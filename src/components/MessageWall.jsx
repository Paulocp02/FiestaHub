import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiDownload } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import MessageWallExportCard from './export/MessageWallExportCard'
import { downloadNodeAsImage } from '../utils/downloadNodeAsImage'

// Colores M3 exactos del diseño Stitch
const STICKER_CONFIGS = [
  { bg: 'bg-primary-container',         text: 'text-on-primary-container',       rotate: -1.5 },
  { bg: 'bg-secondary-container',       text: 'text-on-secondary-container',     rotate:  1.2 },
  { bg: 'bg-secondary-fixed',           text: 'text-on-secondary-fixed-variant', rotate: -0.8 },
  { bg: 'bg-tertiary-container',        text: 'text-on-tertiary-container',      rotate:  2.0 },
  { bg: 'bg-surface-container-highest', text: 'text-on-surface',                 rotate: -1.2 },
  { bg: 'bg-primary-fixed',             text: 'text-on-primary-fixed-variant',   rotate:  0.8 },
]

const RECIPIENT_EMOJI = { all: '🙌', specific: '💛', anonymous: '🎭' }

function getRecipientLabel(msg) {
  if (msg.recipient_type === 'anonymous') return 'Anónimo'
  if (msg.recipient_type === 'specific' && msg.recipient_name) return `Para: ${msg.recipient_name}`
  return 'Para: Todos'
}

function StickerCard({ msg, index }) {
  const cfg   = STICKER_CONFIGS[index % STICKER_CONFIGS.length]
  const emoji = RECIPIENT_EMOJI[msg.recipient_type] || '✨'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0, rotate: cfg.rotate }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.07 }}
      whileHover={{ rotate: 0, scale: 1.04, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      className={`${cfg.bg} ${cfg.text} p-4 rounded-2xl shadow-ambient flex flex-col justify-between min-h-[140px] cursor-default`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[11px] font-jakarta font-bold opacity-80 leading-tight">
          {getRecipientLabel(msg)}
        </span>
        <span className="text-lg leading-none flex-shrink-0">{emoji}</span>
      </div>
      <p className="text-sm leading-relaxed flex-1 mb-3">
        {msg.message}
      </p>
      <div className="text-right">
        <span className="text-[10px] font-jakarta font-bold opacity-70">
          — {msg.recipient_type === 'anonymous' ? 'Anónimo' : msg.sender_name}
        </span>
      </div>
    </motion.div>
  )
}

export default function MessageWall() {
  const [messages, setMessages]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [dbError, setDbError]         = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  // Ref on the inner wrapper div — the export card fills its full width.
  const exportCardRef = useRef(null)

  useEffect(() => {
    let channel

    async function initialize() {
      channel = supabase
        .channel('realtime:messages')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          (payload) => {
            setMessages((prev) => {
              if (prev.some((m) => m.id === payload.new.id)) return prev
              return [payload.new, ...prev].slice(0, 24)
            })
          }
        )
        .subscribe()

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(24)

      if (error) {
        console.error('[MessageWall] Error al cargar mensajes:', error.message)
        setDbError(true)
      } else {
        setMessages(data ?? [])
      }
      setLoading(false)
    }

    initialize()
    return () => { if (channel) supabase.removeChannel(channel) }
  }, [])

  const handleDownloadMural = async () => {
    if (isExporting || !messages.length) return
    setIsExporting(true)
    setExportError(null)

    try {
      // Export card is always mounted with current messages — just let the browser settle
      await new Promise((r) => setTimeout(r, 300))
      await downloadNodeAsImage(
        exportCardRef.current,
        'muro-mensajes-martes-con-alegria.png',
      )
    } catch (err) {
      console.error('[MessageWall Export]', err)
      setExportError('No fue posible generar el mural. Inténtalo de nuevo.')
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="py-8 px-5 text-center text-on-surface-variant text-sm bg-surface">
        Cargando mensajes...
      </div>
    )
  }

  if (dbError || !messages.length) return null

  return (
    <section className="py-12 px-5 bg-tertiary-fixed/10 border-t border-tertiary-fixed/60">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-tertiary-fixed rounded-2xl flex items-center justify-center text-2xl shadow-ambient flex-shrink-0">
            💬
          </div>
          <div>
            <span className="block text-[11px] font-jakarta font-bold uppercase tracking-[0.15em] text-tertiary mb-0.5">
              En tiempo real
            </span>
            <h3 className="text-headline-md font-jakarta font-bold text-on-surface">
              Muro de Energía
            </h3>
            <p className="text-on-surface-variant text-sm mt-0.5">
              Lo que los voluntarios se dicen entre sí
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 items-start">
          {messages.map((msg, i) => (
            <StickerCard key={msg.id} msg={msg} index={i} />
          ))}
        </div>

        {/* Download button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <button
            onClick={handleDownloadMural}
            disabled={isExporting || !messages.length}
            className="inline-flex items-center gap-2.5 bg-tertiary text-on-tertiary font-jakarta font-bold text-sm py-3 px-5 rounded-xl shadow-ambient hover:shadow-ambient-hover hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                Preparando mural...
              </>
            ) : (
              <>
                <FiDownload size={16} />
                Descargar mural de mensajes
              </>
            )}
          </button>
          {exportError && (
            <p className="text-red-400 text-xs">{exportError}</p>
          )}
        </motion.div>
      </div>

      {/*
        Off-screen export container.
        Same fix as PhotoGallery: left: -9999px but top: 0.
        The export card always renders with the current messages.
        The ref is on the inner wrapper div.
      */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '1080px',
          pointerEvents: 'none',
          opacity: 1,
          zIndex: -1,
        }}
      >
        <div ref={exportCardRef}>
          <MessageWallExportCard messages={messages} />
        </div>
      </div>
    </section>
  )
}
