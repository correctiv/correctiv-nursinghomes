# -*- encoding: utf-8 -*-
import json

from django.views.generic import TemplateView, ListView
from django.views.generic.detail import DetailView
from django.http import HttpResponse, QueryDict
from django.shortcuts import redirect
from django.utils.translation import ugettext_lazy as _

from .models import NursingHome
from .forms import SearchForm
from .geocode import geocode


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
        self.form = SearchForm(self.request.GET)
        self.center = None
        if self.form.is_valid():
            center = geocode(self.form.cleaned_data['q'])
            if center is not None:
                self.center = center
                return NursingHome.objects.get_by_distance_to_point(self.center,
                                                             limit=20)
        return NursingHome.objects.all()

    def get_context_data(self, **kwargs):
        context = super(SearchView, self).get_context_data(**kwargs)
        context['form'] = self.form
        context['center'] = self.center
        context['query'] = self.request.GET.get('q', '')
        no_page_query = QueryDict(self.request.GET.urlencode().encode('utf-8'),
                                  mutable=True)
        no_page_query.pop('page', None)
        context['getvars'] = no_page_query.urlencode()
        return context


class NursingHomeDetailView(SearchMixin, DetailView):
    model = NursingHome

    def get_context_data(self, **kwargs):
        context = super(NursingHomeDetailView, self).get_context_data(**kwargs)
        context['title'] = _('Nursing home %(name)s') % {'name': self.object.name}
        context['description'] = _('Detail for the nursing home %(name)s.') % {'name': self.object.name}

        closest = NursingHome.objects.get_json_for_page(self.object)

        context['closest_nursinghomes'] = json.dumps(closest)

        return context
