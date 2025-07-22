import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE = 'http://localhost:8000/api';

/**
 * Verifica si un token JWT es válido y no ha expirado.
 * @param {string} token El token JWT a validar.
 * @returns {boolean} Verdadero si el token es válido y no ha expirado, falso en caso contrario.
 */
export const isTokenValid = (token) => {
  if (!token) {
    console.log('isTokenValid: No se proporcionó ningún token.');
    return false;
  }
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now();
    const tokenExpirationTime = decoded.exp * 1000; // Convertir a milisegundos
    return tokenExpirationTime > currentTime; // Válido si no ha expirado
  } catch (error) {
    console.error('isTokenValid: Error al decodificar o validar el token:', error);
    return false;
  }
};

/**
 * Determina qué almacenamiento (localStorage o sessionStorage) usar.
 * Preferimos localStorage si hay un token de acceso guardado allí,
 * de lo contrario, por defecto usamos sessionStorage.
 * @returns {Storage} El objeto de almacenamiento (localStorage o sessionStorage).
 */
const getStorage = () => {
 
  return localStorage.getItem('access') ? localStorage : sessionStorage;
};

// Instancia de Axios con intercepción para manejar tokens
const authAxios = axios.create({
  baseURL: API_BASE,
});

// Interceptor para agregar automáticamente el token de acceso a los encabezados de las solicitudes.
authAxios.interceptors.request.use(config => {
  const storage = getStorage(); // Obtiene el almacenamiento actual (localStorage o sessionStorage)
  const token = storage.getItem('access'); // Intenta obtener el token de acceso del almacenamiento
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('authAxios Interceptor: Token de acceso agregado al encabezado.');
  } else {
    console.log('authAxios Interceptor: No se encontró token de acceso en el almacenamiento.');
  }
  return config;
}, error => {
  // Manejo de errores de la solicitud (antes de ser enviada)
  return Promise.reject(error);
});


//---- CICLO -----
export const getCiclos = () =>
  authAxios.get('/ciclos/');

export const createCiclo = (data) =>
  authAxios.post('/ciclos/', data);

export const updateCiclo = (id, data) =>
  authAxios.patch(`/ciclos/${id}/`, data);

export const partialUpdateCiclo = (id, data) =>
  authAxios.patch(`/ciclos/${id}/`, data);

export const deleteCiclo = (id) =>
  authAxios.delete(`/ciclos/${id}/`);



// --- EVENTOS ---
export const getEventos = () =>
  authAxios.get('/eventos/');

export const createEvento = (data) =>
  authAxios.post('/eventos/', data);

export const updateEvento = (id, data) =>
  authAxios.put(`/eventos/${id}/`, data);

export const partialUpdateEvento = (id, data) =>
  authAxios.patch(`/eventos/${id}/`, data);

export const deleteEvento = (id) =>
  authAxios.delete(`/eventos/${id}/`);


// --- ACTIVIDADES ---
export const getActividades     = () => authAxios.get('/actividades/');
export const createActividad    = (data) => authAxios.post('/actividades/', data);
export const updateActividad    = (id, data) => authAxios.put(`/actividades/${id}/`, data);
export const deleteActividad    = (id) => authAxios.delete(`/actividades/${id}/`);

// --- CICLO-ACTIVIDADES ---
export const getCicloActividades     = () => authAxios.get('/ciclo-actividades/');
export const createCicloActividad    = (data) => authAxios.post('/ciclo-actividades/', data);
export const deleteCicloActividad    = (id) => authAxios.delete(`/ciclo-actividades/${id}/`);

// --- GALERÍAS ---
export const getGalerias     = () => authAxios.get('/galerias/');
export const createGaleria   = (data) => authAxios.post('/galerias/', data);
export const deleteGaleria   = (id) => authAxios.delete(`/galerias/${id}/`);



// --- FOTOS ---
export const getFotos         = (galeriaId) => authAxios.get(`/fotos/?galeria=${galeriaId}`);
export const deleteFoto       = (id) => authAxios.delete(`/fotos/${id}/`);
export const uploadFotosMasivas      = formData =>
  authAxios.post(
    '/fotos/carga-masiva/',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );



// Miembros
export const getMiembros = () => authAxios.get('/miembros/');
export const createMiembro = (formData) =>
  authAxios.post('/miembros/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateMiembro = (id, formData) =>
  authAxios.patch(`/miembros/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteMiembro = (id) => authAxios.delete(`/miembros/${id}/`);


// reemplaza tu antiguo getGalerias
export const getGaleriasByCicloActividad = (cicloActividadId) =>
  authAxios.get(`/galerias/?ciclo_actividad=${cicloActividadId}`);

// reemplaza tu antiguo getFotos
export const getFotosByGaleria = (galeriaId) =>
  authAxios.get(`/fotos/?galeria=${galeriaId}`);


export async function getFotosPaged(cicloActividadId, page = 1, pageSize = 10) {
  try {
    const res = await authAxios.get(
      `/fotos/?galeria__ciclo_actividad=${cicloActividadId}&page=${page}&page_size=${pageSize}`
    );
    // DRF con paginación devuelve { count, next, previous, results }
    return res.data;
  } catch (error) {
    console.error('Error en getFotosPaged:', error.response?.data || error.message);
    throw error; // Re-lanza el error para que el componente lo maneje
  }
}

// Imagen general "Nosotros" ──────────────────────────────────

// 1) Obtener la(s) imagen(es) existentes; las ordenamos por el campo de fecha
export const getImagenNosotros = () =>
  authAxios.get('/nosotros/?ordering=-actualizado_en');

// 2) Crear una nueva imagen (POST)  ← esto es lo que faltaba
export const createImagenNosotros = (formData) =>
  authAxios.post('/nosotros/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// 3) Actualizar la existente (PATCH) — envía sólo el campo ‘imagen’
export const updateImagenNosotros = (id, formData) =>
  authAxios.patch(`/nosotros/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
