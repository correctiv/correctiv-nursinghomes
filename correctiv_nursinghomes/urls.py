from django.conf.urls import url, include
from django.utils.translation import ugettext_lazy as _

try:
    # Optional caching decorator
    from correctiv_community.helpers.cache_utils import cache_page_anonymous as c
except ImportError:
    c = lambda x: x

from .views import IndexView, SearchView, NursingHomeDetailView
from . import api_urls


urlpatterns = [
    url(r'^$', c(IndexView.as_view()), name='nursinghomes-index'),
    url(_(r'^search/$'), SearchView.as_view(), name='nursinghomes-search'),
    url(_(r'^search/json/$'), SearchView.as_view(),
        {'json': True}, name='nursinghomes-search_json'),
    url(_(r'^nursinghome/(?P<slug>[\w-]+)/$'), NursingHomeDetailView.as_view(),
        name='nursinghomes-detail'),
    url(r'^api/', include(api_urls)),
]
