// src/components/admin/AdminLayout.jsx

import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import { isTokenValid } from '../../services/apiAdmin';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let token = localStorage.getItem('access') || sessionStorage.getItem('access');
    if (!token) {
      navigate('/login');
      return;
    }
    if (isTokenValid(token)) {
      setCheckingAuth(false);
    } else {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    }
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-6 text-xl text-sky-700">Verificando sesión...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-inter bg-gray-100 text-gray-800">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 m-4 rounded-lg shadow-inner">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
