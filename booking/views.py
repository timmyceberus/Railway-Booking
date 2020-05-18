from django.shortcuts import render
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend

from .serializers import StationSerializer
from .models import Station


# Create your views here.
def show_index(request):
    return render(request, 'index.html')


class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()  # Get all items in database
    serializer_class = StationSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ('sname',)  # filter by url, e.g. api/station?sname=臺中
