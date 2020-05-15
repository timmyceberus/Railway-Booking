from django.contrib import admin
from .models import Station, Train, Person, Ticket, StationAdmin, TrainAdmin, PersonAdmin, TicketAdmin

# Register your models here.
admin.site.register(Station, StationAdmin)
admin.site.register(Train, TrainAdmin)
admin.site.register(Person, PersonAdmin)
admin.site.register(Ticket, TicketAdmin)
