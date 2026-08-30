import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, Panel, StatusPill } from '../../components/admin/AdminUI.jsx'
import { collectAccounts } from '../../api/adminStats.js'
import { listApplications, statusLabel } from '../../api/admin.js'
import { ADMIN_EMAILS } from '../../config/admin.js'
import { CITY } from '../../config/locations.js'
import { COMPANY } from '../../config/company.js'
import { activeProvider } from '../../lib/places.js'

const Row = ({ label, value, note }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-6 py-3.5 border-b border-surface-variant last:border-0">
    <span className="text-body-sm text-on-surface-variant shrink-0">{label}</span>
    <span className="text-right">
      <span className="text-body-sm text-on-surface break-words">{value || '—'}</span>
      {note && <span className="block text-body-sm text-outline mt-0.5">{note}</span>}
    </span>
  </div>
)

// Read-only: every value here comes from an environment variable or a config
// file, so changing one means changing the deployment, not clicking a toggle.
export default function AdminSettingsPage() {
  // "I submitted but the admin cannot see it" is hard to debug blind, so show
  // what this browser actually holds.
  const [accounts, setAccounts] = useState([])
  const [apps, setApps] = useState([])

  useEffect(() => {
    setAccounts(collectAccounts())
    listApplications().then(setApps)
  }, [])

  const providers = accounts.filter((a) => a.role === 'provider')
  const submittedUids = new Set(apps.map((a) => a.uid))
  const notSubmitted = providers.filter((p) => !submittedUids.has(p.uid))

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="How this deployment is configured. Read-only — these come from environment variables."
        breadcrumb={[{ label: 'Admin', to: '/admin' }, { label: 'Settings' }]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="p-6">
          <h2 className="text-headline-md text-on-surface mb-4">Platform</h2>
          <Row label="Name" value={COMPANY.name} />
          <Row label="Service city" value={`${CITY.name}, ${CITY.state}`} />
          <Row label="Support email" value={COMPANY.supportEmail} />
          <Row label="Partner email" value={COMPANY.partnersEmail} />
          <Row label="FSSAI licence" value={COMPANY.fssai} note={!COMPANY.fssai ? 'Not issued yet — hidden site-wide' : undefined} />
          <Row label="GSTIN" value={COMPANY.gstin} note={!COMPANY.gstin ? 'Not issued yet — hidden site-wide' : undefined} />
        </Panel>

        <Panel className="p-6">
          <h2 className="text-headline-md text-on-surface mb-4">Configuration</h2>
          <Row label="Location provider" value={activeProvider}
            note={activeProvider === 'photon' ? 'Keyless, OpenStreetMap data' : undefined} />
          <Row label="Admin accounts" value={ADMIN_EMAILS.join(', ')}
            note="Set with VITE_ADMIN_EMAILS" />
          <Row label="Data storage" value="Browser localStorage"
            note="No backend connected. Data does not sync between devices." />
        </Panel>
      </div>

      <Panel className="p-6 mt-6">
        <h2 className="text-headline-md text-on-surface mb-1">What this browser holds</h2>
        <p className="text-body-sm text-on-surface-variant mb-5">
          The queue only sees accounts created in this browser. If a kitchen is missing, check here
          first.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-DEFAULT border border-outline-variant p-4">
            <p className="font-display text-headline-lg text-on-surface">{accounts.length}</p>
            <p className="text-body-sm text-on-surface-variant">Accounts in this browser</p>
          </div>
          <div className="rounded-DEFAULT border border-outline-variant p-4">
            <p className="font-display text-headline-lg text-on-surface">{providers.length}</p>
            <p className="text-body-sm text-on-surface-variant">Kitchen accounts</p>
          </div>
          <div className="rounded-DEFAULT border border-outline-variant p-4">
            <p className="font-display text-headline-lg text-on-surface">{apps.length}</p>
            <p className="text-body-sm text-on-surface-variant">Applications in the queue</p>
          </div>
        </div>

        {notSubmitted.length > 0 && (
          <div className="rounded-DEFAULT border border-mustard/40 bg-mustard/10 p-4 mb-5">
            <p className="text-label-lg text-on-surface mb-1">
              {notSubmitted.length} kitchen{notSubmitted.length > 1 ? 's have' : ' has'} an account
              but has not submitted
            </p>
            <p className="text-body-sm text-on-surface-variant mb-2">
              Their profile is incomplete, or they never pressed “Submit for verification” — the
              button stays disabled until the checklist reaches 5 of 5.
            </p>
            <ul className="text-body-sm text-on-surface-variant">
              {notSubmitted.map((p) => (
                <li key={p.uid}>· {p.kitchenProfile?.name || p.name}</li>
              ))}
            </ul>
          </div>
        )}

        {apps.length > 0 && (
          <ul className="space-y-2 mb-6">
            {apps.map((a) => (
              <li key={a.uid} className="flex items-center justify-between gap-3 rounded-DEFAULT border border-outline-variant p-3">
                <span className="text-body-sm text-on-surface">{a.kitchenName}</span>
                <span className="flex items-center gap-3">
                  <StatusPill tone={a.status === 'approved' ? 'success' : 'pending'}>
                    {statusLabel[a.status]}
                  </StatusPill>
                  <Link to="/admin/kitchens" className="text-label-md text-terracotta hover:underline">
                    Open
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel className="p-6 mt-6">
        <h2 className="text-headline-md text-on-surface mb-2">Before this handles real applications</h2>
        <ul className="space-y-2.5 text-body-sm text-on-surface-variant">
          <li className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-terracotta shrink-0" />
            The admin check runs in the browser, so the email list is readable in the shipped bundle.
            It belongs in Firebase custom claims plus Firestore rules, protecting the data rather
            than the route.
          </li>
          <li className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-terracotta shrink-0" />
            The verification queue is per-browser. A kitchen that applied on its own device is not
            visible here.
          </li>
          <li className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-terracotta shrink-0" />
            Roles live in localStorage, not in a trusted claim.
          </li>
        </ul>
      </Panel>
    </>
  )
}
