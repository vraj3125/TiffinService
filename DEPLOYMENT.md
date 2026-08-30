# Deploying TiffinConnect with a backend

The API lives in `/api` as Vercel Serverless Functions — same repo, same deploy,
same domain. There is no second server to host and no CORS to configure.

Currently on the backend: **the kitchen verification queue.** Everything else
still uses per-browser storage; see [FEATURES.md](FEATURES.md).

---

## What you need

| | Why | Cost |
|---|---|---|
| MongoDB Atlas account | The database | Free (M0, 512 MB) |
| Firebase service account key | Verifying ID tokens server-side | Free |
| Vercel project | Already have one | Free (Hobby) |

---

## 1. MongoDB Atlas

1. [cloud.mongodb.com](https://cloud.mongodb.com) → sign up → **Create** a free
   **M0** cluster. Pick a region near you (Mumbai `ap-south-1` for India).
2. **Database Access** → Add New Database User → username and password →
   **Read and write to any database**. Save the password.
3. **Network Access** → Add IP Address → **Allow access from anywhere**
   (`0.0.0.0/0`).
   Serverless functions have no fixed IP, so this is required. The database is
   still protected by the username and password.
4. **Connect** → **Drivers** → copy the string. It looks like:

```
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Replace `PASSWORD` with the real one. If it contains `@`, `:` or `/`,
percent-encode it (`@` → `%40`).

---

## 2. Firebase service account

The API verifies ID tokens, which needs admin credentials.

1. Firebase console → **⚙ Project settings** → **Service accounts**
2. **Generate new private key** → downloads a JSON file
3. Keep the whole file contents — you will paste it as one environment variable

**Treat this like a password.** It can act as any user in your project. Never
commit it, never put it in a `VITE_` variable (those are compiled into the
browser bundle).

If the dashboard mangles the newlines in `private_key`, base64 it instead — the
code accepts either:

```bash
base64 -w0 serviceAccount.json
```

---

## 3. Vercel environment variables

Project → **Settings** → **Environment Variables**. Add for **Production** and
**Preview**.

**Server-only** — no `VITE_` prefix, so they stay out of the browser:

| Name | Value |
|---|---|
| `MONGODB_URI` | the Atlas string from step 1 |
| `MONGODB_DB` | `tiffinconnect` |
| `FIREBASE_SERVICE_ACCOUNT` | the JSON from step 2, or its base64 |
| `ADMIN_EMAILS` | `you@example.com` — same list as below |

**Client** — these are compiled into the bundle, which is fine for all of them:

| Name | Value |
|---|---|
| `VITE_USE_API` | `true` ← **this is the switch that turns the backend on** |
| `VITE_FIREBASE_*` | your six Firebase keys |
| `VITE_ADMIN_EMAILS` | your admin emails |
| `VITE_URL_PARAM_SECRET` | any random string |
| `VITE_PLACES_PROVIDER` | `photon` |

Then **Redeploy** — Vercel only picks up new variables on a fresh build.

---

## 4. Check it worked

After the redeploy, open your site and sign in as an admin.

**It is working if:** a kitchen that submits on one device appears in
`/admin/kitchens/pending` on a *different* device. That is the whole point of
this step — before it, the queue lived in one browser.

**Quick check without a second device:** submit as a kitchen, then open the site
in a private window, sign in as admin, and look at the queue. Private windows
share nothing with the normal one, so if the application is there, it came from
the server.

`/admin/settings` shows what the browser holds locally, which is now separate
from what the queue holds.

---

## 5. Local development

`npm run dev` keeps working with **no MongoDB and no Vercel CLI** — leave
`VITE_USE_API` unset in `.env.local` and the app falls back to browser storage,
exactly as before. Good for UI work.

To run the API locally:

```bash
npm i -g vercel
vercel link          # once
vercel env pull .env.local   # fetches the server variables
vercel dev           # serves the app AND /api together
```

Then set `VITE_USE_API=true` in `.env.local`.

Note `vercel env pull` writes your service account key into `.env.local` — it is
gitignored, but do not paste that file anywhere.

---

## 6. When something is wrong

| Symptom | Cause |
|---|---|
| `Sign in first.` | Not signed in, or the token expired — sign out and back in |
| `Admins only.` | Your email is not in `ADMIN_EMAILS` **on the server**. It is a separate variable from `VITE_ADMIN_EMAILS`; both need it |
| `MONGODB_URI is not configured` | Variable missing, or added after the last build — redeploy |
| `Could not reach the server` | Function did not deploy. Check Vercel → Deployments → Functions |
| `Server returned an unexpected response (404)` | `/api` did not ship. Confirm the `api/` folder is committed |
| Times out after ~8s | Atlas Network Access is not `0.0.0.0/0` |
| Queue still per-browser | `VITE_USE_API` is not `true`, or you did not redeploy after adding it |

Function logs: Vercel → your deployment → **Functions** → pick the route.

---

## 7. What this step does and does not fix

**Fixed**

- The verification queue is genuinely shared. Any admin, any device.
- The 5 MB browser storage cap no longer applies to applications.
- The admin check is real: the server verifies a Firebase ID token and refuses
  a non-admin with 403. A user cannot grant themselves access from the console.
- Transition rules and the mandatory note are enforced server-side, not only in
  the UI.
- A kitchen can only submit as itself — the uid comes from the verified token,
  not from the request body.

**Not yet**

- **Orders, subscriptions, customers and profiles are still per-browser.** The
  admin dashboard's revenue and customer figures still describe one browser.
- **Documents are still base64 in MongoDB.** It works and it is off the client,
  but object storage (Cloudinary or S3) is the right home — that is step 2, and
  it removes the 1.5 MB PDF limit.
- **Admin is still an email list**, now checked server-side. Firebase custom
  claims are step 3 and are stronger: `ADMIN_EMAILS` has to be redeployed to
  change, a claim does not.
- The provider's own document badges are mirrored into their browser after a
  decision, so a provider on another device will not see the badge change until
  step 4 moves those too.
