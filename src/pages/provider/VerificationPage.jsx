import { useEffect, useState } from 'react'
import { ShieldCheck, Clock, UploadCloud, FileCheck2 } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { Input, Textarea } from '../../components/ui/Input.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import {
  fetchKitchenProfile,
  fetchVerificationDocs,
  saveKitchenProfile,
  saveVerificationDocs,
} from '../../api/provider.js'
import { useToast } from '../../context/ToastContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function VerificationPage() {
  const { user } = useAuth()
  const [docs, setDocs] = useState(null)
  const [profile, setProfile] = useState(null)
  const { showToast } = useToast()

  // This kitchen's own paperwork -- nothing is pre-filled or pre-verified.
  useEffect(() => {
    if (!user) return
    fetchVerificationDocs(user.uid).then(setDocs)
    fetchKitchenProfile(user.uid).then((p) => setProfile({ ...p, name: p.name || user.name || '' }))
  }, [user])

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
