import { useEffect, useMemo, useState } from 'react'
import { ClipboardCheck, Clock, ShieldCheck, ShieldX, Store } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'
import { STATUS, listApplications, statusLabel } from '../../api/admin.js'
import ApplicationReview from './ApplicationReview.jsx'

const TABS = [
  { key: STATUS.submitted, label: 'Awaiting review', icon: Clock, tone: 'pending' },
  { key: STATUS.approved, label: 'Approved', icon: ShieldCheck, tone: 'success' },
  { key: STATUS.rejected, label: 'Changes requested', icon: ShieldX, tone: 'danger' },
]

const toneFor = (status) =>
  status === STATUS.approved ? 'success' : status === STATUS.rejected ? 'danger' : 'pending'

const when = (iso) =>
  iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

export default function AdminDashboardPage() {
  const [apps, setApps] = useState(null)
  const [tab, setTab] = useState(STATUS.submitted)
  const [openUid, setOpenUid] = useState(null)

  const load = () => listApplications().then(setApps)
  useEffect(() => {
    load()
  }, [])

  const counts = useMemo(() => {
    const c = { [STATUS.submitted]: 0, [STATUS.approved]: 0, [STATUS.rejected]: 0 }
    for (const a of apps || []) if (c[a.status] != null) c[a.status] += 1
    return c
  }, [apps])

  const shown = (apps || []).filter((a) => a.status === tab)
  const open = (apps || []).find((a) => a.uid === openUid) || null

  const onDecided = (updated) => {
    setApps((list) => list.map((a) => (a.uid === updated.uid ? updated : a)))
    setOpenUid(null)
  }

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <header className="mb-8">
        <h1 className="text-headline-lg text-on-surface mb-1">Kitchen Verification</h1>
        <p className="text-body-md text-on-surface-variant">
          Review what a kitchen has submitted, then approve it or send it back with a note. A
          kitchen cannot take subscriptions until it is approved.
        </p>
      </header>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg border p-5 text-left transition-colors ${
              tab === t.key
                ? 'border-terracotta bg-surface-container-low'
                : 'border-surface-variant bg-surface-container-lowest hover:border-terracotta/40'
            }`}
          >
            <t.icon
              size={20}
              className={`mb-3 ${tab === t.key ? 'text-terracotta' : 'text-on-surface-variant'}`}
            />
            <p className="text-headline-md text-on-surface">{counts[t.key] ?? 0}</p>
            <p className="text-body-sm text-on-surface-variant">{t.label}</p>
          </button>
        ))}
      </div>

      {!apps ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title={
            tab === STATUS.submitted
              ? 'Nothing waiting'
              : `No ${statusLabel[tab].toLowerCase()} applications`
          }
          description={
            tab === STATUS.submitted
              ? 'New kitchens appear here the moment they submit their details.'
              : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {shown.map((a) => (
            <Card key={a.uid} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-terracotta shrink-0">
                    <Store size={20} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-headline-md text-on-surface">{a.kitchenName}</h2>
                    <p className="text-body-sm text-on-surface-variant">
                      {a.owner} · {a.phone}
                    </p>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                      {a.branches?.length || 0}{' '}
                      {a.branches?.length === 1 ? 'location' : 'locations'} ·{' '}
                      {a.documents?.filter((d) => d.file).length || 0} of{' '}
                      {a.documents?.length || 0} documents · submitted {when(a.submittedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge tone={toneFor(a.status)}>{statusLabel[a.status]}</Badge>
                  <button
                    onClick={() => setOpenUid(a.uid)}
                    className="text-label-lg text-terracotta hover:underline whitespace-nowrap"
                  >
                    {a.status === STATUS.submitted ? 'Review' : 'View'}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ApplicationReview
        application={open}
        onClose={() => setOpenUid(null)}
        onDecided={onDecided}
      />
    </div>
  )
}
