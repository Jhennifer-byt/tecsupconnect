import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const SliderMisionVision = () => {
  return (
    <section className="w-full bg-white py-6">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        loop
      >
        <SwiperSlide>
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 p-8">
            <div className="max-w-lg">

              <h3 className="text-sky-500 font-bold text-xl">Misión</h3>
              <p className="text-lg text-gray-700">
                Formar profesionales globalmente competitivos, éticos e innovadores que cuenten con un profundo conocimiento tecnológico; asimismo, apoyar a las empresas a incrementar su productividad y valor.
              </p>
            </div>
            <div>
              <img src="/src/assets/vision.png" alt="Misión y Visión" className="rounded-lg shadow-md max-w-sm"/>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 p-8">
            <div className="max-w-lg">
              <h3 className="text-sky-500 font-bold text-xl">Visión</h3>
              <p className="text-lg text-gray-700">
                Desarrollar el talento tecnológico e innovador en el presente, para transformar el futuro.
              </p>
            </div>
            <div>
              <img src="/src/assets/proposito.jpg" alt="Propósito" className="rounded-lg shadow-md max-w-sm"/>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default SliderMisionVision;
