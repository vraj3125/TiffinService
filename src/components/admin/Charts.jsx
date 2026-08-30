import { useId, useState } from 'react'

// Inline SVG charts. No charting dependency: three small forms is not worth
// 200 kB, and hand-rolled SVG matches the app's own styling exactly.
//
// The categorical palette below was validated for lightness band, chroma floor,
// colourblind separation, normal-vision separation and contrast against a white
// surface. Adjacent pairs are ordered so similar hues never sit next to each
// other. Do not reorder or add a hue without re-validating.
export const SERIES = ['#9d4300', '#005eb2', '#b07d00', '#006e2f']

const AXIS = '#ddc1b4' // outline-variant
const INK = '#564339' // on-surface-variant

const niceMax = (max) => {
  if (max <= 0) return 1
  const pow = 10 ** Math.floor(Math.log10(max))
  return Math.ceil(max / pow) * pow
}

/**
 * Vertical bars for a short ordered series -- one measure, so one hue and no
 * legend; the title names it.
 */
export function BarChart({ data, valueKey = 'value', format = (v) => v, height = 200 }) {
  const [hover, setHover] = useState(null)
  const id = useId()

  const values = data.map((d) => Number(d[valueKey]) || 0)
  const max = niceMax(Math.max(...values, 0))
  const allZero = values.every((v) => v === 0)

  return (
    <div className="relative">
      <div className="flex items-end gap-2 sm:gap-3" style={{ height }}>
        {data.map((d, i) => {
          const v = Number(d[valueKey]) || 0
          const pct = allZero ? 0 : (v / max) * 100
          return (
            <div
              key={d.label + i}
              className="flex-1 h-full flex flex-col justify-end items-center group"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              aria-label={`${d.label}: ${format(v)}`}
            >
              <span
                className={`text-body-sm tabular-nums mb-1.5 transition-opacity ${
                  hover === i ? 'text-on-surface opacity-100' : 'text-on-surface-variant opacity-0 group-hover:opacity-100'
                }`}
              >
                {format(v)}
              </span>
              {/* 4px rounded data-end, anchored to the baseline. */}
              <div
                className="w-full max-w-[44px] rounded-t-[4px] transition-[height,opacity] duration-300"
                style={{
                  height: `${Math.max(pct, v > 0 ? 2 : 0)}%`,
                  minHeight: v > 0 ? 3 : 0,
                  backgroundColor: SERIES[0],
                  opacity: hover === null || hover === i ? 1 : 0.45,
                }}
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-2 sm:gap-3 mt-2 pt-2 border-t" style={{ borderColor: AXIS }}>
        {data.map((d, i) => (
          <span
            key={d.label + i + id}
            className="flex-1 text-center text-body-sm"
            style={{ color: hover === i ? '#231915' : INK }}
          >
            {d.label}
          </span>
        ))}
      </div>
      {allZero && (
        <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-body-sm text-outline">
          No activity in this period yet
        </p>
      )}
    </div>
  )
}

/**
 * A single-series line with a crosshair. One measure, one hue, no legend.
 */
export function LineChart({ data, valueKey = 'value', format = (v) => v, height = 200 }) {
  const [hover, setHover] = useState(null)
  const W = 600
  const H = height
  const pad = { top: 12, right: 8, bottom: 24, left: 8 }

  const values = data.map((d) => Number(d[valueKey]) || 0)
  const max = niceMax(Math.max(...values, 0))
  const allZero = values.every((v) => v === 0)

  const x = (i) => pad.left + (i * (W - pad.left - pad.right)) / Math.max(data.length - 1, 1)
  const y = (v) => H - pad.bottom - (v / max) * (H - pad.top - pad.bottom)

  const line = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ')
  const area = `${line} L ${x(values.length - 1)} ${H - pad.bottom} L ${x(0)} ${H - pad.bottom} Z`

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height }}
        role="img"
        aria-label={`Trend across ${data.length} points`}
        onMouseLeave={() => setHover(null)}
      >
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1={pad.left} x2={W - pad.right} y1={y(max * t)} y2={y(max * t)}
            stroke={AXIS} strokeWidth="1" opacity="0.5" />
        ))}

        {!allZero && (
          <>
            <path d={area} fill={SERIES[0]} opacity="0.08" />
            <path d={line} fill="none" stroke={SERIES[0]} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {data.map((d, i) => (
          <g key={d.label + i}>
            {hover === i && (
              <line x1={x(i)} x2={x(i)} y1={pad.top} y2={H - pad.bottom}
                stroke={SERIES[0]} strokeWidth="1" opacity="0.35" />
            )}
            {!allZero && (
              <circle cx={x(i)} cy={y(values[i])} r={hover === i ? 5 : 3.5}
                fill={SERIES[0]} stroke="#ffffff" strokeWidth="2" />
            )}
            {/* Hit target far larger than the mark. */}
            <rect x={x(i) - 20} y={0} width="40" height={H} fill="transparent"
              onMouseEnter={() => setHover(i)} />
            <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="11" fill={INK}>
              {d.label}
            </text>
          </g>
        ))}
      </svg>

      {hover != null && !allZero && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-DEFAULT border border-outline-variant bg-surface-container-lowest px-3 py-1.5 shadow-sm"
          style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(values[hover]) / H) * 100}%` }}
        >
          <p className="text-body-sm text-on-surface-variant whitespace-nowrap">{data[hover].label}</p>
          <p className="text-label-lg text-on-surface tabular-nums whitespace-nowrap">
            {format(values[hover])}
          </p>
        </div>
      )}

      {allZero && (
        <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-body-sm text-outline">
          No activity in this period yet
        </p>
      )}
    </div>
  )
}

/**
 * Donut for a small parts-of-a-whole split. Every slice is direct-labelled in
 * the legend beside its own swatch, so identity is never colour alone.
 */
export function DonutChart({ data, size = 180, thickness = 26 }) {
  const [hover, setHover] = useState(null)
  const total = data.reduce((t, d) => t + d.value, 0)

  if (!total) {
    return (
      <p className="text-body-sm text-outline py-8 text-center">
        Nothing to break down yet
      </p>
    )
  }

  const r = (size - thickness) / 2
  const c = size / 2
  const circumference = 2 * Math.PI * r
  let offset = 0

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0"
        role="img" aria-label="Distribution by plan">
        <g transform={`rotate(-90 ${c} ${c})`}>
          {data.map((d, i) => {
            const fraction = d.value / total
            const dash = fraction * circumference
            // 2px surface gap between segments.
            const gap = data.length > 1 ? 2 : 0
            const seg = (
              <circle
                key={d.label}
                cx={c} cy={c} r={r}
                fill="none"
                stroke={SERIES[i % SERIES.length]}
                strokeWidth={hover === i ? thickness + 4 : thickness}
                strokeDasharray={`${Math.max(dash - gap, 0)} ${circumference - Math.max(dash - gap, 0)}`}
                strokeDashoffset={-offset}
                opacity={hover === null || hover === i ? 1 : 0.45}
                style={{ transition: 'stroke-width 150ms, opacity 150ms' }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            )
            offset += dash
            return seg
          })}
        </g>
        <text x={c} y={c - 4} textAnchor="middle" className="fill-on-surface"
          style={{ fontSize: 26, fontWeight: 700 }}>
          {hover === null ? total : data[hover].value}
        </text>
        <text x={c} y={c + 16} textAnchor="middle" fill={INK} style={{ fontSize: 11 }}>
          {hover === null ? 'total' : data[hover].label}
        </text>
      </svg>

      <ul className="flex-1 w-full space-y-2.5">
        {data.map((d, i) => (
          <li
            key={d.label}
            className="flex items-center gap-3"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: SERIES[i % SERIES.length] }} />
            <span className="text-body-sm text-on-surface flex-1 capitalize">{d.label}</span>
            <span className="text-label-lg text-on-surface tabular-nums">{d.value}</span>
            <span className="text-body-sm text-on-surface-variant tabular-nums w-11 text-right">
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Horizontal ranking bars — magnitude by category, one hue. */
export function RankBars({ data, format = (v) => v, max: maxOverride }) {
  const max = niceMax(maxOverride ?? Math.max(...data.map((d) => d.value), 0))
  if (!data.length) {
    return <p className="text-body-sm text-outline py-6 text-center">Nothing to rank yet</p>
  }
  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.label}>
          <div className="flex justify-between gap-3 mb-1.5">
            <span className="text-body-sm text-on-surface truncate">{d.label}</span>
            <span className="text-label-lg text-on-surface tabular-nums shrink-0">{format(d.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${max ? (d.value / max) * 100 : 0}%`, backgroundColor: SERIES[0] }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
