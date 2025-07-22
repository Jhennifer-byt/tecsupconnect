// src/components/Hero.jsx – fondo dinámico desde la API de ImagenGeneralNosotros
import React, { useEffect, useState } from 'react';
import { getImagenNosotros } from '../services/api';
import fallbackHero from '../assets/proposito.jpg'; // Imagen por defecto

export default function Hero() {
  const [bgUrl, setBgUrl] = useState(fallbackHero);

  /* ──────────────────────────────
   * 1. Cargar imagen más reciente de la API
   * ────────────────────────────── */
  useEffect(() => {
    async function fetchHeroImage() {
      try {
        const data = await getImagenNosotros();
        /*
         * La API puede devolver un array simple o paginado (results).
         * Tomamos la primera (o la más reciente) según convenga.
         */
        let lista = [];
        if (Array.isArray(data)) lista = data;
        else if (Array.isArray(data?.results)) lista = data.results;

        if (lista.length > 0 && lista[0].imagen_url) {
          setBgUrl(lista[0].imagen_url);
        }
      } catch (err) {
        console.error('Hero: no se pudo cargar la imagen dinámicamente:', err);
        // Nos quedamos con la imagen por defecto
      }
    }

    fetchHeroImage();
  }, []);

  /* ──────────────────────────────
   * 2. Render
   * ────────────────────────────── */
  return (
    <section className="w-full">
      {/* Imagen principal */}
      <div
        className="relative w-full h-[75vh] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        {/* Overlay y contenido */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            VIDA ESTUDIANTIL
          </h1>

          <a
            href="/nosotros"
            className="mt-4 bg-black bg-opacity-60 text-white px-6 py-2 rounded shadow-md hover:bg-opacity-80 transition"
          >
            Nosotros
          </a>
        </div>
      </div>

      {/* Franja azul debajo */}
      <div className="w-full h-6 bg-[#02B0E3]" />
    </section>
  );
}
