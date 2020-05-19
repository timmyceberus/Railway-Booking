# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Foreigner(models.Model):
    pkind = models.ForeignKey('Person', models.DO_NOTHING, db_column='pkind')
    psp_no = models.CharField(primary_key=True, max_length=9)

    class Meta:
        managed = False
        db_table = 'foreigner'


class Native(models.Model):
    pkind = models.ForeignKey('Person', models.DO_NOTHING, db_column='pkind')
    ssn = models.CharField(primary_key=True, max_length=10)

    class Meta:
        managed = False
        db_table = 'native'


class Person(models.Model):
    pkind = models.IntegerField(primary_key=True)
    pname = models.CharField(max_length=15)
    tid = models.ForeignKey('Train', models.DO_NOTHING, db_column='tid')

    class Meta:
        managed = False
        db_table = 'person'


class Station(models.Model):
    sid = models.CharField(primary_key=True, max_length=4)
    sname = models.CharField(max_length=4)
    cty = models.CharField(max_length=3)

    class Meta:
        managed = False
        db_table = 'station'


class StopAt(models.Model):
    sid = models.OneToOneField(Station, models.DO_NOTHING, db_column='sid', primary_key=True)
    tid = models.ForeignKey('Train', models.DO_NOTHING, db_column='tid')
    torder = models.IntegerField()
    arrtime = models.TimeField()
    deptime = models.TimeField()

    class Meta:
        managed = False
        db_table = 'stop_at'
        unique_together = (('sid', 'tid'),)


class Ticket(models.Model):
    tid = models.CharField(primary_key=True, max_length=15)
    geton = models.ForeignKey(Station, models.DO_NOTHING, db_column='geton', related_name='geton')
    getoff = models.ForeignKey(Station, models.DO_NOTHING, db_column='getoff', related_name='getoff')
    price = models.IntegerField()
    ttrain = models.ForeignKey('Train', models.DO_NOTHING, db_column='ttrain')
    cno = models.IntegerField()
    sno = models.IntegerField()
    tdate = models.DateField()
    ontime = models.TimeField()
    offtime = models.TimeField()
    ttype = models.IntegerField()
    pkind = models.ForeignKey(Person, models.DO_NOTHING, db_column='pkind')

    class Meta:
        managed = False
        db_table = 'ticket'
        unique_together = (('tdate', 'ttrain', 'cno', 'sno'),)


class Train(models.Model):
    tid = models.CharField(primary_key=True, max_length=4)
    kind = models.IntegerField()
    line_no = models.IntegerField()
    dir = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'train'
