from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .pagination import CustomPageNumberPagination

from .models import (
    CicloAcademico, Evento,Actividad, MiembroPsicopedagogia, ImagenGeneralNosotros,
    Foto, Galeria, CicloActividad
)

from .serializers import (
    CicloAcademicoSerializer, CicloActividadSerializer, EventoSerializer, MiembroPsicopedagogiaSerializer,
    ImagenGeneralNosotrosSerializer, FotoSerializer,
    CargaMasivaFotoEventoSerializer, ActividadSerializer, GaleriaSerializer
)

class CicloAcademicoViewSet(viewsets.ModelViewSet):
    queryset         = CicloAcademico.objects.all()
    serializer_class = CicloAcademicoSerializer
    filter_backends  = [filters.OrderingFilter, filters.SearchFilter]
    search_fields    = ['semestre']

class ActividadViewSet(viewsets.ModelViewSet):
    queryset         = Actividad.objects.all()
    serializer_class = ActividadSerializer
    filter_backends  = [filters.SearchFilter]
    search_fields    = ['nombre']

class CicloActividadViewSet(viewsets.ModelViewSet):
    queryset         = CicloActividad.objects.select_related('ciclo_academico', 'actividad')
    serializer_class = CicloActividadSerializer
    filter_backends  = [DjangoFilterBackend]
    filterset_fields = ['ciclo_academico', 'actividad']

class GaleriaViewSet(viewsets.ModelViewSet):
    queryset         = Galeria.objects.all()
    serializer_class = GaleriaSerializer
    filter_backends  = [DjangoFilterBackend]
    filterset_fields = ['ciclo_actividad']

class FotoViewSet(viewsets.ModelViewSet):
    queryset         = Foto.objects.all().order_by('id') # Define un queryset base ordenado
    serializer_class = FotoSerializer
    filter_backends  = [DjangoFilterBackend]
    filterset_fields = ['galeria__ciclo_actividad'] # <-- Cambiado aquí
    pagination_class = CustomPageNumberPagination  # Esto ya lo tenías y es correcto
    
    def get_queryset(self):
        # Puedes mantener o ajustar tu lógica de filtrado aquí
        queryset = super().get_queryset()
        galeria_ciclo_actividad = self.request.query_params.get('galeria__ciclo_actividad', None)
        if galeria_ciclo_actividad:
            queryset = queryset.filter(galeria__ciclo_actividad=galeria_ciclo_actividad)
        return queryset

class EventoViewSet(viewsets.ModelViewSet):
    queryset         = Evento.objects.all()
    serializer_class = EventoSerializer
    filter_backends  = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['ciclo_academico']

class MiembroPsicopedagogiaViewSet(viewsets.ModelViewSet):
    queryset = MiembroPsicopedagogia.objects.all()
    serializer_class = MiembroPsicopedagogiaSerializer
    permission_classes = [AllowAny]


class ImagenGeneralNosotrosViewSet(viewsets.ModelViewSet):
    queryset = ImagenGeneralNosotros.objects.all()
    serializer_class = ImagenGeneralNosotrosSerializer
    permission_classes = [AllowAny]


class CargaMasivaFotoEventoView(APIView):
    # Para procesar archivos
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = CargaMasivaFotoEventoSerializer(data=request.data)
        if serializer.is_valid():
            fotos = serializer.save()
            return Response({'message': 'Fotos subidas con éxito'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)