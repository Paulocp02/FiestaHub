import { FiMessageCircle, FiCamera, FiImage, FiShare2 } from 'react-icons/fi'

const ITEMS = [
  { label: 'Mensajes',  icon: FiMessageCircle, section: 'messages'   },
  { label: 'Fotos',     icon: FiCamera,        section: 'photobooth' },
  { label: 'Galería',   icon: FiImage,         section: 'gallery'    },
  { label: 'Compartir', icon: FiShare2,        section: 'qr'         },
]

export default function BottomNav({ onScrollTo, activeSection }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface shadow-[0_-4px_20px_0_rgba(0,0,0,0.07)]">
      <div className="flex justify-around items-center px-4 pt-2 pb-4 max-w-2xl mx-auto">
        {ITEMS.map(({ label, icon: Icon, section }) => {
          const isActive = activeSection === section
          return (
            <button
              key={section}
              onClick={() => onScrollTo(section)}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-150 active:scale-90 ${
                isActive
                  ? 'bg-secondary text-on-secondary'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[10px] font-jakarta font-bold tracking-wide">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
