# TGRadar — Session Context & Handover Guide (`context_init.md`)

> **Last Updated**: August 14, 2026  
> **Status**: Production Deployed & Fully Functional  
> **Live App URL**: [https://tg-radar-neon.vercel.app/](https://tg-radar-neon.vercel.app/)  
> **GitHub Repository**: [https://github.com/Satyabrat99/TGRadar.git](https://github.com/Satyabrat99/TGRadar.git)  

---

## 1. Project Overview & Architecture

**TGRadar** is a high-performance, real-time discovery engine and directory for verified Telegram communities (Channels, Groups, Bots, and Web3 Mini Apps).

### 🛠️ Tech Stack & Key Services
- **Frontend Framework**: React (Vite 8) + TailwindCSS.
- **Authentication**: Clerk (`@clerk/clerk-react`) with Google & GitHub SSO enabled.
- **Cloud Database**: Supabase PostgreSQL (`communities` table with real-time indexing).
- **Auto-Discovery Engine**: Node.js crawler (`scripts/daily_discovery.js`) running automatically every 4 hours via GitHub Actions (`.github/workflows/daily_discovery.yml`).
- **Hosting & Deployment**: Vercel SPA (`vercel.json` rewrite routing enabled).

---

## 2. Key Environment Variables & Credentials

- **Clerk Publishable Key**: `pk_test_Z2FtZS1veXN0ZXItMzkuY2xlcmsuYWNjb3VudHMuZGV2JA`
- **Supabase URL**: `https://ihtjvkpgvgpvmimgypoq.supabase.co`
- **Supabase Anon Key**: Defined in `src/lib/supabase.js` and `.env`

---

## 3. Chronological Sequence of Completed Work

1. **Fixed Clerk Auth Localhost Mismatch**:
   - Resolved session rejection bug where `.env` had `pk_live_` instead of `pk_test_`, restoring cookie authorization on `http://localhost:5173`.
2. **Fixed "Sign In" Button Hydration in Navbar**:
   - Replaced static `<SignedIn>` / `<SignedOut>` wrappers in `src/components/Navbar.jsx` with direct `useUser()` hook state (`isLoaded && (isSignedIn ? <UserButton /> : <SignInButton />)`).
3. **Vercel SPA Deployment & Routing**:
   - Created `vercel.json` for SPA rewrites (`"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`).
   - Fixed publishable key truncation on Vercel deployment.
4. **Cloud Bookmarks & Auth-Gating**:
   - Migrated bookmarks from device `localStorage` to **Clerk Cloud User Account Metadata** (`user.unsafeMetadata.bookmarks`).
   - Auth-gated bookmark saving and drawer opening (`if (!isSignedIn) openSignIn()`).
5. **Auto-Discovery Engine Automation**:
   - Confirmed GitHub Actions workflow (`.github/workflows/daily_discovery.yml`) runs on schedule `0 */4 * * *`, populating Supabase directly without needing manual Vercel redeploys.
6. **Avatar Fallback System**:
   - Implemented reactive `onError` handling across `CommunityCard.jsx`, `CommunityModal.jsx`, `BookmarksDrawer.jsx`, and `CommunityOfTheDay.jsx`.
   - Created solid `#005bf8` electric-blue fallback badge with bold tracking initials when DP images fail.
7. **FilterBar Glassmorphism Redesign**:
   - Upgraded `src/components/FilterBar.jsx` with glassmorphic cards, segmented type controls, animated NSFW flame toggle, and live pulsing status indicator.
8. **Trending Communities Leaderboard**:
   - Redesigned rank badges in `src/components/CommunityOfTheDay.jsx` into prestigious metallic Gold (`#1` Crown 👑), Silver (`#2` Medal 🥈), and Bronze (`#3` Trophy 🥉) podium cards.
9. **Navbar & Footer Refinements**:
   - Restored 5 central menu items (*Explore*, *Categories*, *Trending*, *For Creators*, *Blog*).
   - Reduced navbar width to `max-w-[1175px]`.
   - Simplified footer links (retained Privacy Policy), connected GitHub icon to `https://github.com/Satyabrat99/TGRadar`, Telegram icon to `https://t.me/`, and wired footer Submit button to `handleOpenSubmit`.
10. **Custom Brand Favicon**:
    - Generated clean `public/favicon.svg` with electric-blue circle and white Radar graphic.
11. **Mobile Responsiveness & Edge Padding**:
    - Fixed headline text wrapping on mobile screens (`<br className="hidden sm:inline" />`).
    - Added `px-4 sm:px-6` padding across wrappers to prevent elements from touching mobile display edges.
    - Resolved newsletter button overflow and filter tab scrolling.

---

## 4. Key Component Structure & Entry Points

- **`src/App.jsx`**: Main application state, Supabase data loader, Clerk metadata sync, and modal orchestrator.
- **`src/components/Navbar.jsx`**: Floating glassmorphic header with logo, 5 nav links, bookmarks badge, submit CTA, and Clerk auth controls.
- **`src/components/Hero.jsx`**: Animated parallax hero section with live indexed counter, search bar with suggestions, and stat cards.
- **`src/components/FilterBar.jsx`**: Real-time glassmorphic category selector, search query filters, and NSFW toggle.
- **`src/components/CommunityCard.jsx`**: Primary card component for rendering channels/groups with upvotes, categories, and gold/blue verified badges.
- **`src/components/CommunityOfTheDay.jsx`**: Showcase section for top featured community and top-3 trending podium leaderboard.
- **`src/components/CommunityModal.jsx`**: High-detail popover modal for community inspection.
- **`src/components/BookmarksDrawer.jsx`**: Slide-over drawer displaying user-saved bookmarks from Clerk cloud metadata.
- **`src/components/Footer.jsx`**: Dark footer with submit CTA, privacy policy, and external social redirects.

---

## 5. How to Resume Development in a New Session

When starting a new session or handing over to a new agent:
1. Run `git status` to verify working directory is clean on `main`.
2. Start dev server: `npm run dev` (runs on `http://localhost:5173/`).
3. Test production build before pushing: `npm run build`.
4. Push all commits to `main` branch to trigger automatic live updates on Vercel (`https://tg-radar-neon.vercel.app/`).
