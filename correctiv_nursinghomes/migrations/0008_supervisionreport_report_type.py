# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-27 15:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('correctiv_nursinghomes', '0007_supervisionauthority_borough'),
    ]

    operations = [
        migrations.AddField(
            model_name='supervisionreport',
            name='report_type',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
