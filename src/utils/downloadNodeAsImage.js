import { toPng } from 'html-to-image'

export async function downloadNodeAsImage(node, filename = 'imagen.png') {
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
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
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('FileReader error'))
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}
