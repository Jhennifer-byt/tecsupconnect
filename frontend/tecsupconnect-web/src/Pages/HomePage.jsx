
import Hero from '../components/Hero';
import Bienvenida from '../Pages/Bienvenida';
import CardsDestacadas from '../Pages/CardsDestacadas';
import EventosActivosCiclo from '../components/noticias/EventosActivosCiclo';

const HomePage = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <div className="my-16">
        <Bienvenida />
      </div>   
        <CardsDestacadas />  
      <div id="eventos">
        <EventosActivosCiclo />
      </div>

      <a
        href="https://wa.me/51970984481" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.52 3.48A11.79 11.79 0 0 0 12 0C5.38 0 0 5.38 0 12c0 2.1.55 4.15 1.6 5.94L0 24l6.3-1.64A11.93 11.93 0 0 0 12 24c6.62 0 12-5.38 12-12 0-3.19-1.23-6.19-3.48-8.52zm-8.5 17.5c-1.76 0-3.48-.46-5-1.33l-.36-.2-3.73.97 1-3.62-.24-.37A9.53 9.53 0 0 1 2.5 12c0-5.25 4.25-9.5 9.5-9.5 2.54 0 4.92.99 6.71 2.79a9.47 9.47 0 0 1 2.79 6.71c0 5.25-4.25 9.5-9.5 9.5zm5.3-6.88c-.3-.15-1.77-.87-2.04-.97-.27-.1-.46-.15-.65.15-.2.3-.75.97-.92 1.17-.17.2-.34.22-.63.07-.3-.15-1.27-.47-2.43-1.49a9.03 9.03 0 0 1-1.66-2.06c-.17-.3-.02-.46.13-.6.14-.13.3-.34.45-.5.15-.17.2-.3.3-.5.1-.2.05-.37 0-.52-.07-.15-.64-1.54-.88-2.12-.23-.56-.47-.48-.65-.49h-.55c-.2 0-.52.08-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.1 3.22 5.1 4.51.71.31 1.26.5 1.69.63.71.22 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.06-.12-.27-.2-.56-.35z" />
        </svg>
        <span className="text-sm font-light">Habla con Psicopedagogía</span>
      </a>


    </div>
    
  );
};

export default HomePage;
