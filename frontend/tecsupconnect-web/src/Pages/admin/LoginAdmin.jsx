// src/components/Login.jsx – sin “Recordarme”, siempre sesión segura
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  /* ─────────────────────────────
   * 1. Estados y refs
   * ───────────────────────────── */
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const passwordRef = useRef(null); // Mantiene la contraseña fuera del estado
  const navigate = useNavigate();

  /* ─────────────────────────────
   * 2. Redirige si ya hay token en session/localStorage
   * ───────────────────────────── */
  useEffect(() => {
    const access = sessionStorage.getItem('access') || localStorage.getItem('access'); // por si quedan tokens viejos
    if (access) navigate('/admin');
  }, [navigate]);

  /* ─────────────────────────────
   * 3. Envío de formulario
   * ───────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const credenciales = {
      username: username.trim(),
      password: passwordRef.current?.value || '',
    };

    try {
      const { data } = await axios.post('http://localhost:8000/api/token/', credenciales);

      // Guardamos SIEMPRE en sessionStorage (se borra al cerrar pestaña)
      sessionStorage.setItem('access', data.access);
      sessionStorage.setItem('refresh', data.refresh);

      // Eliminamos posibles tokens antiguos en localStorage
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');

      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err?.response?.data || err.message);
      setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
  };

  /* ─────────────────────────────
   * 4. Limpieza automática del mensaje de error
   * ───────────────────────────── */
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(''), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  /* ─────────────────────────────
   * 5. Render
   * ───────────────────────────── */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-sky-600">Iniciar Sesión</h2>

        {error && (
          <p className="text-red-500 text-center text-sm animate-pulse">{error}</p>
        )}

        {/* Usuario */}
        <div>
          <label htmlFor="username" className="sr-only">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            placeholder="Usuario"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border-2 border-gray-300 placeholder-black/80 px-4 py-2 rounded-md focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="sr-only">
            Contraseña
          </label>
          <input
            id="password"
            ref={passwordRef}
            type="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            className="w-full border-2 border-gray-300 placeholder-black/80 px-4 py-2 rounded-md focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-sky-500 text-white py-2 rounded-md shadow-md hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}
