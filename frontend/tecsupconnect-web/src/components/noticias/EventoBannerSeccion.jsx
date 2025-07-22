import React from 'react';

const EventoBannerSeccion = ({ nombre, descripcion, imagen, link, resumen }) => {
  const texto = resumen
    ? resumen
    : typeof descripcion === 'string'
      ? descripcion.slice(0, 120) + '...'
      : 'Sin descripción disponible.';

  return (
    <section className="mb-12 px-4 sm:px-8 md:px-12">
      <div className="w-full max-w-7xl mx-auto relative overflow-hidden shadow-lg h-[300px] sm:h-[400px] md:h-[500px]">
        {/* Imagen de fondo */}
        <img
          src={imagen}
          alt={nombre}
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/1200x500'; }}
        />

        {/* Overlay vidrio */}
        <div className="absolute inset-0 backdrop-blur-md bg-black/25 z-10" />

        {/* Contenido 60/40 en md, full-width en sm */}
        <div className="relative z-20 h-full flex flex-col md:flex-row">
          {/* 60%: Título */}
          <div className="w-full md:w-3/5 flex items-center px-4 sm:px-8 md:px-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 ml-0 md:ml-8">
              {nombre}
            </h2>
          </div>

          {/* 40%: texto + botón */}
          <div className="w-full md:w-2/5 flex flex-col justify-center px-4 sm:px-8 md:px-12 space-y-4">
            <p className="text-sm sm:text-base text-white">
              {texto}
            </p>
            {link && (
              <a
                href={link}
                className="w-32 sm:w-36 text-center px-4 py-2 border border-white text-white font-medium rounded hover:bg-white hover:text-black transition"
              >
                Regístrate
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventoBannerSeccion;
