import { useState, useRef } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiImage, FiX } from 'react-icons/fi'
import { storage, db } from '../lib/firebase'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export default function PhotoUpload() {
  const [form, setForm] = useState({ nombre: '', descripcion: '' })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

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
    if (!file) { setError('Selecciona una imagen.'); return }
    if (!form.nombre.trim()) { setError('Escribe tu nombre.'); return }

    setUploading(true)
    setError('')

    const filename = `fotos/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const storageRef = ref(storage, filename)
    const task = uploadBytesResumable(storageRef, file)

    task.on(
      'state_changed',
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      () => {
        setError('Error al subir la imagen. Verifica tu conexión e inténtalo de nuevo.')
        setUploading(false)
      },
      async () => {
        try {
          const imageUrl = await getDownloadURL(task.snapshot.ref)
          await addDoc(collection(db, 'fotos'), {
            nombre: form.nombre.trim(),
            descripcion: form.descripcion.trim(),
            imageUrl,
            fechaCreacion: serverTimestamp(),
          })
          setSuccess(true)
          clearFile()
          setProgress(0)
          setForm({ nombre: '', descripcion: '' })
          setTimeout(() => setSuccess(false), 6000)
        } catch {
          setError('Error al guardar la foto. Inténtalo de nuevo.')
        } finally {
          setUploading(false)
        }
      }
    )
  }

  return (
    <section className="py-16 px-5 bg-white">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🖼️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sube una foto</h2>
            <p className="text-gray-400 text-sm">Comparte un momento especial de la convivencia</p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8 space-y-5"
          >
            {/* Drop zone */}
            <div className="relative">
              <div
                onClick={() => !uploading && inputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  preview
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                } ${uploading ? 'cursor-default' : ''}`}
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
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tu nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                placeholder="¿Quién sube esta foto?"
                disabled={uploading}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition disabled:opacity-50"
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
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition disabled:opacity-50"
              />
            </div>

            {/* Progress */}
            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>Subiendo imagen...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className="bg-emerald-400 h-2.5 rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={uploading}
              className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-100 transition-colors disabled:opacity-60"
            >
              {uploading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block"
                />
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
                className="mt-5 bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center"
              >
                <div className="text-5xl mb-3">🎉</div>
                <p className="font-bold text-emerald-700 text-lg">¡Foto subida!</p>
                <p className="text-emerald-600 text-sm mt-1">
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
