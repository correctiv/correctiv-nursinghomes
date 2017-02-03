# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-03 12:01
from __future__ import unicode_literals

import django.contrib.postgres.search
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('correctiv_nursinghomes', '0011_auto_20170202_1043'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='nursinghome',
            name='search_index',
        ),
        migrations.AddField(
            model_name='nursinghome',
            name='search_vector',
            field=django.contrib.postgres.search.SearchVectorField(null=True),
        ),
    ]
