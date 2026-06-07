import { forwardRef } from 'react'

const C = {
  primary:          '#ab3500',
  secondary:        '#384dd0',
  secondaryFixed:   '#dfe0ff',
  tertiary:         '#3b6a00',
  tertiaryContainer:'#62ac00',
  tertiaryFixed:    '#9ffa41',
  surface:          '#f9f9fc',
  onSurface:        '#1a1c1e',
  onSurfaceVariant: '#594139',
  outlineVariant:   '#e1bfb5',
}

// Same palette as STICKER_CONFIGS, converted to hex
const CARD_PALETTE = [
  { bg: '#ff6b35', text: '#ffffff',  label: 'rgba(255,255,255,0.8)' },
  { bg: '#5367ea', text: '#fffbff',  label: 'rgba(255,251,255,0.8)' },
  { bg: '#dfe0ff', text: '#000e5f',  label: 'rgba(0,14,95,0.75)'   },
  { bg: '#62ac00', text: '#1d3900',  label: 'rgba(29,57,0,0.8)'    },
  { bg: '#e2e2e5', text: '#1a1c1e',  label: 'rgba(26,28,30,0.75)'  },
  { bg: '#ffdbd0', text: '#390c00',  label: 'rgba(57,12,0,0.75)'   },
]

const RECIPIENT = {
  all:       { label: 'Para todos',      emoji: '🙌' },
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

function clip(text, max = 180) {
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}

const MessageWallExportCard = forwardRef(function MessageWallExportCard({ messages }, ref) {
  const displayed = (messages ?? []).slice(0, 6)

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '900px',
        background: 'linear-gradient(160deg, #eef2ff 0%, #f9f9fc 42%, #f0fdf4 100%)',
        fontFamily: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Top gradient stripe */}
      <div style={{
        height: '7px',
        background: `linear-gradient(90deg, ${C.secondary}, ${C.tertiaryContainer}, ${C.tertiary})`,
      }} />

      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: '24px', right: '28px',
        width: '110px', height: '110px',
        background: C.secondaryFixed,
        borderRadius: '50%', opacity: 0.55,
      }} />
      <div style={{
        position: 'absolute', top: '70px', right: '100px',
        width: '55px', height: '55px',
        background: C.tertiaryFixed,
        borderRadius: '50%', opacity: 0.4,
      }} />
      <div style={{
        position: 'absolute', bottom: '28px', left: '28px',
        width: '90px', height: '90px',
        background: '#dfe0ff',
        borderRadius: '50%', opacity: 0.5,
      }} />

      <div style={{ padding: '36px 48px 44px', position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '60px', height: '60px',
            background: C.secondaryFixed,
            borderRadius: '18px',
            fontSize: '28px',
            marginBottom: '14px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}>
            💬
          </div>

          <div style={{ marginBottom: '10px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              background: C.secondaryFixed,
              borderRadius: '999px',
              padding: '4px 14px',
              fontSize: '10px', fontWeight: '700',
              color: C.secondary,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Muro de mensajes · En tiempo real
            </span>
          </div>

          <div style={{
            fontSize: '44px', fontWeight: '800',
            color: C.onSurface, lineHeight: 1.1,
            letterSpacing: '-0.02em', margin: '0 0 8px',
          }}>
            Mensajes de{' '}
            <span style={{ color: C.secondary }}>Agradecimiento</span>
          </div>

          <p style={{
            color: C.onSurfaceVariant,
            fontSize: '15px', fontWeight: '500', margin: 0,
          }}>
            Mensajes de agradecimiento y cariño
          </p>
        </div>

        {/* Message cards */}
        {displayed.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px',
            marginBottom: '28px',
          }}>
            {displayed.map((msg, i) => {
              const pal = CARD_PALETTE[i % CARD_PALETTE.length]
              const rec = RECIPIENT[msg.recipient_type] ?? { emoji: '✨' }
              return (
                <div key={i} style={{
                  background: pal.bg,
                  borderRadius: '16px',
                  padding: '16px 18px',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '130px',
                  boxShadow: '0 3px 12px rgba(0,0,0,0.09)',
                }}>
                  {/* Top row: recipient + emoji */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: '8px',
                  }}>
                    <span style={{
                      fontSize: '10px', fontWeight: '700',
                      color: pal.label,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      maxWidth: '80%', lineHeight: 1.3,
                    }}>
                      {recipientLine(msg)}
                    </span>
                    <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginLeft: '6px' }}>
                      {rec.emoji}
                    </span>
                  </div>

                  {/* Message text */}
                  <p style={{
                    color: pal.text, fontSize: '13px', lineHeight: 1.55,
                    margin: '0 0 10px', flex: 1, wordBreak: 'break-word',
                  }}>
                    {clip(msg.message)}
                  </p>

                  {/* Sender */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '10px', fontWeight: '700',
                      color: pal.label,
                    }}>
                      — {senderLine(msg)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div style={{
          borderTop: `2px solid ${C.secondaryFixed}`,
          paddingTop: '18px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '7px',
        }}>
          <span style={{ fontSize: '16px' }}>💛</span>
          <span style={{
            color: C.onSurfaceVariant, fontSize: '13px',
            fontStyle: 'italic', fontWeight: '500',
          }}>
            Martes con Alegría — Recuerdos y gratitud compartida
          </span>
        </div>
      </div>
    </div>
  )
})

export default MessageWallExportCard
