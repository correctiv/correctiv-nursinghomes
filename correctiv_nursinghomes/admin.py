from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from django.utils.translation import ugettext_lazy as _

from .models import NursingHome, SupervisionAuthority, SupervisionReport


class SupervisionReportInline(admin.StackedInline):
    model = SupervisionReport
    raw_id_fields = ('nursing_home', 'report_by')


class NursingHomeAdmin(LeafletGeoAdmin):
    search_fields = ('name', 'postcode', 'location')
    list_display = ('name', 'location', 'postcode', 'web', 'provider_type')
    list_filter = ('provider_type', 'state')
    raw_id_fields = ('supervision_authority', 'state', 'district')

    inlines = [SupervisionReportInline]


class SupervisionAuthorityAdmin(admin.ModelAdmin):
    search_fields = ('name', 'address')
    raw_id_fields = ('state', 'district', 'borough')
    list_filter = ('state',)


admin.site.register(NursingHome, NursingHomeAdmin)
admin.site.register(SupervisionAuthority, SupervisionAuthorityAdmin)
