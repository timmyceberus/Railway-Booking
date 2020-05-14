# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Foreigner(models.Model):
    skey = models.ForeignKey('Person', models.DO_NOTHING, db_column='skey')
    psp_no = models.CharField(primary_key=True, max_length=9)

    class Meta:
        managed = False
        db_table = 'foreigner'


class Native(models.Model):
    skey = models.ForeignKey('Person', models.DO_NOTHING, db_column='skey')
    ssn = models.CharField(primary_key=True, max_length=10)

    class Meta:
        managed = False
        db_table = 'native'


class Person(models.Model):
    skey = models.IntegerField(primary_key=True)
    pname = models.CharField(max_length=15)
    tid = models.ForeignKey('Train', models.DO_NOTHING, db_column='tid')

    class Meta:
        managed = False
        db_table = 'person'


class Station(models.Model):
    sid = models.CharField(primary_key=True, max_length=4)
    sname = models.CharField(max_length=4)
    slevel = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'station'


class StopAt(models.Model):
    sid = models.OneToOneField(Station, models.DO_NOTHING, db_column='sid', primary_key=True)
    tid = models.ForeignKey('Train', models.DO_NOTHING, db_column='tid')

    class Meta:
        managed = False
        db_table = 'stop_at'
        unique_together = (('sid', 'tid'),)


class Ticket(models.Model):
    tid = models.CharField(primary_key=True, max_length=15)
    geton = models.CharField(max_length=4)
    getoff = models.CharField(max_length=4)
    price = models.IntegerField()
    cno = models.IntegerField()
    sno = models.IntegerField()
    tdate = models.DateTimeField()
    ttype = models.IntegerField()
    skey = models.ForeignKey(Person, models.DO_NOTHING, db_column='skey')

    class Meta:
        managed = False
        db_table = 'ticket'


class Train(models.Model):
    tid = models.CharField(primary_key=True, max_length=4)
    beg = models.CharField(max_length=4)
    dest = models.CharField(max_length=4)
    kind = models.IntegerField()
    line_no = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'train'
