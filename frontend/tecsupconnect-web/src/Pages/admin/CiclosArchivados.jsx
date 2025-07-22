// src/components/admin/CiclosArchivados.jsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  getCiclos,
  getCicloActividades,
  getFotosPaged
} from '../../services/apiAdmin';

const usePhotosByCAState = (initialPages = {}) => {
  const [data, setData] = useState(initialPages);
  const getCAData = useCallback(
    (caId) => data[caId] || { fotos: [], page: 1, totalPages: 1, loading: false, error: null },
    [data]
  );
  const setCAData = useCallback(
    (caId, newData) => setData(prev => ({ ...prev, [caId]: { ...prev[caId], ...newData } })),
    []
  );
  return { getCAData, setCAData };
};

export default function CiclosArchivados() {
  const [ciclos, setCiclos] = useState([]);
  const [cicloActividades, setCicloActividades] = useState([]);
  const { getCAData, setCAData } = usePhotosByCAState();
  const pageSize = 5;

  // Helper para normalizar la lista venga en data o en data.results
  const extractList = (res) => {
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.results)) return res.data.results;
    return [];
  };

  // Carga inicial de CICLOS archivados y CA relacionadas
  useEffect(() => {
    (async () => {
      try {
        const resC = await getCiclos();
        // Extraemos y filtramos solo los archivados = true
        const allCiclos = extractList(resC);
        const archivados = allCiclos.filter(c => c.archivado === true);
        setCiclos(archivados);

        const resCA = await getCicloActividades();
        const allCA = extractList(resCA);
        // Solo CA de ciclos archivados
        const cas = allCA.filter(ca => archivados.some(c => c.id === ca.ciclo_academico));
        setCicloActividades(cas);
      } catch (err) {
        console.error('Error cargando datos iniciales:', err);
      }
    })();
  }, []);

  // Función para cargar fotos paginadas de una CA
  const loadFotosForCA = useCallback(async (caId, pageToLoad) => {
    setCAData(caId, { loading: true, error: null });
    try {
      const data = await getFotosPaged(caId, pageToLoad, pageSize);
      setCAData(caId, {
        fotos: data.results,
        page: pageToLoad,
        totalPages: Math.ceil(data.count / pageSize),
        loading: false
      });
    } catch (err) {
      console.error(`Error cargando fotos CA ${caId}:`, err);
      setCAData(caId, { loading: false, error: 'No se pudieron cargar las fotos.' });
    }
  }, [setCAData]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Ciclos Archivados</h1>

      {ciclos.length === 0 && (
        <p className="text-gray-600">No hay ciclos archivados.</p>
      )}

      {ciclos.map(ciclo => (
        <details key={ciclo.id} className="mb-4 border rounded-lg overflow-hidden">
          <summary className="bg-gray-200 px-4 py-3 flex justify-between items-center cursor-pointer">
            <div>
              <span className="font-semibold">Semestre {ciclo.semestre}</span>
              <span className="ml-2 text-gray-600 text-sm">
                ({ciclo.fecha_inicio} – {ciclo.fecha_fin})
              </span>
            </div>
            <span className="text-sm text-gray-500" title="Archivado">📦</span>
          </summary>

          <div className="bg-white p-4 space-y-4">
            {cicloActividades
              .filter(ca => ca.ciclo_academico === ciclo.id)
              .map(ca => {
                const { fotos, page, totalPages, loading, error } = getCAData(ca.id);

                return (
                  <details
                    key={ca.id}
                    className="mb-4 border rounded-lg"
                    onToggle={e => {
                      if (e.target.open && fotos.length === 0 && !loading && !error) {
                        loadFotosForCA(ca.id, 1);
                      }
                    }}
                  >
                    <summary className="px-4 py-2 bg-sky-100 cursor-pointer">
                      <h3 className="font-semibold text-sky-600">
                        🎉 {ca.actividad_detalle?.nombre}
                      </h3>
                    </summary>

                    <div className="p-4">
                      {loading && <p className="text-gray-600">Cargando fotos...</p>}
                      {error && <p className="text-red-500">{error}</p>}

                      {!loading && !error && fotos.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {fotos.map(foto => (
                            <img
                              key={foto.id}
                              src={foto.imagen || foto.imagen_url || foto.url}
                              alt={`Foto de ${ca.actividad_detalle?.nombre}`}
                              className="w-full h-24 object-cover rounded"
                              onError={e => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/400x300/CCCCCC/000000?text=Sin+imagen';
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {!loading && !error && fotos.length === 0 && (
                        <p className="text-gray-500 text-sm">Sin imágenes</p>
                      )}

                      {/* Paginación */}
                      {!loading && !error && totalPages > 1 && (
                        <div className="flex justify-center items-center mt-3 space-x-3">
                          <button
                            onClick={() => loadFotosForCA(ca.id, page === 1 ? totalPages : page - 1)}
                            className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
                          >
                            ‹ Anterior
                          </button>
                          <span className="text-sm">Página {page} de {totalPages}</span>
                          <button
                            onClick={() => loadFotosForCA(ca.id, page === totalPages ? 1 : page + 1)}
                            className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
                          >
                            Siguiente ›
                          </button>
                        </div>
                      )}
                    </div>
                  </details>
                );
              })}
          </div>
        </details>
      ))}
    </div>
  );
}
