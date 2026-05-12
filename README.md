# NOVA Analytics — Agent 360
**NYL-style financial advisor CRM** covering Insurance · Investments · Retirement · Advisory

---

## Project Overview
- **App name**: `nyl-agent-360` (PM2), port 3000
- **Stack**: Hono + TypeScript → Cloudflare Pages / Wrangler Pages Dev
- **Build output**: `dist/_worker.js` (sidebar/page shell) + `dist/static/app.js` (all page logic)
- **Demo agent**: Sridhar R · 247 clients · $8.1M AUM + premiums

---

## Completed Features

### INV Track (Steps 1–5) ✅
| Step | Feature | Commit |
|---|---|---|
| 1 | Investment Accounts page shell + nav | prior |
| 2 | Investment Profile FNA tab + Investment Proposal | `2401d59` |
| 3 | Account Opening (Sales p4) + Suitability Review (UW p5) | `b5ce647` |
| 4 | Account Funding & IPS tab (Policy Delivery p6) | `941b77d` |
| 5 | Annual Review tab (Investment Accounts) | `d70c2ca` |
| fix | Investment Accounts KPI bar + AI banner CSS | `df6f56e` |

### RET Track (Steps 1–2) ✅
| Step | Feature | Commit |
|---|---|---|
| 1+2 | Annuity Accounts page: sidebar nav, 6 contracts, 6-tab detail panel, KPI bar, AI banner, income gap scan | `5ffb2dc` |
| fix | RETIREMENT nav missing from dist/_worker.js — worker patch | `6d8f45c` |

### Core Pages (prior sessions)
- Dashboard, Clients, Calendar, Leads, Campaigns, Prospects
- FNA Discovery, Opportunities, Products & Illustrations, E-App & Proposals, Journey Pipeline
- Underwriting, Policy Delivery
- Policies, Policy Alerts, Claims, Upsell Track
- Business Intelligence, AI Insights, AI Agents
- Settings, Help, Spotlight search, Notification panel

---

## Navigation Structure
```
MAIN          Dashboard · Clients · Calendar
MARKETING     Leads · Campaigns · Prospects
SALES         FNA Discovery · Opportunities · Products & Illustrations · E-App & Proposals · Journey Pipeline
ONBOARDING    Underwriting · Policy Delivery
RETIREMENT    Annuity Accounts          ← RET Step 2
SERVICE       Policies · Investment Accounts · Policy Alerts · Claims · Upsell Track
ANALYTICS     Business Intelligence · AI Insights · AI Agents
              Settings · Help
```

---

## Demo Clients
| Client | Key Data |
|---|---|
| Alex Rivera | Prospect → full INV journey demo client |
| James Whitfield | ANN-JW-001 VA $150K — Active Accumulating |
| Sandra Williams | ANN-SW-001 SPIA $120K — Quote URGENT (exp May 30) |
| Linda Morrison | ANN-LM-001 FIA $200K — In Review |
| Maria Gonzalez | ANN-MG-001 Fixed $95K — ⚠️ Maturing Jun 15 (auto-opens) |
| Robert Chen | ANN-RC-001 DIA $250K — Illustration |
| Dorothy Wilson | ANN-DW-001 SPIA $120K — Quoted |

---

## Pending RET Steps
| Step | Feature | Status |
|---|---|---|
| 3 | Retirement Income Center page | ⏳ Next |
| 4 | FNA Retirement Profile tab | ⏳ |
| 5 | Upsell Track retirement upgrade path | ⏳ |

---

## ⚠️ CRITICAL: Build Pattern (vite build is BROKEN — do NOT use)

### Root Cause
`public/static/app.js` is ~2.4MB. Vite's SSR transform freezes at 300s and never completes.
`npm run build` / `npx vite build` will **always time out**. Do not attempt it.

### ✅ Correct Deploy Pattern (use for every step)

#### A — New page logic (app.js changes)
```bash
# 1. Write module file: ret_stepN_module.js
# 2. Write splice script: splice_ret_stepN.cjs  (guard: 'RET Step N module loaded')
# 3. Splice
node splice_ret_stepN.cjs
# 4. Syntax check
node --check public/static/app.js
# 5. Copy to dist (NO vite build)
cp public/static/app.js dist/static/app.js
cp public/static/style.css dist/static/style.css
```

#### B — New sidebar nav item or page template slot (src/index.tsx changes)
```bash
# Edit src/index.tsx  (source of truth for future reference)
# BUT src/index.tsx is NOT read at runtime — only dist/_worker.js is served.
# So ALSO patch dist/_worker.js directly:
node patch_worker_ret.cjs      # or a per-step equivalent
```

#### C — New CSS
```bash
cat >> public/static/style.css << 'EOF'
/* new classes */
EOF
cp public/static/style.css dist/static/style.css
```

#### D — PM2 restart + verify
```bash
pm2 restart nyl-agent-360
sleep 6
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000   # must be 200
```

#### E — Git commit (source files only — dist/ is gitignored)
```bash
git add src/index.tsx ret_stepN_module.js splice_ret_stepN.cjs \
        patch_worker_*.cjs public/static/app.js public/static/style.css
git commit -m "RET Step N: ..."
```

### Why dist/_worker.js must be patched directly
- `dist/_worker.js` is the **compiled sidebar + page shell** — it is what wrangler serves
- Editing `src/index.tsx` alone has zero runtime effect without a vite build
- The pattern is: edit `src/index.tsx` (source truth) + run a `.cjs` patch script on `dist/_worker.js`
- Patch scripts use string injection (find anchor → insert minified JSX output)

### Splice script guard pattern
```javascript
// splice_ret_stepN.cjs
const GUARD = 'RET Step N module loaded';
if (appSrc.includes(GUARD)) { console.log('Already spliced'); process.exit(0); }
fs.writeFileSync(APP_JS, appSrc + '\n\n' + modSrc + '\n');
```

### Worker patch script pattern
```javascript
// patch_worker_ret.cjs  (or per-step equivalent)
const GUARD = 'ret-accounts-nav';   // unique string from the injected content
if (src.includes(GUARD)) { console.log('Already patched'); process.exit(0); }
// Find anchor string → inject minified JSX string before/after it
src = src.replace(ANCHOR, INSERT + ANCHOR);
fs.writeFileSync(WORKER, src);
```

---

## File Map
| File | Role |
|---|---|
| `src/index.tsx` | Source of truth for sidebar nav + page template JSX. NOT served directly. |
| `dist/_worker.js` | Compiled worker — what wrangler actually serves. Must be patched directly. |
| `public/static/app.js` | All page JS logic (2.4MB). Spliced IIFEs per step. |
| `dist/static/app.js` | Runtime copy of app.js — `cp public/static/app.js dist/static/app.js` |
| `public/static/style.css` | All CSS. Append-only per step. |
| `dist/static/style.css` | Runtime copy — `cp public/static/style.css dist/static/style.css` |
| `ecosystem.config.cjs` | PM2: `nyl-agent-360`, `wrangler pages dev dist`, port 3000 |
| `ret_step2_module.js` | RET Step 2 IIFE — 6 annuity contracts, 6-tab panel |
| `splice_ret_step2.cjs` | Splice script for ret_step2_module.js |
| `patch_worker_ret.cjs` | Direct _worker.js patch — RETIREMENT nav + tpl-ret-accounts |

---

## Current Build/Test State
- **Last HTTP**: 200 ✅ (commit `6d8f45c`)
- **PM2**: `nyl-agent-360` online, port 3000
- **app.js**: 2,432,299 bytes (RET Step 2 spliced)
- **_worker.js**: 816,116 bytes (RETIREMENT nav + tpl patched)
- **Git branch**: `main`
- **Last commit**: `6d8f45c`
