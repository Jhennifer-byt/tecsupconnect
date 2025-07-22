import { useEffect, useState } from 'react';
import { getImagenNosotros } from '../../services/api';
import { motion } from 'framer-motion';

const ImagenGeneralPsico = () => {
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    const fetchImagen = async () => {
      try {
        const data = await getImagenNosotros();
        if (data.length > 0) setImagen(data[0].imagen);
      } catch (error) {
        console.error('Error al cargar la imagen general:', error);
      }
    };

    fetchImagen();
  }, []);

  if (!imagen) return null;

  return (
    <section className="w-full bg-white py-20 px-6 md:px-24 flex justify-center">
      <motion.div
        className="w-full max-w-7xl shadow-xl flex flex-col md:flex-row overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* SECCIÓN TEXTO */}
        <div className="w-full md:w-1/2 bg-black text-white p-10 md:p-14 flex flex-col justify-center relative">
          <h1 className="text-3xl md:text-5xl font-bold text-sky-400 leading-tight mb-6">
            Conoce a Nuestro Equipo
          </h1>
          <div className="h-1 w-24 bg-sky-400 mb-6" />
          <p className="text-base md:text-lg leading-relaxed text-white">
            Nos apasiona acompañar y guiar a nuestros estudiantes en su camino académico y personal.
            En el área de Psicopedagogía, promovemos el bienestar emocional, la orientación vocacional
            y la resolución de conflictos, siempre con empatía y compromiso.          </p>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-sky-400" />
        </div>

        {/* SECCIÓN IMAGEN */}
        <div className="w-full md:w-1/2 h-[300px] md:h-auto">
          <img
            src={imagen}
            alt="Equipo Psicopedagogía"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default ImagenGeneralPsico;
