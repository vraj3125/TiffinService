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

---

# 8. Copy-paste example data

Fill-in values for every field. Pincodes below are the real ones the app uses,
so the location picker will match them.

## 8.1 Kitchen profiles

Business Profile → **Business Details**. FSSAI numbers are 14 digits and
invented — fine for testing, never for a live listing.

| # | Business name | Owner name | FSSAI licence | Contact phone |
|---|---|---|---|---|
| K1 | Narushi Tiffin | Nisha Rathod | `10024031000401` | `+91 98250 41001` |
| K2 | Ba Ni Thali | Hansa Patel | `10024031000402` | `+91 98250 41002` |
| K3 | Shreeji Rasoi | Jayesh Shah | `10024031000403` | `+91 98250 41003` |
| K4 | Punjab Da Tadka | Gurmeet Singh | `10024031000404` | `+91 98250 41004` |
| K5 | Amba Home Kitchen | Bhavna Solanki | `10024031000405` | `+91 98250 41005` |
| K6 | Dakshin Ghar | Lakshmi Iyer | `10024031000406` | `+91 98250 41006` |
| K7 | Manjalpur Meals | Ramesh Chauhan | `10024031000407` | `+91 98250 41007` |
| K8 | Padra Tiffin Seva | Dinesh Parmar | `10024031000408` | `+91 98250 41008` |

**Kitchen addresses**

| # | Address |
|---|---|
| K1 | 12, Sunrise Residency, Gotri Main Road, Vadodara 390021 |
| K2 | 4, Jetalpur Road, Near Sardar Estate, Alkapuri, Vadodara 390007 |
| K3 | 21, Kothi Char Rasta, Sayajigunj, Vadodara 390005 |
| K4 | 7, Fatehgunj Main Road, Opp. Circle, Vadodara 390002 |
| K5 | 33, VIP Road, Karelibaug, Vadodara 390018 |
| K6 | 9, Rajpath Club Road, Subhanpura, Vadodara 390023 |
| K7 | 15, Manjalpur Naka, Near Water Tank, Vadodara 390011 |
| K8 | 2, Station Road, Padra, Vadodara 391440 |

## 8.2 Kitchen locations (branches)

**Kitchen Locations** card. K2 and K4 get a second branch to test multi-branch
matching — a customer in the second area should find them.

| # | Branch 1 (name · area · radius) | Branch 2 |
|---|---|---|
| K1 | Main kitchen · Gotri · **6 km** | — |
| K2 | Main kitchen · Alkapuri · **5 km** | Karelibaug branch · Karelibaug · **4 km** |
| K3 | Main kitchen · Sayajigunj · **7 km** | — |
| K4 | Main kitchen · Fatehgunj · **5 km** | Gorwa branch · Gorwa · **5 km** |
| K5 | Main kitchen · Karelibaug · **4 km** | — |
| K6 | Main kitchen · Subhanpura · **8 km** | — |
| K7 | Main kitchen · Manjalpur · **5 km** | — |
| K8 | Main kitchen · Padra · **3 km** | — |

K8's 3 km radius from Padra deliberately reaches nothing in the city — useful for
checking that the radius filter actually excludes.

## 8.3 Weekly menu

Menu screen, per day, lunch and dinner. Two days is enough to test; fill more if
you want the week to look complete.

**K1 / K2 / K5 — Gujarati**

| Day | Meal | Items | Veg | kcal |
|---|---|---|---|---|
| Monday | Lunch | Rotli, Dal, Bhaat, Bataka nu Shaak, Chaas | Yes | 620 |
| Monday | Dinner | Thepla, Kadhi, Khichdi, Athanu | Yes | 560 |
| Tuesday | Lunch | Rotli, Sev Tameta nu Shaak, Dal, Bhaat | Yes | 590 |
| Tuesday | Dinner | Bhakri, Ringan no Olo, Chaas | Yes | 540 |

**K3 — Jain** (no onion, no garlic, no root vegetables)

| Day | Meal | Items | Veg | kcal |
|---|---|---|---|---|
| Monday | Lunch | Rotli, Toor Dal, Bhaat, Dudhi nu Shaak | Yes | 570 |
| Monday | Dinner | Khichdi, Kadhi, Papad | Yes | 500 |

**K4 — Punjabi**

| Day | Meal | Items | Veg | kcal |
|---|---|---|---|---|
| Monday | Lunch | Rajma, Jeera Rice, Roti (4), Salad | Yes | 710 |
| Monday | Dinner | Dal Makhani, Roti (3), Jeera Rice | Yes | 680 |

**K6 — South Indian**

| Day | Meal | Items | Veg | kcal |
|---|---|---|---|---|
| Monday | Lunch | Sambar, Rice, Beans Poriyal, Rasam, Curd | Yes | 600 |
| Monday | Dinner | Lemon Rice, Coconut Chutney, Papad | Yes | 520 |

## 8.4 Subscription plans

Plans & Areas → **Add a plan**. Duration must start with a number — the app reads
the plan length from it.

| Plan type | Duration | Price (₹) | Meals/day | Description |
|---|---|---|---|---|
| One-Time | `1 day` | 120 | 1 | Try before you subscribe |
| Weekly | `7 days` | 700 | 1 | Seven lunches or dinners, cancel anytime |
| Monthly | `26 days` | 2400 | 1 | Best value, skip up to 4 days |
| Monthly (2 meals) | `26 days` | 4300 | 2 | Lunch and dinner every day |

Vary prices per kitchen so the revenue chart is not flat — e.g. K4 (Punjabi) at
₹850 weekly, K8 (Padra) at ₹600.

## 8.5 Customer profiles

Profile screen after signup.

| # | Full name | Phone | City | Saved address |
|---|---|---|---|---|
| C1 | Vraj Prajapati | `+91 99040 51001` | Vadodara | Home · 204, Shivalik Flats, Jetalpur Road · Alkapuri · `390007` |
| C2 | Ananya Desai | `+91 99040 51002` | Vadodara | Home · 11, Gotri Sevasi Road · Gotri · `390021` |
| C3 | Rohan Patel | `+91 99040 51003` | Vadodara | Work · 8, VIP Road, Near Genda Circle · Karelibaug · `390018` |
| C4 | Meera Shah | `+91 99040 51004` | Vadodara | Home · 30, Akota Garden Road · Akota · `390020` |
| C5 | Kunal Joshi | `+91 99040 51005` | Vadodara | Home · 5, Manjalpur Naka · Manjalpur · `390011` |
| C6 | Priya Mehta | `+91 99040 51006` | Vadodara | Home · 17, Kothi Char Rasta · Sayajigunj · `390005` |
| C7 | Nikita Jain | `+91 99040 51007` | Vadodara | Home · 3, Fatehgunj Main Road · Fatehgunj · `390002` |
| C8 | Sanjay Rao | — | — | *(leave empty)* |

## 8.6 Orders to place

This spread gives every admin screen something real: three payment methods, both
meals, four plan types, and one paused and one skipped subscription.

| Customer | Kitchen | Plan | Meal | Payment | Then do |
|---|---|---|---|---|---|
| C1 | K3 Shreeji Rasoi | Monthly | Lunch | UPI | — |
| C1 | K2 Ba Ni Thali | Weekly | Dinner | UPI | **Pause** it |
| C2 | K1 Narushi Tiffin | Monthly | Lunch | UPI | **Skip** tomorrow |
| C3 | K5 Amba Home Kitchen | Weekly | Lunch | Card | — |
| C4 | K2 Ba Ni Thali | Monthly (2 meals) | Lunch | Cash | — |
| C5 | K7 Manjalpur Meals | One-Time | Dinner | Cash | — |
| C6 | K3 Shreeji Rasoi | Weekly | Lunch | Card | — |
| C6 | K6 Dakshin Ghar | One-Time | Dinner | UPI | — |
| C7 | K4 Punjab Da Tadka | Weekly | Lunch | UPI | — |
| C8 | *none* | — | — | — | leave empty |

The two Cash orders stay **Awaiting delivery** on the Payments page until the
order is marked delivered — that is the pending-payment count on the dashboard.

## 8.7 Admin notes

Wording to paste when the action needs a note.

| Action | Kitchen | Note |
|---|---|---|
| Request changes | K5 | `The FSSAI licence photo is too blurry to read the number. Please re-upload page 1 of the certificate in good light.` |
| Decline | K6 | `The address given is a commercial unit, not a home kitchen. We only list home kitchens on TiffinConnect.` |
| Suspend | K7 | `Two customers reported stomach upset after the 14th. Suspending while we investigate; we will be in touch within 48 hours.` |
| Edit note | K5 | `The FSSAI licence photo is unreadable. Please re-upload a clear photo of page 1 showing the 14-digit number.` |
| Reinstate | K7 | *(no note needed — confirm only)* |
| Reopen | K6 | *(no note needed)* |

## 8.8 Documents to upload

Any PDF or image works. To tell them apart in the review screen, rename three
files first:

```
fssai-licence.pdf      → FSSAI License
kitchen-photos.jpg     → Kitchen Photos
owner-aadhaar.pdf      → Owner ID Proof
```

For **K5**, upload a deliberately blurry or wrong image as the licence so the
"request changes" scenario has a genuine reason behind it.

Kitchen photos: any two or three food or kitchen images. They are downscaled to
900 px automatically, so file size does not matter.
