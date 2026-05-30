# Vitto — Loan Application Portal

A full-stack portal for managing loan applications. Borrowers submit applications via a public form; the ops team reviews and approves or rejects them through a protected dashboard. Built as part of Vitto's FSE intern assessment.

**Live:** https://vitto-assignment-j8ye.vercel.app  
**API:** https://vitto-assignment-cdgt.onrender.com

---

## Stack

- **Frontend** — React 18 + Vite, deployed on Vercel
- **Backend** — Node.js + Express, deployed on Render
- **Database** — PostgreSQL on Neon (free tier)

---

## Running locally

You'll need Node 18+ and a PostgreSQL database (or a free Neon project at neon.tech).

**Backend**

```bash
git clone https://github.com/Ayush-04-spec/Vitto_assignment
cd Vitto_assignment/backend
npm install
cp .env.example .env
```

Fill in `.env`:

```
DATABASE_URL=your_neon_connection_string
JWT_SECRET=any_long_random_string
PORT=3001
```

Run the migration in your database:

```bash
psql $DATABASE_URL -f migrations/001_init.sql
psql $DATABASE_URL -f migrations/002_add_users.sql
```

Seed the admin user:

```bash
node src/seed.js
```

Start the server:

```bash
npm run dev
```

**Frontend**

```bash
cd ../frontend
npm install
cp .env.example .env
```

Fill in `.env`:

```
VITE_API_URL=http://localhost:3001
```

```bash
npm run dev
```

App runs at http://localhost:5173

---

## API

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/applications | No | Submit a loan application |
| GET | /api/applications | Yes | List applications (?status= filter) |
| PATCH | /api/applications/:id/status | Yes | Approve or reject |
| GET | /api/summary | Yes | Dashboard stats |
| POST | /api/auth/login | No | Get JWT token |
| POST | /api/auth/verify | Yes | Validate existing token |

Protected routes expect `Authorization: Bearer <token>` header.

---

## Dashboard access

The dashboard is behind a login. Default admin account (created by the seed script):

```
Email:    admin@vitto.com
Password: admin123
```

---

## Known issues

- Render's free tier spins down after 15 minutes of inactivity. First request after that takes around 30 seconds. Subsequent requests are fast.
- No duplicate mobile number check — the same borrower can submit multiple applications. Would add a UNIQUE constraint on mobile in a follow-up.
- No pagination on the dashboard table yet.

---

## What I'd change with more time

- Swap localStorage for httpOnly cookies for the JWT — more secure against XSS
- Add rate limiting on the login endpoint
- Pagination once there are more than ~50 applications
- Some kind of notification (SMS/WhatsApp) when a status changes — fits how Vitto's borrowers actually communicate
