import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const TIPS = [
  'Puedes agradecer algo que valores del equipo.',
  'Puedes recordar una anécdota bonita o divertida.',
  'Puedes escribir una frase de ánimo para todos.',
  'No hace falta que sea largo; lo importante es que sea sincero.',
]

const EJEMPLOS = [
  'Gracias por la buena actitud que siempre muestran cada martes.',
  'Me alegra compartir con un equipo tan dispuesto y alegre.',
  'Un bonito recuerdo de este grupo es ver cómo todos colaboran cuando hay mucho por hacer.',
]

const TIPOS = [
  { value: 'todos',    label: '👥 Para todos'           },
  { value: 'especial', label: '💛 Para alguien especial' },
  { value: 'anonimo',  label: '🎭 Anónimo'              },
]

// Mapeo de valores de UI a valores de base de datos
const RECIPIENT_TYPE_MAP = {
  todos:    'all',
  especial: 'specific',
  anonimo:  'anonymous',
}

const inputClass =
  'w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-on-surface placeholder-outline text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition'

export default function MessageForm() {
  const [form, setForm] = useState({
    nombre: '',
    tipoDestinatario: 'todos',
    destinatario: '',
    mensaje: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState('')

  const set = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    if (!form.mensaje.trim()) {
      setError('Por favor escribe un mensaje.')
      return
    }
    if (form.tipoDestinatario !== 'anonimo' && !form.nombre.trim()) {
      setError('Por favor escribe tu nombre.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const { error: dbError } = await supabase.from('messages').insert({
        sender_name:    form.tipoDestinatario === 'anonimo' ? 'Anónimo' : form.nombre.trim(),
        recipient_type: RECIPIENT_TYPE_MAP[form.tipoDestinatario],
        recipient_name: form.tipoDestinatario === 'especial'
          ? (form.destinatario.trim() || null)
          : null,
        message: form.mensaje.trim(),
      })

      if (dbError) throw dbError

      setSuccess(true)
      setForm({ nombre: '', tipoDestinatario: 'todos', destinatario: '', mensaje: '' })
      setTimeout(() => setSuccess(false), 6000)
    } catch (err) {
      setError(err.message || 'Hubo un error al enviar. Inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-16 px-5 bg-primary-fixed/10 border-t border-primary-fixed">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-fixed rounded-2xl flex items-center justify-center text-3xl shadow-ambient">💬</div>
          </div>
          <span className="block text-[11px] font-jakarta font-bold uppercase tracking-[0.15em] text-primary mb-2">
            Muro de mensajes
          </span>
          <h2 className="text-headline-md font-jakarta font-bold text-on-surface mb-2">
            Escribe un mensaje
          </h2>
          <p className="text-on-surface-variant text-sm">Comparte algo especial con tus compañeros voluntarios</p>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="bg-surface-container-low rounded-2xl p-5 mb-6 border border-outline-variant"
        >
          <p className="text-label-bold font-jakarta font-bold text-primary mb-3">Ideas para tu mensaje:</p>
          <ul className="space-y-1.5 mb-4">
            {TIPS.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                <span className="text-tertiary mt-0.5 flex-shrink-0">✓</span>
                {tip}
              </li>
            ))}
          </ul>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Ejemplos — toca para usar:
          </p>
          <div className="space-y-2">
            {EJEMPLOS.map((ej, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setForm((p) => ({ ...p, mensaje: ej }))}
                className="w-full text-left text-xs text-on-surface-variant italic bg-surface-container-lowest hover:bg-primary-fixed/30 border border-outline-variant/50 hover:border-primary/30 rounded-xl px-4 py-2.5 transition-colors"
              >
                &ldquo;{ej}&rdquo;
              </button>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/30 p-6 md:p-8 space-y-5"
        >
          {/* Tipo destinatario */}
          <div>
            <label className="block text-sm font-jakarta font-bold text-gray-700 mb-2.5">
              ¿Para quién es tu mensaje?
            </label>
            <div className="flex items-center gap-2 overflow-x-auto py-1 -mx-1 px-1 no-scrollbar">
              {TIPOS.map((tipo) => (
                <button
                  key={tipo.value}
                  type="button"
                  disabled={submitting}
                  onClick={() => setForm((p) => ({ ...p, tipoDestinatario: tipo.value }))}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-jakarta font-bold whitespace-nowrap transition-all active:scale-95 disabled:opacity-50 ${
                    form.tipoDestinatario === tipo.value
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-ambient'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                  }`}
                >
                  {tipo.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nombre de quien escribe */}
          <AnimatePresence>
            {form.tipoDestinatario !== 'anonimo' && (
              <motion.div
                key="nombre"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tu nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={set('nombre')}
                  placeholder="¿Cómo te llamas?"
                  disabled={submitting}
                  className={`${inputClass} disabled:opacity-50`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nombre del destinatario especial */}
          <AnimatePresence>
            {form.tipoDestinatario === 'especial' && (
              <motion.div
                key="destinatario"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  ¿Para quién es?
                </label>
                <input
                  type="text"
                  value={form.destinatario}
                  onChange={set('destinatario')}
                  placeholder="Nombre de la persona especial"
                  disabled={submitting}
                  className={`${inputClass} disabled:opacity-50`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mensaje */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tu mensaje</label>
            <textarea
              value={form.mensaje}
              onChange={set('mensaje')}
              placeholder="Escribe algo bonito para tus compañeros..."
              rows={4}
              disabled={submitting}
              className={`${inputClass} resize-none disabled:opacity-50`}
            />
          </div>

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
            whileHover={!submitting ? { scale: 1.02 } : {}}
            whileTap={!submitting ? { scale: 0.97 } : {}}
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-on-primary font-jakarta font-bold py-4 rounded-lg flex items-center justify-center gap-2 shadow-ambient hover:shadow-ambient-hover transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
            ) : (
              <>
                <FiSend size={18} />
                Enviar mensaje
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Success */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="mt-5 bg-surface-container-low border border-outline-variant rounded-2xl p-6 text-center"
            >
              <div className="text-5xl mb-3">💌</div>
              <p className="font-jakarta font-bold text-on-surface text-lg">¡Mensaje enviado!</p>
              <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                Mensaje enviado con cariño. Gracias por aportar al recuerdo del día.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
