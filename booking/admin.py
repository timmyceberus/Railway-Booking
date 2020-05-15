from django.contrib import admin
from .models import Station, Train, Person, Ticket

# Register your models here.
admin.site.register(Station)
admin.site.register(Train)
admin.site.register(Person)
admin.site.register(Ticket)
