from django.shortcuts import render
from django.http import JsonResponse
from django.forms.models import model_to_dict
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
    filter_fields = ('sname','cty', )  # filter by url, e.g. api/station?sname=臺中


def get_stations(request):
    begin_station = request.GET.get('begin_station')
    dest_station = request.GET.get('dest_station')

    b_obj = Station.objects.get(sname=begin_station)
    d_obj = Station.objects.get(sname=dest_station)

    b_dict = model_to_dict(b_obj)
    d_dict = model_to_dict(d_obj)

    context = {
        'begin_station_id': b_dict['sid'],
        'begin_station_name': b_dict['sname'],
        'dest_station_id': d_dict['sid'],
        'dest_station_name': d_dict['sname']
    }
    return JsonResponse(context)
