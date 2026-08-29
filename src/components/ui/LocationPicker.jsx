import { useEffect, useRef, useState } from 'react'
import { MapPin, Loader2, X } from 'lucide-react'
import { attribution, resolveLocation, suggestLocations } from '../../lib/places.js'

const inputClass =
  'w-full min-h-[52px] rounded-DEFAULT border border-outline-variant bg-surface pl-11 pr-10 py-3 text-body-md text-on-surface placeholder:text-outline focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all'

/**
 * Type-ahead for locations inside the Vadodara service area.
 * Calls onSelect with { name, description, lat, lng, pincode }.
 */
export default function LocationPicker({
  value = '',
  onSelect,
  onClear,
  placeholder = 'Search an area in Vadodara',
  label,
  id = 'location',
}) {
  const [query, setQuery] = useState(value)
  const [options, setOptions] = useState([])
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const boxRef = useRef(null)

  useEffect(() => setQuery(value), [value])

  // Debounced so typing does not fire a request per keystroke.
  useEffect(() => {
    if (!open) return
    let live = true
    setBusy(true)
    const t = setTimeout(() => {
      suggestLocations(query).then((res) => {
        if (!live) return
        setOptions(res)
        setBusy(false)
      })
    }, 220)
    return () => {
      live = false
      clearTimeout(t)
    }
  }, [query, open])

  // Close when the click lands outside the field.
  useEffect(() => {
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const choose = async (option) => {
    setQuery(option.name)
    setOpen(false)
    onSelect?.(await resolveLocation(option))
  }

  const clear = () => {
    setQuery('')
    setOptions([])
    onClear?.()
  }

  return (
    <div ref={boxRef} className="relative">
      {label && (
        <label htmlFor={id} className="block text-label-md text-on-surface-variant mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input
          id={id}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          placeholder={placeholder}
          className={inputClass}
        />
        {busy ? (
          <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear location"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-outline hover:text-terracotta"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      {open && options.length > 0 && (
        <ul className="absolute z-30 mt-2 w-full max-h-72 overflow-y-auto rounded-DEFAULT border border-outline-variant bg-surface-container-lowest ambient-shadow-lg py-1">
          {options.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => choose(o)}
                className="w-full text-left px-4 py-2.5 hover:bg-surface-container-low transition-colors"
              >
                <span className="block text-body-md text-on-surface">{o.name}</span>
                <span className="block text-body-sm text-on-surface-variant">{o.description}</span>
              </button>
            </li>
          ))}
          {attribution && (
            <li className="px-4 pt-2 pb-1 border-t border-outline-variant/50 mt-1">
              <span className="text-body-sm text-outline">{attribution}</span>
            </li>
          )}
        </ul>
      )}

      {open && !busy && options.length === 0 && (
        <div className="absolute z-30 mt-2 w-full rounded-DEFAULT border border-outline-variant bg-surface-container-lowest ambient-shadow-lg px-4 py-3">
          <p className="text-body-sm text-on-surface-variant">
            Nothing in Vadodara matches that. We only deliver in and around the city.
          </p>
        </div>
      )}
    </div>
  )
}
