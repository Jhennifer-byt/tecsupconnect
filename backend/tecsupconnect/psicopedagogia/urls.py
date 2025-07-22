from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    CicloAcademicoViewSet,
    ActividadViewSet, 
    CicloActividadViewSet,
    GaleriaViewSet, 
    FotoViewSet,
    EventoViewSet,
    ImagenGeneralNosotrosViewSet,
    CargaMasivaFotoEventoView, 
    MiembroPsicopedagogiaViewSet
)

router = DefaultRouter()
router.register('ciclos', CicloAcademicoViewSet)
router.register('actividades', ActividadViewSet)
router.register('ciclo-actividades', CicloActividadViewSet)
router.register('galerias', GaleriaViewSet)
router.register('eventos', EventoViewSet)
router.register(r'nosotros', ImagenGeneralNosotrosViewSet, basename='imagen-nosotros')
router.register('miembros', MiembroPsicopedagogiaViewSet)
router.register('fotos', FotoViewSet)

urlpatterns = [
path('fotos/carga-masiva/', CargaMasivaFotoEventoView.as_view(), name='carga_masiva_fotos'),
] + router.urls 
