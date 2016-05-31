import re
import functools

from django.conf import settings
from django.db.models import Q
from django.contrib.gis.geos import GEOSGeometry

import requests

from geogermany.models import ZipCode, GermanGeoArea

from .models import NursingHome


SEARCH_URL = 'https://search.mapzen.com/v1/search?api_key={apikey}&text={q}&boundary.country=DEU'
ZIPCODE_RE = re.compile('\b(\d{5})\b')


def geocode(q):
    zipresult = zipsearch(q)
    if zipresult:
        return zipresult

    if not settings.MAPZEN_SEARCH_APIKEY:
        return fallback_geocode(q)

    search_url = SEARCH_URL.format(apikey=settings.MAPZEN_SEARCH_APIKEY, q=q)
    response = requests.get(search_url)
    if response.status_code != 200:
        return fallback_geocode(q)

    results = response.json()
    if len(results['features']) == 0:
        return fallback_geocode(q)

    first_feature = results['features'][0]
    return GEOSGeometry('POINT(%f %f)' % tuple(first_feature['geometry']['coordinates']), srid=4326)


def zipsearch(q):
    match = ZIPCODE_RE.search(q)
    if match is not None:
        try:
            return ZipCode.objects.get(name=match.group(1)).geom.centroid
        except ZipCode.DoesNotExist:
            pass
    return None


def fallback_geocode(q):
    zipresult = zipsearch(q)
    if zipresult:
        return zipresult

    areas = GermanGeoArea.objects.filter(functools.reduce(lambda a, b: a | b, [Q(name__contains=part) for part in q.split()]))
    if areas:
        return areas[0].geom.centroid

    homes = NursingHome.objects.search(NursingHome.objects.all(), q)
    if homes:
        return homes[0].geo
