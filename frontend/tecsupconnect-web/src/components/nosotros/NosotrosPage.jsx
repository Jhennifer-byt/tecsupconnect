// src/pages/NosotrosPage.jsx

import { useEffect, useState } from 'react';
import SliderMisionVision from '../nosotros/SliderMisionVision';
import CardEquipo from '../../components/nosotros/CardEquipo';
import { getMiembrosPsicopedagogia } from '../../services/api';

const NosotrosPage = () => {
  const [equipo, setEquipo] = useState([]);

  // Normalizador: extrae array de cualquier forma de res.data o res
  const extractList = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.results)) return res.results;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.results)) return res.data.results;
    return [];
  };

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        const res = await getMiembrosPsicopedagogia();
        setEquipo(extractList(res));
      } catch (err) {
        console.error('Error cargando equipo:', err);
      }
    };
    fetchEquipo();
  }, []);

  return (
    <main className="pt-12 bg-white min-h-screen">
      <SliderMisionVision />

      <section className="py-16 px-8 md:px-40">
        <h2 className="text-center text-4xl font-bold text-black mb-12">
          Nuestro Equipo
        </h2>
        <div className="flex flex-wrap justify-center gap-10">
          {equipo.length > 0 ? (
            equipo.map((persona, i) => (
              <CardEquipo
                key={i}
                nombre={persona.nombre}
                frase={persona.frase}
                imagen={persona.foto_url}
              />
            ))
          ) : (
            <p className="text-gray-500">No hay miembros por mostrar.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default NosotrosPage;
