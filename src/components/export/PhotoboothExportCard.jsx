import { forwardRef } from 'react'

// M3 hex tokens from tailwind.config.js
const C = {
  primary:              '#ab3500',
  primaryContainer:     '#ff6b35',
  primaryFixed:         '#ffdbd0',
  secondary:            '#384dd0',
  secondaryContainer:   '#5367ea',
  secondaryFixed:       '#dfe0ff',
  tertiary:             '#3b6a00',
  tertiaryFixed:        '#9ffa41',
  surface:              '#f9f9fc',
  onSurface:            '#1a1c1e',
  onSurfaceVariant:     '#594139',
  outlineVariant:       '#e1bfb5',
}

function getGridCols(count) {
  if (count <= 2) return count || 1
  if (count === 4) return 2
  return 3
}

const PhotoboothExportCard = forwardRef(function PhotoboothExportCard({ photos }, ref) {
  const displayed = (photos ?? []).slice(0, 6)
  const count = displayed.length
  const cols = getGridCols(count)
  const aspectRatio = count === 1 ? '16 / 9' : '1 / 1'

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '900px',
        background: 'linear-gradient(160deg, #fff8f6 0%, #f9f9fc 48%, #eff2ff 100%)',
        fontFamily: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Top gradient stripe */}
      <div style={{
        height: '7px',
        background: `linear-gradient(90deg, ${C.primary}, ${C.primaryContainer}, ${C.secondary})`,
      }} />

      {/* Decorative circles (no blur — más confiable en html-to-image) */}
      <div style={{
        position: 'absolute', top: '24px', right: '24px',
        width: '120px', height: '120px',
        background: C.primaryFixed,
        borderRadius: '50%', opacity: 0.55,
      }} />
      <div style={{
        position: 'absolute', top: '60px', right: '80px',
        width: '60px', height: '60px',
        background: C.secondaryFixed,
        borderRadius: '50%', opacity: 0.45,
      }} />
      <div style={{
        position: 'absolute', bottom: '24px', left: '24px',
        width: '100px', height: '100px',
        background: C.secondaryFixed,
        borderRadius: '50%', opacity: 0.45,
      }} />
      <div style={{
        position: 'absolute', bottom: '60px', left: '80px',
        width: '50px', height: '50px',
        background: C.tertiaryFixed,
        borderRadius: '50%', opacity: 0.35,
      }} />

      <div style={{ padding: '36px 48px 44px', position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          {/* Emoji icon */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '60px', height: '60px',
            background: C.secondaryFixed,
            borderRadius: '18px',
            fontSize: '28px',
            marginBottom: '14px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}>
            📸
          </div>

          {/* Badge */}
          <div style={{ marginBottom: '10px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              background: C.secondaryFixed,
              borderRadius: '999px',
              padding: '4px 14px',
              fontSize: '10px', fontWeight: '700',
              color: C.secondary,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              Photobooth del martes
            </span>
          </div>

          {/* Title */}
          <div style={{
            fontSize: '46px', fontWeight: '800',
            color: C.onSurface, lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: '0 0 8px',
          }}>
            Martes con{' '}
            <span style={{ color: C.primary }}>Alegría</span>
          </div>

          {/* Subtitle */}
          <p style={{
            color: C.onSurfaceVariant,
            fontSize: '15px', fontWeight: '500',
            margin: 0,
          }}>
            Convivencia de los voluntarios del martes
          </p>
        </div>

        {/* Photo grid */}
        {count > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: '12px',
            marginBottom: '28px',
          }}>
            {displayed.map((photo, i) => (
              <div key={i} style={{
                borderRadius: '14px',
                overflow: 'hidden',
                aspectRatio,
                boxShadow: '0 4px 18px rgba(0,0,0,0.10)',
                position: 'relative',
                background: '#d9d9d9',
                border: '3px solid #ffffff',
              }}>
                {photo.dataUrl ? (
                  <img
                    src={photo.dataUrl}
                    alt={photo.uploader_name || 'Foto'}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover', display: 'block',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '32px',
                  }}>📷</div>
                )}
                {/* Name overlay */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.62) 0%, transparent 100%)',
                  padding: '20px 10px 8px',
                }}>
                  <span style={{
                    color: '#fff', fontSize: '11px', fontWeight: '700',
                    display: 'block',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {photo.uploader_name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Divider + footer */}
        <div style={{
          borderTop: `2px solid ${C.outlineVariant}`,
          paddingTop: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '7px',
        }}>
          <span style={{ fontSize: '16px' }}>✨</span>
          <span style={{
            color: C.onSurfaceVariant,
            fontSize: '13px',
            fontStyle: 'italic',
            fontWeight: '500',
          }}>
            Gracias por compartir este recuerdo
          </span>
        </div>
      </div>
    </div>
  )
})

export default PhotoboothExportCard
