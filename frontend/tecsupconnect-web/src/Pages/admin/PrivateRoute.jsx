import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
// Importamos isTokenValid desde apiAdmin para asegurar consistencia
import { isTokenValid } from './../../services/apiAdmin'; 

const getToken = () => {
  const token = localStorage.getItem('access') || sessionStorage.getItem('access');
  console.log('PrivateRoute: Intentando obtener token. Token encontrado:', token ? 'Sí' : 'No');
  return token;
};

const PrivateRoute = ({ children }) => {
  const token = getToken();

  console.log('PrivateRoute: Verificando token para acceso a ruta privada...');

  if (!token) {
    console.log('PrivateRoute: No hay token. Redirigiendo a /login.');
    Swal.fire({
      icon: 'warning',
      title: 'Sesión expirada',
      text: 'No se encontró un token de sesión. Por favor, inicia sesión nuevamente.',
      confirmButtonColor: '#0ea5e9',
    }).then(() => {
      window.location.href = '/login';
    });
    return null; // Evita renderizar el children mientras se redirige
  }

  if (!isTokenValid(token)) {
    console.log('PrivateRoute: Token existe pero NO es VÁLIDO o ha expirado. Redirigiendo a /login.');
    // Opcional: Limpiar tokens si son inválidos, aunque AdminLayout también lo hace
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('refresh');

    Swal.fire({
      icon: 'warning',
      title: 'Sesión expirada',
      text: 'Tu sesión ha expirado o el token es inválido. Por favor, inicia sesión nuevamente.',
      confirmButtonColor: '#0ea5e9',
    }).then(() => {
      window.location.href = '/login';
    });

    return null; // Evita renderizar el children mientras se redirige
  }

  console.log('PrivateRoute: Token es VÁLIDO. Permitiendo acceso a la ruta.');
  return children;
};

export default PrivateRoute;
