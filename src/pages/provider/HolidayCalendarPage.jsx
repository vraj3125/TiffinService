import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { Textarea } from '../../components/ui/Input.jsx'
import { holidays as initialHolidays } from '../../mockData.js'
import { useToast } from '../../context/ToastContext.jsx'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function toISO(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function HolidayCalendarPage() {
  const [cursor, setCursor] = useState(new Date(2026, 7, 1)) // August 2026
  const [holidays, setHolidays] = useState(initialHolidays)
  const [pendingDate, setPendingDate] = useState(null)
  const [note, setNote] = useState('')
  const { showToast } = useToast()

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
      setHolidays((h) => h.filter((x) => x.date !== iso))
      showToast('Holiday removed — deliveries resume on this day')
    } else {
      setPendingDate(iso)
      setNote('')
    }
  }

  const confirmHoliday = () => {
    setHolidays((h) => [...h, { date: pendingDate, note: note || 'Marked as off-day' }])
    showToast(`Marked ${pendingDate} as a holiday`)
    setPendingDate(null)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-forest-700 mb-1">Leave / Holiday Calendar</h1>
      <p className="text-gray-500 mb-6">Mark days your kitchen is closed. Customers won't be charged for skipped meals.</p>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft size={18} />
          </button>
          <h3 className="font-display font-semibold text-forest-700">{MONTHS[month]} {year}</h3>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
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
                className={`aspect-square rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                  isHoliday ? 'bg-terracotta-500 text-white' : 'hover:bg-forest-50 text-forest-700'
                }`}
                title={holidayMap[iso]}
              >
                {day}
              </button>
            )
          })}
        </div>
      </Card>

      <Card className="p-5 mt-6">
        <h3 className="font-semibold text-forest-700 mb-4">Upcoming Holidays</h3>
        {holidays.length === 0 ? (
          <p className="text-sm text-gray-400">No holidays marked.</p>
        ) : (
          <div className="space-y-2">
            {holidays.sort((a, b) => a.date.localeCompare(b.date)).map((h) => (
              <div key={h.date} className="flex items-center justify-between p-3 rounded-xl border border-gray-200">
                <div>
                  <p className="text-sm font-semibold text-forest-700">{h.date}</p>
                  <p className="text-xs text-gray-500">{h.note}</p>
                </div>
                <button
                  onClick={() => {
                    setHolidays((hs) => hs.filter((x) => x.date !== h.date))
                    showToast('Holiday removed')
                  }}
                  className="text-gray-400 hover:text-red-500"
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
