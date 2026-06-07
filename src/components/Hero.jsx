import { motion } from 'framer-motion'
import { FiMessageCircle, FiCamera, FiImage, FiShare2 } from 'react-icons/fi'

const BUTTONS = [
  {
    label: 'Escribir mensaje',
    icon: <FiMessageCircle size={20} />,
    section: 'messages',
    color: 'bg-primary text-on-primary hover:opacity-90',
    shadow: 'shadow-md',
  },
  {
    label: 'Photobooth y fotos',
    icon: <FiCamera size={20} />,
    section: 'photobooth',
    color: 'bg-secondary text-on-secondary hover:opacity-90',
    shadow: 'shadow-md',
  },
  {
    label: 'Ver galería',
    icon: <FiImage size={20} />,
    section: 'gallery',
    color: 'bg-primary-container text-on-primary-container hover:opacity-90',
    shadow: 'shadow-md',
  },
  {
    label: 'Compartir QR',
    icon: <FiShare2 size={20} />,
    section: 'qr',
    color: 'bg-tertiary-container text-on-tertiary-container hover:opacity-90',
    shadow: 'shadow-md',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function Hero({ onScrollTo }) {
  return (
    <section className="relative min-h-[calc(100svh-56px)] flex flex-col items-center justify-center px-5 py-20 overflow-hidden bg-surface">
      {/* Decorative blobs — vivid container colors for visible color wash */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.28, 0.42, 0.28] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-16 -right-16 w-80 h-80 bg-primary-container rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.22, 0.36, 0.22] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary-container rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.18, 0.30, 0.18] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/2 left-1/3 w-52 h-52 bg-tertiary-container rounded-full blur-3xl pointer-events-none"
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-xl mx-auto w-full"
      >
        {/* Icon container */}
        <motion.div variants={itemVariants} className="flex justify-center mb-5">
          <div className="w-20 h-20 bg-primary-fixed rounded-3xl flex items-center justify-center text-4xl shadow-ambient animate-float">
            🌟
          </div>
        </motion.div>

        {/* Eyebrow */}
        <motion.div variants={itemVariants} className="mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-jakarta font-bold uppercase tracking-[0.15em] text-on-tertiary-fixed bg-tertiary-fixed px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse" />
            Convivencia en vivo
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-display-lg-mobile md:text-display-lg font-jakarta font-extrabold text-on-surface mb-4 text-balance"
        >
          Martes con{' '}
          <span className="text-primary">Alegría</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-on-surface-variant mb-10 px-2 leading-relaxed max-w-sm mx-auto"
        >
          Un espacio para compartir recuerdos, mensajes y buenos momentos entre voluntarios.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10"
        >
          {BUTTONS.map((btn) => (
            <motion.button
              key={btn.section}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onScrollTo(btn.section)}
              className={`${btn.color} font-jakarta font-bold py-4 px-5 rounded-lg flex items-center justify-center gap-3 text-sm shadow-ambient hover:shadow-ambient-hover transition-all duration-200`}
            >
              {btn.icon}
              {btn.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Thank you phrase */}
        <motion.div
          variants={itemVariants}
          className="bg-surface-container-lowest rounded-2xl px-6 py-4 shadow-ambient border border-outline-variant/30"
        >
          <p className="text-on-surface-variant text-sm italic leading-relaxed">
            ✨ &ldquo;Gracias por servir con alegría, buena disposición y espíritu de equipo.&rdquo;
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-xs flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xl"
        >
          ↓
        </motion.div>
        <span>Desliza para explorar</span>
      </motion.div>
    </section>
  )
}
