// GET   /api/applications/:uid   one application, with file bytes
// PATCH /api/applications/:uid   apply an admin action
import { applications, applicationFiles } from '../_lib/db.js'
import { getCaller, route, send } from '../_lib/auth.js'
import { ACTIONS, ACTION_META, STATUS, statusLabel } from '../../src/shared/verification.js'

export default route(async (req, res) => {
  const caller = await getCaller(req)
  if (!caller) return send(res, 401, { error: 'Sign in first.' })

  const { uid } = req.query
  const col = await applications()

  // A kitchen may read its own application; only an admin may read anyone's.
  const mayRead = caller.isAdmin || caller.uid === uid
  if (!mayRead) return send(res, 403, { error: 'Not your application.' })

  if (req.method === 'GET') {
    const entry = await col.findOne({ uid }, { projection: { _id: 0 } })
    if (!entry) return send(res, 404, { error: 'No application for that kitchen.' })

    // Rehydrate the bytes only for a single read, never for the list.
    const files = await (await applicationFiles()).findOne({ uid })
    const application = {
      ...entry,
      documents: (entry.documents || []).map((d) => {
        const own = files?.documents?.find((o) => o.id === d.id)
        return own?.file ? { ...d, file: own.file } : d
      }),
      photos: (entry.photos || []).map((p) => {
        const own = files?.photos?.find((o) => o.id === p.id)
        return own?.src ? { ...p, src: own.src } : p
      }),
    }
    return send(res, 200, { application })
  }

  if (req.method === 'PATCH') {
    if (!caller.isAdmin) return send(res, 403, { error: 'Admins only.' })

    const { action, reviewNote = '' } = req.body || {}
    const meta = ACTION_META[action]
    if (!meta) return send(res, 400, { error: `Unknown action: ${action}` })

    const entry = await col.findOne({ uid })
    if (!entry) return send(res, 404, { error: 'That application no longer exists.' })

    if (meta.needsNote && !String(reviewNote).trim()) {
      return send(res, 400, { error: 'This action needs a note explaining the decision.' })
    }

    // The same guard the browser applies, enforced where it counts.
    const allowed = ACTIONS[entry.status] || []
    if (!allowed.includes(action)) {
      return send(res, 409, {
        error: `Cannot ${action} an application that is ${statusLabel[entry.status]}.`,
      })
    }

    const now = new Date().toISOString()
    const update = {
      status: meta.to,
      reviewNote: meta.needsNote ? String(reviewNote).trim() : '',
      decidedAt: action === 'reopen' ? null : now,
    }
    const historyEntry = {
      action,
      label: meta.label,
      from: entry.status,
      to: meta.to,
      note: String(reviewNote).trim(),
      at: now,
      by: caller.email || 'Admin',
    }

    await col.updateOne({ uid }, { $set: update, $push: { history: historyEntry } })

    const updated = await col.findOne({ uid }, { projection: { _id: 0 } })
    const docStatus =
      meta.to === STATUS.approved ? 'verified' : meta.to === STATUS.submitted ? 'pending' : 'rejected'

    return send(res, 200, { application: updated, docStatus })
  }

  res.setHeader('Allow', 'GET, PATCH')
  return send(res, 405, { error: `${req.method} not allowed` })
})
