import bienvenidaImage from '../assets/vision.png' // <-- Asegúrate que esta imagen esté correctamente cargada

const Bienvenida = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2">
        {/* Texto */}
        <div className="relative bg-black text-white p-10 flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl uppercase font-light mb-2 tracking-wide">
            ¡Bienvenido al corazón de la
          </h2>
          <h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#02B0E3' }}
          >
            Vida Estudiantil en Tecsup!
          </h1>

          {/* Línea decorativa */}
          <div className="w-24 h-2 mb-6" style={{ backgroundColor: '#02B0E3' }}></div>

          <p className="text-base leading-relaxed">
            Te invitamos a formar parte de la gran comunidad estudiantil Tecsup. En ella podrás{' '}
            <span className="font-semibold text-white">
              desarrollar tus habilidades, potenciar tus talentos,
            </span>{' '}
            resolver tus inquietudes y{' '}
            <span className="font-semibold text-white">
              beneficiarte de todos los servicios y actividades extracurriculares
            </span>{' '}
            que sabemos ¡disfrutarás al máximo!.
          </p>

          {/* Franja inferior azul */}
          <div className="absolute bottom-0 left-0 w-full h-2" style={{ backgroundColor: '#02B0E3' }}></div>
        </div>

        {/* Imagen */}
        <div className="w-full h-full">
          <img
            src={bienvenidaImage}
            alt="Vida Estudiantil"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export default Bienvenida
