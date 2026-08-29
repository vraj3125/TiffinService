import { useEffect, useState } from 'react'
import { ShieldCheck, Clock, UploadCloud, FileCheck2, MapPin, Trash2, Store } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { Input, Textarea } from '../../components/ui/Input.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import {
  fetchBranches,
  fetchKitchenProfile,
  fetchVerificationDocs,
  newBranch,
  saveBranches,
  saveKitchenProfile,
  saveVerificationDocs,
} from '../../api/provider.js'
import LocationPicker from '../../components/ui/LocationPicker.jsx'
import { CITY, DEFAULT_RADIUS_KM, MAX_RADIUS_KM } from '../../config/locations.js'
import { useToast } from '../../context/ToastContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function VerificationPage() {
  const { user } = useAuth()
  const [docs, setDocs] = useState(null)
  const [profile, setProfile] = useState(null)
  const [branches, setBranches] = useState(null)
  const { showToast } = useToast()

  // This kitchen's own paperwork -- nothing is pre-filled or pre-verified.
  useEffect(() => {
    if (!user) return
    fetchVerificationDocs(user.uid).then(setDocs)
    fetchKitchenProfile(user.uid).then((p) => setProfile({ ...p, name: p.name || user.name || '' }))
    fetchBranches(user.uid).then(setBranches)
  }, [user])

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

  const uploadDoc = (id) => {
    const next = docs.map((d) => (d.id === id ? { ...d, status: 'pending' } : d))
    setDocs(next)
    saveVerificationDocs(user.uid, next)
    showToast('Document uploaded — under review')
  }

  const field = (key) => (e) => setProfile({ ...profile, [key]: e.target.value })

  const saveBusiness = async (e) => {
    e.preventDefault()
    await saveKitchenProfile(user.uid, profile)
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

      <div className="grid md:grid-cols-2 gap-gutter">
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

        <Card className="p-6 md:col-span-2">
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

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-headline-md text-on-surface mb-4">Verification Documents</h3>
            {!docs ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <div className="space-y-3">
                {docs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 rounded-DEFAULT border border-outline-variant">
                    <div className="flex items-center gap-2">
                      <FileCheck2 size={16} className="text-terracotta" />
                      <span className="text-label-lg text-on-surface">{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={doc.status === 'verified' ? 'verified' : 'pending'}>
                        {doc.status === 'verified'
                          ? 'Verified'
                          : doc.status === 'pending'
                            ? 'Pending'
                            : 'Not uploaded'}
                      </Badge>
                      <button onClick={() => uploadDoc(doc.id)} className="text-on-surface-variant hover:text-terracotta">
                        <UploadCloud size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-headline-md text-on-surface mb-3">Kitchen Photos</h3>
            <p className="text-body-sm text-on-surface-variant mb-3">
              No photos yet. Add a few of your cooking and storage areas.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => showToast('Photo upload simulated')}
                className="h-20 rounded-lg border-2 border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-terracotta/50 hover:text-terracotta"
              >
                <UploadCloud size={18} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
