from django.contrib.sitemaps import Sitemap

from .models import NursingHome


def update_sitemap(sitemap_dict):
    sitemap_dict.update({
        'nursinghomes-nursinghome': NursingHomeSitemap,
    })
    return sitemap_dict


class NursingHomeSitemap(Sitemap):
    priority = 0.25
    changefreq = 'yearly'

    def items(self):
        """
        Return published entries.
        """
        return NursingHome.objects.all()
