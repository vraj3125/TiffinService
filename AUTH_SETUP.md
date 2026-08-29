# Auth setup (Firebase)

TiffinConnect uses **Firebase Authentication** for three sign-in methods:

| Method | Firebase provider | Notes |
| --- | --- | --- |
| Email + password | Email/Password | Signup sends a verification link, then redirects to login |
| Continue with Google | Google | Popup flow, no backend needed |
| Mobile number + OTP | Phone | Invisible reCAPTCHA + SMS code |

Until you paste keys into `.env.local`, the app runs in **demo mode**: nothing hits
the network, any email/password is accepted, and the OTP is always `123456`.

---

## What I need from you

Everything below is done by you in the Firebase console — I can't create a project
or read your keys. Takes about 10 minutes.

### 1. Create the project

1. Go to <https://console.firebase.google.com> and sign in with your Google account.
2. **Add project** → name it `tiffinconnect` (or anything) → Continue.
3. Google Analytics is optional; turning it off is fine and quicker.

### 2. Register a Web app and copy the config

1. On the project home, click the **`</>`** (Web) icon.
2. Nickname it `TiffinConnect Web` → **Register app**. Skip Firebase Hosting for now.
3. You'll see a `firebaseConfig` object. Keep this tab open.
4. In the project root, copy the template and fill it in:

   ```bash
   cp .env.example .env.local
   ```

   Map the values across:

   | `firebaseConfig` key | `.env.local` variable |
   | --- | --- |
   | `apiKey` | `VITE_FIREBASE_API_KEY` |
   | `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
   | `projectId` | `VITE_FIREBASE_PROJECT_ID` |
   | `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
   | `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
   | `appId` | `VITE_FIREBASE_APP_ID` |

   You can find this again later at **Project settings → General → Your apps → SDK setup and configuration**.

> These values are public client identifiers, not secrets — they ship inside your
> JS bundle by design. `.env.local` is gitignored anyway. What actually protects
> your project is the provider settings and authorized domains below.

### 3. Enable the three sign-in providers

Go to **Build → Authentication → Get started**, then the **Sign-in method** tab.

**a. Email/Password**
- Click **Email/Password** → toggle **Enable** → **Save**.
- Leave "Email link (passwordless sign-in)" off; the app doesn't use it.

**b. Google**
- Click **Google** → toggle **Enable**.
- Set **Project public-facing name** (e.g. `TiffinConnect`) — users see this on the consent screen.
- Set **Project support email** — pick your own address from the dropdown.
- **Save**. No OAuth client ID or secret to copy; Firebase provisions it for you.

**c. Phone**
- Click **Phone** → toggle **Enable** → **Save**.
- Expand **Phone numbers for testing** and add at least one pair, e.g.
  `+91 9876543210` with code `123456`.

> **Test numbers are the free path.** They never send a real SMS, don't consume
> quota, and need no card — the code you set is the code that works. Use these
> for your demo and viva.
>
> For SMS to *real* phones, the free Spark plan allows only a small number of
> verifications per day, and Firebase may require you to upgrade to the **Blaze**
> pay-as-you-go plan (a card on file, billed per SMS). The console tells you
> exactly which when you enable the provider — check there before assuming.

### 4. Authorized domains

Under **Authentication → Settings → Authorized domains**, `localhost` is already
listed, so local dev works immediately. When you deploy, add the deployed domain
here or Google sign-in fails with `auth/unauthorized-domain`.

### 5. Restart the dev server

Vite reads env vars only at startup, so this step is not optional:

```bash
npm run dev
```

The login page subtitle stops saying "Demo mode" once the keys are picked up.

---

## Verifying it works

1. **Signup → login redirect** — Sign Up tab, fill the form, submit. You land back
   on the Log In tab with a toast, and the account appears under
   **Authentication → Users** in the console.
2. **Google** — "Continue with Google", pick an account, you land on `/discover`
   (or `/provider/dashboard`).
3. **OTP** — "Continue with mobile number", enter your *test* number, **Send OTP**,
   type the code you configured. Real numbers get a real SMS.

---

## How it's wired

| File | Role |
| --- | --- |
| [`src/lib/firebase.js`](src/lib/firebase.js) | SDK init, `isFirebaseConfigured` flag, error-code → human message map |
| [`src/context/AuthContext.jsx`](src/context/AuthContext.jsx) | All auth actions + `onAuthStateChanged` session restore |
| [`src/pages/LoginPage.jsx`](src/pages/LoginPage.jsx) | Login/signup UI, Google button, phone + OTP screens |
| [`src/components/layout/ProtectedRoute.jsx`](src/components/layout/ProtectedRoute.jsx) | Waits for session restore, then guards by role |

Sessions persist across reloads (`browserLocalPersistence`).

### Known limitation: roles are client-side

Firebase has no notion of "customer" vs "provider". Until this app has a backend,
the role picked at signup is stored in `localStorage` under `tc:role:<uid>`.

That is fine for **routing the UI**, but it is **not a security boundary** — a user
can edit localStorage and flip themselves to `provider`. Since every page reads
from `mockData.js` and there is no real data to protect, nothing is at risk today.

To make roles real you need a trusted server to set them:

1. A Cloud Function calls `admin.auth().setCustomUserClaims(uid, { role })`.
2. The client reads the role from the ID token instead of localStorage.
3. Firestore security rules check `request.auth.token.role`.

Worth doing before this handles real orders or payments.
