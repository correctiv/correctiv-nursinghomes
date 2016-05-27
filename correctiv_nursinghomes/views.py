# -*- encoding: utf-8 -*-
import json

from django.views.generic import TemplateView, ListView
from django.views.generic.detail import DetailView
from django.http import HttpResponse, QueryDict
from django.shortcuts import redirect
from django.utils.translation import ugettext_lazy as _

from .models import NursingHome
from .forms import SearchForm


class SearchMixin(object):
    def get_context_data(self, **kwargs):
        context = super(SearchMixin, self).get_context_data(**kwargs)
        context['form'] = SearchForm()
        return context


class IndexView(SearchMixin, TemplateView):
    template_name = 'correctiv_nursinghomes/index.html'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['is_index'] = True
        return context


class SearchView(ListView):
    model = NursingHome
    paginate_by = 20

    def get_queryset(self):
        qs = super(SearchView, self).get_queryset()
        self.form = SearchForm(self.request.GET)
        if self.kwargs.get('json'):
            result = self.form.autocomplete(qs)
        else:
            result = self.form.search(qs)
        return result

    def get_context_data(self, **kwargs):
        context = super(SearchView, self).get_context_data(**kwargs)
        context['form'] = self.form
        context['query'] = self.request.GET.get('q', '')
        no_page_query = QueryDict(self.request.GET.urlencode().encode('utf-8'),
                                  mutable=True)
        no_page_query.pop('page', None)
        context['getvars'] = no_page_query.urlencode()
        return context

    def render_to_response(self, context, **response_kwargs):
        if self.kwargs.get('json'):
            autocomplete_list = [{'name': '%s (%s)' % (o.name, o.postcode), 'url': o.get_absolute_url()}
                                          for o in context['object_list']]
            return HttpResponse(json.dumps(autocomplete_list),
                                content_type='application/json')
        return super(SearchView, self).render_to_response(context,
                                                          **response_kwargs)


class NursingHomeDetailView(SearchMixin, DetailView):
    model = NursingHome

    def get_context_data(self, **kwargs):
        context = super(NursingHomeDetailView, self).get_context_data(**kwargs)
        context['title'] = _('Nursing home %(name)s') % {'name': self.object.name}
        context['description'] = _('Detail for the nursing home %(name)s.') % {'name': self.object.name}

        closest_nursinghomes = NursingHome.objects.get_by_distance(self.object)

        for nursinghome in closest_nursinghomes:
            nursinghome.prices = {
                'carelevel_1': nursinghome.data[u'Vollstationär Allgemein Pflegestufe 1 Eigenanteil'],
                'carelevel_2': nursinghome.data[u'Vollstationär Allgemein Pflegestufe 2 Eigenanteil'],
                'carelevel_3': nursinghome.data[u'Vollstationär Allgemein Pflegestufe 3 Eigenanteil'],
            }

        context['closest_nursinghomes'] = closest_nursinghomes

        return context
