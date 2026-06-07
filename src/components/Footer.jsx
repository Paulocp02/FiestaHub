import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="py-12 px-5 bg-inverse-surface text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        <div className="text-3xl mb-4">🌟</div>
        <p className="font-jakarta font-extrabold text-inverse-on-surface text-xl tracking-tight mb-1">
          Martes con Alegría
        </p>
        <p className="text-inverse-on-surface/60 text-sm mb-5">
          Recuerdos, mensajes y buenos momentos.
        </p>
        <div className="w-10 h-px bg-inverse-on-surface/20 mx-auto mb-5" />
        <p className="text-inverse-on-surface/40 text-xs">
          Hecho con cariño para los voluntarios del martes. 💛
        </p>
      </motion.div>
    </footer>
  )
}
