import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ModalImagenEvento from './ModalImagenEvento';
import { getEventos, getActividades } from '../../services/api';

export default function EventosActivosCiclo() {
  const [items, setItems]     = useState([]);
  const [imgFull, setImgFull] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [rawEvs, rawActs] = await Promise.all([getEventos(), getActividades()]);
        const evs  = Array.isArray(rawEvs)  ? rawEvs  : Array.isArray(rawEvs.results)  ? rawEvs.results  : [];
        const acts = Array.isArray(rawActs) ? rawActs : Array.isArray(rawActs.results) ? rawActs.results : [];

        const eventos = evs.map(e => ({
          id: `ev-${e.id}`, nombre: e.nombre,
          descripcion: e.enlace_inscripcion, imagen: e.imagen,
          link: e.enlace_inscripcion
        }));
        const actividades = acts.map(a => ({
          id: `ac-${a.id}`, nombre: a.nombre,
          descripcion: a.descripcion, imagen: a.imagen,
          link: a.enlace_inscripcion
        }));

        setItems([...eventos, ...actividades]);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los eventos y actividades.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="py-20 text-center text-gray-600">Cargando…</div>;
  if (error)   return <div className="py-20 text-center text-red-500">{error}</div>;

  return (
    <section className="py-12 px-4 sm:px-8 md:px-12">
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center  text-gray-800">
          EVENTOS ACTIVOS DEL CICLO:
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          className="h-[350px] sm:h-[450px] md:h-[550px] overflow-hidden shadow-lg"
        >
          {items.map(item => (
            <SwiperSlide key={item.id}>
              <div className="relative w-full h-full">
                
                <img
                  src={item.imagen || 'https://via.placeholder.com/1200x500'}
                  alt={item.nombre}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/1200x500'; }}
                />

                {/* Overlay vidrio + contenido 60/40 */}
                <div className="absolute inset-0 flex text-white">
                  {/* 60%: título */}
                  <div className="w-full md:w-3/5 flex items-center px-4 sm:px-8 md:px-12 backdrop-blur-sm bg-black/30">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 ml-0 md:ml-8">
                      {item.nombre}
                    </h2>
                  </div>
                  {/* 40%: descripción + botón */}
                  <div className="w-full md:w-2/5 flex flex-col justify-center px-4 sm:px-8 md:px-12 backdrop-blur-sm bg-black/30 space-y-4">
                    <p className="text-sm sm:text-base">
                      {item.descripcion?.slice(0, 100) + (item.descripcion?.length > 100 ? '...' : '')}
                    </p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-32 sm:w-36 text-center px-4 py-2 border border-white font-medium rounded hover:bg-white hover:text-black transition"
                      >
                        Regístrate
                      </a>
                    )}
                  </div>
                </div>

                {/* Botón ver imagen */}
                <button
                  onClick={() => setImgFull(item.imagen)}
                  className="absolute bottom-4 right-4 text-xs text-white underline"
                >
                  Ver flayer completo
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {imgFull && <ModalImagenEvento imagen={imgFull} onClose={() => setImgFull(null)} />}
    </section>
  );
}
