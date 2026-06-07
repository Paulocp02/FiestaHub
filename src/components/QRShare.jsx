import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { motion } from 'framer-motion'
import { FiDownload, FiCopy, FiCheck } from 'react-icons/fi'

const QR_ID = 'qr-canvas-martes'

export default function QRShare() {
  const [copied, setCopied] = useState(false)
  const pageUrl = window.location.href

  const downloadQR = () => {
    const canvas = document.getElementById(QR_ID)
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'martes-con-alegria-qr.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback para navegadores sin soporte de clipboard
      const input = document.createElement('input')
      input.value = pageUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <section className="py-16 px-5 bg-tertiary-fixed/15 border-t border-tertiary-fixed/60">
      <div className="max-w-sm mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-tertiary-fixed rounded-2xl flex items-center justify-center text-3xl shadow-ambient">📲</div>
          </div>
          <span className="block text-[11px] font-jakarta font-bold uppercase tracking-[0.15em] text-tertiary mb-2">
            Invita a más voluntarios
          </span>
          <h2 className="text-headline-md font-jakarta font-bold text-on-surface mb-2">
            Comparte esta página
          </h2>
          <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
            Escanea este QR para entrar a la experiencia digital de la convivencia.
          </p>

          {/* QR Code */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-50 rounded-3xl p-7 flex justify-center mb-6 shadow-inner"
          >
            <div className="bg-white p-4 rounded-2xl shadow-md">
              <QRCodeCanvas
                id={QR_ID}
                value={pageUrl}
                size={200}
                level="H"
                includeMargin={false}
                fgColor="#1f2937"
                bgColor="#ffffff"
              />
            </div>
          </motion.div>

          {/* URL display */}
          <p className="text-xs text-gray-300 mb-6 break-all px-2 leading-relaxed">
            {pageUrl}
          </p>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadQR}
              className="flex items-center gap-2 bg-transparent border-2 border-secondary text-secondary font-jakarta font-bold py-3 px-5 rounded-lg text-sm hover:bg-secondary-fixed/30 transition-colors"
            >
              <FiDownload size={16} />
              Descargar QR
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyUrl}
              className="flex items-center gap-2 bg-primary text-on-primary font-jakarta font-bold py-3 px-5 rounded-lg text-sm shadow-ambient hover:shadow-ambient-hover transition-all hover:opacity-90"
            >
              {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
              {copied ? '¡Copiado!' : 'Copiar enlace'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
