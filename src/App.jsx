import { useRef, useState } from 'react'
import TopAppBar from './components/TopAppBar'
import BottomNav from './components/BottomNav'
import Hero from './components/Hero'
import MessageForm from './components/MessageForm'
import MessageWall from './components/MessageWall'
import PhotoboothSection from './components/PhotoboothSection'
import PhotoGallery from './components/PhotoGallery'
import QRShare from './components/QRShare'
import Footer from './components/Footer'

function App() {
  const [activeSection, setActiveSection] = useState(null)

  const refs = {
    messages:   useRef(null),
    photobooth: useRef(null),
    gallery:    useRef(null),
    qr:         useRef(null),
  }

  const scrollTo = (section) => {
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(section)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopAppBar />

      <div className="pb-20">
        <Hero onScrollTo={scrollTo} />

        <div ref={refs.messages}>
          <MessageForm />
          <MessageWall />
        </div>

        <div ref={refs.photobooth}>
          <PhotoboothSection />
        </div>

        <div ref={refs.gallery}>
          <PhotoGallery />
        </div>

        <div ref={refs.qr}>
          <QRShare />
        </div>

        <Footer />
      </div>

      <BottomNav onScrollTo={scrollTo} activeSection={activeSection} />
    </div>
  )
}

export default App
