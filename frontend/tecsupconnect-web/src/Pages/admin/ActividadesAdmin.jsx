// src/components/admin/ActividadesAdmin.jsx

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import {
  getActividades,
  createActividad,
  updateActividad,
  deleteActividad,
} from '../../services/apiAdmin';

export default function ActividadesAdmin() {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: '',
    enlace_inscripcion: '',
    descripcion: '',
    enlace_cronograma: '',
    enlace_extra: '',
    imagen: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  // Helper: convierte la respuesta en un array
  const extractList = (res) => {
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.results)) return res.data.results;
    return [];
  };

  useEffect(() => {
    fetchActividades();
  }, []);

  const fetchActividades = async () => {
    setLoading(true);
    try {
      const res = await getActividades();
      setActividades(extractList(res));
    } catch (err) {
      console.error('Error cargando actividades:', err);
      Swal.fire('Error', 'No se pudieron cargar las actividades.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!editingId && actividades.length >= 4) {
      return Swal.fire('Límite alcanzado', 'Solo puedes tener 4 actividades.', 'warning');
    }
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null && val !== '') formData.append(key, val);
    });
    try {
      if (editingId) {
        await updateActividad(editingId, formData);
        Swal.fire('¡Actualizado!', 'Actividad actualizada con éxito.', 'success');
      } else {
        await createActividad(formData);
        Swal.fire('¡Creado!', 'Actividad creada con éxito.', 'success');
      }
      setForm({
        nombre: '',
        enlace_inscripcion: '',
        descripcion: '',
        enlace_cronograma: '',
        enlace_extra: '',
        imagen: null,
      });
      setEditingId(null);
      fetchActividades();
    } catch (err) {
      console.error('Error guardando actividad:', err);
      if (err.response?.data) setErrors(err.response.data);
      Swal.fire('Error', 'No se pudo guardar la actividad.', 'error');
    }
  };

  const startEdit = (act) => {
    setEditingId(act.id);
    setForm({
      nombre: act.nombre || '',
      enlace_inscripcion: act.enlace_inscripcion || '',
      descripcion: act.descripcion || '',
      enlace_cronograma: act.enlace_cronograma || '',
      enlace_extra: act.enlace_extra || '',
      imagen: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      nombre: '',
      enlace_inscripcion: '',
      descripcion: '',
      enlace_cronograma: '',
      enlace_extra: '',
      imagen: null,
    });
    setErrors({});
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Eliminar actividad?',
      text: 'Esta acción no se puede revertir.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;
    try {
      await deleteActividad(id);
      Swal.fire('¡Eliminado!', 'Actividad eliminada.', 'success');
      fetchActividades();
    } catch (err) {
      console.error('Error eliminando actividad:', err);
      Swal.fire('Error', 'No se pudo eliminar la actividad.', 'error');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🛠️ Administrar Actividades</h1>

      {/* Formulario de actividad */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Editar actividad' : 'Nueva actividad'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
            {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre}</p>}
          </div>

          {/* Enlace inscripción */}
          <div>
            <label className="block text-sm font-medium">Enlace inscripción</label>
            <input
              type="url"
              name="enlace_inscripcion"
              value={form.enlace_inscripcion}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
            {errors.descripcion && <p className="text-red-600 text-sm">{errors.descripcion}</p>}
          </div>

          {/* Enlace cronograma */}
          <div>
            <label className="block text-sm font-medium">Enlace cronograma</label>
            <input
              type="url"
              name="enlace_cronograma"
              value={form.enlace_cronograma}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          {/* Enlace extra */}
          <div>
            <label className="block text-sm font-medium">Enlace extra</label>
            <input
              type="url"
              name="enlace_extra"
              value={form.enlace_extra}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          {/* Imagen */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Imagen</label>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green600"
          >
            {editingId ? 'Actualizar actividad' : 'Crear actividad'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Listado de actividades en cards */}
      {loading ? (
        <p>Cargando actividades…</p>
      ) : actividades.length === 0 ? (
        <p className="text-gray-600">No hay actividades aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actividades.map(act => (
            <div
              key={act.id}
              className="bg-white shadow rounded-lg overflow-hidden flex flex-col"
            >
              {act.imagen && (
                <img
                  src={act.imagen}
                  alt={act.nombre}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{act.nombre}</h3>
                <p className="text-sm text-gray-600 mb-4">{act.descripcion}</p>
                <div className="mt-auto flex space-x-2">
                  <button
                    onClick={() => startEdit(act)}
                    className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(act.id)}
                    className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
