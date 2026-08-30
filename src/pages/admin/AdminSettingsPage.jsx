import { PageHeader, Panel } from '../../components/admin/AdminUI.jsx'
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
