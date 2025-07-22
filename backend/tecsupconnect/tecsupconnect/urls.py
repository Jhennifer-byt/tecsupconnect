from django.contrib import admin
from django.urls import path, include  # <- agrega include
from django.conf import settings       # <- agrega esto
from django.conf.urls.static import static  # <- y esto
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('psicopedagogia.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
