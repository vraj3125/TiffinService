# TiffinConnect — Test Data & Walkthrough

Accounts and scripted scenarios for exercising the whole platform: customer,
kitchen partner and admin.

> **Read this first.** Accounts are real Firebase Auth users, so they cannot be
> seeded from a file — you create each one through the signup form. Everything
> else (orders, subscriptions, applications, documents) is stored per account in
> **this browser's** localStorage.
>
> **Use one browser profile for all of it.** The verification queue and the admin
> figures only see accounts that signed up in the same browser. Switching to
> incognito or another browser starts from zero.

---

## Before you start

1. `npm run dev` → http://localhost:5173
2. Check `.env.local` has your Firebase keys, or signup will run in demo mode.
3. Confirm `VITE_ADMIN_EMAILS` contains the admin address below.
4. Password for every test account: **`Test@1234`** (any 6+ characters works).

To start completely clean at any point: DevTools → Application → Local Storage →
`http://localhost:5173` → delete keys beginning `tc:`. That wipes app data but
**not** the Firebase accounts — those persist, so reuse the same emails.

---

## 1. Admin account

| Field | Value |
|---|---|
| Email | `admin@tiffinconnect.in` |
| Password | `Test@1234` |
| Role at signup | Customer |

Role does not matter — admin comes from the email allowlist. After logging in,
**Verification** appears in the navbar and `/admin` opens.

---

## 2. Kitchen partner accounts

Sign up each with role **Service Provider**. The area is required at signup.

| # | Business name | Email | Area | Suggested cuisine |
|---|---|---|---|---|
| K1 | Narushi Tiffin | `k1@test.in` | Gotri | Gujarati |
| K2 | Ba Ni Thali | `k2@test.in` | Alkapuri | Gujarati, Kathiawadi |
| K3 | Shreeji Rasoi | `k3@test.in` | Sayajigunj | Jain |
| K4 | Punjab Da Tadka | `k4@test.in` | Fatehgunj | Punjabi |
| K5 | Amba Home Kitchen | `k5@test.in` | Karelibaug | Gujarati |
| K6 | Dakshin Ghar | `k6@test.in` | Subhanpura | South Indian |
| K7 | Manjalpur Meals | `k7@test.in` | Manjalpur | North Indian |
| K8 | Padra Tiffin Seva | `k8@test.in` | Padra | Gujarati |

**Take each to a different state** so every admin queue has something in it:

| Kitchen | Leave it at | How |
|---|---|---|
| K1, K2 | **Awaiting review** | Complete the checklist, press Submit for verification |
| K3, K4 | **Approved** | Submit, then approve from `/admin` |
| K5 | **Changes requested** | Submit, then Request changes with a note |
| K6 | **Declined** | Submit, then Decline with a note |
| K7 | **Suspended** | Submit → Approve → Suspend with a note |
| K8 | **Not submitted** | Sign up only; leave the profile blank |

### Completing a kitchen profile

Business Profile (`/provider/verification`):

- **Business Details** → Owner name, FSSAI number (any 14 digits, e.g.
  `12345678901234`), kitchen address, phone → **Save Details**
- **Kitchen Locations** → the signup area is already there. Add a second for K2
  and K4 to test multi-branch matching. Set a radius per branch.
- **Documents** → upload all three. Any PDF or image works; use different files
  so you can tell them apart in the review screen.
- **Kitchen Photos** → add two or three.
- **Submit for verification** (only enables at 5/5 on the checklist)

---

## 3. Customer accounts

Sign up each with role **Customer**. Phone and city are set later in Profile.

| # | Name | Email | Area to save | What to do with it |
|---|---|---|---|---|
| C1 | Vraj Prajapati | `c1@test.in` | Alkapuri | Two subscriptions, one paused |
| C2 | Ananya Desai | `c2@test.in` | Gotri | One monthly plan, skip a day |
| C3 | Rohan Patel | `c3@test.in` | Karelibaug | One weekly plan, pay by card |
| C4 | Meera Shah | `c4@test.in` | Akota | One plan, cash on delivery |
| C5 | Kunal Joshi | `c5@test.in` | Manjalpur | One-time plan |
| C6 | Priya Mehta | `c6@test.in` | Sayajigunj | Two orders from one kitchen |
| C7 | Nikita Jain | `c7@test.in` | Fatehgunj | Subscribe, then cancel |
| C8 | Sanjay Rao | `c8@test.in` | Dabhoi | Sign up only — no orders |

C8 is deliberately empty: it proves a new account starts blank, and Dabhoi is
outside every kitchen's radius, so Discover should show nothing there.

Vary the **payment method** across C1–C7 (UPI, Card, Cash) so the Payments page
has a real spread rather than one method.

### Placing an order

1. **Explore** → open the filter → set *Deliver to* → pick the customer's area
2. Open a kitchen → choose a plan → **Subscribe**
3. Checkout → add an address (street, area, 6-digit pincode) → pick a payment
   method → **Place order**
4. It appears under **Subscriptions**

---

## 4. Scenarios worth running

### A. New account starts empty
Sign in as **C8**. Subscriptions, Orders and Profile addresses should all be
empty. Sign in as **K8**: dashboard shows zeros, a flat chart, and the orange
"finish setting up" banner. *This is the fix for shared demo data — nothing from
another account should be visible.*

### B. Delivery radius decides visibility
As **C1** (Alkapuri) search Discover — kitchens in Alkapuri plus any whose radius
reaches it, nearest first. Now search **Dabhoi**: nothing, because no kitchen
covers it. Give K2 a second branch in Karelibaug and it should appear for a
Karelibaug customer too.

### C. Checklist only ticks on save
On **K1**, type into Owner name but do **not** save. The checklist item stays
open. Press Save Details and it moves to "Saved, not yet submitted". It only
turns green after an admin approves.

### D. Full verification loop
Submit **K1** → admin sees it under *Pending Verification* → Review → preview each
document inline → **Approve**. Back as K1: banner gone, checklist green,
documents read *Verified*.

### E. Changes requested, then fixed
Submit **K5** → admin **Request changes** with "Licence photo is unreadable". As
K5 the note appears with a **Resubmit** button. Fix and resubmit → it returns to
*Pending* and the old note clears.

### F. Decline and reopen
Submit **K6** → admin **Decline application** (note required; a confirm dialog
appears). As K6 the submit button disappears — a declined application cannot be
resubmitted. Back in admin, **Reopen for review** puts it back in the queue.

### G. Suspend an approved kitchen
Approve **K7**, then **Suspend** with a reason. K7's dashboard shows the
suspension. **Reinstate** restores it. Check *Decision history* in the review
modal — every step, with notes and timestamps.

### H. Subscription controls
As **C2**, skip tomorrow's meal, then pause the plan. Reload the page — both
should persist. Resume it.

### I. Admin dashboard reflects reality
With the above in place, `/admin` should show: 8 customers, kitchens split across
the queues, real order and revenue bars for today, a plan-mix donut, and a
**Needs attention** panel listing the pending and changes-requested counts.
Clicking an item goes to the right queue.

### J. Session survives a refresh
Log in, press F5. You stay logged in. Only **Logout** signs you out.

### K. Password reset
**Forgot password?** → enter a real address you control → the email arrives.
(Until the Firebase console action URL is set, the link opens Firebase's own
page rather than `/reset-password`.)

---

## 5. Admin action reference

What is available from each state, and whether a note is required.

| Application state | Actions | Note required |
|---|---|---|
| Awaiting review | Approve · Request changes · Decline | changes, decline |
| Changes requested | Approve · Edit note · Decline · Reopen | edit, decline |
| Approved | Suspend | yes |
| Declined | Reopen | no |
| Suspended | Reinstate · Reopen | reinstate confirms only |
| Not submitted | — | — |

**There is no delete.** That is deliberate: the queue's job is to record why a
kitchen was approved or refused, and deleting the record destroys exactly the
thing you would need if the decision were ever questioned. Every action is
reversible instead — a wrong decline is fixed with **Reopen**, not by starting
over — and each one is appended to the decision history with its note, timestamp
and who acted.

Declining, suspending and reinstating ask for confirmation, and the dialog says
what actually happens (suspension removes the kitchen from search but does not
cancel existing customers).

---

## 6. Quick checklist

- [ ] Admin account created and `/admin` opens
- [ ] 8 kitchens signed up, one per state
- [ ] 8 customers signed up, 7 with orders
- [ ] Payment methods vary across UPI, Card and Cash
- [ ] At least one kitchen has two branches
- [ ] New account (C8/K8) shows genuinely empty screens
- [ ] Discover respects the delivery radius
- [ ] Approve, request changes, decline, suspend, reinstate and reopen all work
- [ ] Decision history shows every step
- [ ] Dashboard KPIs, charts and Needs Attention match what you created
- [ ] Sidebar collapses on a narrow window; tables scroll sideways
- [ ] Refresh keeps you signed in

---

## 7. What you cannot test without a backend

Worth knowing so you don't chase these as bugs:

- **Cross-device anything.** Accounts, orders and the review queue are per
  browser. A kitchen that applied on a phone is invisible to an admin on a laptop.
- **Failed payments and refunds.** No gateway is connected, so there is nothing
  to fail. The Payments page says so rather than showing a fabricated zero.
- **Real signup dates.** Customer growth is dated by first order, the only date
  that exists.
- **A newly registered kitchen appearing on Discover.** The public catalogue is
  separate seed data; approval does not add a kitchen to it yet.
- **Email delivery to the `@test.in` addresses.** They are not real mailboxes, so
  verification and reset emails go nowhere. Use an address you control if you
  want to test those.
