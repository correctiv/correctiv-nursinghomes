# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-25 15:15
from __future__ import unicode_literals

import correctiv_nursinghomes.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('geogermany', '0004_auto_20160525_1715'),
        ('correctiv_nursinghomes', '0004_auto_20160525_1639'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='supervisionauthority',
            options={'verbose_name': 'Supervision Authority', 'verbose_name_plural': 'Supervision Authorities'},
        ),
        migrations.AlterModelOptions(
            name='supervisionreport',
            options={'verbose_name': 'Supervision Report', 'verbose_name_plural': 'Supervision Reports'},
        ),
        migrations.AddField(
            model_name='supervisionauthority',
            name='district',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='geogermany.District'),
        ),
        migrations.AddField(
            model_name='supervisionauthority',
            name='state',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='geogermany.State'),
        ),
        migrations.AlterField(
            model_name='nursinghome',
            name='district',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='geogermany.District'),
        ),
        migrations.AlterField(
            model_name='nursinghome',
            name='state',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='geogermany.State'),
        ),
        migrations.AlterField(
            model_name='supervisionreport',
            name='report',
            field=models.FileField(blank=True, upload_to=correctiv_nursinghomes.models.report_file_path),
        ),
    ]