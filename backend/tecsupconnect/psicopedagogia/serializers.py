from rest_framework import serializers
from .models import (
    CicloAcademico, Actividad, CicloActividad, MiembroPsicopedagogia, ImagenGeneralNosotros, Foto, Galeria, Evento
)

class CicloAcademicoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CicloAcademico
        fields = ['id', 'fecha_inicio', 'semestre', 'fecha_fin', 'archivado']

class ActividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actividad
        fields = ['id', 'nombre', 'enlace_inscripcion', 'descripcion', 'enlace_cronograma', 'enlace_extra', 'imagen']

class CicloActividadSerializer(serializers.ModelSerializer):
    ciclo_academico_detalle = CicloAcademicoSerializer(source='ciclo_academico', read_only=True)
    actividad_detalle       = ActividadSerializer(source='actividad', read_only=True)

    class Meta:
        model  = CicloActividad
        fields = ['id', 'ciclo_academico', 'actividad', 'ciclo_academico_detalle', 'actividad_detalle']

class GaleriaSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Galeria
        fields = '__all__'

class FotoSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()
    class Meta:
        model  = Foto
        fields = ['id', 'galeria', 'imagen', 'imagen_url']
    def get_imagen_url(self, obj):
        req = self.context.get('request')
        return req.build_absolute_uri(obj.imagen.url) if obj.imagen else ''


class EventoSerializer(serializers.ModelSerializer):
    ciclo_academico_detalle = CicloAcademicoSerializer(source='ciclo_academico', read_only=True)

    class Meta:
        model  = Evento
        fields = ['id', 'nombre', 'ciclo_academico', 'enlace_inscripcion', 'imagen', 'ciclo_academico_detalle']


class MiembroPsicopedagogiaSerializer(serializers.ModelSerializer):
    foto_url = serializers.SerializerMethodField()

    class Meta:
        model = MiembroPsicopedagogia
        fields = ['id', 'nombre', 'frase', 'foto', 'foto_url']

    def get_foto_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.foto.url) if obj.foto else ''

class ImagenGeneralNosotrosSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = ImagenGeneralNosotros
        fields = ['id', 'imagen', 'imagen_url']

    def get_imagen_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.imagen.url) if obj.imagen else ''


class CargaMasivaFotoEventoSerializer(serializers.Serializer):
    galeria   = serializers.PrimaryKeyRelatedField(queryset=Galeria.objects.all())
    archivos  = serializers.ListField(
        child=serializers.FileField(),
        write_only=True
    )

    def create(self, validated_data):
        galeria  = validated_data['galeria']
        archivos = validated_data['archivos']
        fotos = []
        for archivo in archivos:
            foto = Foto.objects.create(
                galeria=galeria,
                imagen=archivo
            )
            fotos.append(foto)
        return fotos