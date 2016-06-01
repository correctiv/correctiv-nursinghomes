# -*- encoding: utf-8 -*-
import os
try:
    from urllib.parse import urlencode
except ImportError:
    from urllib import urlencode

from django.contrib.gis.db import models
from django.utils.encoding import python_2_unicode_compatible
from django.utils.translation import ugettext_lazy as _
from django.contrib.gis.db.models.functions import Distance
from django.contrib.postgres.fields import JSONField
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe

from djorm_pgfulltext.models import SearchManager
from djorm_pgfulltext.fields import VectorField, FullTextLookup, startswith

from geogermany.models import State, District, Borough


class FullTextLookupCustom(FullTextLookup):
    lookup_name = 'ft_search'

    def as_sql(self, qn, connection):
        lhs, lhs_params = qn.compile(self.lhs)
        rhs, rhs_params = self.process_rhs(qn, connection)

        catalog, rhs_params = rhs_params

        cmd = "%s @@ plainto_tsquery('%s', %%s)" % (lhs, catalog)
        rest = (" & ".join(self.transform.__call__(rhs_params)),)

        return cmd, rest


class FullTextLookupCustomStartsWith(FullTextLookupCustom):
    lookup_name = 'ft_search_startswith'

    def transform(self, *args):
        return startswith(*args)

VectorField.register_lookup(FullTextLookupCustom)
VectorField.register_lookup(FullTextLookupCustomStartsWith)


@python_2_unicode_compatible
class SupervisionAuthority(models.Model):
    name = models.CharField(max_length=512)

    url = models.URLField(blank=True, max_length=512)
    report_url = models.URLField(blank=True, max_length=512)

    email = models.EmailField(blank=True)
    contact = models.TextField(blank=True)
    address = models.TextField(blank=True)

    state = models.ForeignKey(State, null=True, blank=True)
    district = models.ForeignKey(District, null=True, blank=True)
    borough = models.ForeignKey(Borough, null=True, blank=True)

    fds_url = models.CharField(max_length=512, blank=True)

    class Meta:
        verbose_name = _('Supervision Authority')
        verbose_name_plural = _('Supervision Authorities')

    def __str__(self):
        return self.name


def _prepare_query(query):
    return [q.encode('utf-8') for q in query.split()]


class NursingHomeManager(SearchManager):

    def get_queryset(self):
        return super(NursingHomeManager, self).get_queryset().filter(care_full=True)

    def get_by_natural_key(self, slug):
        return self.get(slug=slug)

    def search(self, qs, query):
        query = _prepare_query(query)
        if query:
            qs = qs.filter(
                search_index__ft_search=(self.config, query)
            )
        return qs

    def autocomplete(self, qs, query):
        query = _prepare_query(query)
        if query:
            query = startswith(query)
            qs = qs.search(' & '.join(query), raw=True)
        return qs

    def get_by_distance(self, home, limit=10):
        return self.get_by_distance_to_point(home.geo, limit=limit)

    def get_by_distance_to_point(self, point, limit=10):
        qs = self.get_queryset().annotate(distance=Distance('geo', point)).order_by('distance')
        if limit:
            qs = qs[:limit]
        return qs

    def get_json_for_page(self, obj):
        homes = self.get_by_distance(obj)
        return [
            {
                'name': home.name,
                'location': home.location,
                'url': home.get_absolute_url(),
                'latlng': home.geo.geojson,
                'prices': home.prices,
                'current': home == obj
            }
            for home in homes
        ]


@python_2_unicode_compatible
class NursingHome(models.Model):
    PROVIDER_TYPE_CHOICES = (
        (u'freigemeinnützig', _('charitable')),
        (u'privat', _('private')),
        (u'öffentlich', _('public')),
        (u'nicht zu ermitteln', _('unknown')),
    )

    STATE_AVERAGE_PRICES = {
        u'Baden-Württemberg': 2158.704842,
        u'Bayern': 1761.289590,
        u'Berlin': 1932.816667,
        u'Brandenburg': 1484.844051,
        u'Bremen': 1949.459574,
        u'Hamburg': 2125.885714,
        u'Hessen': 1924.645357,
        u'Mecklenburg-Vorpommern': 1254.278298,
        u'Niedersachsen': 1524.164769,
        u'Nordrhein-Westfalen': 2407.845254,
        u'Rheinland-Pfalz': 2230.119824,
        u'Saarland': 2415.508054,
        u'Sachsen': 1261.394410,
        u'Sachsen-Anhalt': 1100.590175,
        u'Schleswig-Holstein': 1543.599081,
        u'Thüringen': 1363.933010,
    }

    STATE_AVERAGE_MEDICAL_GRADE = {
        u'Baden-Württemberg': 1.362950,
        u'Bayern': 1.647086,
        u'Berlin': 1.264725,
        u'Brandenburg': 1.288612,
        u'Bremen': 1.848214,
        u'Hamburg': 1.688966,
        u'Hessen': 1.478189,
        u'Mecklenburg-Vorpommern': 1.398776,
        u'Niedersachsen': 1.574394,
        u'Nordrhein-Westfalen': 1.462506,
        u'Rheinland-Pfalz': 1.822955,
        u'Saarland': 1.256738,
        u'Sachsen': 1.341103,
        u'Sachsen-Anhalt': 1.393562,
        u'Schleswig-Holstein': 1.666387,
        u'Thüringen': 1.688953,
    }

    STATE_QUANTILE_PRICES = {
        u'Baden-Württemberg': (1741.70, 2129.78, 2350.04, 2526.62),
        u'Bayern': (1505.00, 1680.80, 1838.54, 2008.22),
        u'Berlin': (1720.40, 1885.34, 2003.12, 2094.68),
        u'Brandenburg': (1337.00, 1449.50, 1524.50, 1641.80),
        u'Bremen': (1693.70, 1803.92, 1955.36, 2097.32),
        u'Hamburg': (1879.88, 2034.50, 2208.44, 2355.80),
        u'Hessen': (1628.90, 1845.20, 2036.90, 2223.20),
        u'Mecklenburg-Vorpommern': (1097.42, 1216.88, 1317.20, 1450.16),
        u'Niedersachsen': (1274.24, 1430.24, 1573.52, 1750.04),
        u'Nordrhein-Westfalen': (2127.20, 2314.70, 2489.60, 2663.60),
        u'Rheinland-Pfalz': (2039.72, 2193.68, 2304.14, 2420.84),
        u'Saarland': (2144.18, 2352.14, 2446.22, 2568.20),
        u'Sachsen': (1073.24, 1179.68, 1286.30, 1469.96),
        u'Sachsen-Anhalt': (934.94, 1045.22, 1143.26, 1246.94),
        u'Schleswig-Holstein': (1261.70, 1430.06, 1571.60, 1809.86),
        u'Thüringen': (1124.60, 1303.70, 1431.32, 1581.92),
    }

    STATE_QUANTILE_BEDSIZE = {
        u'Baden-Württemberg': (29.0, 45.0, 64.0, 91.0),
        u'Bayern': (38.0, 61.0, 83.0, 108.0),
        u'Berlin': (42.6, 75.2, 105.0, 139.0),
        u'Brandenburg': (40.0, 57.0, 74.0, 102.0),
        u'Bremen': (19.8, 46.0, 65.0, 82.0),
        u'Hamburg': (48.6, 82.6, 108.0, 142.8),
        u'Hessen': (30.0, 48.0, 71.0, 99.0),
        u'Mecklenburg-Vorpommern': (46.0, 62.0, 77.4, 105.2),
        u'Niedersachsen': (33.0, 51.0, 67.0, 91.0),
        u'Nordrhein-Westfalen': (40.0, 66.0, 80.0, 100.0),
        u'Rheinland-Pfalz': (47.0, 68.0, 86.0, 106.0),
        u'Saarland': (47.0, 61.0, 80.0, 104.0),
        u'Sachsen': (26.0, 51.0, 70.0, 92.2),
        u'Sachsen-Anhalt': (27.0, 44.0, 61.0, 87.0),
        u'Schleswig-Holstein': (27.0, 44.0, 59.0, 84.0),
        u'Thüringen': (35.0, 57.0, 70.0, 94.0),
    }

    STATE_QUANTILE_AGE = {
        u'Baden-Württemberg': (7.824658, 11.827397, 19.413699, 32.107397),
        u'Bayern': (8.912329, 15.745205, 21.668493, 39.131507),
        u'Berlin': (7.320548, 12.112329, 16.233973, 21.416438),
        u'Brandenburg': (8.408219, 11.720548, 15.410959, 20.002740),
        u'Bremen': (7.158904, 13.164384, 20.597260, 35.676712),
        u'Hamburg': (10.161644, 19.167123, 32.175342, 47.936986),
        u'Hessen': (6.706849, 12.537534, 20.818082, 33.710685),
        u'Mecklenburg-Vorpommern': (8.408219, 12.691507, 17.100274, 21.231781),
        u'Niedersachsen': (6.909589, 11.994521, 18.917808, 30.690411),
        u'Nordrhein-Westfalen': (9.270685, 16.082192, 23.920548, 38.594521),
        u'Rheinland-Pfalz': (8.072877, 14.881096, 20.769315, 32.268493),
        u'Saarland': (4.073973, 10.284932, 12.284932, 19.917808),
        u'Sachsen': (9.107397, 12.830137, 15.589041, 18.580822),
        u'Sachsen-Anhalt': (8.186849, 12.027945, 15.410959, 20.810959),
        u'Schleswig-Holstein': (8.845479, 13.495890, 19.747945, 31.563836),
        u'Thüringen': (6.572603, 10.994521, 15.164384, 20.145205),
    }

    MDK_REGIONS = {
        u'Hamburg': (u'MDK Nord', 'http://www.mdk-nord.de'),
        u'Schleswig-Holstein': (u'MDK Nord', 'http://www.mdk-nord.de'),
        u'Niedersachsen': (u'MDK Niedersachsen', 'http://www.mdk-niedersachsen.de'),
        u'Mecklenburg-Vorpommern': (u'MDK Mecklenburg-Vorpommern', 'http://www.mdk-mv.de'),
        u'Berlin': (u'MDK Berlin-Brandenburg', 'http://www.mdk-bb.de'),
        u'Brandenburg': (u'MDK Berlin-Brandenburg', 'http://www.mdk-bb.de'),
        u'Sachsen-Anhalt': (u'MDK Sachsen-Anhalt', 'http://www.mdk-san.de'),
        u'Sachsen': (u'MDK Sachsen', 'http://www.mdk-sachsen.de'),
        u'Thüringen': (u'MDK Thüringen', 'http://www.mdk-th.de'),
        u'Bayern': (u'MDK Bayern', 'http://www.mdk-bayern.de'),
        u'Hessen': (u'MDK Hessen', 'http://www.mdk-hessen.de'),
        u'Baden-Württemberg': (u'MDK Baden-Württemberg', 'http://www.mdkbw.de'),
        u'Saarland': (u'MDK Saarland', 'http://www.mdk-saarland.de'),
        u'Rheinland-Pfalz': (u'MDK Rheinland-Pfalz', 'http://www.mdk-rlp.de'),
        u'Bremen': (u'MDK Bremen', 'http://www.mdk-bremen.de'),
        u'Nordrhein': (u'MDK Nordrhein', 'http://www.mdk-nordrhein.de'),
        u'Westfalen-Lippe': (u'MDK Westfalen-Lippe', 'http://www.mdk-wl.de')
    }

    WESTFALEN_LIPPE_AGS = set(['05554', '05558', '05954', '05754', '05758',
        '05958', '05762', '05766', '05962', '05770', '05966', '05774', '05562',
        '05970', '05974', '05566', '05978', '05570', '05711', '05911', '05512',
        '05913', '05513', '05914', '05915', '05916', '05515']
    )

    name = models.CharField(max_length=512)
    slug = models.SlugField(max_length=512)

    address = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    postcode = models.CharField(max_length=10, blank=True)

    provider_type = models.CharField(max_length=25, blank=True,
        choices=PROVIDER_TYPE_CHOICES
    )

    grade_total = models.DecimalField(max_digits=5, decimal_places=2,
                                      default=0.0, null=True, blank=True)
    grade_care = models.DecimalField(max_digits=5, decimal_places=2,
                                     default=0.0, null=True, blank=True)

    care_night = models.BooleanField(default=False)
    care_temp = models.BooleanField(default=False)
    care_day = models.BooleanField(default=False)
    care_full = models.BooleanField(default=False)

    red_flag_food = models.BooleanField(default=False)
    red_flag_decubitus = models.BooleanField(default=False)
    red_flag_medicine = models.BooleanField(default=False)
    red_flag_incontinence = models.BooleanField(default=False)
    red_flag_pain = models.BooleanField(default=False)

    web = models.CharField(max_length=1024, blank=True)

    data = JSONField(blank=True)

    state = models.ForeignKey(State, null=True, blank=True)
    district = models.ForeignKey(District, null=True, blank=True)

    geo = models.PointField(_('Geographic location'), geography=True)

    supervision_authority = models.ForeignKey(SupervisionAuthority,
                                              blank=True, null=True)

    search_index = VectorField()

    default_manager = models.Manager()
    objects = NursingHomeManager(
        fields=[
            ('name', 'A'),
            ('postcode', 'A'),
            ('location', 'A'),
        ],
        config='pg_catalog.german',
        search_field='search_index',
        auto_update_search_field=True
    )

    RED_FLAGS = [
        'red_flag_food',
        'red_flag_decubitus',
        'red_flag_medicine',
        'red_flag_incontinence',
        'red_flag_pain'
    ]
    COMP_PRICE = u'Vollstationär Allgemein Pflegestufe 3 Eigenanteil'

    class Meta:
        verbose_name = _('nursing home')
        verbose_name_plural = _('nursing homes')
        ordering = ('name',)

    def __str__(self):
        return self.name

    def natural_key(self):
        return (self.slug,)

    @models.permalink
    def get_absolute_url(self):
        return ('nursinghomes:nursinghomes-detail', (), {
            'slug': self.slug
        })

    def get_example_report(self):
        reports = SupervisionReport.objects.filter(report_by=self.supervision_authority)[:1]
        if not reports:
            reports = SupervisionReport.objects.filter(report_by__state=self.state)[:1]

        if reports:
            return reports[0]
        return None

    @property
    def any_red_flag(self):
        return any([getattr(self, n) for n in self.RED_FLAGS])

    @property
    def red_flag_count(self):
        return sum([getattr(self, n) for n in self.RED_FLAGS])

    @property
    def prices(self):
        return {
            'carelevel_1':
                self.data[u'Vollstationär Allgemein Pflegestufe 1 Eigenanteil'],
            'carelevel_2':
                self.data[u'Vollstationär Allgemein Pflegestufe 2 Eigenanteil'],
            'carelevel_3':
                self.data[u'Vollstationär Allgemein Pflegestufe 3 Eigenanteil'],
        }

    def national_average_price(self):
        return 1869

    def compare_care_grade_state(self):
        avg_grade = self.STATE_AVERAGE_MEDICAL_GRADE[self.state.name]
        if self.grade_care < avg_grade:
            return True
        elif self.grade_care > avg_grade:
            return False
        return None

    def _quantile(self, val, quantiles, mapping):
        return mapping[([0] + [x[0] for x in enumerate(quantiles) if val > x[1]])[-1]]

    def bedsize(self):
        return int(self.data[u'belegt_vollstationär'])

    def bedsize_comp(self):
        return self._quantile(
            self.data[u'belegt_vollstationär'],
            self.STATE_QUANTILE_BEDSIZE[self.state.name],
            (
                _('very small'),
                _('small'),
                _('normal-sized'),
                _('big'),
                _('very big'),
            )
        )

    def age_years(self):
        return int(self.data['days_in_operation'] / 365)

    def age_comp(self):
        return self._quantile(
            self.data[u'days_in_operation'] / 365,
            [8.076712, 13.326027, 19.418630, 31.690411],
            (
                _('very young'),
                _('young'),
                _('a normal age'),
                _('old'),
                _('very old'),
            )
        )

    def price_range(self):
        return self._quantile(
            self.data[self.COMP_PRICE],
            self.STATE_QUANTILE_PRICES[self.state.name],
            (
                _('very cheap'),
                _('cheap'),
                _('moderately priced'),
                _('expensive'),
                _('very expensive'),
            )
        )

    def price_increase(self):
        price = self.data[self.COMP_PRICE]
        state_avg = self.STATE_AVERAGE_PRICES[self.state.name]
        diff = (price - state_avg) / state_avg
        diff = round(diff * 100)
        if diff < 0:
            return _('%d%% less') % abs(diff)
        return _('%d%% more') % diff

    def get_mdk_region(self):
        state_name = self.state.name
        if state_name in self.MDK_REGIONS:
            region = self.MDK_REGIONS[state_name]
        else:
            if self.data['ags'] in self.WESTFALEN_LIPPE_AGS:
                region = self.MDK_REGIONS[u'Westfalen-Lippe']
            else:
                region = self.MDK_REGIONS[u'Nordrhein']
        if region:
            return mark_safe(u'<a href="{url}">{name}</a>'.format(
                url=region[1],
                name=region[0],
            ))
        return ''

    def get_supervision_authority_link(self):
        if self.supervision_authority:
            return mark_safe(u'<a href="{url}">{name}</a>'.format(
                url=self.supervision_authority.url,
                name=self.supervision_authority.name
            ))
        return ''

    def get_request_url(self):
        if not self.supervision_authority:
            return ''
        if not self.supervision_authority.fds_url:
            return ''

        slugs = self.supervision_authority.fds_url.rsplit('/', 2)
        pb_slug = slugs[-2]

        subject = _(u'Nursing home report of “%s”') % self.name
        if len(subject) > 250:
            subject = subject[:250] + '...'

        query = urlencode({
            'subject': subject.encode('utf-8'),
            'body': render_to_string('correctiv_nursinghomes/request_email.txt', {
                    'name': self.name,
                    'postcode': self.postcode,
                    'location': self.location,
                    'address': self.address,
            }).encode('utf-8'),
            'ref': ('correctiv:nursinghomes@%s' % self.pk).encode('utf-8')
        })
        return 'https://fragdenstaat.de/anfrage-stellen/an/%s/?%s' % (pb_slug, query)


def report_file_path(instance=None, filename=None):
    path = str(instance.pk).zfill(4)
    path_1 = path[:2]
    path_2 = path[2:4]
    temp_path = ['investigations', 'nursinghomes', path_1, path_2, '%s.pdf' % instance.pk]
    return os.path.join(*temp_path)


@python_2_unicode_compatible
class SupervisionReport(models.Model):
    report_by = models.ForeignKey(SupervisionAuthority)
    nursing_home = models.ForeignKey(NursingHome)
    date = models.DateField(null=True)
    report_type = models.CharField(max_length=255, blank=True)

    fds_url = models.CharField(max_length=255, blank=True)
    report = models.FileField(blank=True, upload_to=report_file_path)

    class Meta:
        ordering = ('-date',)
        verbose_name = _('Supervision Report')
        verbose_name_plural = _('Supervision Reports')

    def __str__(self):
        return _(u'Report on %(date)s by %(auth)s') % {
            'date': self.date,
            'auth': self.report_by
        }
