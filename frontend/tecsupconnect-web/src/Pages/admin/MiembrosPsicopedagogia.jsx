// src/components/nosotros/MiembrosPsicopedagogia.jsx

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  getMiembros,
  createMiembro,
  updateMiembro,
  deleteMiembro
} from '../../services/apiAdmin';

function MiembrosPsicopedagogia() {
  const [miembros, setMiembros] = useState([]);
  const [form, setForm] = useState({ nombre: '', frase: '', foto: null });
  const [editandoId, setEditandoId] = useState(null);
  const [preview, setPreview] = useState(null);

  // Helper: convierte la respuesta en un array (res | res.data | res.data.results)
  const extractList = res => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.results)) return res.data.results;
    return [];
  };

  const fetchMiembros = async () => {
    try {
      const res = await getMiembros();
      setMiembros(extractList(res));
    } catch (err) {
      console.error('Error al cargar miembros:', err);
      Swal.fire('Error', 'No se pudieron cargar los miembros.', 'error');
    }
  };

  useEffect(() => {
    fetchMiembros();
  }, []);

  const handleFotoChange = e => {
    const file = e.target.files[0];
    setForm(prev => ({ ...prev, foto: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const resetForm = () => {
    setForm({ nombre: '', frase: '', foto: null });
    setPreview(null);
    setEditandoId(null);
  };

  const handleGuardar = async () => {
    if (!form.nombre || !form.frase) {
      return Swal.fire('Atención', 'Nombre y frase son obligatorios.', 'warning');
    }
    const formData = new FormData();
    formData.append('nombre', form.nombre);
    formData.append('frase', form.frase);
    if (form.foto) formData.append('foto', form.foto);

    try {
      if (editandoId) {
        await updateMiembro(editandoId, formData);
        Swal.fire('Actualizado', 'Miembro actualizado con éxito.', 'success');
      } else {
        await createMiembro(formData);
        Swal.fire('Creado', 'Miembro creado con éxito.', 'success');
      }
      resetForm();
      fetchMiembros();
    } catch (err) {
      console.error('Error al guardar miembro:', err);
      Swal.fire('Error', 'No se pudo guardar el miembro.', 'error');
    }
  };

  const handleEditar = miembro => {
    setForm({ nombre: miembro.nombre, frase: miembro.frase, foto: null });
    setEditandoId(miembro.id);
    setPreview(miembro.foto_url);
  };

  const handleEliminar = async id => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Eliminar este miembro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;
    try {
      await deleteMiembro(id);
      Swal.fire('Eliminado', 'Miembro eliminado.', 'success');
      fetchMiembros();
    } catch (err) {
      console.error('Error al eliminar:', err);
      Swal.fire('Error', 'No se pudo eliminar el miembro.', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">👥 Miembros Psicopedagogía</h1>

      {/* Formulario */}
      <div className="space-y-2 border p-4 rounded bg-gray-50">
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))}
          className="w-full border px-3 py-1 rounded"
        />
        <textarea
          placeholder="Correo"
          value={form.frase}
          onChange={e => setForm(prev => ({ ...prev, frase: e.target.value }))}
          className="w-full border px-3 py-1 rounded"
        />
        <input type="file" accept="image/*" onChange={handleFotoChange} />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border"
          />
        )}
        <button
          onClick={handleGuardar}
          className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
        >
          {editandoId ? 'Actualizar' : 'Crear'}
        </button>
        {editandoId && (
          <button
            onClick={resetForm}
            className="ml-2 text-sm text-gray-600 underline"
          >
            Cancelar edición
          </button>
        )}
      </div>

      {/* Listado en cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {miembros.map(m => (
          <div
            key={m.id}
            className="border p-4 rounded flex flex-col items-center"
          >
            <img
              src={m.foto_url}
              alt={m.nombre}
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
            <h2 className="font-bold">{m.nombre}</h2>
            <p className="text-sm italic text-center">"{m.frase}"</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEditar(m)}
                className="bg-yellow-400 text-white px-2 py-1 rounded text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminar(m.id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MiembrosPsicopedagogia;
