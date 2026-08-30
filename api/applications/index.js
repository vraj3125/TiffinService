// GET  /api/applications        list the queue (admin only)
// POST /api/applications        submit or resubmit (the kitchen itself)
import { applications, applicationFiles, ensureIndexes } from '../_lib/db.js'
import { getCaller, route, send } from '../_lib/auth.js'
import { STATUS } from '../../src/shared/verification.js'

const stripFiles = (documents = []) =>
  documents.map((d) => ({
    ...d,
    file: d.file ? { name: d.file.name, type: d.file.type, size: d.file.size } : null,
  }))

export default route(async (req, res) => {
  const caller = await getCaller(req)
  if (!caller) return send(res, 401, { error: 'Sign in first.' })

  const col = await applications()

  if (req.method === 'GET') {
    if (!caller.isAdmin) return send(res, 403, { error: 'Admins only.' })
    const list = await col
      .find({}, { projection: { _id: 0 } })
      .sort({ submittedAt: -1 })
      .toArray()
    return send(res, 200, { applications: list })
  }

  if (req.method === 'POST') {
    await ensureIndexes()
    const payload = req.body || {}

    // A kitchen may only submit its own application.
    const uid = caller.uid
    const existing = await col.findOne({ uid })
    const now = new Date().toISOString()

    const entry = {
      ...(existing || {}),
      uid,
      kitchenName: payload.kitchenName || '',
      owner: payload.owner || '',
      fssai: payload.fssai || '',
      phone: payload.phone || '',
      address: payload.address || '',
      branches: payload.branches || [],
      documents: stripFiles(payload.documents),
      photos: (payload.photos || []).map((p) => ({ id: p.id, name: p.name })),
      status: STATUS.submitted,
      submittedAt: now,
      decidedAt: null,
      reviewNote: '',
      history: [
        ...(existing?.history || []),
        {
          action: existing ? 'resubmit' : 'submit',
          label: existing ? 'Resubmitted by kitchen' : 'Submitted by kitchen',
          from: existing?.status || STATUS.draft,
          to: STATUS.submitted,
          note: '',
          at: now,
          by: 'Kitchen',
        },
      ],
    }
    delete entry._id

    await col.updateOne({ uid }, { $set: entry }, { upsert: true })

    // File bytes go to their own collection so listing the queue stays cheap.
    const files = await applicationFiles()
    await files.updateOne(
      { uid },
      {
        $set: {
          uid,
          documents: (payload.documents || []).filter((d) => d.file),
          photos: payload.photos || [],
          updatedAt: now,
        },
      },
      { upsert: true }
    )

    return send(res, 200, { application: entry })
  }

  res.setHeader('Allow', 'GET, POST')
  return send(res, 405, { error: `${req.method} not allowed` })
})
