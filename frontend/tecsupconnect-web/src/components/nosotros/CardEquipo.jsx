// src/components/nosotros/CardEquipo.jsx
const CardEquipo = ({ nombre, frase, imagen }) => {
  return (
    <div className="w-64 text-center">
      <img src={imagen} alt={nombre} className="w-64 h-64 object-cover rounded-full shadow-lg mx-auto" />
      <h3 className="mt-4 text-xl text-gray-600 font-semibold">{nombre}</h3>
      <p className="text-sm text-gray-600 mt-2 italic">"{frase}"</p>
    </div>
  );
};

export default CardEquipo;
