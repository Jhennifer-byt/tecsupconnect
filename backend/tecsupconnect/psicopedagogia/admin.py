from django.contrib import admin
from .models import (
    CicloAcademico, Actividad, CicloActividad,
    Galeria, Foto, Evento,
    
)

@admin.register(CicloAcademico)
class CicloAcademicoAdmin(admin.ModelAdmin):
    list_display  = ('id', 'semestre', 'fecha_inicio', 'fecha_fin', 'archivado')
    list_filter   = ('semestre', 'archivado')
    search_fields = ('semestre',)

@admin.register(Actividad)
class ActividadAdmin(admin.ModelAdmin):
    list_display  = ('id', 'nombre', 'enlace_inscripcion')
    search_fields = ('nombre',)

@admin.register(CicloActividad)
class CicloActividadAdmin(admin.ModelAdmin):
    list_display = ('id', 'ciclo_academico', 'actividad')
    list_filter  = ('ciclo_academico',)

@admin.register(Galeria)
class GaleriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'ciclo_actividad')
    list_filter  = ('ciclo_actividad',)

@admin.register(Foto)
class FotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'galeria', 'imagen', 'imagen_url')
    list_filter  = ('galeria',)

    def imagen_url(self, obj):
        if obj.imagen:
            return obj.imagen.url
        return '-'
    imagen_url.short_description = 'URL de la imagen'

@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display  = ('id', 'nombre', 'ciclo_academico', 'enlace_inscripcion')
    list_filter   = ('ciclo_academico',)
    search_fields = ('nombre',)

