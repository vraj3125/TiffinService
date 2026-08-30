import { useEffect, useState } from 'react'
import { AlertTriangle, FileWarning, History, MapPin, RotateCcw, ShieldCheck, ShieldX, Ban, PlayCircle, Pencil } from 'lucide-react'
import FilePreview from '../../components/ui/FilePreview.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { Textarea } from '../../components/ui/Input.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { ACTIONS, ACTION_META, STATUS, decideApplication, statusLabel } from '../../api/admin.js'
import { DEFAULT_RADIUS_KM } from '../../config/locations.js'

const ICONS = {
  approve: ShieldCheck, changes: ShieldX, decline: Ban,
  suspend: AlertTriangle, reinstate: PlayCircle, reopen: RotateCcw, editNote: Pencil,
}

const TOASTS = {
  approve: (n) => `${n} approved — they can start taking orders.`,
  changes: (n) => `Sent back to ${n} with your note.`,
  decline: (n) => `${n} declined. They cannot resubmit.`,
  suspend: (n) => `${n} suspended and removed from search.`,
  reinstate: (n) => `${n} reinstated and live again.`,
  reopen: (n) => `${n} is back in the review queue.`,
  editNote: (n) => `Note to ${n} updated.`,
}

// Wording for the actions that are hard to walk back.
const CONFIRM = {
  decline: {
    title: 'Decline this application?',
    body: 'The kitchen will be told it was declined and cannot resubmit. You can reopen it later if that turns out to be wrong.',
  },
  suspend: {
    title: 'Suspend this kitchen?',
    body: 'It comes out of search immediately and stops taking new subscriptions. Existing customers are not cancelled automatically.',
  },
  reinstate: {
    title: 'Reinstate this kitchen?',
    body: 'It goes back into search and can take subscriptions again.',
  },
}

const BUTTON_VARIANT = { primary: 'primary', warning: 'secondary', danger: 'secondary', secondary: 'ghost' }

const when = (iso) =>
  iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ''

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-6 py-2.5 border-b border-surface-variant/70 last:border-0">
    <span className="text-body-sm text-on-surface-variant shrink-0">{label}</span>
    <span className="text-body-sm text-on-surface text-right break-words">{value || '—'}</span>
  </div>
)

// Everything a reviewer needs on one screen: details, locations, the actual
// documents and the kitchen photos -- then a decision.
export default function ApplicationReview({ application, onClose, onDecided }) {
  const { showToast } = useToast()
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(null)
  // Destructive actions ask first -- see CONFIRM below for the wording.
  const [confirm, setConfirm] = useState(null)

  useEffect(() => {
    setNote(application?.reviewNote || '')
  }, [application])

  if (!application) return null

  const a = application
  const missingDocs = (a.documents || []).filter((d) => !d.file)
  const available = ACTIONS[a.status] || []

  const run = async (action) => {
    const meta = ACTION_META[action]
    if (meta.needsNote && !note.trim()) {
      showToast('Add a note explaining this decision', 'info')
      return
    }
    setBusy(action)
    try {
      // Documents follow the outcome so the kitchen's own screen matches.
      const documents = (a.documents || []).map((d) =>
        d.file
          ? { ...d, status: meta.to === STATUS.approved ? 'verified' : meta.to === STATUS.submitted ? 'pending' : 'rejected' }
          : d
      )
      const updated = await decideApplication(a.uid, action, note.trim())
      onDecided({ ...updated, documents })
      showToast(TOASTS[action] ? TOASTS[action](a.kitchenName) : `${meta.label} done.`)
      setConfirm(null)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setBusy(null)
    }
  }

  const trigger = (action) =>
    ACTION_META[action].confirm ? setConfirm(action) : run(action)

  // Second modal rather than window.confirm, so the wording can explain what
  // actually happens and the action stays cancellable.
  if (confirm) {
    const meta = ACTION_META[confirm]
    const copy = CONFIRM[confirm]
    return (
      <Modal
        open
        onClose={() => setConfirm(null)}
        title={copy.title}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(null)} disabled={Boolean(busy)}>
              Cancel
            </Button>
            <Button
              variant={meta.tone === 'danger' ? 'danger' : 'primary'}
              onClick={() => run(confirm)}
              disabled={Boolean(busy)}
            >
              {meta.label}
            </Button>
          </>
        }
      >
        <p className="text-body-md text-on-surface-variant mb-4">{copy.body}</p>
        <p className="text-body-sm text-on-surface">
          Kitchen: <span className="font-semibold">{a.kitchenName}</span>
        </p>
        {note.trim() && (
          <div className="mt-4 rounded-DEFAULT border border-outline-variant bg-surface-container-low p-3">
            <p className="text-label-md text-on-surface-variant mb-1">They will be told</p>
            <p className="text-body-sm text-on-surface-variant">{note.trim()}</p>
          </div>
        )}
      </Modal>
    )
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={a.kitchenName}
      footer={
        available.length === 0 ? (
          <Button variant="ghost" onClick={onClose}>Close</Button>
        ) : (
          <div className="flex flex-wrap justify-end gap-2">
            {available.map((action) => {
              const meta = ACTION_META[action]
              const Icon = ICONS[action]
              return (
                <Button
                  key={action}
                  size="sm"
                  variant={BUTTON_VARIANT[meta.tone]}
                  onClick={() => trigger(action)}
                  disabled={Boolean(busy)}
                  className={meta.tone === 'danger' ? '!border-error !text-error hover:!bg-error-container/30' : ''}
                >
                  <Icon size={16} /> {meta.label}
                </Button>
              )
            })}
          </div>
        )
      }
    >
      <div className="space-y-6">
        <section>
          <h4 className="text-label-md uppercase tracking-[0.14em] text-terracotta mb-2">Business</h4>
          <Row label="Owner" value={a.owner} />
          <Row label="Phone" value={a.phone} />
          <Row label="FSSAI licence" value={a.fssai} />
          <Row label="Address" value={a.address} />
        </section>

        <section>
          <h4 className="text-label-md uppercase tracking-[0.14em] text-terracotta mb-2">
            Locations ({a.branches?.length || 0})
          </h4>
          <div className="space-y-2">
            {(a.branches || []).map((b) => (
              <div
                key={b.id || b.area}
                className="flex items-start gap-2.5 rounded-DEFAULT border border-outline-variant p-3"
              >
                <MapPin size={16} className="text-terracotta shrink-0 mt-0.5" />
                <div>
                  <p className="text-label-lg text-on-surface">{b.label || b.area}</p>
                  <p className="text-body-sm text-on-surface-variant">
                    {b.area}
                    {b.pincode ? ` — ${b.pincode}` : ''} · delivers up to{' '}
                    {b.radiusKm ?? DEFAULT_RADIUS_KM} km
                  </p>
                  {b.address && <p className="text-body-sm text-outline">{b.address}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-label-md uppercase tracking-[0.14em] text-terracotta mb-2">
            Documents
          </h4>
          <div className="space-y-2">
            {(a.documents || []).map((d) =>
              d.file ? (
                <FilePreview key={d.id} file={d.file} label={d.name} />
              ) : (
                <div
                  key={d.id}
                  className="flex items-center gap-2.5 rounded-DEFAULT border border-error/40 bg-error-container/20 p-3"
                >
                  <FileWarning size={16} className="text-error shrink-0" />
                  <div>
                    <p className="text-label-lg text-on-surface">{d.name}</p>
                    <p className="text-body-sm text-on-surface-variant">Not supplied</p>
                  </div>
                </div>
              )
            )}
          </div>
          {missingDocs.length > 0 && (
            <p className="text-body-sm text-error mt-2">
              {missingDocs.length} document{missingDocs.length > 1 ? 's' : ''} missing.
            </p>
          )}
        </section>

        {a.photos?.length > 0 && (
          <section>
            <h4 className="text-label-md uppercase tracking-[0.14em] text-terracotta mb-2">
              Kitchen photos ({a.photos.length})
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {a.photos.map((p) => (
                <img
                  key={p.id}
                  src={p.src}
                  alt={p.name || 'Kitchen'}
                  className="w-full h-24 object-cover rounded-lg border border-outline-variant"
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="rounded-DEFAULT border border-outline-variant bg-surface-container-low p-4 mb-4">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-label-md text-on-surface-variant">Current status</span>
              <Badge
                tone={
                  a.status === STATUS.approved ? 'success'
                    : a.status === STATUS.declined || a.status === STATUS.suspended ? 'danger'
                    : 'pending'
                }
              >
                {statusLabel[a.status]}
              </Badge>
            </div>
            {a.reviewNote && (
              <p className="text-body-sm text-on-surface-variant mt-2">{a.reviewNote}</p>
            )}
          </div>

          {available.some((x) => ACTION_META[x].needsNote) && (
            <Textarea
              label="Note to the kitchen"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Required when requesting changes, declining or suspending — say exactly what is wrong."
            />
          )}
        </section>

        {(a.history || []).length > 0 && (
          <section>
            <h4 className="text-label-md uppercase tracking-[0.14em] text-terracotta mb-3 flex items-center gap-1.5">
              <History size={13} /> Decision history
            </h4>
            <ol className="space-y-3 border-l border-outline-variant/70 ml-1.5">
              {[...a.history].reverse().map((h, i) => (
                <li key={h.at + i} className="relative pl-5">
                  <span className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-outline-variant" />
                  <p className="text-body-sm text-on-surface">
                    {h.label} <span className="text-outline">· {h.by}</span>
                  </p>
                  <p className="text-body-sm text-outline">{when(h.at)}</p>
                  {h.note && (
                    <p className="text-body-sm text-on-surface-variant mt-1 italic">&ldquo;{h.note}&rdquo;</p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </Modal>
  )
}
