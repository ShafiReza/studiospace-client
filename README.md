# StudioSpace — Peer-to-Peer Creative Workspace Platform

**Live site (when deployed):** `https://your-vercel-url.vercel.app`

A high-performance peer-to-peer marketplace for creators, filmmakers, photographers, podcasters, and musicians to discover and book professional studios.

## Features
- Interactive hero slider (Swiper) with CTAs to explore / host
- Dynamic featured studios from MongoDB (top-rated / newest, limit 6)
- Browse by category with pre-filtered Explore page
- Full auth: Register, Login, Google social login (demo), JWT in HTTPOnly cookies
- Studio CRUD (add, list, update, delete) with image URL support
- Booking system with double-booking prevention
- My Bookings with status badges, cancel, and PDF invoice download
- Wishlist (heart on cards)
- Light / Dark theme toggle (system-wide)
- Sonner toast notifications (no default alerts)
- Custom 404 page and empty states
- Responsive design for mobile, tablet, and desktop
- Private routes stay authenticated on reload (cookie + /auth/me)

## Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), Tailwind CSS, JavaScript |
| UI | Custom components + Lucide icons, Sonner toasts, Swiper |
| Auth | JWT + HTTPOnly cookies, bcrypt, Google endpoint |
| Backend | Express.js, MongoDB, Mongoose |
| Optional | jsPDF for booking invoices |

## Local Setup

### 1. Backend (run first)
```bash
cd studiospace-backend
npm install
# ensure MongoDB is running
npm run seed          # optional sample data + test users
npm run dev           # http://localhost:5000
```

### 2. Frontend
```bash
cd studiospace-frontend
npm install
cp .env.local.example .env.local   # already points to localhost:5000
npm run dev                        # http://localhost:3000
```



## Project Structure (Frontend)
```
src/
  app/           # App Router pages
  components/    # UI, layout, studios, auth
  context/       # Auth + Theme
  lib/           # api client, utils
```

## Challenges Implemented
1. **JWT Security with HTTPOnly Cookies** – mutations protected; 401 on unauthorized
2. **Booking Double-Booking Prevention** – server-side overlap check on Confirmed/Pending
3. **Theme Customization** – full light/dark toggle persisted in localStorage

## Optional
- PDF Booking Invoice for confirmed bookings
- Saved Studios Wishlist (heart icon)

## Deployment notes
- Frontend: Vercel (set `NEXT_PUBLIC_API_URL` to your backend URL)
- Backend: Render / Railway (set `CLIENT_URL`, `MONGODB_URI`, `JWT_SECRET`)
- Ensure CORS `credentials: true` and matching origins
