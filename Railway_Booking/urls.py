"""Railway_Booking URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from booking import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.show_index),
    path('station/', views.get_stations),
    path('booking/<tid>/<bsid>/<dsid>', views.booking),
    path('TicketInsert/<bsid>/<dsid>/<ssn_type>/<ssn_value>/<name>/<ticket_type>/<date>/<train_id>/<ticket_count>', views.insert_ticket),
    path('allstations/', views.get_all_stations),
    path('TrainSchedule/', views.get_train_schedule),
    path('SearchTrain/', views.search_train)

]
