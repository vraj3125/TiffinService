import { useEffect, useState } from 'react'
import { MapPin, Map, Store } from 'lucide-react'
import { PageHeader, StatCard, Panel, LocalDataNote, EmptyPanel } from '../../components/admin/AdminUI.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import { RankBars } from '../../components/admin/Charts.jsx'
import { fetchLocationStats } from '../../api/adminStats.js'
import { CITY, VADODARA_AREAS } from '../../config/locations.js'

export default function LocationsPage() {
  const [data, setData] = useState(null)
  useEffect(() => { fetchLocationStats().then(setData) }, [])

  const rows = data?.rows || []
  const covered = rows.filter((r) => r.kitchens > 0)

  return (
    <>
      <PageHeader
        title="Locations"
        subtitle={`Service coverage across ${CITY.name} and the towns around it.`}
        breadcrumb={[{ label: 'Admin', to: '/admin' }, { label: 'Locations' }]}
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard icon={Map} tone="info" value={data?.total ?? '—'} label="Service locations"
          hint={`${VADODARA_AREAS.length} city areas, ${(data?.total ?? 0) - VADODARA_AREAS.length} nearby towns`} />
        <StatCard icon={Store} tone="success" value={data?.covered ?? '—'} label="Areas with a kitchen" />
        <StatCard icon={MapPin} tone="pending"
          value={data ? data.total - data.covered : '—'} label="Areas with no kitchen"
          hint="Where a new partner would have no competition" />
      </div>

      <Panel className="p-6 mb-8">
        <h2 className="text-headline-md text-on-surface mb-1">Kitchens by area</h2>
        <p className="text-body-sm text-on-surface-variant mb-6">
          Areas with at least one kitchen, most first.
        </p>
        {covered.length === 0 ? (
          <EmptyPanel icon={MapPin} title="No coverage yet" description="Areas appear once a kitchen lists there." />
        ) : (
          <RankBars data={covered.slice(0, 10).map((r) => ({ label: r.name, value: r.kitchens }))} />
        )}
      </Panel>

      <DataTable
        rows={rows}
        loading={data === null}
        searchKeys={['name', 'pincode']}
        searchPlaceholder="Search an area or pincode"
        filters={[{
          key: 'coverage', label: 'All areas',
          options: [
            { value: 'covered', label: 'Has a kitchen' },
            { value: 'uncovered', label: 'No kitchen yet' },
          ],
          match: (r, v) => (v === 'covered' ? r.kitchens > 0 : r.kitchens === 0),
        }]}
        initialSort={{ key: 'kitchens', dir: 'desc' }}
        columns={[
          { key: 'name', header: 'Area', sortable: true,
            render: (r) => <span className="text-label-lg text-on-surface">{r.name}</span> },
          { key: 'pincode', header: 'Pincode', sortable: true },
          { key: 'kitchens', header: 'Kitchens', align: 'right', sortable: true },
          { key: 'customers', header: 'Customers', align: 'right', sortable: true },
        ]}
      />
      <LocalDataNote what="The customer column" />
    </>
  )
}
