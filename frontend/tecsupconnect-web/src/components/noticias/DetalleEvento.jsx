// src/components/DetalleEvento.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getCicloActividadesByActividad,
  getFotosByCicloActividadPaged,
} from '../../services/api';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function DetalleEvento() {
  const { actividadId } = useParams();
  const [ciclos, setCiclos] = useState([]);
  const [selectedCA, setSelectedCA] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Paginación */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  /* Lightbox */
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  /* ───────── 1. Cargar ciclos ───────── */
  useEffect(() => {
    async function loadCiclos() {
      setLoading(true);
      setError(null);

      const parsedId = parseInt(actividadId, 10);
      if (isNaN(parsedId)) {
        setError('No se ha proporcionado un ID de actividad válido.');
        setLoading(false);
        return;
      }

      try {
        const data   = await getCicloActividadesByActividad(parsedId);
        const lista  = Array.isArray(data) ? data : data.results ?? [];

        /* Orden: año ↓, semestre ↓ */
        const sorted = lista.sort((a, b) => {
          const yA = new Date(a.ciclo_academico_detalle?.fecha_inicio).getFullYear() || 0;
          const yB = new Date(b.ciclo_academico_detalle?.fecha_inicio).getFullYear() || 0;
          const sA = a.ciclo_academico_detalle?.semestre || 0;
          const sB = b.ciclo_academico_detalle?.semestre || 0;
          return yB - yA || sB - sA;
        });

        setCiclos(sorted);
        const defaultCA =
          sorted.find(c => !c.ciclo_academico_detalle?.archivado) || sorted[0];
        setSelectedCA(defaultCA || null);
        setPage(1);
      } catch (e) {
        console.error(e);
        setError('No se pudieron cargar los ciclos para esta actividad.');
      } finally {
        setLoading(false);
      }
    }
    loadCiclos();
  }, [actividadId]);

  /* ───────── 2. Cargar fotos ───────── */
  useEffect(() => {
    if (!selectedCA) return setFotos([]);

    async function loadFotos() {
      setLoading(true);
      setError(null);
      try {
        const data = await getFotosByCicloActividadPaged(
          selectedCA.id,
          page,
          pageSize
        );
        setFotos(data.results);
        setTotalPages(Math.ceil(data.count / pageSize));
      } catch (e) {
        console.error(e);
        setError('No se pudieron cargar las fotos.');
        setFotos([]);
      } finally {
        setLoading(false);
      }
    }
    loadFotos();
  }, [selectedCA, page]);

  /* ───────── 3. Render ───────── */
  return (
    <div className="px-6 md:px-24 py-12">
      <h1 className="text-3xl font-bold text-sky-800 mb-6">
        Galería de la Actividad
      </h1>

      {loading && <p className="text-gray-600">Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Selector de semestre */}
      {!loading && ciclos.length > 0 && (
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {ciclos.map(ca => {
            const ciclo = ca.ciclo_academico_detalle;
            const año   = ciclo?.fecha_inicio
              ? new Date(ciclo.fecha_inicio).getFullYear()
              : '';
            const label = `Semestre ${ciclo?.semestre || ''} ${año}`;
            return (
              <button
                key={ca.id}
                onClick={() => { setSelectedCA(ca); setPage(1); }}
                className={`px-3 py-1 rounded whitespace-nowrap text-sm font-medium
                  transition-colors duration-200 ${
                    selectedCA?.id === ca.id
                      ? 'bg-sky-600 text-white shadow'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                title={label}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Cascada de fotos */}
      {!loading && (
        fotos.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {fotos.map((f, idx) => (
              <img
                key={f.id || idx}
                src={f.imagen || f.imagen_url || f.url}
                alt={f.descripcion || `Foto ${idx + 1}`}
                className="mb-4 w-full rounded-lg shadow-md break-inside-avoid cursor-pointer
                           transition-transform duration-300 hover:scale-[1.03]"
                onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'https://placehold.co/400x300/CCCCCC/000000?text=Sin+imagen';
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            {selectedCA
              ? 'No hay imágenes para este semestre.'
              : 'Selecciona un ciclo para ver fotos.'}
          </p>
        )
      )}

      {/* Paginación */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            ‹ Anterior
          </button>
          <span>Página {page} de {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Siguiente ›
          </button>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={fotos.map(f => ({ src: f.imagen || f.imagen_url || f.url }))}
      />
    </div>
  );
}
