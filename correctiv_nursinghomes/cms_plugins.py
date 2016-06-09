from django.utils.translation import ugettext_lazy as _

from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool


@plugin_pool.register_plugin
class NursingHomesSearchTilePlugin(CMSPluginBase):
    module = _("Nursing Homes")
    name = _('Nursing Homes Search Tile')
    render_template = "correctiv_nursinghomes/plugins/search_tile.html"
