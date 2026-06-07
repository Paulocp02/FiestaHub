const C = {
  primary:           '#ab3500',
  secondary:         '#384dd0',
  secondaryFixed:    '#dfe0ff',
  tertiary:          '#3b6a00',
  tertiaryContainer: '#62ac00',
  tertiaryFixed:     '#9ffa41',
  onSurface:         '#1a1c1e',
  onSurfaceVariant:  '#594139',
}

// Same palette as StickerCard STICKER_CONFIGS
const PALETTE = [
  { bg: '#ff6b35', text: '#ffffff',  muted: 'rgba(255,255,255,0.82)' },
  { bg: '#5367ea', text: '#fffbff',  muted: 'rgba(255,251,255,0.82)' },
  { bg: '#dfe0ff', text: '#000e5f',  muted: 'rgba(0,14,95,0.75)'     },
  { bg: '#62ac00', text: '#1d3900',  muted: 'rgba(29,57,0,0.80)'     },
  { bg: '#e2e2e5', text: '#1a1c1e',  muted: 'rgba(26,28,30,0.72)'    },
  { bg: '#ffdbd0', text: '#390c00',  muted: 'rgba(57,12,0,0.78)'     },
]

const RECIPIENT = {
  all:       { label: 'Para todos',       emoji: '🙌' },
  specific:  { label: 'Mensaje especial', emoji: '💛' },
  anonymous: { label: 'Anónimo',          emoji: '🎭' },
}

function recipientLine(msg) {
  if (msg.recipient_type === 'specific' && msg.recipient_name) return `Para: ${msg.recipient_name}`
  return RECIPIENT[msg.recipient_type]?.label ?? 'Mensaje'
}

function senderLine(msg) {
  return msg.recipient_type === 'anonymous' ? 'Anónimo' : msg.sender_name
}

function clip(text, max = 185) {
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}

export default function MessageWallExportCard({ messages }) {
  const displayed = (messages ?? []).slice(0, 6)

  return (
    <div style={{
      width: '100%',
      position: 'relative',
      background: 'linear-gradient(160deg, #eef2ff 0%, #f9f9fc 42%, #f0fdf4 100%)',
      fontFamily: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      {/* Top accent stripe */}
      <div style={{
        height: '7px',
        background: `linear-gradient(90deg, ${C.secondary}, ${C.tertiaryContainer}, ${C.tertiary})`,
      }} />

      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: 24, right: 28, width: 110, height: 110, background: C.secondaryFixed, borderRadius: '50%', opacity: 0.6  }} />
      <div style={{ position: 'absolute', top: 70, right: 105, width: 55, height: 55, background: C.tertiaryFixed,  borderRadius: '50%', opacity: 0.4  }} />
      <div style={{ position: 'absolute', bottom: 28, left: 28, width: 90, height: 90, background: '#dfe0ff',       borderRadius: '50%', opacity: 0.5  }} />

      <div style={{ padding: '36px 56px 44px', position: 'relative' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 64, height: 64,
            background: C.secondaryFixed, borderRadius: 18,
            fontSize: 30, marginBottom: 14,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}>💬</div>

          <div style={{ marginBottom: 10 }}>
            <span style={{
              display: 'inline-flex', gap: 5,
              background: C.secondaryFixed, borderRadius: 999,
              padding: '4px 16px',
              fontSize: 11, fontWeight: 700, color: C.secondary,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Muro de mensajes · En tiempo real
            </span>
          </div>

          <div style={{
            fontSize: 46, fontWeight: 800, color: C.onSurface,
            lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 8px',
          }}>
            Mensajes de{' '}
            <span style={{ color: C.secondary }}>Agradecimiento</span>
          </div>

          <p style={{ color: C.onSurfaceVariant, fontSize: 15, fontWeight: 500, margin: 0 }}>
            Mensajes de agradecimiento y cariño
          </p>
        </div>

        {/* ── Message cards ── */}
        {displayed.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 14,
            marginBottom: 28,
          }}>
            {displayed.map((msg, i) => {
              const pal = PALETTE[i % PALETTE.length]
              const rec = RECIPIENT[msg.recipient_type] ?? { emoji: '✨' }
              return (
                <div key={i} style={{
                  background: pal.bg, borderRadius: 16,
                  padding: '16px 18px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  minHeight: 130,
                  boxShadow: '0 3px 12px rgba(0,0,0,0.09)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: pal.muted,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      maxWidth: '80%', lineHeight: 1.3,
                    }}>
                      {recipientLine(msg)}
                    </span>
                    <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginLeft: 6 }}>
                      {rec.emoji}
                    </span>
                  </div>

                  <p style={{
                    color: pal.text, fontSize: 13, lineHeight: 1.6,
                    margin: '0 0 10px', flex: 1, wordBreak: 'break-word',
                  }}>
                    {clip(msg.message)}
                  </p>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: pal.muted }}>
                      — {senderLine(msg)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{
          borderTop: `2px solid ${C.secondaryFixed}`, paddingTop: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>💛</span>
          <span style={{ color: C.onSurfaceVariant, fontSize: 13, fontStyle: 'italic', fontWeight: 500 }}>
            Martes con Alegría — Recuerdos y gratitud compartida
          </span>
        </div>
      </div>
    </div>
  )
}
