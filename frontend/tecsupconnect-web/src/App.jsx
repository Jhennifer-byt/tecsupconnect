import { Routes, Route } from 'react-router-dom';
import Layout from './Layouts/Layout';
import HomePage from './Pages/HomePage';
import NosotrosPage from './components/nosotros/NosotrosPage';
import './index.css'; 
import PrivateRoute from './Pages/admin/PrivateRoute';
import CiclosAdmin from './Pages/admin/CiclosAdmin';
import AdminLayout from './Pages/admin/AdminLayout';
import Login from './Pages/admin/LoginAdmin';
import DetalleEvento from './components/noticias/DetalleEvento';
import CiclosArchivados from './Pages/admin/CiclosArchivados';
import EventosAdmin from './Pages/admin/EventoAdmin'
import FotoEventosAdmin from './Pages/admin/FotoEventosAdmin'
import FotoEventosGaleria from './Pages/admin/FotoEventosGaleria'
import MiembrosPsicopedagogiaAdmin from './Pages/admin/MiembrosPsicopedagogia'
import ImagenGeneralNosotros from './Pages/admin/ImagenGeneralNosotros'
import ActividadesAdmin from './Pages/admin/ActividadesAdmin';


function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/detalle-evento/:actividadId"
        element={
          <Layout>
            <DetalleEvento />
          </Layout>
        }
      />

      <Route
        path="/nosotros"
        element={
          <Layout>
            <NosotrosPage />
          </Layout>
        }
      />

      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="ciclos" element={<CiclosAdmin />} />
        <Route path="/admin/ciclos-archivados" element={<CiclosArchivados />} />
        <Route path="/admin/eventos" element={<EventosAdmin />} />
        <Route path="/admin/foto-eventos" element={<FotoEventosAdmin />} />
        <Route path="/admin/foto-eventos/galeria" element={<FotoEventosGaleria />} />
        <Route path="/admin/miembros" element={<MiembrosPsicopedagogiaAdmin />} />
        <Route path="/admin/nosotros" element={<ImagenGeneralNosotros />} />
        <Route path="/admin/actividad" element={<ActividadesAdmin />} />
      </Route>
    </Routes>
  );
}

export default App;
