import React from 'react';
import { useNavigate } from 'react-router-dom';

const Nosotros = () => {
  const navigate = useNavigate();

  const irANosotros = () => {
    navigate('/nosotros');
  };

  return (
    <section className="py-16 bg-white w-full flex flex-col items-center px-6 md:px-40"> 
      {/* Título */}
      <h2 className="text-center text-[38px] font-bold text-black mb-12">
        NOSOTROS
      </h2>

      <div className="w-full h-96 md:h-[500px] bg-[#F0FBFE] flex justify-center items-center mb-8 shadow-sm border border-black">
        <h3 className="text-3xl md:text-5xl font-semibold text-sky-500 animate-pulse">
          Área de Psicopedagogía
        </h3>
      </div>

      {/* Botón con bordes rectos */}
      <button
        onClick={irANosotros}
        className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition" // <-- SIN rounded
      >
        Sobre Nosotros
      </button>
    </section>
  );
};

export default Nosotros;
