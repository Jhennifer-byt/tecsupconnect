// src/components/admin/ImagenGeneralNosotros.jsx – corrige flujo create/patch
import { useEffect, useState } from 'react';
import {
  getImagenNosotros,
  updateImagenNosotros,
  createImagenNosotros,
} from '../../services/apiAdmin';

function ImagenGeneralNosotros() {
  const [imagen, setImagen] = useState(null); // registro existente (o null)
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ──────────────────────────────
   * 1. Cargar imagen actual
   * ────────────────────────────── */
  const fetchImagen = async () => {
    try {
      const res = await getImagenNosotros();
      const lista = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.results)
        ? res.data.results
        : [];

      if (lista.length) {
        setImagen(lista[0]);
        setPreview(lista[0].imagen_url);
      } else {
        setImagen(null);
        setPreview(null);
      }
    } catch (err) {
      console.error('Error al obtener imagen:', err);
    }
  };

  useEffect(() => {
    fetchImagen();
  }, []);

  /* ──────────────────────────────
   * 2. Selección de archivo
   * ────────────────────────────── */
  const handleChange = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setFile(archivo);
    setPreview(URL.createObjectURL(archivo));
  };

  /* ──────────────────────────────
   * 3. Subir/actualizar
   * ────────────────────────────── */
  const handleActualizar = async () => {
    if (!file) {
      alert('Selecciona una imagen antes de actualizar.');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', file);

    try {
      setLoading(true);

      let updated;
      if (imagen?.id) {
        // PATCH sobre el registro existente
        ({ data: updated } = await updateImagenNosotros(imagen.id, formData));
      } else {
        // No había registro → lo creamos
        ({ data: updated } = await createImagenNosotros(formData));
      }

      setImagen(updated);
      setPreview(updated.imagen_url);
      setFile(null);
      alert('✅ Imagen guardada con éxito');
    } catch (err) {
      console.error('Error al guardar imagen:', err);
      alert('❌ Error al guardar la imagen');
    } finally {
      setLoading(false);
    }
  };

  /* ──────────────────────────────
   * 4. Render
   * ────────────────────────────── */
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">📸 Imagen General – Nosotros</h1>

      {preview ? (
        <img
          src={preview}
          alt="Imagen general nosotros"
          className="w-full max-w-lg border rounded"
        />
      ) : (
        <p className="text-gray-500">No hay imagen subida.</p>
      )}

      <div className="space-y-2">
        <input type="file" accept="image/*" onChange={handleChange} />
        <button
          onClick={handleActualizar}
          disabled={loading || !file}
          className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 disabled:opacity-60"
        >
          {loading ? 'Guardando…' : imagen ? 'Actualizar Imagen' : 'Subir Imagen'}
        </button>
      </div>
    </div>
  );
}

export default ImagenGeneralNosotros;
