from django.db import migrations
import os

class Migration(migrations.Migration):
    dependencies = [
        ('psicopedagogia', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            sql=open(
                os.path.join(os.path.dirname(__file__), '../sql/eliminar_eventos_si_ciclo_archivado.sql')
            ).read(),
            reverse_sql='DROP TRIGGER eliminar_eventos_si_ciclo_archivado;'
        ),
    ]
