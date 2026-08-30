import { useEffect, useState } from 'react'
import {
  ShieldCheck,
  Clock,
  UploadCloud,
  FileCheck2,
  MapPin,
  Trash2,
  Store,
  CheckCircle2,
  Circle,
  CircleDot,
  Loader2,
  ArrowRight,
  Eye,
  X,
} from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { Input, Textarea } from '../../components/ui/Input.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import {
  fetchBranches,
  fetchKitchenPhotos,
  fetchKitchenProfile,
  fetchVerificationDocs,
  newBranch,
  saveBranches,
  saveKitchenPhotos,
  saveKitchenProfile,
  saveVerificationDocs,
} from '../../api/provider.js'
import LocationPicker from '../../components/ui/LocationPicker.jsx'
import { MAX_PHOTOS, compressImage, readDocument } from '../../lib/imageFile.js'
import FilePreview from '../../components/ui/FilePreview.jsx'
import { STATUS, getApplication, submitApplication, statusLabel } from '../../api/admin.js'
import { CITY, DEFAULT_RADIUS_KM, MAX_RADIUS_KM } from '../../config/locations.js'
import { useToast } from '../../context/ToastContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function VerificationPage() {
  const { user } = useAuth()
  const [docs, setDocs] = useState(null)
  const [profile, setProfile] = useState(null)
  const [branches, setBranches] = useState(null)
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  // What is actually persisted, as opposed to what is being typed. The
  // checklist reads this so a half-typed field never counts as done.
  const [saved, setSaved] = useState(null)
  const [application, setApplication] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  // This kitchen's own paperwork -- nothing is pre-filled or pre-verified.
  useEffect(() => {
    if (!user) return
    fetchVerificationDocs(user.uid).then(setDocs)
    fetchKitchenProfile(user.uid).then((p) => {
      const withName = { ...p, name: p.name || user.name || '' }
      setProfile(withName)
      setSaved(p)
    })
    getApplication(user.uid).then(setApplication)
    fetchBranches(user.uid).then(setBranches)
    fetchKitchenPhotos(user.uid).then(setPhotos)
  }, [user])

  // Real files off the user's device, downscaled before they are stored.
  const onPickPhotos = async (e) => {
    const picked = Array.from(e.target.files || [])
    e.target.value = '' // let the same file be re-picked after a removal
    if (!picked.length) return

    const room = MAX_PHOTOS - photos.length
    if (room <= 0) {
      showToast(`You can keep up to ${MAX_PHOTOS} photos. Remove one first.`, 'info')
      return
    }
    if (picked.length > room) {
      showToast(`Only the first ${room} of those were added — ${MAX_PHOTOS} photos maximum.`, 'info')
    }

    setUploading(true)
    const added = []
    for (const file of picked.slice(0, room)) {
      try {
        added.push({ id: `ph${Date.now()}${added.length}`, name: file.name, src: await compressImage(file) })
      } catch (err) {
        showToast(err.message, 'error')
      }
    }

    if (added.length) {
      const next = [...photos, ...added]
      try {
        await saveKitchenPhotos(user.uid, next)
        setPhotos(next)
        showToast(`${added.length} photo${added.length > 1 ? 's' : ''} added`)
      } catch (err) {
        showToast(err.message, 'error')
      }
    }
    setUploading(false)
  }

  const removePhoto = async (id) => {
    const next = photos.filter((p) => p.id !== id)
    setPhotos(next)
    await saveKitchenPhotos(user.uid, next).catch(() => {})
    showToast('Photo removed')
  }

  const commitBranches = (next) => {
    setBranches(next)
    saveBranches(user.uid, next)
  }

  const addBranch = (place) => {
    if (!place?.name) return
    if (branches.some((b) => b.area === place.name)) {
      showToast(`You already have a kitchen in ${place.name}`, 'info')
      return
    }
    commitBranches([
      ...branches,
      newBranch(place, branches.length === 0 ? 'Main kitchen' : place.name),
    ])
    showToast(`${place.name} added as a kitchen location`)
  }

  const updateBranch = (id, patch) =>
    commitBranches(branches.map((b) => (b.id === id ? { ...b, ...patch } : b)))

  const removeBranch = (id) => {
    commitBranches(branches.filter((b) => b.id !== id))
    showToast('Kitchen location removed')
  }

  const overallStatus = docs?.every((d) => d.status === 'verified')
    ? 'verified'
    : docs?.some((d) => d.status !== 'missing')
      ? 'pending'
      : 'missing'

  // Real files off the device. An upload sets the document to 'pending' -- only
  // an admin decision can make it 'verified'.
  const onPickDoc = (id) => async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploading(true)
    try {
      const stored = await readDocument(file)
      const next = docs.map((d) =>
        d.id === id
          ? { ...d, status: 'pending', file: stored, uploadedAt: new Date().toISOString() }
          : d
      )
      await saveVerificationDocs(user.uid, next)
      setDocs(next)
      showToast(`${file.name} uploaded — pending review`)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  const removeDoc = async (id) => {
    const next = docs.map((d) => (d.id === id ? { ...d, status: 'missing', file: null } : d))
    try {
      await saveVerificationDocs(user.uid, next)
      setDocs(next)
      showToast('Document removed')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const field = (key) => (e) => setProfile({ ...profile, [key]: e.target.value })

  const reviewed = application?.status === STATUS.approved
  const awaiting = application?.status === STATUS.submitted
  const rejected = application?.status === STATUS.rejected

  // done  -> saved on the account, ready to submit
  // state -> what the badge says: 'todo' | 'saved' | 'review' | 'verified'
  const stateOf = (done) =>
    !done ? 'todo' : reviewed ? 'verified' : awaiting ? 'review' : 'saved'

  const checklist = [
    {
      label: 'Business and owner name',
      done: Boolean(saved?.name && saved?.owner),
      hint: 'Fill in Business Details and press Save.',
    },
    {
      label: 'FSSAI licence number',
      done: Boolean(saved?.fssai),
      hint: 'The 14-digit number on your registration certificate.',
    },
    {
      label: 'Contact phone',
      done: Boolean(saved?.phone),
      hint: 'How we and your customers reach the kitchen.',
    },
    {
      label: 'At least one kitchen location',
      done: Boolean(branches?.length),
      hint: 'Add the area you cook in, below.',
    },
    {
      label: 'Documents uploaded',
      done: Boolean(docs?.length && docs.every((d) => d.status !== 'missing')),
      hint: 'Licence, kitchen photos and ID proof.',
    },
  ].map((item) => ({ ...item, state: stateOf(item.done) }))

  const done = checklist.filter((c) => c.done).length
  const remaining = checklist.length - done

  // Sending the application copies it into the shared review queue. Nothing is
  // marked verified here -- only an admin decision does that.
  const submitForReview = async () => {
    if (remaining > 0) {
      showToast('Finish the outstanding items first', 'info')
      return
    }
    setSubmitting(true)
    try {
      const entry = await submitApplication(user.uid, {
        kitchenName: saved.name,
        owner: saved.owner,
        fssai: saved.fssai,
        phone: saved.phone,
        address: saved.address,
        branches,
        documents: docs,
        photos,
      })
      setApplication(entry)
      showToast('Sent for verification. We review new kitchens within 24-48 hours.')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const saveBusiness = async (e) => {
    e.preventDefault()
    await saveKitchenProfile(user.uid, profile)
    setSaved(profile)
    showToast('Business details saved')
  }

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
        <div>
          <h1 className="text-headline-lg text-on-surface">Business Profile & Verification</h1>
          <p className="text-body-md text-on-surface-variant">Keep your details accurate — verified providers get more orders.</p>
        </div>
        {docs && (
          <Badge tone={overallStatus === 'verified' ? 'verified' : 'pending'} icon={overallStatus === 'verified' ? ShieldCheck : Clock}>
            {overallStatus === 'verified'
              ? 'Verified'
              : overallStatus === 'pending'
                ? 'Verification Pending'
                : 'Not Submitted'}
          </Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-gutter items-start">
        {/* Details and locations carry the weight; documents sit alongside
            rather than under, so the right-hand column is never empty. */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6">
            <h3 className="text-headline-md text-on-surface mb-4">Business Details</h3>
            {!profile ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <form onSubmit={saveBusiness} className="space-y-4">
                <Input label="Business name" value={profile.name} onChange={field('name')} placeholder="e.g. Narushi Kitchen" />
                <Input label="Owner name" value={profile.owner || ''} onChange={field('owner')} placeholder="Your full name" />
                <Input label="FSSAI license number" value={profile.fssai} onChange={field('fssai')} placeholder="14-digit licence number" />
                <Textarea label="Kitchen address" rows={2} value={profile.address || ''} onChange={field('address')} placeholder="Street, area, city, pincode" />
                <Input label="Contact phone" value={profile.phone} onChange={field('phone')} placeholder="+91 98765 43210" />
                <Button type="submit">Save Details</Button>
              </form>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
              <h3 className="text-headline-md text-on-surface flex items-center gap-2">
                <Store size={20} className="text-terracotta" /> Kitchen Locations
              </h3>
              {branches?.length > 1 && (
                <Badge tone="info">{branches.length} branches</Badge>
              )}
            </div>
            <p className="text-body-sm text-on-surface-variant mb-5">
              Add every place you cook from. Each branch has its own delivery radius, and a customer
              sees you if any one of them reaches their address.
            </p>

            {!branches ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <>
                {branches.length === 0 && (
                  <p className="text-body-sm text-on-surface-variant mb-4">
                    No kitchen locations yet. Add the area you cook in to start taking orders.
                  </p>
                )}

                <div className="space-y-4 mb-6">
                  {branches.map((b, i) => (
                    <div key={b.id} className="rounded-DEFAULT border border-outline-variant p-5">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-start gap-2.5">
                          <MapPin size={18} className="text-terracotta shrink-0 mt-1" />
                          <div>
                            <p className="text-label-lg text-on-surface">
                              {b.area}
                              {b.pincode ? ` — ${b.pincode}` : ''}
                            </p>
                            <p className="text-body-sm text-on-surface-variant">
                              {i === 0 ? 'Main kitchen' : 'Branch'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeBranch(b.id)}
                          aria-label={`Remove ${b.area}`}
                          className="p-1.5 text-on-surface-variant hover:text-error shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                          label="Name this branch"
                          value={b.label}
                          onChange={(e) => updateBranch(b.id, { label: e.target.value })}
                          placeholder={i === 0 ? 'Main kitchen' : `${b.area} branch`}
                        />
                        <Input
                          label="Street address"
                          value={b.address}
                          onChange={(e) => updateBranch(b.id, { address: e.target.value })}
                          placeholder="Building, street, landmark"
                        />
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between mb-2">
                          <label htmlFor={`radius-${b.id}`} className="text-label-md text-on-surface-variant">
                            Delivers up to
                          </label>
                          <span className="text-label-lg text-terracotta">
                            {b.radiusKm ?? DEFAULT_RADIUS_KM} km
                          </span>
                        </div>
                        <input
                          id={`radius-${b.id}`}
                          type="range"
                          min="1"
                          max={MAX_RADIUS_KM}
                          step="1"
                          value={b.radiusKm ?? DEFAULT_RADIUS_KM}
                          onChange={(e) => updateBranch(b.id, { radiusKm: Number(e.target.value) })}
                          className="w-full accent-terracotta"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <LocationPicker
                  id="add-branch"
                  label={branches.length ? 'Add another kitchen location' : 'Where do you cook?'}
                  placeholder={`Search an area in ${CITY.name}`}
                  onSelect={addBranch}
                />
              </>
            )}
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
          {/* What is still standing between this kitchen and its first order. */}
          <Card className="p-6">
            <h3 className="text-headline-md text-on-surface mb-1">Before you go live</h3>
            <p className="text-body-sm text-on-surface-variant mb-4">
              {reviewed
                ? 'Approved. Your kitchen is live and can take subscriptions.'
                : awaiting
                  ? 'Everything is with us. We review new kitchens within 24-48 hours.'
                  : rejected
                    ? 'We need a change before we can approve this.'
                    : remaining === 0
                      ? 'All filled in. Send it over when you are ready.'
                      : `${remaining} ${remaining === 1 ? 'thing' : 'things'} left to finish.`}
            </p>

            <div className="h-1.5 w-full rounded-full bg-surface-variant overflow-hidden mb-5">
              <div
                className={`h-full transition-all duration-500 ${reviewed ? 'bg-leaf-success' : 'bg-terracotta'}`}
                style={{ width: `${Math.round((done / checklist.length) * 100)}%` }}
              />
            </div>

            <ul className="space-y-3 mb-6">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  {item.state === 'verified' ? (
                    <CheckCircle2 size={18} className="text-leaf-success shrink-0 mt-0.5" />
                  ) : item.state === 'review' ? (
                    <Clock size={18} className="text-secondary shrink-0 mt-0.5" />
                  ) : item.state === 'saved' ? (
                    <CircleDot size={18} className="text-terracotta shrink-0 mt-0.5" />
                  ) : (
                    <Circle size={18} className="text-outline-variant shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-label-lg ${item.state === 'verified' ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                      {item.label}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      {item.state === 'verified'
                        ? 'Verified'
                        : item.state === 'review'
                          ? 'Awaiting review'
                          : item.state === 'saved'
                            ? 'Saved, not yet submitted'
                            : item.hint}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {rejected && application?.reviewNote && (
              <div className="rounded-DEFAULT border border-error/40 bg-error-container/40 p-4 mb-5">
                <p className="text-label-md text-on-error-container mb-1">What needs changing</p>
                <p className="text-body-sm text-on-surface-variant">{application.reviewNote}</p>
              </div>
            )}

            {!reviewed && (
              <Button
                className="w-full"
                size="lg"
                onClick={submitForReview}
                disabled={submitting || remaining > 0 || awaiting}
              >
                {submitting ? (
                  <>Sending <Loader2 size={18} className="animate-spin" /></>
                ) : awaiting ? (
                  <>Awaiting review <Clock size={18} /></>
                ) : rejected ? (
                  <>Resubmit for verification <ArrowRight size={18} /></>
                ) : (
                  <>Submit for verification <ArrowRight size={18} /></>
                )}
              </Button>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-headline-md text-on-surface mb-4">Verification Documents</h3>
            {!docs ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <div className="space-y-3">
                {docs.map((doc) => (
                  <div key={doc.id} className="rounded-DEFAULT border border-outline-variant p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <FileCheck2 size={16} className="text-terracotta shrink-0 mt-1" />
                        <div className="min-w-0">
                          <p className="text-label-lg text-on-surface">{doc.name}</p>
                          <p className="text-body-sm text-on-surface-variant truncate">
                            {doc.file ? doc.file.name : doc.hint}
                          </p>
                        </div>
                      </div>
                      <Badge
                        tone={
                          doc.status === 'verified'
                            ? 'success'
                            : doc.status === 'rejected'
                              ? 'danger'
                              : 'pending'
                        }
                      >
                        {doc.status === 'verified'
                          ? 'Verified'
                          : doc.status === 'rejected'
                            ? 'Rejected'
                            : doc.status === 'pending'
                              ? 'Pending'
                              : 'Not uploaded'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 pl-6">
                      <label
                        className={`text-label-md text-terracotta hover:underline cursor-pointer inline-flex items-center gap-1.5 ${
                          uploading ? 'opacity-60 pointer-events-none' : ''
                        }`}
                      >
                        <UploadCloud size={14} />
                        {doc.file ? 'Replace' : 'Upload'}
                        <input
                          type="file"
                          accept="application/pdf,image/jpeg,image/png,image/webp"
                          onChange={onPickDoc(doc.id)}
                          className="sr-only"
                        />
                      </label>

                      {doc.file && (
                        <button
                          onClick={() => removeDoc(doc.id)}
                          className="text-label-md text-on-surface-variant hover:text-error inline-flex items-center gap-1.5"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      )}
                    </div>

                    {/* Same preview the reviewer sees, so a provider can check
                        they uploaded the right page before submitting. */}
                    {doc.file && (
                      <div className="mt-3">
                        <FilePreview file={doc.file} label={doc.name} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p className="text-body-sm text-outline mt-4">
              PDF or photo, up to 1.5 MB for PDFs. Uploaded documents stay pending until we review
              them.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-headline-md text-on-surface mb-1">Kitchen Photos</h3>
            <p className="text-body-sm text-on-surface-variant mb-4">
              {photos.length
                ? `${photos.length} of ${MAX_PHOTOS} added. These appear on your listing.`
                : 'Add a few of your cooking and storage areas — they appear on your listing and help verification.'}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {photos.map((p) => (
                <div key={p.id} className="relative group">
                  <img
                    src={p.src}
                    alt={p.name || 'Kitchen photo'}
                    className="w-full h-20 object-cover rounded-lg border border-outline-variant"
                  />
                  <button
                    onClick={() => removePhoto(p.id)}
                    aria-label={`Remove ${p.name || 'photo'}`}
                    className="absolute top-1 right-1 p-1 rounded-full bg-on-background/60 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {photos.length < MAX_PHOTOS && (
                <label
                  className={`h-20 rounded-lg border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-1 cursor-pointer text-on-surface-variant hover:border-terracotta/50 hover:text-terracotta transition-colors ${
                    uploading ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  {uploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                  <span className="text-body-sm">{uploading ? 'Adding…' : 'Add'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={onPickPhotos}
                    className="sr-only"
                  />
                </label>
              )}
            </div>

            <p className="text-body-sm text-outline">
              JPEG, PNG or WebP. Large photos are resized automatically before saving.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
