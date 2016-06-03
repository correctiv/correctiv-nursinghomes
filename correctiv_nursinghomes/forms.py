from django import forms
from django.utils.translation import ugettext_lazy as _

from .models import NursingHome


class SearchForm(forms.Form):
    q = forms.CharField(
        required=False,
        label=_('Search'),
        widget=forms.TextInput(
            attrs={
                'type': 'search',
                'class': 'form-control',
                'placeholder': _('address, location, or postcode')
            }))

    # def search(self, queryset, autocomplete=False):
    #     if not self.is_valid():
    #         return queryset
    #
    #     query = self.cleaned_data['q'].strip()
    #     if autocomplete:
    #         return NursingHome.objects.autocomplete(queryset, query)
    #     return NursingHome.objects.search(queryset, query)
    #
    # def autocomplete(self, queryset):
    #     return self.search(queryset, autocomplete=True)
