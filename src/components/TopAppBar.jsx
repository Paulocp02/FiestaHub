import { motion } from 'framer-motion'

export default function TopAppBar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-surface shadow-sm"
    >
      <div className="flex items-center justify-between px-5 h-16 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none" style={{ color: '#ab3500' }}>🌟</span>
          <span className="font-jakarta font-bold text-primary text-base tracking-tight">
            Martes con Alegría
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-jakarta font-bold uppercase tracking-[0.12em] bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse" />
          En vivo
        </div>
      </div>
    </motion.header>
  )
}
