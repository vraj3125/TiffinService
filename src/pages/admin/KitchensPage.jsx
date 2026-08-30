import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ClipboardCheck, Store } from 'lucide-react'
import {
  PageHeader, StatCard, StatusPill, EmptyPanel, LocalDataNote, inr,
} from '../../components/admin/AdminUI.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import Button from '../../components/ui/Button.jsx'
import ApplicationReview from './ApplicationReview.jsx'
import { STATUS, getApplicationForReview, listApplications, statusLabel } from '../../api/admin.js'
import { fetchKitchenPerformance } from '../../api/adminStats.js'
import { ShieldCheck, ShieldX, Clock } from 'lucide-react'

const TONE = {
  [STATUS.approved]: 'success',
  [STATUS.submitted]: 'pending',
  [STATUS.rejected]: 'warning',
  [STATUS.declined]: 'error',
  [STATUS.suspended]: 'error',
  [STATUS.draft]: 'neutral',
}

const VIEWS = {
  all: { title: 'All Kitchens', crumb: 'All Kitchens', status: null },
  pending: { title: 'Pending Verification', crumb: 'Pending Verification', status: STATUS.submitted },
  approved: { title: 'Approved Kitchens', crumb: 'Approved Kitchens', status: STATUS.approved },
  changes: { title: 'Changes Requested', crumb: 'Changes Requested', status: STATUS.rejected },
}

const when = (iso) =>
  iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

/**
 * Kitchens list, and the verification queue it grew out of. The review modal is
 * the original ApplicationReview component, unchanged -- approve and request
 * changes behave exactly as before.
 */
export default function KitchensPage() {
  const { view = 'all' } = useParams()
  const config = VIEWS[view] || VIEWS.all

  const [apps, setApps] = useState(null)
  const [performance, setPerformance] = useState([])
  const [openUid, setOpenUid] = useState(null)
  // Loaded on demand, because the list deliberately holds no file bytes.
  const [reviewing, setReviewing] = useState(null)

  const load = useCallback(() => {
    listApplications().then(setApps)
    fetchKitchenPerformance().then(setPerformance)
  }, [])

  useEffect(() => { load() }, [load])

  const counts = useMemo(() => ({
    submitted: (apps || []).filter((a) => a.status === STATUS.submitted).length,
    approved: (apps || []).filter((a) => a.status === STATUS.approved).length,
    rejected: (apps || []).filter((a) => a.status === STATUS.rejected).length,
  }), [apps])

  // "All" shows every kitchen the platform knows about -- registered and
  // catalogue. The filtered views are the verification queue itself.
  const rows = useMemo(() => {
    if (!apps) return []
    if (!config.status) return performance
    return apps
      .filter((a) => a.status === config.status)
      .map((a) => ({
        id: a.uid, uid: a.uid, name: a.kitchenName, owner: a.owner, phone: a.phone,
        area: a.branches?.[0]?.area || '', locations: a.branches?.length || 0,
        documents: a.documents?.filter((d) => d.file).length || 0,
        documentsTotal: a.documents?.length || 0,
        submittedAt: a.submittedAt, status: a.status,
      }))
  }, [apps, performance, config.status])

  useEffect(() => {
    if (!openUid) {
      setReviewing(null)
      return
    }
    let live = true
    getApplicationForReview(openUid).then((a) => live && setReviewing(a))
    return () => { live = false }
  }, [openUid])

  const onDecided = (updated) => {
    setApps((list) => list.map((a) => (a.uid === updated.uid ? updated : a)))
    setOpenUid(null)
    fetchKitchenPerformance().then(setPerformance)
  }

  const queueColumns = [
    {
      key: 'name', header: 'Kitchen', sortable: true,
      render: (r) => (
        <div>
          <p className="text-label-lg text-on-surface">{r.name}</p>
          <p className="text-body-sm text-on-surface-variant">{r.owner} · {r.phone}</p>
        </div>
      ),
    },
    { key: 'area', header: 'Area', sortable: true, render: (r) => r.area || '—' },
    { key: 'locations', header: 'Locations', align: 'right', sortable: true },
    {
      key: 'documents', header: 'Documents', align: 'right',
      render: (r) => `${r.documents}/${r.documentsTotal}`,
    },
    { key: 'submittedAt', header: 'Submitted', sortable: true, render: (r) => when(r.submittedAt) },
    {
      key: 'status', header: 'Status',
      render: (r) => <StatusPill tone={TONE[r.status]}>{statusLabel[r.status]}</StatusPill>,
    },
    {
      key: 'action', header: '', align: 'right',
      render: (r) => (
        <Button size="sm" variant="secondary" onClick={() => setOpenUid(r.uid)}>
          {r.status === STATUS.submitted ? 'Review' : 'View'}
        </Button>
      ),
    },
  ]

  const allColumns = [
    {
      key: 'name', header: 'Kitchen', sortable: true,
      render: (r) => (
        <div>
          <p className="text-label-lg text-on-surface">{r.name}</p>
          <p className="text-body-sm text-on-surface-variant">{r.area || 'No area set'}</p>
        </div>
      ),
    },
    { key: 'locations', header: 'Locations', align: 'right', sortable: true },
    { key: 'orders', header: 'Orders', align: 'right', sortable: true },
    { key: 'revenue', header: 'Revenue', align: 'right', sortable: true, render: (r) => inr(r.revenue) },
    {
      key: 'rating', header: 'Rating', align: 'right', sortable: true,
      render: (r) => (r.rating ? r.rating.toFixed(1) : '—'),
    },
    {
      key: 'status', header: 'Status',
      render: (r) => (
        <StatusPill tone={TONE[r.status] || 'neutral'}>{statusLabel[r.status] || 'Listed'}</StatusPill>
      ),
    },
    {
      key: 'action', header: '', align: 'right',
      render: (r) =>
        r.source === 'registered' ? (
          <Button size="sm" variant="secondary" onClick={() => setOpenUid(r.id)}>View</Button>
        ) : (
          <span className="text-body-sm text-outline">Catalogue</span>
        ),
    },
  ]

  return (
    <>
      <PageHeader
        title={config.title}
        subtitle={
          config.status
            ? 'Review what a kitchen submitted, then approve it or send it back with a note.'
            : 'Every kitchen on the platform — registered here and seeded in the catalogue.'
        }
        breadcrumb={[{ label: 'Admin', to: '/admin' }, { label: 'Kitchens' }, { label: config.crumb }]}
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard
          icon={Clock} tone="pending" to="/admin/kitchens/pending"
          value={counts.submitted} label="Awaiting review"
          hint={counts.submitted ? 'Needs a decision' : 'Queue is clear'}
        />
        <StatCard
          icon={ShieldCheck} tone="success" to="/admin/kitchens/approved"
          value={counts.approved} label="Approved" hint="Live and taking orders"
        />
        <StatCard
          icon={ShieldX} tone="warning" to="/admin/kitchens/changes"
          value={counts.rejected} label="Changes requested" hint="Waiting on the kitchen"
        />
      </div>

      <DataTable
        rows={rows}
        loading={apps === null}
        columns={config.status ? queueColumns : allColumns}
        searchKeys={config.status ? ['name', 'owner', 'phone', 'area'] : ['name', 'area']}
        searchPlaceholder="Search kitchens"
        filters={
          config.status
            ? []
            : [
                {
                  key: 'status',
                  label: 'All statuses',
                  options: Object.entries(statusLabel).map(([value, label]) => ({ value, label })),
                  match: (r, v) => r.status === v,
                },
                {
                  key: 'area',
                  label: 'All areas',
                  options: [...new Set(performance.map((p) => p.area).filter(Boolean))]
                    .sort()
                    .map((a) => ({ value: a, label: a })),
                  match: (r, v) => r.area === v,
                },
              ]
        }
        initialSort={config.status ? { key: 'submittedAt', dir: 'desc' } : { key: 'orders', dir: 'desc' }}
        empty={
          <EmptyPanel
            icon={config.status ? ClipboardCheck : Store}
            title={
              config.status === STATUS.submitted
                ? 'Nothing waiting'
                : config.status
                  ? `No ${statusLabel[config.status].toLowerCase()} applications`
                  : 'No kitchens yet'
            }
            description={
              config.status === STATUS.submitted
                ? 'New kitchens appear here the moment they submit their details.'
                : undefined
            }
          />
        }
      />

      {!config.status && <LocalDataNote what="Order and revenue columns" />}

      <ApplicationReview application={reviewing} onClose={() => setOpenUid(null)} onDecided={onDecided} />
    </>
  )
}
