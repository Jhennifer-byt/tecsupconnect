// src/components/admin/EventoAdmin.jsx

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import {
  getCiclos,
  getEventos,
  createEvento,
  updateEvento,
  deleteEvento
} from '../../services/apiAdmin';

export default function EventoAdmin() {
  const [ciclos, setCiclos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    enlace_inscripcion: '',
    ciclo_academico: '',
    imagen: null
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const extractList = res => {
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.results)) return res.data.results;
    return [];
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [resCiclos, resEventos] = await Promise.all([getCiclos(), getEventos()]);
      setCiclos(extractList(resCiclos).filter(c => !c.archivado));
      setEventos(extractList(resEventos));
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudieron cargar datos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('nombre', form.nombre);
    fd.append('enlace_inscripcion', form.enlace_inscripcion);
    fd.append('ciclo_academico', form.ciclo_academico);
    if (form.imagen) fd.append('imagen', form.imagen);

    try {
      if (editingId) {
        await updateEvento(editingId, fd);
        Swal.fire('¡Actualizado!', 'Evento actualizado.', 'success');
      } else {
        await createEvento(fd);
        Swal.fire('¡Creado!', 'Evento creado.', 'success');
      }
      setForm({ nombre: '', enlace_inscripcion: '', ciclo_academico: '', imagen: null });
      setEditingId(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo guardar el evento.', 'error');
    }
  };

  const startEdit = ev => {
    setEditingId(ev.id);
    setForm({
      nombre: ev.nombre || '',
      enlace_inscripcion: ev.enlace_inscripcion || '',
      ciclo_academico: ev.ciclo_academico || '',
      imagen: null
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async id => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Eliminar evento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    });
    if (!isConfirmed) return;
    try {
      await deleteEvento(id);
      Swal.fire('Eliminado', 'Evento borrado.', 'success');
      fetchAll();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo eliminar.', 'error');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Formulario */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editingId ? 'Editar Evento' : 'Crear Nuevo Evento'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Título del evento"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ciclo Académico</label>
            <select
              name="ciclo_academico"
              value={form.ciclo_academico}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Selecciona Ciclo</option>
              {ciclos.map(c => (
                <option key={c.id} value={c.id}>
                  Sem {c.semestre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Enlace Inscripción</label>
            <input
              name="enlace_inscripcion"
              type="url"
              value={form.enlace_inscripcion}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="https://"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Imagen</label>
            <input
              name="imagen"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="md:col-span-2 flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              {editingId ? 'Actualizar Evento' : 'Crear Evento'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ nombre: '', enlace_inscripcion: '', ciclo_academico: '', imagen: null });
                }}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Listado de eventos en cards */}
      {loading ? (
        <p>Cargando eventos…</p>
      ) : eventos.length === 0 ? (
        <p className="text-gray-600">No hay eventos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map(ev => (
            <div key={ev.id} className="bg-white shadow rounded-lg overflow-hidden flex flex-col">
              {ev.imagen && (
                <img
                  src={ev.imagen}
                  alt={ev.nombre}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{ev.nombre}</h3>
                {ev.enlace_inscripcion && (
                  <a
                    href={ev.enlace_inscripcion}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline mb-2"
                  >
                    Enlace de inscripción
                  </a>
                )}
                <span className="text-gray-500 text-sm mb-4">
                  Semestre {ciclos.find(c => c.id === ev.ciclo_academico)?.semestre || '-'}
                </span>
                <div className="mt-auto flex space-x-2">
                  <button
                    onClick={() => startEdit(ev)}
                    className="flex-1 bg-yellow-400 text-white py-1 rounded hover:bg-yellow-500 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
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
