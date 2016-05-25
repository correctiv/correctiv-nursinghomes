from cms.app_base import CMSApp
from cms.apphook_pool import apphook_pool
from django.utils.translation import ugettext_lazy as _


class NursingHomesApp(CMSApp):
    name = _('Nursing Homes')
    app_name = 'nursinghomes'
    urls = ['correctiv_nursinghomes.urls']


apphook_pool.register(NursingHomesApp)
