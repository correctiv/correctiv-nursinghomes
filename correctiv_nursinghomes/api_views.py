from rest_framework import serializers, viewsets

from .models import NursingHome


class NursingHomeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = NursingHome
        fields = ('id', 'name', 'slug',)


class NursingHomeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    permission_classes = ()
    authentication_classes = ()

    queryset = NursingHome.objects.all()
    serializer_class = NursingHomeSerializer
