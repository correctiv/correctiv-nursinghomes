# -*- encoding: utf-8 -*-
import re
from collections import defaultdict
import fnmatch
import os
import json
from datetime import date

from django.core.management.base import BaseCommand
from django.utils import translation
from django.conf import settings
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import GEOSGeometry
from django.db.models import Q
from django.core.files import File
from django.template.defaultfilters import slugify
from django.utils.timezone import get_current_timezone


import requests
from dateutil.parser import parse as parse_date
import pandas as pd
import unicodecsv

from geogermany.models import State, District, Municipality, Borough

from ...models import (NursingHome, SupervisionAuthority, SupervisionReport,
                       report_file_path)


def convert_timestamp(ts):
    return ts.tz_localize('Europe/Berlin').to_datetime()


QUOTES_RE = re.compile(r'''^["'](.*)["']$''')
EMAIL_RE = re.compile(r'[^\@]+@[\w\.-]+', re.I)
PLZ_RE = re.compile('\b(\d{5})\b')
STREET_RE = re.compile('^([^\. \d]+).*', re.U)
BERLIN_REPORT_RE = re.compile(r'\[\[http://ftp.berlinonline.de/lageso/([\w\.]+)\|(.*) vom (\d+)\.(\d+)\.(\d+)\]\]', re.U)


def clean_name(name):
    name = name.strip()
    name = QUOTES_RE.sub('\\1', name)
    return name


def urlify(url):
    url = stringify(url)
    if not url:
        return ''
    if not url.startswith(('http://', 'https://')):
        url += 'http://' + url
    return url


def stringify(val):
    if pd.isnull(val):
        return ''
    return val


def jsonify(val):
    if pd.isnull(val):
        return None
    if isinstance(val, pd.tslib.Timestamp):
        return val.isoformat()
    return val


def get_pdfs_in_dir(dir):
    for root, dirnames, filenames in os.walk(dir):
        for filename in fnmatch.filter(filenames, '*.pdf'):
            yield os.path.join(root, filename)


def read_nursinghomes(filename):
    df = pd.read_csv(filename, parse_dates=['start_date', 'start_date_contract', 'letzte Aktualisierung durch Pflegeeinrichtung'], encoding='utf-8')
    df['ags'] = df['ags'].apply(lambda x: None if pd.isnull(x) else str(int(x)).zfill(5))
    df['PLZ'] = df['PLZ'].apply(lambda x: None if pd.isnull(x) else str(int(x)).zfill(5))
    return df


class Command(BaseCommand):
    help = "Import observational studies and related data"

    def add_arguments(self, parser):
        parser.add_argument('command', help='Subcommand')
        parser.add_argument('filename', help='filename')

    def handle(self, *args, **options):
        getattr(self, options['command'])(**options)

    def load(self, *args, **options):
        translation.activate(settings.LANGUAGE_CODE)
        filename = options['filename']
        skip_keys = ['Name', 'slug', u'Straße Hausnr', 'Ort', 'PLZ',
                'traeger_art', 'Web', 'lng', 'lat',
                'nachtpflege',
                'kurzzeitpflege',
                'tagespflege',
                'vollstationaer',
                'red_flag_food',
                'red_flag_decubitus',
                'red_flag_medicine',
                'red_flag_incontinence',
                'red_flag_pain'
        ]
        df = read_nursinghomes(filename)
        for _, row in df.iterrows():
            data = {k: jsonify(v) for k, v in row.iteritems() if k not in skip_keys}

            name = clean_name(row['Name'])
            slug = row['slug']

            nursinghome, created = NursingHome._default_manager.update_or_create(
                slug=slug, defaults=dict(
                    name=name,
                    address=stringify(row[u'Straße Hausnr']),
                    location=stringify(row['Ort']),
                    postcode=stringify(row['PLZ']),
                    provider_type=stringify(row['traeger_art']),
                    web=urlify(row['Web']),
                    grade_total=row['grade_overall'],
                    grade_care=row['grade_care'],

                    care_night=row['nachtpflege'],
                    care_temp=row['kurzzeitpflege'],
                    care_day=row['tagespflege'],
                    care_full=row['vollstationaer'],

                    red_flag_food=row['red_flag_food'],
                    red_flag_decubitus=row['red_flag_decubitus'],
                    red_flag_medicine=row['red_flag_medicine'],
                    red_flag_incontinence=row['red_flag_incontinence'],
                    red_flag_pain=row['red_flag_pain'],

                    data=data,
                    geo=GEOSGeometry('POINT(%f %f)' % (row['lng'], row['lat']), srid=4326)
                )
            )
            if created:
                print('Created %s' % nursinghome)
            else:
                print('Updated %s' % nursinghome)

    def set_geogermany(self, *args, **options):
        for nursinghome in NursingHome._default_manager.filter(district__isnull=True):
            print(nursinghome)
            try:
                district = District.objects.get(
                    geom__covers=nursinghome.geo)
            except District.DoesNotExist:
                district = District.objects.annotate(distance=Distance('geom', nursinghome.geo)).order_by('distance')[0]

            nursinghome.district = district
            nursinghome.state_id = district.part_of_id
            nursinghome.save()

    def load_supervision_authorities(self, *args, **options):
        excel_file = pd.ExcelFile(options['filename'])
        state_names = excel_file.sheet_names

        for state_name in state_names:
            state = State.objects.get(name=state_name)
            df = excel_file.parse(state_name)
            for _, row in df.iterrows():
                try:
                    email = stringify(row['email'])
                    if email:
                        email = email.splitlines()[0]
                        email = EMAIL_RE.search(email)
                        email = email.group(0).strip() if email is not None else ''
                        email = email.lower()
                    authority, created = SupervisionAuthority.objects.update_or_create(
                        state=state, name=stringify(row['name']), defaults=dict(
                            address=stringify(row['address']),
                            contact=stringify(row['contact']),
                            email=email,
                            url=stringify(row['url']),
                            report_url=stringify(row.get(u'Verfügbare Berichte', ''))
                        )
                    )
                    if created:
                        print(authority)
                except Exception:
                    print(row['name'])
                    raise

    def assign_authorities(self, *args, **options):
        central = [u'Berlin',
                # u'Brandenburg',
                u'Bremen',
                # u'Hessen',
                # u'Rheinland-Pfalz',
                u'Saarland',
                u'Sachsen',
                u'Sachsen-Anhalt',
                u'Thüringen'
        ]

        central_states = [
            State.objects.get(name=state_name) for state_name in central
        ]
        central_authorities = {
            state: SupervisionAuthority.objects.get(state=state) for state in central_states
        }

        # Assign central authorities
        central_homes = NursingHome._default_manager.filter(supervision_authority__isnull=True, state__in=central_states)
        for nursinghome in central_homes:
            nursinghome.supervision_authority = central_authorities[nursinghome.state]
            nursinghome.save()

        decentral = [
            u'Baden-Württemberg',
            u'Bayern',
            u'Hamburg',
            u'Mecklenburg-Vorpommern',
            u'Niedersachsen',
            u'Nordrhein-Westfalen',
            u'Schleswig-Holstein',
        ]

        decentral_states = [
            State.objects.get(name=state_name) for state_name in decentral
        ]

        for state in decentral_states:
            print('\n' * 3)
            print('=' * 20)
            print(state)
            state_districts = District.objects.filter(part_of=state)
            for district in state_districts:
                if SupervisionAuthority.objects.filter(district=district).exists():
                    continue
                authorities = SupervisionAuthority.objects.filter(state=state, name__contains=district.name, district__isnull=True)

                if len(authorities) == 0:
                    authorities = SupervisionAuthority.objects.filter(state=state, name__contains=district.name.split()[0], district__isnull=True)
                    if len(authorities) > 1:
                        authorities = authorities.filter(
                                name__icontains=re.split('\W', district.name)[-1])

                if len(authorities) > 1:
                    print(authorities)
                    if 'Landkreis' in district.kind_detail:
                        authorities = authorities.filter(Q(name__contains='Landkreis') |
                                                         Q(name__contains='Kreisver'))
                    if 'Stadt' in district.kind_detail:
                        authorities = authorities.filter(Q(name__icontains='Stadt') |
                                                         Q(name__contains='kreisfrei'))
                if len(authorities) == 1:
                    auth = authorities[0]
                    auth.district = district
                    auth.save()
                else:
                    print(district, district.kind_detail)
                    print(authorities)

        hamburg_state = State.objects.get(name='Hamburg')
        hamburg_district = District.objects.get(part_of=hamburg_state)
        hamburg = Municipality.objects.get(part_of=hamburg_district)
        boroughs = Borough.objects.filter(part_of=hamburg)

        for borough in boroughs:
            authorities = SupervisionAuthority.objects.filter(state=hamburg_state, name__contains=borough.name, borough__isnull=True)
            if len(authorities) == 1:
                auth = authorities[0]
                auth.district = hamburg_district
                auth.borough = borough
                auth.save()
                NursingHome.objects.filter(supervision_authority__isnull=True, geo__coveredby=borough.geom).update(supervision_authority=auth)
            else:
                print(borough.name)
                print(authorities)

        central_homes = NursingHome.objects.filter(supervision_authority__isnull=True, state__in=decentral_states)
        for nursinghome in central_homes:
            try:
                auth = SupervisionAuthority.objects.get(district=nursinghome.district)
                nursinghome.supervision_authority = auth
                nursinghome.save()
            except SupervisionAuthority.DoesNotExist:
                print('Missing Authority %s' % nursinghome.district)

    def assign_hessen(self, *args, **options):
        hessen_state = State.objects.get(name='Hessen')

        df = pd.read_csv(options['filename'])
        auth_key = [x for x in df.columns if 'HAVS' in x][0]
        auth_names = list(df[auth_key].value_counts().index)
        auth_mapping = {
            a: SupervisionAuthority.objects.get(state=hessen_state, name__contains=a.split()[0]) for a in auth_names
        }

        hessen_plz = df['PLZ'].value_counts()
        hessen_plz_unique = hessen_plz[hessen_plz == 1]
        hessen_plz_non_unique = hessen_plz[hessen_plz > 1]

        for _, row in df[df['PLZ'].isin(hessen_plz_unique.index)].iterrows():
            plz = str(row['PLZ'])
            auth = auth_mapping[row[auth_key]]
            NursingHome.objects.filter(supervision_authority__isnull=True,
                                       state=hessen_state, postcode=plz).update(
                                           supervision_authority=auth
                                       )
        for _, row in df[df['PLZ'].isin(hessen_plz_non_unique.index)].iterrows():
            plz = str(row['PLZ'])
            location = str(row['Ort'])
            if pd.isnull(row[auth_key]):
                print(row)
                continue
            auth = auth_mapping[row[auth_key]]
            NursingHome.objects.filter(supervision_authority__isnull=True,
                                       state=hessen_state, postcode=plz,
                                       location=location).update(
                                           supervision_authority=auth
                                       )

    def assign_brandenburg(self, *args, **options):
        brandenburg_state = State.objects.get(name='Brandenburg')
        excel_file = pd.ExcelFile(options['filename'])
        df = excel_file.parse('Brandenburg')
        assigned_auths = defaultdict(list)
        locations = {}
        for _, row in df.iterrows():
            auth = SupervisionAuthority.objects.get(state=brandenburg_state, name=row['name'])
            locations[auth] = GEOSGeometry('POINT(%f %f)' % (row['lng'], row['lat']), srid=4326)
            assigned_districts = row[u'Landkreis-Zuständigkeit'].splitlines()
            for district_name in assigned_districts:
                districts = District.objects.filter(part_of=brandenburg_state, name=district_name)
                if len(districts) != 1:
                    print(district_name)
                    print(districts)
                else:
                    assigned_auths[districts[0]].append(auth)

        for nursinghome in NursingHome.objects.filter(supervision_authority__isnull=True,
                state=brandenburg_state):
            district = District.objects.get(geom__covers=nursinghome.geo)
            auths = assigned_auths[district]
            if len(auths) == 1:
                nursinghome.supervision_authority = auths[0]
                nursinghome.save()
            else:
                min_distance = None
                best_auth = None
                for auth, point in locations.items():
                    if auth not in auths:
                        continue
                    dist = NursingHome.objects.filter(pk=nursinghome.pk
                            ).annotate(distance=Distance('geo', point))
                    dist = dist[0].distance.m
                    if min_distance is None or dist < min_distance:
                        min_distance = dist
                        best_auth = auth
                nursinghome.supervision_authority = best_auth
                nursinghome.save()

    def assign_rheinlandpfalz(self, *args, **options):
        rp_state = State.objects.get(name='Rheinland-Pfalz')
        excel_file = pd.ExcelFile(options['filename'])
        df = excel_file.parse('Rheinland-Pfalz')
        assigned = defaultdict(list)
        for _, row in df.iterrows():
            auth = SupervisionAuthority.objects.get(state=rp_state, name=row['name'])
            district_names = row[u'Landkreis-Zuständigkeit'].splitlines()
            for district_name in district_names:
                only = None
                if '|' in district_name:
                    district_name, only = district_name.split('|')
                    only = only.split(',')

                districts = District.objects.filter(part_of=rp_state, name=district_name)
                if len(districts) == 0:
                    districts = District.objects.filter(part_of=rp_state, name__contains=district_name)
                if len(districts) == 0:
                    districts = District.objects.filter(part_of=rp_state, name__contains=district_name.split()[0])
                if len(districts) == 0:
                    districts = District.objects.filter(part_of=rp_state, name__istartswith=re.sub('\W', '', district_name))
                if len(districts) > 1:
                    if 'Kreis' in district_name:
                        districts = districts.filter(kind_detail__contains='Landkreis')
                    if 'Stadt' in district_name:
                        districts = districts.filter(kind_detail__contains='Stadt')
                if len(districts) != 1:
                    print(districts)
                    print(u'District not one: %s' % district_name)
                    continue
                assigned[auth].append((districts[0], only))
        for auth, district_list in assigned.items():
            for district, only in district_list:
                if only is None:
                    NursingHome.objects.filter(state=rp_state, district=district, supervision_authority__isnull=True).update(supervision_authority=auth)
                    continue
                for muni_name in only:
                    muni_name = muni_name.strip()
                    munis = Municipality.objects.filter(part_of=district, name__contains=muni_name)
                    if len(munis) > 1:
                        munis = Municipality.objects.filter(part_of=district, name=muni_name)
                    if len(munis) != 1:
                        print('Did not find %s' % muni_name)
                        continue
                    muni = munis[0]
                    NursingHome.objects.filter(state=rp_state, district=district, supervision_authority__isnull=True, geo__coveredby=muni.geom).update(supervision_authority=auth)

    def index_reports(self, *args, **options):
        from ...reports import index_pdfs

        base_path = options['filename']
        index_pdfs(get_pdfs_in_dir(base_path))

    def search_reports(self, *args, **options):
        from ...reports import search_reports

        states = ['mecklenburg-vorpommern', 'bayern', 'nordrhein-westfalen']
        for state in states:
            state_matches = defaultdict(list)
            nursinghomes = NursingHome.objects.filter(state__slug__contains=state)
            for nursinghome in nursinghomes:
                results = search_reports(state, [],
                    [nursinghome.name,
                    nursinghome.location,
                    nursinghome.address,
                ])
                if not results:
                    continue
                result = results[0]
                if result['_score'] < 0.2:
                    continue
                # print(nursinghome.name, nursinghome.address, nursinghome.location, nursinghome.postcode)
                # print(result['_score'], result['_source']['filename'])
                state_matches[result['_source']['filename']].append(
                    (result['_score'], nursinghome)
                )
            for filename in state_matches:
                matches = state_matches[filename]
                matches.sort(key=lambda x: x[0])
                # print(matches[-1][0], filename, matches[-1][1])
                # import ipdb; ipdb.set_trace()
            print(len(state_matches), len(nursinghomes))

    def assign_berlin_reports(self, *args, **options):
        from fuzzywuzzy import process

        berlin_state = State.objects.filter(name='Berlin')
        berlin_auth = SupervisionAuthority.objects.get(state=berlin_state)

        filename = options['filename']
        base_path = os.path.dirname(filename)

        berlin_data = json.load(open(filename))
        berlin_nh = NursingHome.objects.filter(state=berlin_state)
        count = berlin_nh.count()

        nh_names = [x.name for x in berlin_nh]  # if x.supervisionreport_set.count() == 0]
        print(len(nh_names), count)

        fields = {
            "pruefung_%d": u"Prüfung",
            "pruefung_%d_ergaenzender_bericht_1": "Ergänzender Bericht",
            "pruefung_%d_ergaenzender_bericht_2": "Ergänzender Bericht",
            "pruefung_%d_gegendarstellung_1": "Gegendarstellung",
            "pruefung_%d_gegendarstellung_2": "Gegendarstellung",
            "pruefung_%d_gegendarstellung_3": "Gegendarstellung",
        }

        found_names = set()
        matches = []

        for nh_data in berlin_data['index']:
            found_name, score = process.extractOne(nh_data['einrichtung_name'], nh_names)
            print(nh_data['einrichtung_name'], found_name, score)
            matches.append({
                'name_berlin': nh_data['einrichtung_name'],
                'name_aok': found_name,
                'score': score
            })
            found_names.add(found_name)
            if score < 90:
                continue
            nh = NursingHome.objects.get(state=berlin_state, name=found_name)
            continue

            for i in range(1, 11):
                for k, v in fields.items():
                    val = nh_data[k % i]
                    if not val:
                        continue
                    match = BERLIN_REPORT_RE.match(val)
                    if match is None:
                        print(val)

                    report_filename = match.group(1)
                    report_type = match.group(2)
                    report_date = date(int(match.group(5)), int(match.group(4)), int(match.group(3)))
                    print(report_filename, report_type, report_date)
                    full_path = os.path.join(base_path, 'reports', report_filename)
                    if not os.path.exists(full_path):
                        continue
                    report, created = SupervisionReport.objects.get_or_create(
                        report_by=berlin_auth,
                        nursing_home=nh,
                        date=report_date,
                        report_type=report_type
                    )
                    if report.report:
                        report.report.delete(save=False)
                    report.report.save('report_filename', File(open(full_path)))

        pd.DataFrame(list(set(nh_names) - found_names)).to_csv('berlin_left.csv', index=False, encoding='utf-8')
        pd.DataFrame(matches).to_csv('berlin_matches.csv', index=False, encoding='utf-8')

    def export_supervision_authorities(self, *args, **options):
        writer = unicodecsv.DictWriter(open(options['filename'], 'w'), (
            'name', 'email', 'address', 'contact', 'jurisdiction__slug', 'other_names', 'description', 'tags', 'parent__name', 'classification', 'url', 'website_dump', 'request_note'
        ))
        writer.writeheader()
        for authority in SupervisionAuthority.objects.all():
            slug = slugify(authority.name)
            authority.fds_url = 'https://fragdenstaat.de/behoerde/%s/' % slug
            authority.save()
            writer.writerow({
                'name': authority.name,
                'email': authority.email,
                'address': authority.address,
                'contact': authority.contact,
                'jurisdiction__slug': slugify(authority.state.name),
                'classification': 'Heimaufsicht'
            })

    def update_from_fragdenstaat(self, *args, **options):
        url = 'https://fragdenstaat.de/api/v1/request/?reference__startswith=%s'
        reference_prefix = 'correctiv:nursinghomes'
        response = requests.get(url % reference_prefix)
        results = response.json()
        for obj in results['objects']:
            obj_id = obj['reference'].split('@', 1)[1]
            try:
                obj_id = int(obj_id)
            except ValueError:
                continue
            try:
                home = NursingHome.objects.get(id=obj_id)
            except NursingHome.DoesNotexist:
                continue

            reports = SupervisionReport.objects.filter(nursing_home=home,
                                                       fds_url=obj['site_url'])
            if reports:
                continue

            tz = get_current_timezone()

            date_obj = parse_date(obj['first_message'])
            date_obj = tz.localize(date_obj)
            SupervisionReport.objects.create(
                    nursing_home=home,
                    report_type='Anfrage auf FragDenStaat.de',
                    date=date_obj.date(),
                    report_by=home.supervision_authority,
                    fds_url=obj['site_url'],
            )

    def resave_reports(self, *args, **options):
        reports = SupervisionReport.objects.all()
        for report in reports:
            if not report.report:
                continue
            old_path = report.report.path
            future_name = report_file_path(instance=report)
            if future_name == report.report.name:
                continue
            report.report.save('empty', report.report.file)
            if report.report.path != old_path:
                os.unlink(old_path)
