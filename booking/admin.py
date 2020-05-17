from django.contrib import admin
from .models import Station, Train, Person, Ticket


class PersonAdmin(admin.ModelAdmin):
    list_display = ('pname', 'tid', 'pkind')


class StationAdmin(admin.ModelAdmin):
    list_display = ('sid', 'sname')
    search_fields = ('sname',)


class TicketAdmin(admin.ModelAdmin):
    list_display = ('tid', 'geton', 'getoff', 'tdate', 'ttype')


class TrainAdmin(admin.ModelAdmin):
    list_display = ('tid', 'beg', 'dest')


# Register your models here.
admin.site.register(Station, StationAdmin)
admin.site.register(Train, TrainAdmin)
admin.site.register(Person, PersonAdmin)
admin.site.register(Ticket, TicketAdmin)
