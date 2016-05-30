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


class NursingHomeManager(SearchManager):
    def get_by_natural_key(self, slug):
        return self.get(slug=slug)

    def search(self, qs, query):
        if query:
            qs = qs.filter(
                search_index__ft_search=(self.config, query)
            )
        return qs

    def autocomplete(self, qs, query):
        if query:
            query = startswith(query)
            qs = qs.search(' & '.join(query), raw=True)
        return qs

    def get_by_distance(self, home, limit=10):
        return self.get_queryset().exclude(pk=home.pk).annotate(distance=Distance('geo', home.geo)).order_by('distance')[:limit]


@python_2_unicode_compatible
class NursingHome(models.Model):
    name = models.CharField(max_length=512)
    slug = models.SlugField(max_length=512)

    address = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    postcode = models.CharField(max_length=10, blank=True)

    provider_type = models.CharField(max_length=25, blank=True)

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
        return _(u'Report on %s by %s') % (self.date, self.report_by)
