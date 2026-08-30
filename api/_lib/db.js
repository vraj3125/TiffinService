// MongoDB connection for serverless functions.
//
// Each Vercel invocation may reuse a warm container, so the client is cached on
// globalThis. Without this, every request opens a new connection pool and Atlas
// runs out of connections under any real load.
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'tiffinconnect'

if (!uri) {
  // Fail loudly at import time rather than on the first query.
  console.error('[db] MONGODB_URI is not set')
}

let cached = globalThis.__tiffinMongo
if (!cached) {
  cached = globalThis.__tiffinMongo = { client: null, promise: null }
}

export async function getDb() {
  if (!uri) throw new Error('MONGODB_URI is not configured')
  if (cached.client) return cached.client.db(dbName)

  if (!cached.promise) {
    cached.promise = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    })
      .connect()
      .catch((err) => {
        // Let the next request try again instead of caching a failure.
        cached.promise = null
        throw err
      })
  }

  cached.client = await cached.promise
  return cached.client.db(dbName)
}

export const applications = async () => (await getDb()).collection('applications')

// File bytes live apart from the application document so listing the queue
// never drags megabytes of base64 with it. Step 2 swaps this for object storage
// without changing the shape the client sees.
export const applicationFiles = async () => (await getDb()).collection('applicationFiles')

export async function ensureIndexes() {
  const col = await applications()
  await col.createIndex({ uid: 1 }, { unique: true })
  await col.createIndex({ status: 1, submittedAt: -1 })
  const files = await applicationFiles()
  await files.createIndex({ uid: 1 }, { unique: true })
}
