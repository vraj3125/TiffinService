import { useEffect, useState } from 'react'
import { FileWarning, MapPin, ShieldCheck, ShieldX } from 'lucide-react'
import FilePreview from '../../components/ui/FilePreview.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { Textarea } from '../../components/ui/Input.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { STATUS, decideApplication } from '../../api/admin.js'
import { DEFAULT_RADIUS_KM } from '../../config/locations.js'

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

  useEffect(() => {
    setNote(application?.reviewNote || '')
  }, [application])

  if (!application) return null

  const a = application
  const decided = a.status === STATUS.approved || a.status === STATUS.rejected
  const missingDocs = (a.documents || []).filter((d) => !d.file)

  const decide = async (decision) => {
    if (decision === STATUS.rejected && !note.trim()) {
      showToast('Say what needs changing so they can fix it', 'info')
      return
    }
    setBusy(decision)
    try {
      const documents = (a.documents || []).map((d) =>
        d.file ? { ...d, status: decision === STATUS.approved ? 'verified' : 'rejected' } : d
      )
      const updated = await decideApplication(a.uid, decision, note.trim())
      onDecided({ ...updated, documents })
      showToast(
        decision === STATUS.approved
          ? `${a.kitchenName} approved — they can start taking orders.`
          : `Sent back to ${a.kitchenName} with your note.`
      )
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setBusy(null)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={a.kitchenName}
      footer={
        decided ? (
          <Button variant="ghost" onClick={onClose}>Close</Button>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={() => decide(STATUS.rejected)}
              disabled={Boolean(busy)}
              className="!border-error !text-error hover:!bg-error-container/30"
            >
              <ShieldX size={18} /> Request changes
            </Button>
            <Button onClick={() => decide(STATUS.approved)} disabled={Boolean(busy)}>
              <ShieldCheck size={18} /> Approve
            </Button>
          </>
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
          {decided ? (
            <div className="rounded-DEFAULT border border-outline-variant bg-surface-container-low p-4">
              <Badge tone={a.status === STATUS.approved ? 'success' : 'danger'}>
                {a.status === STATUS.approved ? 'Approved' : 'Changes requested'}
              </Badge>
              {a.reviewNote && (
                <p className="text-body-sm text-on-surface-variant mt-2">{a.reviewNote}</p>
              )}
            </div>
          ) : (
            <Textarea
              label="Note to the kitchen"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Required when requesting changes — say exactly what to fix."
            />
          )}
        </section>
      </div>
    </Modal>
  )
}
