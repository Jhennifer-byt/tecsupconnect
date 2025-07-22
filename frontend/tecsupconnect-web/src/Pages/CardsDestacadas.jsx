// src/components/CardsDestacadas.jsx (CORREGIDO)
import React, { useEffect, useState } from 'react';
import { getActividades } from '../services/api';
import { ArrowRight } from 'lucide-react';

export default function CardsDestacadas() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true); // Añadimos estado de carga
  const [error, setError] = useState(null); // Añadimos estado de error

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const responseData = await getActividades(); // getActividades debería retornar res.data
        
        // Asumiendo que getActividades devuelve { results: [...] } o directamente un array.
        // Si devuelve un objeto con 'results', usamos eso. Si devuelve un array directamente, lo usamos.
        const actividadesArray = Array.isArray(responseData.results) 
                                ? responseData.results 
                                : Array.isArray(responseData) 
                                  ? responseData 
                                  : [];
        setLista(actividadesArray);
        
      } catch (err) {
        console.error('Error al cargar actividades:', err);
        setError('No se pudieron cargar las actividades.');
        setLista([]); // Asegúrate de que lista sea un array vacío en caso de error
      } finally {
        setLoading(false); // La carga ha terminado
      }
    };
    fetchActividades();
  }, []); // El array de dependencias vacío asegura que se ejecute una vez al montar

  // Condicionales de renderizado para feedback al usuario
  if (loading) {
    return <section className="py-16 bg-white text-center text-gray-600">Cargando actividades...</section>;
  }

  if (error) {
    return <section className="py-16 bg-white text-center text-red-500">{error}</section>;
  }

  if (lista.length === 0) {
    return <section className="py-16 bg-white text-center text-gray-500">No hay actividades destacadas para mostrar.</section>;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800">ACTIVIDADES ANUALES</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {lista.map(act => {

          return (
            <div
              key={act.id} // Asegúrate que act.id siempre exista y sea único
              className="relative rounded-xl overflow-hidden shadow-lg group bg-white"
            >
              <img
                src={act.imagen || 'https://via.placeholder.com/400x250?text=Sin+Imagen'} // Fallback por si 'imagen' es null/undefined
                alt={act.nombre}
                className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { // Manejo de error para imágenes rotas
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/400x250?text=Imagen+No+Disponible';
                }}
              />
              <div className="p-4 flex flex-col justify-between h-[140px]">
                <h3 className="text-lg font-bold text-gray-800">{act.nombre}</h3>
                <a
                  href={`/detalle-evento/${act.id}`} // Asegúrate que esta ruta sea correcta para tu app
                  className="inline-flex items-center gap-2 text-sky-600 font-semibold hover:underline text-sm"
                >
                  Ver galería <ArrowRight size={16} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}