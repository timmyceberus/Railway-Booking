from django.shortcuts import render
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.db import connection

import re
import random, string

from .models import Station, Train


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


def insert_ticket(request):
    begin_station = request.GET.get('begin_station')
    begin_station_id = re.search('[\\d]{4}', begin_station).group(0)

    dest_station = request.GET.get('dest_station')
    dest_station_id = re.search('[\\d]{4}', dest_station).group(0)

    ssn_type = request.GET.get('ssn_type')
    ssn_value = request.GET.get('ssn_value')
    name = request.GET.get('name')
    ticket_type = request.GET.get('schedule_kind')
    date = request.GET.get('date')
    train_id = request.GET.get('train_id')
    ticket_count = request.GET.get('ticket_count')
    ticket_count = int(ticket_count)

    cursor = connection.cursor()

    if not check_ssn_conflict(ssn_value):
        surrogate_key = insert_person(name, train_id, ssn_type, ssn_value)
    else:
        if check_ssn_conflict(ssn_value) == 'native':
            cursor.execute('''
                    select pkind
                    from native
                    where ssn='%s';
                ''' % ssn_value)
            temp = cursor.fetchall()
            surrogate_key = temp[0][0]
        else:
            cursor.execute('''
                        select pkind
                        from foreigner
                        where psp_no='%s';
                    ''' % ssn_value)
            temp = cursor.fetchall()
            surrogate_key = temp[0][0]

    for i in range(0, ticket_count):

        while True:
            id_temp = ''.join(random.choice(string.digits) for x in range(15))
            cursor.execute('''
                select count(*)
                from ticket
                where tid='%s';
            ''' % id_temp)
            temp = cursor.fetchall()
            if temp[0][0] == 0:
                break
        while True:
            car_no = random.randrange(1, 12)
            seat_no = random.randrange(1, 52)
            cursor.execute('''
                    select count(*)
                    from ticket
                    where cno = %d and sno = %d;
                ''' % (car_no, seat_no))
            temp = cursor.fetchall()

            if temp[0][0] == 0:
                cursor.execute('''
                        insert into ticket values ('%s','%s','%s','%s',%d,%d,'%s',%s,%d);
                     ''' % (id_temp, begin_station_id, dest_station_id, train_id, car_no, seat_no, date, ticket_type, surrogate_key))
                break
    return render(request)


def check_ssn_conflict(ssn):
    cursor = connection.cursor()
    cursor.execute('''
            select count(*)
            from native
            where ssn='%s';
       ''' % ssn)
    temp = cursor.fetchall()
    if temp[0][0] == 1:
        return 'native'

    cursor.execute('''
                select count(*)
                from foreigner
                where psp_no='%s';
           ''' % ssn)
    temp = cursor.fetchall()
    if temp[0][0] == 1:
        return 'foreigner'

    return False


def insert_person(name, train_id, ssn_type, ssn_value):
    cursor = connection.cursor()
    cursor.execute('''
                    select MAX(pkind)
                    from person;
                ''')

    temp = cursor.fetchall()
    surrogate_key = temp[0][0]
    if surrogate_key is None:
        cursor.execute('''
                        insert into person values (%d,'%s','%s');
                    ''' % (0, name, train_id))
        surrogate_key = 0
    else:
        surrogate_key += 1
        cursor.execute('''
                        insert into person values (%d,'%s','%s');
                    ''' % (surrogate_key, name, train_id))

    if ssn_type == 'ssn':
        cursor.execute('''
                        insert into native values (%d,'%s');
                     ''' % (surrogate_key, ssn_value))
    else:
        cursor.execute('''
                        insert into foreigner values (%d,'%s');
                    ''' % (surrogate_key, ssn_value))
    return surrogate_key


def booking(request, tid, bsid, dsid):
    train_names = ['自強', '莒光', '復興']

    try:
        begin_station = Station.objects.get(sid=bsid)
        dest_station = Station.objects.get(sid=dsid)
        train = Train.objects.get(tid=tid)
    except:
        return render(request, '404 not found.html')

    begin_name = begin_station.sname
    dest_name = dest_station.sname
    train_name = train_names[train.kind]

    context = {
        'train_id': tid,
        'train_name': train_name,
        'begin_station_id': bsid,
        'full_begin_station': bsid + ' ' + begin_name,
        'dest_station_id': dsid,
        'full_dest_station': dsid + ' ' + dest_name
    }
    return render(request, 'booking.html', context=context)


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
