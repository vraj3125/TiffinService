import { useEffect, useState } from 'react'
import { ShieldCheck, Clock, UploadCloud, FileCheck2 } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { Input, Textarea } from '../../components/ui/Input.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { fetchVerificationDocs } from '../../api/provider.js'
import { useToast } from '../../context/ToastContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function VerificationPage() {
  const { user } = useAuth()
  const [docs, setDocs] = useState(null)
  const { showToast } = useToast()

  useEffect(() => {
    fetchVerificationDocs().then(setDocs)
  }, [])

  const overallStatus = docs?.every((d) => d.status === 'verified') ? 'verified' : docs?.some((d) => d.status === 'pending') ? 'pending' : 'pending'

  const uploadDoc = (id) => {
    setDocs((ds) => ds.map((d) => (d.id === id ? { ...d, status: 'pending' } : d)))
    showToast('Document uploaded — under review')
  }

  const saveBusiness = (e) => {
    e.preventDefault()
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
            {overallStatus === 'verified' ? 'Verified' : 'Verification Pending'}
          </Badge>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-gutter">
        <Card className="p-6">
          <h3 className="text-headline-md text-on-surface mb-4">Business Details</h3>
          <form onSubmit={saveBusiness} className="space-y-4">
            <Input label="Business name" defaultValue={user?.name} />
            <Input label="Owner name" defaultValue="Sunita Sharma" />
            <Input label="FSSAI license number" defaultValue="12345678901234" />
            <Textarea label="Kitchen address" rows={2} defaultValue="BTM 2nd Stage, Koramangala, Bengaluru - 560034" />
            <Input label="Contact phone" defaultValue="+91 98765 43210" />
            <Button type="submit">Save Details</Button>
          </form>
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
                        {doc.status === 'verified' ? 'Verified' : 'Pending'}
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
            <div className="grid grid-cols-3 gap-2 mb-3">
              {['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200'].map((src) => (
                <img key={src} src={src} alt="Kitchen" className="w-full h-20 object-cover rounded-lg" />
              ))}
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
