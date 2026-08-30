import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { EmptyPanel, RowSkeleton } from './AdminUI.jsx'

const PAGE_SIZE = 10

/**
 * One table for every admin list: search, optional dropdown filters, sortable
 * columns and pagination. Columns declare how to read and render a cell, so a
 * page describes its data rather than rebuilding a table.
 *
 * Scrolls horizontally on narrow screens rather than collapsing, so a row stays
 * one record and columns stay comparable.
 */
export default function DataTable({
  columns,
  rows,
  loading = false,
  searchKeys = [],
  searchPlaceholder = 'Search',
  filters = [],
  empty,
  onRowClick,
  initialSort,
}) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState({})
  const [sort, setSort] = useState(initialSort || null)
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    let list = rows || []

    const q = query.trim().toLowerCase()
    if (q && searchKeys.length) {
      list = list.filter((r) =>
        searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q))
      )
    }

    for (const f of filters) {
      const value = active[f.key]
      if (value) list = list.filter((r) => f.match(r, value))
    }

    if (sort) {
      const col = columns.find((c) => c.key === sort.key)
      if (col) {
        const read = col.sortValue || ((r) => r[col.key])
        list = [...list].sort((a, b) => {
          const av = read(a)
          const bv = read(b)
          const cmp =
            typeof av === 'number' && typeof bv === 'number'
              ? av - bv
              : String(av ?? '').localeCompare(String(bv ?? ''))
          return sort.dir === 'asc' ? cmp : -cmp
        })
      }
    }
    return list
  }, [rows, query, active, sort, columns, filters, searchKeys])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount - 1)
  const visible = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE)

  const toggleSort = (key) =>
    setSort((s) =>
      s?.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }
    )

  const hasControls = searchKeys.length > 0 || filters.length > 0

  return (
    <div>
      {hasControls && (
        <div className="flex flex-wrap gap-3 mb-4">
          {searchKeys.length > 0 && (
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(0) }}
                placeholder={searchPlaceholder}
                className="w-full min-h-[42px] rounded-DEFAULT border border-outline-variant bg-surface-container-lowest pl-10 pr-3 text-body-sm text-on-surface placeholder:text-outline focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none"
              />
            </div>
          )}
          {filters.map((f) => (
            <select
              key={f.key}
              value={active[f.key] || ''}
              onChange={(e) => { setActive((a) => ({ ...a, [f.key]: e.target.value })); setPage(0) }}
              className="min-h-[42px] rounded-DEFAULT border border-outline-variant bg-surface-container-lowest px-3 text-body-sm text-on-surface focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none"
            >
              <option value="">{f.label}</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ))}
        </div>
      )}

      {loading ? (
        <RowSkeleton />
      ) : filtered.length === 0 ? (
        empty || <EmptyPanel title="Nothing to show" description="No records match this view." />
      ) : (
        <>
          <div className="rounded-lg border border-surface-variant bg-surface-container-lowest overflow-x-auto">
            <table className="w-full min-w-[680px] text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-variant bg-surface-container-low">
                  {columns.map((c) => (
                    <th key={c.key} className={`py-3 px-4 text-label-md uppercase tracking-[0.06em] text-on-surface-variant ${c.align === 'right' ? 'text-right' : ''}`}>
                      {c.sortable ? (
                        <button
                          onClick={() => toggleSort(c.key)}
                          className={`inline-flex items-center gap-1 hover:text-terracotta transition-colors ${c.align === 'right' ? 'flex-row-reverse' : ''}`}
                        >
                          {c.header}
                          {sort?.key === c.key && (sort.dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                        </button>
                      ) : (
                        c.header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((row, i) => (
                  <tr
                    key={row.id || row.uid || i}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={`border-b border-surface-variant last:border-0 transition-colors ${
                      onRowClick ? 'cursor-pointer hover:bg-surface-container-low' : 'hover:bg-surface-container-low/60'
                    }`}
                  >
                    {columns.map((c) => (
                      <td key={c.key} className={`py-3.5 px-4 text-body-sm text-on-surface align-middle ${c.align === 'right' ? 'text-right tabular-nums' : ''}`}>
                        {c.render ? c.render(row) : String(row[c.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-body-sm text-on-surface-variant">
                {current * PAGE_SIZE + 1}–{Math.min((current + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={current === 0}
                  className="p-2 rounded-DEFAULT text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40 disabled:hover:bg-transparent"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-body-sm text-on-surface-variant px-2 tabular-nums">
                  {current + 1} / {pageCount}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={current >= pageCount - 1}
                  className="p-2 rounded-DEFAULT text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40 disabled:hover:bg-transparent"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
