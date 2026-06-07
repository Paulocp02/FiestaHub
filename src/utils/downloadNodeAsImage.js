import { toPng } from 'html-to-image'

async function waitForImages(node) {
  const imgs = Array.from(node.querySelectorAll('img'))
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve()
      return new Promise((resolve) => {
        img.onload  = resolve
        img.onerror = resolve // resolve even on error so we don't block
      })
    })
  )
}

export async function downloadNodeAsImage(node, filename = 'imagen.png') {
  if (!node) throw new Error('El nodo de exportación no está disponible.')

  // Wait for custom fonts (Plus Jakarta Sans / Inter)
  if (document.fonts?.ready) await document.fonts.ready

  // Wait for every <img> inside the node to finish loading
  await waitForImages(node)

  // Extra frame for the browser to finish compositing
  await new Promise((r) => setTimeout(r, 150))

  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#f9f9fc',
  })

  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function fetchAsDataUrl(url) {
  try {
    const res = await fetch(url, { mode: 'cors' })
    const blob = await res.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload  = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('FileReader error'))
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}
