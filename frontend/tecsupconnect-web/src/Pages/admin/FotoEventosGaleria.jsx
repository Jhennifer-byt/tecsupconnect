// FotoEventosGaleria.jsx

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import {
  getCicloActividades,
  getFotosPaged, // 🚨 IMPORTANTE: Usar la nueva función paginada
  deleteFoto
} from '../../services/apiAdmin'; // Asegúrate que esta ruta sea correcta

function FotoEventosGaleria() {
  const [cicloActividades, setCicloActividades] = useState([]);
  const [seleccionado, setSeleccionado] = useState(''); // ID del ciclo-actividad seleccionado
  const [fotos, setFotos] = useState([]); // Fotos de la página actual
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Coincide con tu backend

  // 1) Cargar todas las ciclo-actividades al montar (para el selector)
  useEffect(() => {
    getCicloActividades()
      .then(res => {
        // Asegúrate de acceder a 'res.data.results' si el endpoint está paginado
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setCicloActividades(data);
      })
      .catch(err => console.error('Error cargando eventos:', err));
  }, []);

  // 2) Cuando cambie la selección de ciclo-actividad o la página, cargar fotos paginadas
  useEffect(() => {
    if (!seleccionado) {
      setFotos([]);
      setPage(1); // Reiniciar página al deseleccionar
      setTotalPages(1);
      return;
    }

    const loadPagedFotos = async () => {
      setLoading(true);
      setError(null);
      try {
        // Usar la nueva función getFotosPaged que ya maneja la lógica de filtrado y paginación
        const data = await getFotosPaged(seleccionado, page, pageSize);
        
        setFotos(data.results); // Acceder a las fotos de la página actual
        setTotalPages(Math.ceil(data.count / pageSize)); // Calcular el total de páginas
      } catch (err) {
        console.error('Error cargando fotos paginadas:', err);
        setError('No se pudieron cargar las fotos.');
        setFotos([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    loadPagedFotos();
  }, [seleccionado, page, pageSize]); // Depende de la selección, la página y el tamaño de página

  // 3) Eliminar foto
  const handleEliminar = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Eliminar imagen?',
      text: 'Esta acción no se puede revertir.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!isConfirmed) return;

    try {
      await deleteFoto(id);
      Swal.fire('Eliminada', 'La imagen ha sido eliminada.', 'success');
      // Después de eliminar, recargar las fotos de la página actual
      // Esto asegura que la paginación se actualice correctamente si se borra la última foto de una página
      if (fotos.length === 1 && page > 1) { // Si era la única foto en la página y no es la primera página
          setPage(prevPage => prevPage - 1); // Retroceder una página
      } else {
          // Si no, simplemente recargar la página actual
          // Trigger useEffect by changing a state it depends on, e.g., 'seleccionado' or 'page'
          // A simple way is to re-call loadPagedFotos or force a state update if the data changed
          // Forcing a reload:
          // You could have a `refreshKey` state or simply re-call the data fetch.
          // For simplicity, we can just trigger the useEffect again by updating a dummy state or the page state.
          // Or, as you have `deleteFoto` that removes the item locally, just re-fetch to get accurate count.
          // A more robust way might be to decrement count and adjust totalPages and remove locally,
          // but re-fetching is safer after a deletion.
          // For now, a simple re-fetch after delete:
          const data = await getFotosPaged(seleccionado, page, pageSize);
          setFotos(data.results);
          setTotalPages(Math.ceil(data.count / pageSize));
      }

    } catch (err) {
      console.error('Error eliminando foto:', err);
      Swal.fire('Error', 'No se pudo eliminar la imagen.', 'error');
    }
  };

  // Funciones para navegación de paginación
  const prevPage = () => setPage(p => Math.max(1, p - 1));
  const nextPage = () => setPage(p => Math.min(totalPages, p + 1));

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
      <h1 className="text-2xl font-bold mb-4">🖼️ Galería de Actividades</h1>

      {/* Selector de Evento */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Evento:</label>
        <select
          value={seleccionado}
          onChange={e => {
            setSeleccionado(e.target.value);
            setPage(1); // Reinicia a la primera página cuando cambia el evento
          }}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Selecciona un evento --</option>
          {cicloActividades.map(ca => (
            <option key={ca.id} value={ca.id}>
              {ca.actividad_detalle?.nombre} – Semestre {ca.ciclo_academico_detalle?.semestre}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-600 mt-4">Cargando fotos...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Muestra todas las fotos de todas las galerías de ese evento */}
      {!loading && !error && (
        fotos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            {fotos.map(foto => (
              <div key={foto.id} className="relative group">
                <img
                  src={foto.imagen || foto.imagen_url || foto.url} // Usa las posibles propiedades de imagen
                  alt=""
                  className="w-full h-32 object-cover rounded"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x300/CCCCCC/000000?text=Sin+imagen';
                  }}
                />
                <button
                  onClick={() => handleEliminar(foto.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : seleccionado ? (
          <p className="text-gray-500 mt-4">No hay imágenes en este evento.</p>
        ) : (
          <p className="text-gray-500 mt-4">Selecciona un evento para ver sus fotos.</p>
        )
      )}

      {/* Controles de paginación */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            ‹ Anterior
          </button>
          <span>Página {page} de {totalPages}</span>
          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Siguiente ›
          </button>
        </div>
      )}
    </div>
  );
}

export default FotoEventosGaleria;