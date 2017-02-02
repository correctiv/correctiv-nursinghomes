# -*- encoding: utf-8 -*-
import json

from django.views.generic import TemplateView, ListView
from django.views.generic.detail import DetailView
from django.shortcuts import render
from django.http import QueryDict
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

    center = None
    center_label = None

    def get_queryset(self):
        self.form = SearchForm(self.request.GET)
        self.center = None
        if self.form.is_valid():
            center, label = geocode(self.form.cleaned_data['q'])
            if center is not None:
                self.center = center
                self.center_label = label
                return NursingHome.objects.get_by_distance_to_point(
                        self.center, limit=None, distance=30000)
        return NursingHome.objects.all()

    def get_context_data(self, **kwargs):
        context = super(SearchView, self).get_context_data(**kwargs)
        context['form'] = self.form
        context['center'] = self.center
        context['query'] = self.request.GET.get('q', '')
        context['center_label'] = self.center_label
        no_page_query = QueryDict(self.request.GET.urlencode().encode('utf-8'),
                                  mutable=True)
        no_page_query.pop('page', None)
        context['getvars'] = no_page_query.urlencode()
        return context


class NursingHomeDetailView(SearchMixin, DetailView):
    model = NursingHome

    def get_context_data(self, **kwargs):
        context = super(NursingHomeDetailView, self).get_context_data(**kwargs)
        map_data = NursingHome.objects.get_map_data(self.object)
        price_comparison_data = NursingHome.objects.get_price_comparison_data(self.object)

        context['map_json'] = json.dumps(map_data)
        context['price_comparison_json'] = json.dumps(price_comparison_data)
        context['title'] = _('Nursing home %(name)s') % {'name': self.object.name}
        context['description'] = _('Details about the nursing home %(name)s.') % {'name': self.object.name}

        return context

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        context = self.get_context_data(object=self.object)

        if not self.request.user.is_staff and not self.object.visible:
            return self.show_451(request, context)

        return self.render_to_response(context)

    def show_451(self, request, context):
        return render(request,
                'correctiv_nursinghomes/nursinghome_detail_removed.html',
                context, status=451)
