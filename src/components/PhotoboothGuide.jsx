import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCamera, FiShuffle } from 'react-icons/fi'

const STEPS = [
  'Busca el espacio preparado para las fotos.',
  'Tómate una foto solo, con amigos o en grupo.',
  'Usa una pose creativa.',
  'Sube tu foto a la galería del evento.',
]

const POSES = [
  'Pose de equipo ganador 🏆',
  'Foto seria… pero solo por tres segundos 😐 → 😄',
  'Como si ya hubieran terminado toda la jornada 😌',
  'Sonrisa de convivencia 😁',
  'Modo voluntario martes activado 🌟',
  'Foto grupal estilo portada de revista 📸',
  'Pose de: sí hubo refacción 🍕😏',
  'Como cuando todos ayudan y se termina más rápido 💪',
  'El antes de la jornada vs. el después 😅',
  'Mirada al horizonte — el futuro es brillante ✨',
]

export default function PhotoboothGuide({ onUploadClick }) {
  const [pose, setPose] = useState(null)

  const randomPose = () => {
    let next
    do { next = POSES[Math.floor(Math.random() * POSES.length)] } while (next === pose)
    setPose(next)
  }

  return (
    <section className="py-16 px-5 bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-50">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📸</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Photobooth del martes</h2>
            <p className="text-gray-400 text-sm">Crea recuerdos fotográficos del día</p>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-3xl shadow-md p-6 mb-5">
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
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-gray-600 text-sm pt-0.5 leading-relaxed">{step}</span>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Random pose */}
          <div className="bg-white rounded-3xl shadow-md p-6 mb-5 text-center">
            <p className="text-gray-400 text-sm mb-4">¿No sabes qué pose hacer? ¡Te damos una idea!</p>

            <AnimatePresence mode="wait">
              {pose && (
                <motion.div
                  key={pose}
                  initial={{ opacity: 0, scale: 0.8, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-sky-50 border border-sky-100 rounded-2xl px-5 py-4 mb-4 text-sky-700 font-semibold text-base leading-snug"
                >
                  {pose}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={randomPose}
              className="inline-flex items-center gap-2 bg-sky-400 hover:bg-sky-500 text-white font-semibold py-3 px-6 rounded-2xl shadow-md shadow-sky-100 transition-colors text-sm"
            >
              <FiShuffle size={16} />
              Ver ideas de poses
            </motion.button>
          </div>

          {/* Upload CTA */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onUploadClick}
            className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-colors"
          >
            <FiCamera size={18} />
            Subir foto a la galería
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
