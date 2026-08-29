import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { Textarea } from '../../components/ui/Input.jsx'
import { fetchHolidays, saveHolidays } from '../../api/provider.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function toISO(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function HolidayCalendarPage() {
  const { user } = useAuth()
  // Open on the current month rather than a fixed one, and start with this
  // kitchen's own closures -- none for a new provider.
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [holidays, setHolidays] = useState([])
  const [pendingDate, setPendingDate] = useState(null)
  const [note, setNote] = useState('')
  const { showToast } = useToast()

  useEffect(() => {
    if (!user) return
    fetchHolidays(user.uid).then(setHolidays)
  }, [user])

  const commit = (next) => {
    setHolidays(next)
    saveHolidays(user.uid, next)
  }

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const holidayMap = Object.fromEntries(holidays.map((h) => [h.date, h.note]))

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const toggleDay = (day) => {
    const iso = toISO(year, month, day)
    if (holidayMap[iso]) {
      commit(holidays.filter((x) => x.date !== iso))
      showToast('Holiday removed — deliveries resume on this day')
    } else {
      setPendingDate(iso)
      setNote('')
    }
  }

  const confirmHoliday = () => {
    commit([...holidays, { date: pendingDate, note: note || 'Marked as off-day' }])
    showToast(`Marked ${pendingDate} as a holiday`)
    setPendingDate(null)
  }

  return (
    <div className="max-w-container-max mx-auto px-6 sm:px-margin-desktop pb-section-gap">
      <h1 className="text-headline-lg text-on-surface mb-1">Leave / Holiday Calendar</h1>
      <p className="text-body-md text-on-surface-variant mb-8">Mark days your kitchen is closed. Customers won't be charged for skipped meals.</p>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant">
            <ChevronLeft size={18} />
          </button>
          <h3 className="text-headline-md text-on-surface">{MONTHS[month]} {year}</h3>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-body-sm text-on-surface-variant mb-2">
          {WEEKDAYS.map((w, i) => <div key={i}>{w}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />
            const iso = toISO(year, month, day)
            const isHoliday = !!holidayMap[iso]
            return (
              <button
                key={i}
                onClick={() => toggleDay(day)}
                className={`aspect-square rounded-DEFAULT text-body-sm font-medium flex items-center justify-center transition-colors ${
                  isHoliday ? 'bg-terracotta text-white' : 'hover:bg-surface-container-low text-on-surface'
                }`}
                title={holidayMap[iso]}
              >
                {day}
              </button>
            )
          })}
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <h3 className="text-headline-md text-on-surface mb-4">Upcoming Holidays</h3>
        {holidays.length === 0 ? (
          <p className="text-body-sm text-on-surface-variant">No holidays marked.</p>
        ) : (
          <div className="space-y-2">
            {holidays.sort((a, b) => a.date.localeCompare(b.date)).map((h) => (
              <div key={h.date} className="flex items-center justify-between p-4 rounded-DEFAULT border border-outline-variant">
                <div>
                  <p className="text-label-lg text-on-surface">{h.date}</p>
                  <p className="text-body-sm text-on-surface-variant">{h.note}</p>
                </div>
                <button
                  onClick={() => {
                    setHolidays((hs) => hs.filter((x) => x.date !== h.date))
                    showToast('Holiday removed')
                  }}
                  className="text-on-surface-variant hover:text-error"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={!!pendingDate}
        onClose={() => setPendingDate(null)}
        title={`Mark ${pendingDate} as off-day`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingDate(null)}>Cancel</Button>
            <Button onClick={confirmHoliday}>Confirm</Button>
          </>
        }
      >
        <Textarea label="Note (optional)" placeholder="e.g. Festival holiday, family function…" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
      </Modal>
    </div>
  )
}
