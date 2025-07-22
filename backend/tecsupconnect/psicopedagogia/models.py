from django.db import models

class CicloAcademico(models.Model):
    fecha_inicio   = models.DateField()
    semestre       = models.IntegerField()
    fecha_fin      = models.DateField()
    archivado      = models.BooleanField(default=False)

    def __str__(self):
        return f"Ciclo {self.semestre} ({self.fecha_inicio} – {self.fecha_fin})"


class Actividad(models.Model):
    nombre              = models.CharField(max_length=255)
    enlace_inscripcion  = models.URLField(max_length=500, blank=True)
    descripcion         = models.TextField()
    enlace_cronograma   = models.URLField(max_length=500, blank=True)
    enlace_extra        = models.URLField(max_length=500, blank=True)
    imagen              = models.ImageField(upload_to='actividades/', blank=True, null=True)

    def __str__(self):
        return self.nombre


class CicloActividad(models.Model):
    ciclo_academico = models.ForeignKey(
        CicloAcademico, on_delete=models.CASCADE, related_name='ciclo_actividades'
    )
    actividad       = models.ForeignKey(
        Actividad, on_delete=models.CASCADE, related_name='ciclo_actividades'
    )

    class Meta:
        unique_together = ('ciclo_academico', 'actividad')

    def __str__(self):
        return f"{self.actividad.nombre} en {self.ciclo_academico}"


class Galeria(models.Model):
    ciclo_actividad = models.ForeignKey(
        CicloActividad, on_delete=models.CASCADE, related_name='galerias'
    )

    def __str__(self):
        return f"Galería {self.id} de {self.ciclo_actividad}"


class Foto(models.Model):
    imagen   = models.ImageField(
        upload_to='galerias/',
    null=True, 
    blank=True)
    galeria  = models.ForeignKey(
        Galeria, on_delete=models.CASCADE, 
        related_name='fotos'
    )

    def __str__(self):
        return self.url


class Evento(models.Model):
    nombre             = models.CharField(max_length=255)
    ciclo_academico    = models.ForeignKey(
        CicloAcademico, on_delete=models.CASCADE, related_name='eventos'
    )
    enlace_inscripcion = models.URLField(max_length=500, blank=True)
    imagen             = models.ImageField(upload_to='eventos/', blank=True, null=True)

    def __str__(self):
        return self.nombre


class MiembroPsicopedagogia(models.Model):
    nombre = models.CharField(max_length=255)
    frase = models.TextField()
    foto = models.ImageField(upload_to='psicopedagogia/')

    def __str__(self):
        return self.nombre

class ImagenGeneralNosotros(models.Model):
    imagen = models.ImageField(upload_to='nosotros/')
    actualizado_en = models.DateTimeField(auto_now=True)  # Para saber cuándo se actualizó

    def __str__(self):
        return f"Imagen actualizada en {self.actualizado_en}"
