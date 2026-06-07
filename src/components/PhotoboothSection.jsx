import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiImage, FiX } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const BUCKET   = 'event-photos'

const STEPS = [
  'Busca el espacio preparado para las fotos.',
  'Tómate una foto solo, con amigos o en grupo.',
  'Usa una pose creativa.',
  'Sube tu foto a la galería del evento.',
]

const inputClass =
  'w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-on-surface placeholder-outline text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition disabled:opacity-50'

export default function PhotoboothSection() {
  const [form, setForm]       = useState({ nombre: '', descripcion: '' })
  const [file, setFile]       = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')
  const inputRef              = useRef(null)

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return

    if (!f.type.startsWith('image/')) {
      setError('Solo se aceptan archivos de imagen (JPG, PNG, WEBP, etc.).')
      return
    }
    if (f.size > MAX_SIZE) {
      setError('La imagen debe ser menor a 5 MB.')
      return
    }

    setFile(f)
    setError('')
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(f))
  }

  const clearFile = () => {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (uploading) return
    if (!file)              { setError('Selecciona una imagen.'); return }
    if (!form.nombre.trim()) { setError('Escribe tu nombre.');    return }

    setUploading(true)
    setError('')

    try {
      // Nombre de archivo único
      const ext      = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const filePath = `photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      // 1. Subir imagen a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false,
        })
      if (uploadError) throw uploadError

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath)

      // 3. Guardar metadata en la tabla photos
      const { error: dbError } = await supabase.from('photos').insert({
        uploader_name: form.nombre.trim(),
        description:   form.descripcion.trim() || null,
        image_url:     publicUrl,
        storage_path:  filePath,
      })

      if (dbError) {
        // Si la metadata falla, intentar borrar el archivo ya subido
        await supabase.storage.from(BUCKET).remove([filePath])
        throw dbError
      }

      setSuccess(true)
      clearFile()
      setForm({ nombre: '', descripcion: '' })
      setTimeout(() => setSuccess(false), 6000)
    } catch (err) {
      setError(err.message || 'Error al subir la foto. Inténtalo de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="py-16 px-5 bg-secondary-fixed/15 border-t border-secondary-fixed">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-secondary-fixed rounded-2xl flex items-center justify-center text-3xl shadow-ambient">📸</div>
          </div>
          <span className="block text-[11px] font-jakarta font-bold uppercase tracking-[0.15em] text-secondary mb-2">
            Momentos en vivo
          </span>
          <h2 className="text-headline-md font-jakarta font-bold text-on-surface mb-2">
            Photobooth del martes
          </h2>
          <p className="text-on-surface-variant text-sm">Crea recuerdos fotográficos del día</p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="bg-surface-container-lowest rounded-2xl shadow-md p-6 mb-6"
        >
          <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">
            ¿Cómo funciona?
          </h3>
          <ol className="space-y-3">
            {STEPS.map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-gray-600 text-sm pt-0.5 leading-relaxed">{step}</span>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        {/* Upload form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/30 p-6 md:p-8 space-y-5"
          >
            <h3 className="font-semibold text-gray-800 text-base">Sube tu foto a la galería</h3>

            {/* Drop zone */}
            <div
              onClick={() => !uploading && inputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                preview
                  ? 'border-secondary bg-secondary-fixed/20'
                  : 'border-outline-variant hover:border-secondary hover:bg-secondary-fixed/10'
              } ${uploading ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {preview ? (
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="max-h-52 mx-auto rounded-xl object-cover shadow-md"
                  />
                  {!uploading && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); clearFile() }}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      <FiX size={14} className="text-gray-500" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-gray-400">
                  <FiImage size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-medium">Toca para seleccionar una imagen</p>
                  <p className="text-xs mt-1.5 text-gray-300">JPG · PNG · WEBP · Máximo 5 MB</p>
                </div>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
              disabled={uploading}
            />

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tu nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                placeholder="¿Quién sube esta foto?"
                disabled={uploading}
                className={inputClass}
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Descripción{' '}
                <span className="text-gray-300 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.descripcion}
                onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
                placeholder="¿Qué está pasando en esta foto?"
                disabled={uploading}
                className={inputClass}
              />
            </div>

            {/* Estado de carga */}
            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 text-sm text-secondary"
                >
                  <span className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  Subiendo imagen a la galería...
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={!uploading ? { scale: 1.02 } : {}}
              whileTap={!uploading ? { scale: 0.97 } : {}}
              type="submit"
              disabled={uploading}
              className="w-full bg-primary text-on-primary font-jakarta font-bold py-4 rounded-lg flex items-center justify-center gap-2 shadow-ambient hover:shadow-ambient-hover transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
              ) : (
                <>
                  <FiUpload size={18} />
                  Subir foto
                </>
              )}
            </motion.button>
          </form>

          {/* Success */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="mt-5 bg-tertiary-fixed/20 border border-tertiary-container rounded-3xl p-6 text-center"
              >
                <div className="text-5xl mb-3">🎉</div>
                <p className="font-bold text-tertiary text-lg">¡Foto subida!</p>
                <p className="text-on-tertiary-container text-sm mt-1">
                  Tu recuerdo ya está en la galería de la convivencia.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
