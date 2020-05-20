from django.shortcuts import render
from django.http import JsonResponse
from django.forms.models import model_to_dict

from .models import Station


# Create your views here.
def show_index(request):
    return render(request, 'index.html')


def get_all_stations(request):
    stations = Station.objects.all()

    stations_dict = []
    for station in stations:
        stations_dict.append(model_to_dict(station))

    # If set safe parameter to False, any object can be passed for serialization
    return JsonResponse(stations_dict, safe=False)


def get_stations(request):

    # Get information from ajax requests
    begin_station = request.GET.get('begin_station')
    dest_station = request.GET.get('dest_station')

    # Get object from database
    b_obj = Station.objects.get(sname=begin_station)
    d_obj = Station.objects.get(sname=dest_station)

    # Convert object to dictionary
    b_dict = model_to_dict(b_obj)
    d_dict = model_to_dict(d_obj)

    context = {
        'begin_station_id': b_dict['sid'],
        'begin_station_name': b_dict['sname'],
        'dest_station_id': d_dict['sid'],
        'dest_station_name': d_dict['sname']
    }
    return JsonResponse(context)
