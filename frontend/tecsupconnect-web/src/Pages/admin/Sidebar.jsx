// src/components/admin/Sidebar.jsx

import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `block py-2 px-4 rounded hover:bg-sky-100 ${isActive ? 'bg-sky-200' : ''}`;

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r shadow-md overflow-y-auto">
      <div className="p-4 text-xl font-bold text-sky-600">Admin</div>

      {/* Logout moved arriba */}
      <button
        onClick={logout}
        className="mx-4 mb-4 py-2 px-4 w-auto text-left text-red-600 font-semibold rounded hover:bg-red-100"
      >
        Cerrar sesión
      </button>

      <nav className="space-y-2 px-4">
        <NavLink to="/admin/ciclos" className={linkClass}>
          Ciclos Académicos
        </NavLink>

        <details className="group">
          <summary className="cursor-pointer font-semibold text-sky-500">
            Eventos
          </summary>
          <div className="ml-4 mt-1 space-y-1">
            <NavLink to="/admin/eventos" className={linkClass}>
              Eventos
            </NavLink>
          </div>
        </details>

        <details className="group">
          <summary className="cursor-pointer font-semibold text-sky-500">
            Actividades
          </summary>
          <div className="ml-4 mt-1">
            <NavLink to="/admin/actividad" className={linkClass}>
              Actividades
            </NavLink>
            <NavLink to="/admin/foto-eventos" className={linkClass}>
              Agregar Fotos por Actividad
            </NavLink>
            <NavLink to="/admin/foto-eventos/galeria" className={linkClass}>
              Ver Fotos por Actividad
            </NavLink>
          </div>
        </details>

        <details className="group">
          <summary className="cursor-pointer font-semibold text-sky-500">
            Psicopedagogía
          </summary>
          <div className="ml-4 mt-1 space-y-1">
            <NavLink to="/admin/nosotros" className={linkClass}>
              Imagen Nosotros
            </NavLink>
            <NavLink to="/admin/miembros" className={linkClass}>
              Miembros Psicopedagógicos
            </NavLink>
          </div>
        </details>

        <NavLink to="/admin/ciclos-archivados" className={linkClass}>
          Ciclos Archivados
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
