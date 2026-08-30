import { useEffect, useMemo, useState } from 'react'
import { Download, ExternalLink, Eye, EyeOff, FileText, ImageIcon } from 'lucide-react'
import { dataUrlToObjectUrl, isImage, isPdf, prettySize } from '../../lib/blobUrl.js'

/**
 * One uploaded document: preview it in place, open it in a tab, or download it.
 *
 * Preview is the default action because a reviewer usually just needs to glance
 * at a licence -- opening tabs for three documents to approve one kitchen is
 * the slow path, not the fast one.
 */
export default function FilePreview({ file, label, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  // Built once per file and revoked on unmount, or the blob leaks.
  const url = useMemo(() => (file?.src ? dataUrlToObjectUrl(file.src) : null), [file?.src])
  useEffect(() => () => url && URL.revokeObjectURL(url), [url])

  if (!file) return null

  const image = isImage(file)
  const pdf = isPdf(file)
  const Icon = image ? ImageIcon : FileText

  return (
    <div className="rounded-DEFAULT border border-outline-variant overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon size={16} className="text-terracotta shrink-0" />
          <div className="min-w-0">
            <p className="text-label-lg text-on-surface truncate">{label || file.name}</p>
            <p className="text-body-sm text-on-surface-variant truncate">
              {file.name}
              {prettySize(file.size) ? ` · ${prettySize(file.size)}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="p-2 rounded-full text-on-surface-variant hover:text-terracotta hover:bg-surface-container-low transition-colors"
            title={open ? 'Hide preview' : 'Preview here'}
            aria-label={open ? 'Hide preview' : 'Preview here'}
          >
            {open ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          {/* A blob URL can be navigated to; the original data: URL cannot. */}
          <a
            href={url || undefined}
            target="_blank"
            rel="noreferrer noopener"
            className="p-2 rounded-full text-on-surface-variant hover:text-terracotta hover:bg-surface-container-low transition-colors"
            title="Open in a new tab"
            aria-label="Open in a new tab"
          >
            <ExternalLink size={16} />
          </a>

          <a
            href={url || undefined}
            download={file.name || 'document'}
            className="p-2 rounded-full text-on-surface-variant hover:text-terracotta hover:bg-surface-container-low transition-colors"
            title="Download"
            aria-label="Download"
          >
            <Download size={16} />
          </a>
        </div>
      </div>

      {open && (
        <div className="border-t border-outline-variant bg-surface-container-low">
          {!url ? (
            <p className="p-4 text-body-sm text-on-surface-variant">
              This file could not be read. Ask for it to be uploaded again.
            </p>
          ) : image ? (
            <img
              src={url}
              alt={label || file.name}
              className="w-full max-h-[420px] object-contain bg-surface"
            />
          ) : pdf ? (
            <iframe
              src={url}
              title={label || file.name}
              className="w-full h-[460px] bg-surface"
            />
          ) : (
            <p className="p-4 text-body-sm text-on-surface-variant">
              No inline preview for this file type — open it in a tab or download it.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
