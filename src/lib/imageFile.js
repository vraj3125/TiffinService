// Turning a picked file into something we can actually keep.
//
// Photos are held per account in localStorage, which is a ~5 MB budget shared
// with everything else, and base64 inflates bytes by about a third. A phone
// photo straight off the camera is 3-6 MB, so storing the raw file would blow
// the quota on the first upload. Everything here is about getting a usable
// image down to a size that fits.
//
// When there is a real backend, replace this with an upload and keep the URL.

export const MAX_PHOTOS = 6
const MAX_EDGE = 900 // px on the longest side
const QUALITY = 0.72
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_INPUT_BYTES = 12 * 1024 * 1024

export function describeFileError(file) {
  if (!ACCEPTED.includes(file.type)) return `${file.name} is not a JPEG, PNG or WebP image.`
  if (file.size > MAX_INPUT_BYTES) return `${file.name} is larger than 12 MB.`
  return null
}

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('read-failed'))
    reader.readAsDataURL(file)
  })

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('decode-failed'))
    img.src = src
  })

/**
 * Read an image file, scale its longest edge down to MAX_EDGE and re-encode as
 * JPEG. Returns a data URL, or throws with a message worth showing.
 */
export async function compressImage(file) {
  const problem = describeFileError(file)
  if (problem) throw new Error(problem)

  const dataUrl = await readAsDataUrl(file)
  const img = await loadImage(dataUrl)

  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height))
  const width = Math.round(img.width * scale)
  const height = Math.round(img.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  // White ground so a transparent PNG does not turn black once it is JPEG.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)

  return canvas.toDataURL('image/jpeg', QUALITY)
}

export const approxKb = (dataUrl) => Math.round((dataUrl.length * 3) / 4 / 1024)

// --- verification documents -------------------------------------------------
//
// Documents may be a photo of a certificate or a PDF. Images go through the
// same downscale as kitchen photos; PDFs are kept as-is but capped, because a
// data URL in localStorage is the only place to put them until there is a
// backend to upload to.

const DOC_TYPES = [...ACCEPTED, 'application/pdf']
const MAX_PDF_BYTES = 1.5 * 1024 * 1024

export async function readDocument(file) {
  if (!DOC_TYPES.includes(file.type)) {
    throw new Error(`${file.name} must be a PDF, JPEG, PNG or WebP.`)
  }

  if (file.type === 'application/pdf') {
    if (file.size > MAX_PDF_BYTES) {
      throw new Error(`${file.name} is over 1.5 MB. Compress the PDF or upload a photo instead.`)
    }
    return { name: file.name, type: file.type, size: file.size, src: await readAsDataUrl(file) }
  }

  const src = await compressImage(file)
  return { name: file.name, type: 'image/jpeg', size: Math.round((src.length * 3) / 4), src }
}
