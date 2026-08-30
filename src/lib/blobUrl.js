// Data URLs cannot be opened in a tab.
//
// Browsers block top-level navigation to `data:` URLs -- it was a phishing
// vector -- so a link straight to one downloads the file instead of showing it.
// Blob URLs have no such restriction, so PDFs open in the browser's own viewer
// and images render normally.
//
// Every URL made here must be revoked when the component using it unmounts, or
// the blob stays in memory for the life of the page.

export function dataUrlToBlob(dataUrl) {
  const [header, encoded] = String(dataUrl).split(',')
  if (!encoded) throw new Error('Not a data URL')

  const type = header.match(/data:([^;]+)/)?.[1] || 'application/octet-stream'

  if (!header.includes(';base64')) {
    return new Blob([decodeURIComponent(encoded)], { type })
  }

  const binary = atob(encoded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type })
}

export function dataUrlToObjectUrl(dataUrl) {
  try {
    return URL.createObjectURL(dataUrlToBlob(dataUrl))
  } catch {
    return null
  }
}

export const isPdf = (file) => file?.type === 'application/pdf'
export const isImage = (file) => String(file?.type || '').startsWith('image/')

export const prettySize = (bytes) => {
  if (!bytes) return ''
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
