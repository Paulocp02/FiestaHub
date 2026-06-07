// M3 hex tokens from tailwind.config.js
const C = {
  primary:          '#ab3500',
  primaryContainer: '#ff6b35',
  primaryFixed:     '#ffdbd0',
  secondary:        '#384dd0',
  secondaryFixed:   '#dfe0ff',
  tertiary:         '#3b6a00',
  tertiaryFixed:    '#9ffa41',
  onSurface:        '#1a1c1e',
  onSurfaceVariant: '#594139',
  outlineVariant:   '#e1bfb5',
}

function gridCols(count) {
  if (count <= 2) return count || 1
  if (count === 4) return 2
  return 3
}

export default function PhotoboothExportCard({ photos }) {
  const displayed = (photos ?? []).slice(0, 6)
  const count     = displayed.length
  const cols      = gridCols(count)
  const aspect    = count === 1 ? '16 / 9' : '1 / 1'

  return (
    <div style={{
      width: '100%',
      position: 'relative',
      background: 'linear-gradient(160deg, #fff8f6 0%, #f9f9fc 48%, #eff2ff 100%)',
      fontFamily: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      {/* Top accent stripe */}
      <div style={{
        height: '7px',
        background: `linear-gradient(90deg, ${C.primary}, ${C.primaryContainer}, ${C.secondary})`,
      }} />

      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: 24,  right: 24, width: 120, height: 120, background: C.primaryFixed,  borderRadius: '50%', opacity: 0.55 }} />
      <div style={{ position: 'absolute', top: 60,  right: 90, width:  60, height:  60, background: C.secondaryFixed, borderRadius: '50%', opacity: 0.4  }} />
      <div style={{ position: 'absolute', bottom: 24, left: 24, width: 100, height: 100, background: C.secondaryFixed, borderRadius: '50%', opacity: 0.45 }} />
      <div style={{ position: 'absolute', bottom: 60, left: 90, width:  50, height:  50, background: C.tertiaryFixed, borderRadius: '50%', opacity: 0.3  }} />

      <div style={{ padding: '36px 56px 44px', position: 'relative' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 64, height: 64,
            background: C.secondaryFixed, borderRadius: 18,
            fontSize: 30, marginBottom: 14,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}>📸</div>

          <div style={{ marginBottom: 10 }}>
            <span style={{
              display: 'inline-flex', gap: 5,
              background: C.secondaryFixed, borderRadius: 999,
              padding: '4px 16px',
              fontSize: 11, fontWeight: 700, color: C.secondary,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Photobooth del martes
            </span>
          </div>

          <div style={{
            fontSize: 48, fontWeight: 800, color: C.onSurface,
            lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 8px',
          }}>
            Martes con{' '}
            <span style={{ color: C.primary }}>Alegría</span>
          </div>

          <p style={{ color: C.onSurfaceVariant, fontSize: 15, fontWeight: 500, margin: 0 }}>
            Convivencia de los voluntarios del martes
          </p>
        </div>

        {/* ── Photo grid ── */}
        {count > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 14,
            marginBottom: 28,
          }}>
            {displayed.map((photo, i) => (
              <div key={i} style={{
                borderRadius: 14, overflow: 'hidden', aspectRatio: aspect,
                boxShadow: '0 4px 18px rgba(0,0,0,0.10)',
                position: 'relative',
                background: '#d9d9d9',
                border: '3px solid #ffffff',
              }}>
                {photo.dataUrl
                  ? <img
                      src={photo.dataUrl}
                      alt={photo.uploader_name || 'Foto'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>📷</div>
                }
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.62) 0%, transparent 100%)',
                  padding: '22px 12px 8px',
                }}>
                  <span style={{
                    color: '#fff', fontSize: 11, fontWeight: 700,
                    display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {photo.uploader_name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{
          borderTop: `2px solid ${C.outlineVariant}`, paddingTop: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>✨</span>
          <span style={{ color: C.onSurfaceVariant, fontSize: 13, fontStyle: 'italic', fontWeight: 500 }}>
            Gracias por compartir este recuerdo
          </span>
        </div>
      </div>
    </div>
  )
}
