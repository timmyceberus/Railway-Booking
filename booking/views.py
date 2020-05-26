from django.shortcuts import render
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.db import connection

import re

from .models import Station, StopAt


# Create your views here.
def show_index(request):
    return render(request, 'index.html')


def get_train_schedule(request):
    tid = request.GET.get('train_id')
    cursor = connection.cursor()
    cursor.execute('''
            select s.sname,st.arrtime,st.deptime
            from stop_at as st,train as t,station as s
            where st.sid=s.sid and st.tid=t.tid and t.tid = '%s'
            order by st.torder;
        ''' % tid)
    train_schedule = cursor.fetchall()

    trains_schedule_dict = []
    for train_s in train_schedule:
        trains_schedule_dict.append({'sname': train_s[0], 'arrtime': train_s[1], 'deptime': train_s[2]})

    return JsonResponse(trains_schedule_dict, safe=False)


def get_all_stations(request):
    stations = Station.objects.all()

    stations_dict = []
    for station in stations:
        stations_dict.append(model_to_dict(station))

    # If set safe parameter to False, any object can be passed for serialization
    return JsonResponse(stations_dict, safe=False)


def search_train(request):
    begin_station = request.GET.get('begin_station')
    dest_station = request.GET.get('dest_station')
    time = request.GET.get('time')

    # Get id from request message
    begin_station_id = re.search('[\\d]{4}', begin_station).group(0)
    dest_station_id = re.search('[\\d]{4}', dest_station).group(0)

    # Find which train satisfied the request
    cursor = connection.cursor()
    cursor.execute('''
        select st1.tid, st1.arrtime, st2.arrtime, t.kind, t.line_no
        from stop_at as st1, stop_at as st2, train as t
        where st1.deptime > '%s' and st1.sid = '%s' and st2.sid = '%s'
            and st1.tid = st2.tid and st1.torder < st2.torder and t.tid = st1.tid
        order by st1.arrtime;
    ''' % (time, begin_station_id, dest_station_id))

    trains = cursor.fetchall()  # return tuple instead of Queryset

    trains_dict = []
    for train in trains:
        trains_dict.append({'tid': train[0], 'begin_time': train[1], 'dest_time': train[2],
                            'kind': train[3], 'line_no': train[4]})

    return JsonResponse(trains_dict, safe=False)


# Example
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
