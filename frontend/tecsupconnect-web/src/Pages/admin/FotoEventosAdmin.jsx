// src/components/admin/FotoEventosAdmin.jsx
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import {
  getCicloActividades,
  getGaleriasByCicloActividad,
  createGaleria,
  uploadFotosMasivas
} from '../../services/apiAdmin';

function FotoEventosAdmin() {
  const [cicloActividades, setCicloActividades] = useState([]);
  const [cicloActSeleccionada, setCicloActSeleccionada] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [mensaje, setMensaje] = useState('');

  /* ──────────────────── 1) Cargar ciclo-actividades ──────────────────── */
  useEffect(() => {
    getCicloActividades()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.results ?? [];

        /* 🔹 Filtramos los ciclos 👉 solo los NO archivados */
        const activos = data.filter(
          ca => !ca.ciclo_academico_detalle?.archivado
        );

        setCicloActividades(activos);
      })
      .catch(err => {
        console.error('Error cargando ciclo-actividades:', err);
        Swal.fire(
          'Error',
          'No se pudieron cargar los eventos disponibles.',
          'error'
        );
      });
  }, []);

  /* ──────────────────── 2) Manejadores de archivos y subida ───────────── */
  const handleFileChange = e => {
    setImagenes(Array.from(e.target.files));
    setMensaje('');
  };

  const handleUpload = async () => {
    if (!cicloActSeleccionada || imagenes.length === 0) {
      return Swal.fire(
        'Atención',
        'Debes seleccionar un evento y al menos una imagen.',
        'warning'
      );
    }

    let galeriaIdParaSubir;

    try {
      const resGalerias = await getGaleriasByCicloActividad(
        cicloActSeleccionada
      );
      const existing = Array.isArray(resGalerias.data)
        ? resGalerias.data
        : resGalerias.data.results ?? [];

      if (existing.length > 0) {
        galeriaIdParaSubir = existing[0].id;
      } else {
        const resNew = await createGaleria({
          ciclo_actividad: cicloActSeleccionada
        });
        galeriaIdParaSubir = resNew.data.id;
      }
    } catch (error) {
      console.error('Error al obtener/crear la galería:', error);
      return Swal.fire(
        'Error',
        'No se pudo obtener o crear la galería.',
        'error'
      );
    }

    const formData = new FormData();
    formData.append('galeria', galeriaIdParaSubir);
    imagenes.forEach(img => formData.append('archivos', img));

    try {
      await uploadFotosMasivas(formData);
      Swal.fire('¡Listo!', 'Fotos subidas con éxito.', 'success');
      setImagenes([]);
      setMensaje('Fotos subidas correctamente');
      document.getElementById('file-upload-input').value = '';
    } catch (err) {
      console.error('Error subiendo fotos:', err);
      const detalle = err.response?.data
        ? JSON.stringify(err.response.data)
        : err.message;
      Swal.fire('Error', `No se pudieron subir las fotos. ${detalle}`, 'error');
      setMensaje('❌ Error al subir imágenes');
    }
  };

  /* ──────────────────── 3) Render ─────────────────────────────────────── */
  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
      <h1 className="text-2xl font-bold mb-4">🛠️ Subir Fotos de Actividades</h1>

      {/* Selector de Evento */}
      <div className="mb-4">
        <label htmlFor="ciclo-act-select" className="block font-medium mb-1">
          Evento:
        </label>
        <select
          id="ciclo-act-select"
          value={cicloActSeleccionada}
          onChange={e => setCicloActSeleccionada(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Selecciona un evento --</option>

          {cicloActividades.map(ca => {
            const ciclo = ca.ciclo_academico_detalle;
            const year = ciclo?.fecha_inicio
              ? new Date(ciclo.fecha_inicio).getFullYear()
              : '—';
            return (
              <option key={ca.id} value={ca.id}>
                {ca.actividad_detalle?.nombre} – Semestre {ciclo?.semestre}{' '}
                {year}
              </option>
            );
          })}
        </select>
      </div>

      {/* Input de imágenes */}
      <div className="mb-4">
        <label
          htmlFor="file-upload-input"
          className="block font-medium mb-1"
        >
          Imágenes (múltiple):
        </label>
        <input
          id="file-upload-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="block w-full"
        />
      </div>

      {/* Botón de subida */}
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!cicloActSeleccionada || imagenes.length === 0}
      >
        Subir Fotos
      </button>

      {/* Mensajes + previews */}
      {mensaje && (
        <p
          className={`mt-2 ${
            mensaje.includes('Error') ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {mensaje}
        </p>
      )}

      {imagenes.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {imagenes.map((img, i) => (
            <img
              key={i}
              src={URL.createObjectURL(img)}
              alt={`preview-${i}`}
              className="w-full h-32 object-cover rounded"
              onLoad={() => URL.revokeObjectURL(img.src)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FotoEventosAdmin;
