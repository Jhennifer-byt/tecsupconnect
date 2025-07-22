import React from 'react';

const ModalImagenEvento = ({ imagen, onClose }) => {
  const handleOverlayClick = (e) => {
    // Solo cerrar si se hace clic en el fondo, no en la imagen o el botón
    if (e.target.id === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-[9999] backdrop-blur-sm"
    >
      <div className="relative w-[90%] max-w-2xl"> {/* <-- más pequeño */}
        <img
          src={imagen}
          alt="Flyer del evento"
          className="w-full max-h-[80vh] object-contain rounded shadow-lg"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/70 hover:bg-black p-2 rounded-full text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ModalImagenEvento;
