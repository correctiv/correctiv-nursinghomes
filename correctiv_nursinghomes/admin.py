from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from django.utils.translation import ugettext_lazy as _

from .models import NursingHome


class NursingHomeAdmin(LeafletGeoAdmin):
    search_fields = ('name', 'postcode', 'location')
    list_display = ('name', 'location', 'postcode', 'web', 'provider_type')
    list_filter = ('provider_type',)

admin.site.register(NursingHome, NursingHomeAdmin)
