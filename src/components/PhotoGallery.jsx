import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiHeart, FiDownload } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import PhotoboothExportCard from './export/PhotoboothExportCard'
import { downloadNodeAsImage, fetchAsDataUrl } from '../utils/downloadNodeAsImage'

function formatTimestamp(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const time = d.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })
  const date = d.toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })
  return `${time} · ${date}`
}

function Lightbox({ photo, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={photo.image_url}
            alt={photo.description || 'Foto de la convivencia'}
            className="w-full max-h-80 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>
        <div className="p-5">
          <p className="font-jakarta font-bold text-gray-800">{photo.uploader_name}</p>
          {photo.description && (
            <p className="text-gray-500 text-sm mt-1">{photo.description}</p>
          )}
          <p className="text-gray-300 text-xs mt-2">{formatTimestamp(photo.created_at)}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function PolaroidCard({ photo, index, onClick }) {
  const [liked, setLiked] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
      className="group bg-white p-2.5 rounded-xl cursor-pointer"
      style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.06))' }}
      onClick={onClick}
      whileHover={{
        scale: 1.03,
        rotate: 0.8,
        filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.12))',
        transition: { duration: 0.25 },
      }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="aspect-square overflow-hidden rounded-lg mb-2.5">
        <img
          src={photo.image_url}
          alt={photo.description || 'Foto de la convivencia'}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex items-center justify-between px-0.5 pb-0.5">
        <div className="min-w-0 pr-1">
          <p className="text-[11px] font-jakarta font-bold text-gray-700 truncate">
            {photo.uploader_name}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5 truncate">
            {formatTimestamp(photo.created_at)}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setLiked((v) => !v) }}
          className={`flex-shrink-0 p-1.5 rounded-full transition-colors ${
            liked ? 'text-rose-500' : 'text-gray-300 hover:text-rose-400'
          }`}
        >
          <FiHeart size={13} className={liked ? 'fill-current' : ''} />
        </button>
      </div>
    </motion.div>
  )
}

export default function PhotoGallery() {
  const [photos, setPhotos]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [selected, setSelected]     = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState(null)
  const [exportPhotos, setExportPhotos] = useState([])
  const exportCardRef = useRef(null)

  useEffect(() => {
    let channel

    async function initialize() {
      channel = supabase
        .channel('realtime:photos')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'photos' },
          (payload) => {
            setPhotos((prev) => {
              if (prev.some((p) => p.id === payload.new.id)) return prev
              return [payload.new, ...prev].slice(0, 30)
            })
          }
        )
        .subscribe()

      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30)

      if (!error && data) setPhotos(data)
      setLoading(false)

      if (error) console.error('[PhotoGallery] Error al cargar fotos:', error.message)
    }

    initialize()
    return () => { if (channel) supabase.removeChannel(channel) }
  }, [])

  const handleDownloadCollage = async () => {
    if (isExporting || !photos.length) return
    setIsExporting(true)
    setExportError(null)

    try {
      const toExport = photos.slice(0, 6)

      // Pre-fetch images as data URLs (avoids CORS issues in html-to-image)
      const withDataUrls = await Promise.all(
        toExport.map(async (p) => ({
          ...p,
          dataUrl: await fetchAsDataUrl(p.image_url),
        }))
      )
      const valid = withDataUrls.filter((p) => p.dataUrl)
      if (!valid.length) throw new Error('No se pudieron cargar las imágenes.')

      setExportPhotos(valid)

      // Wait two animation frames: React commit + browser paint
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

      await downloadNodeAsImage(exportCardRef.current, 'photobooth-martes-con-alegria.png')
    } catch (err) {
      console.error('[PhotoGallery Export]', err)
      setExportError('No fue posible generar el collage. Inténtalo de nuevo.')
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="py-6 text-center text-gray-400 text-sm bg-gray-50">
        Cargando galería...
      </div>
    )
  }

  if (!photos.length) return null

  return (
    <section className="py-12 px-5 bg-secondary-fixed/10 border-t border-secondary-fixed/60">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-6 gap-4"
        >
          <div>
            <span className="text-[11px] font-jakarta font-bold uppercase tracking-[0.15em] text-secondary">
              Galería en vivo
            </span>
            <h3 className="text-headline-md font-jakarta font-bold text-on-surface mt-1">
              Recuerdos del día
            </h3>
            <p className="text-on-surface-variant text-sm mt-1">
              Momentos capturados por los voluntarios
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm flex-shrink-0">
            <span>🖼️</span>
            <span className="font-jakarta font-bold text-gray-500">{photos.length} fotos</span>
          </div>
        </motion.div>

        {/* Download button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <button
            onClick={handleDownloadCollage}
            disabled={isExporting || !photos.length}
            className="inline-flex items-center gap-2.5 bg-secondary text-on-secondary font-jakarta font-bold text-sm py-3 px-5 rounded-xl shadow-ambient hover:shadow-ambient-hover hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                Preparando collage...
              </>
            ) : (
              <>
                <FiDownload size={16} />
                Descargar collage del photobooth
              </>
            )}
          </button>
          {exportError && (
            <p className="text-red-400 text-xs mt-2">{exportError}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {photos.map((photo, i) => (
            <PolaroidCard
              key={photo.id}
              photo={photo}
              index={i}
              onClick={() => setSelected(photo)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <Lightbox photo={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      {/* Hidden export card — always mounted, off-screen */}
      <PhotoboothExportCard ref={exportCardRef} photos={exportPhotos} />
    </section>
  )
}
