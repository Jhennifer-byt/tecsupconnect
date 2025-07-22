// src/components/admin/CiclosAdmin.jsx
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import {
  getCiclos,
  getActividades,
  getCicloActividades,
  createCiclo,
  deleteCiclo,
  createCicloActividad,
  deleteCicloActividad,
  partialUpdateCiclo
} from '../../services/apiAdmin';

export default function CiclosAdmin() {
  const [ciclos, setCiclos] = useState([]);
  const [actividadesDisponibles, setActividadesDisponibles] = useState([]);
  const [actividadPorCiclo, setActividadPorCiclo] = useState({});
  const [nuevoCiclo, setNuevoCiclo] = useState({
    semestre: '',
    fecha_inicio: '',
    fecha_fin: ''
  });

  // ---------- helpers ----------
  const extractList = res => {
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.results)) return res.data.results;
    return [];
  };

  const fetchData = async () => {
    try {
      const [resCiclos, resActividades, resCA] = await Promise.all([
        getCiclos(),
        getActividades(),
        getCicloActividades()
      ]);

      const allCiclos        = extractList(resCiclos).filter(c => !c.archivado);
      const listActividades  = extractList(resActividades);
      const listCA           = extractList(resCA);

      const ciclosWithCA = allCiclos.map(ciclo => ({
        ...ciclo,
        ciclo_actividades: listCA.filter(ca => ca.ciclo_academico === ciclo.id)
      }));

      setCiclos(ciclosWithCA);
      setActividadesDisponibles(listActividades);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      Swal.fire('Error', 'No se pudieron cargar los ciclos o actividades.', 'error');
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ---------- acciones ----------
  const handleCreateCiclo = async () => {
    const sem = Number(nuevoCiclo.semestre);
    if (sem < 1 || sem > 2) {
      return Swal.fire('Dato inválido', 'El semestre solo puede ser 1 o 2.', 'warning');
    }
    try {
      await createCiclo(nuevoCiclo);
      setNuevoCiclo({ semestre: '', fecha_inicio: '', fecha_fin: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo crear el ciclo.', 'error');
    }
  };

  const handleToggleArchivado = async (cicloId, archivado) => {
    await partialUpdateCiclo(cicloId, { archivado });
    fetchData();
  };

  const handleDeleteCiclo = async cicloId => {
    await deleteCiclo(cicloId);
    fetchData();
  };

  const handleCreateCA = async cicloId => {
    const actividadId = actividadPorCiclo[cicloId];
    if (!actividadId) {
      return Swal.fire('Error', 'Selecciona primero una actividad.', 'warning');
    }
    try {
      await createCicloActividad({ ciclo_academico: cicloId, actividad: actividadId });
      fetchData();
    } catch (err) {
      console.error('Error creando ciclo-actividad:', err);
      if (err.response?.status === 400) {
        return Swal.fire('¡Ups!', 'La actividad ya está asociada a ese ciclo.', 'error');
      }
      Swal.fire('Error', 'No se pudo asociar la actividad.', 'error');
    }
  };

  const handleDeleteCA = async caId => {
    await deleteCicloActividad(caId);
    fetchData();
  };

  // ---------- render ----------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🚀 Administración de Ciclos</h1>

      {/* ---------- formulario nuevo ciclo ---------- */}
      <div className="mb-6 border p-4 rounded">
        <h2 className="font-semibold mb-2">Crear Nuevo Ciclo</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Semestre */}
          <input
            type="number"
            placeholder="Semestre"
            min={1}
            max={2}
            value={nuevoCiclo.semestre}
            onChange={e => setNuevoCiclo({ ...nuevoCiclo, semestre: e.target.value })}
            className="border px-3 py-1 rounded"
          />

          {/* Fecha inicio */}
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Inicio de ciclo</span>
            <input
              type="date"
              value={nuevoCiclo.fecha_inicio}
              onChange={e => setNuevoCiclo({ ...nuevoCiclo, fecha_inicio: e.target.value })}
              className="border px-3 py-1 rounded"
            />
          </label>

          {/* Fecha fin */}
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Fin de ciclo</span>
            <input
              type="date"
              value={nuevoCiclo.fecha_fin}
              onChange={e => setNuevoCiclo({ ...nuevoCiclo, fecha_fin: e.target.value })}
              className="border px-3 py-1 rounded"
            />
          </label>
        </div>

        <button
          onClick={handleCreateCiclo}
          className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Crear Ciclo
        </button>
      </div>

      {/* ---------- listado de ciclos ---------- */}
      {ciclos.map(ciclo => {
        const year = ciclo.fecha_inicio ? new Date(ciclo.fecha_inicio).getFullYear() : '—';
        return (
          <div key={ciclo.id} className="mb-4 border p-4 rounded shadow-sm">
            {/* cabecera */}
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">
                  Semestre {ciclo.semestre} {year}
                </span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleToggleArchivado(ciclo.id, !ciclo.archivado)}
                  className={`px-3 py-1 rounded ${
                    ciclo.archivado ? 'bg-yellow-400' : 'bg-blue-500 text-white'
                  } hover:opacity-90`}
                >
                  {ciclo.archivado ? 'Desarchivar' : 'Archivar'}
                </button>
                <button
                  onClick={() => handleDeleteCiclo(ciclo.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {/* asignar actividades */}
            <div className="mt-3 flex gap-2 items-center">
              <select
                value={actividadPorCiclo[ciclo.id] || ''}
                onChange={e =>
                  setActividadPorCiclo({ ...actividadPorCiclo, [ciclo.id]: e.target.value })
                }
                className="border px-3 py-1 rounded flex-1"
              >
                <option value="">Selecciona Actividad</option>
                {actividadesDisponibles.map(act => (
                  <option key={act.id} value={act.id}>
                    {act.nombre}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleCreateCA(ciclo.id)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                + Actividad
              </button>
            </div>

            {/* listado ciclo_actividades */}
            <ul className="mt-2 ml-4 list-disc">
              {ciclo.ciclo_actividades.map(ca => (
                <li key={ca.id} className="flex justify-between items-center">
                  {ca.actividad_detalle?.nombre}
                  <button
                    onClick={() => handleDeleteCA(ca.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {ciclos.length === 0 && <p className="text-gray-500">No hay ciclos disponibles.</p>}
    </div>
  );
}
