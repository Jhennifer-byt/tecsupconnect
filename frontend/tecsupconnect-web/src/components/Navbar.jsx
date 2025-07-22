// src/components/Navbar.jsx – versión con logo clicable + acordeón responsivo
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo2.png';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* ───────────────────────────────────
         *  1. Sección principal (logo + botón hamburguesa)
         * ─────────────────────────────────── */}
        <div className="flex justify-between items-center h-20">
          {/* Logo (lleva al Home) */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={logo} alt="TecsupConnect" className="h-14 w-auto" />
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center space-x-12">
            <Link
              to="/"
              className="text-sky-500 hover:text-sky-700 font-normal"
            >
              Inicio
            </Link>
            <a
              href="/#eventos"
              className="text-sky-500 hover:text-sky-700 font-normal"
            >
              Actividades
            </a>
            <Link
              to="/nosotros"
              className="text-sky-500 hover:text-sky-700 font-normal"
            >
              Nosotros
            </Link>
            <Link
              to="/login"
              className="flex items-center text-sky-500 hover:text-sky-700 font-normal space-x-2"
            >
              <FaUserCircle className="text-2xl" />
              <span>Login</span>
            </Link>
          </div>

          {/* Botón hamburguesa móvil */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden text-sky-600 hover:text-sky-800 focus:outline-none text-2xl"
            aria-label="Abrir menú"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* ───────────────────────────────────
         *  2. Menú móvil (acordeón)
         * ─────────────────────────────────── */}
        {open && (
          <div className="md:hidden border-t border-gray-200 animate-fade-down">
            {/* Usamos <details> para efecto acordeón/colapso extra */}
            <details open className="px-4 py-2">
              <summary className="cursor-pointer py-2 font-medium text-sky-700">
                Navegación
              </summary>
              <nav className="flex flex-col space-y-3 mt-2">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="text-sky-500 hover:text-sky-700"
                >
                  Inicio
                </Link>
                <a
                  href="/#eventos"
                  onClick={() => setOpen(false)}
                  className="text-sky-500 hover:text-sky-700"
                >
                  Actividades
                </a>
                <Link
                  to="/nosotros"
                  onClick={() => setOpen(false)}
                  className="text-sky-500 hover:text-sky-700"
                >
                  Nosotros
                </Link>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-2 text-sky-500 hover:text-sky-700"
                >
                  <FaUserCircle />
                  <span>Login</span>
                </Link>
              </nav>
            </details>
          </div>
        )}
      </div>
    </nav>
  );
}
