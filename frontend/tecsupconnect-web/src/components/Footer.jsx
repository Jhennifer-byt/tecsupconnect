import React from 'react';
import logo from '../assets/logo2.png'; // Tu logo importado

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t mt-8 py-10 font-inter rounded-t-lg shadow-inner"> {/* Added font-inter, py, rounded-t-lg, shadow-inner */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-gray-700"> {/* Adjusted grid for smaller screens */}
        
        {/* Logo y Acerca */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left"> {/* Aligned content */}
          <img
            className="h-20 w-auto mb-4 rounded-md shadow-sm" // Increased logo size, added w-auto, mb-4, rounded-md, shadow-sm
            src={logo}
            alt="TecsupConnect"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/120x80/EEEEEE/333333?text=Logo'; }} // Fallback image for logo
          />
          <p className="text-sm leading-relaxed"> {/* Added leading-relaxed for better readability */}
            Área de Psicopedagogía <br />
            Tecsup
          </p>
        </div>

        {/* Nosotros */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-sky-700">NOSOTROS</h3> {/* Increased mb, added text-sky-700 */}
          <ul className="space-y-3 text-sm"> {/* Increased space-y */}
            <li><a href="#acerca" className="hover:text-sky-600 transition duration-200">Acerca del Área</a></li> {/* Added hover effect */}
            <li><a href="#equipo" className="hover:text-sky-600 transition duration-200">Nuestro Equipo</a></li> {/* Added hover effect */}
          </ul>
        </div>

        {/* Eventos y Talleres */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-sky-700">EVENTOS</h3> {/* Increased mb, added text-sky-700 */}
          <ul className="space-y-3 text-sm"> {/* Increased space-y */}
            <li><a href="#noticias" className="hover:text-sky-600 transition duration-200">Noticias</a></li> {/* Added hover effect */}
            <li><a href="#actividades" className="hover:text-sky-600 transition duration-200">Talleres</a></li> {/* Added hover effect */}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-sky-700">CONTACTO</h3> {/* Increased mb, added text-sky-700 */}
          <ul className="space-y-3 text-sm"> {/* Increased space-y */}
            <li><a href="mailto:psicopedagogia@tecsup.edu.pe" className="hover:text-sky-600 transition duration-200">psicopedagogia@tecsup.edu.pe</a></li> {/* Added hover effect */}
            <li><a href="tel:+5111234567" className="hover:text-sky-600 transition duration-200">+51 1 123 4567</a></li> {/* Added hover effect */}
          </ul>
        </div>

      </div>

      {/* Línea final */}
      <div className="border-t border-gray-200 text-center py-6 mt-10 text-sm text-gray-500 bg-gray-50 rounded-b-lg"> {/* Added border-gray-200, py, mt, bg-gray-50, rounded-b-lg */}
        © 2025 Tecsup | Área de Psicopedagogía
      </div>
    </footer>
  );
};

export default Footer;
