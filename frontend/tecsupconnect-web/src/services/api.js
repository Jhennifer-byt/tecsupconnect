// src/services/api.js

import axios from 'axios';
const API_BASE_URL = 'http://localhost:8000/api';

const publicAxios = axios.create({
  baseURL: API_BASE_URL,
});

// Eventos públicos
export const getEventos = async () => {
  const res = await publicAxios.get('/eventos/');
  return res.data;
};

// Actividades públicas
export const getActividades = async () => {
  const res = await publicAxios.get('/actividades/');
  return res.data;
};

// Ciclo-actividades
export const getCicloActividadesByActividad = async (actividadId) => {
  const res = await publicAxios.get(`/ciclo-actividades/?actividad=${actividadId}`);
  return res.data;
};

// Galerías y fotos
export const getGaleriasByCicloActividad = async (cicloActividadId) => {
  const res = await publicAxios.get(`/galerias/?ciclo_actividad=${cicloActividadId}`);
  return res.data;
};
export const getFotosByGaleria = async (galeriaId) => {
  const res = await publicAxios.get(`/fotos/?galeria=${galeriaId}`);
  return res.data;
};

// Fotos paginadas
export async function getFotosByCicloActividadPaged(cicloActividadId, page = 1, pageSize = 10) {
  const res = await publicAxios.get(
    `/fotos/?galeria__ciclo_actividad=${cicloActividadId}&page=${page}&page_size=${pageSize}`
  );
  return res.data;
}

// ————————————————
// **Este era el olvidado**: miembros de psicopedagogía
export const getMiembrosPsicopedagogia = async () => {
  const res = await publicAxios.get('/miembros/');
  return res.data;
};

// Imagen general de “Nosotros” (útil para Hero)
export const getImagenNosotros = async () => {
  const res = await publicAxios.get('/nosotros/');   // Ajusta la ruta si tu API es diferente
  return res.data;
};


