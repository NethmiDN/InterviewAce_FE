# InterviewAce Frontend

AI-assisted interview preparation experience built with React, TypeScript, Vite, Tailwind CSS, and React Router. The app lets candidates register, authenticate, launch AI-generated mock interviews with speech recognition, review posts from the community, and manage their profile details in a polished light/dark themed UI.

## Features

- **Marketing landing experience** – hero, CTA, and benefits sections living in `src/pages/index.tsx` with animated gradients and sticky nav.
- **Authentication + profile** – login/register, token storage, auto session hydration, profile edits, avatar upload placeholder, and password updates through `authContext` and `AuthProvider`.
- **Protected app shell** – `routes/index.tsx` guards `/home`, `/interview`, `/post`, `/my-post`, and `/user` with a `RequireAuth` wrapper and shared `Layout`/`Header` components.
- **AI interview simulator** – `pages/Interview.tsx` integrates speech synthesis/recognition to read questions aloud, capture spoken responses, and score sessions using backend prompts (`POST /ai/generate`).
- **Content feed** – `pages/Post.tsx` consumes `/post` via Axios to show paginated community posts with tags and skeleton states.
- **Design system + theming** – Tailwind is extended with a navy-to-cyan palette, gradient utilities, and a floating `ThemeToggle` backed by `themeContext`.

## Tech Stack

- React 19 + TypeScript + Vite 7
- React Router v7 for nested routes
- axios with interceptors for token refresh (`services/api.ts`)
- Tailwind CSS 3 with custom tokens and gradients (`tailwind.config.js`)
- Context API for auth and theming

## Quick Start

1. **Install dependencies**
   ```powershell
   npm install
   ```
2. **Run the dev server**
   ```powershell
   npm run dev
   ```
3. **Build for production**
   ```powershell
   npm run build
   ```
4. Preview the static build locally with `npm run preview`.

> The frontend expects the InterviewAce API at `http://localhost:5000/api/v1` (see `src/services/api.ts`). Update `baseURL` or inject an environment variable before deploying.

## API + Auth Flow

- `AuthProvider` checks `localStorage` for `accessToken`/`refreshToken`, fetches `/auth/me`, and exposes `user`, `setUser`, and `loading`.
- `services/api.ts` attaches Bearer tokens to non-public requests and automatically performs `/auth/refresh` once per failed request before redirecting to `/login`.
- Login/Register pages save tokens, hydrate profile data, and redirect to `/home`.

## Project Structure

```
src/
  components/        # Layout, Header, Logo, ThemeToggle
  context/           # authContext + themeContext providers
  pages/             # Landing, Login, Register, Home, Interview, Post, etc.
  routes/            # Router + RequireAuth wrapper
  services/          # axios instance, auth/post API helpers
  assets/            # SVGs used on the landing page
```

## Styling System

Tailwind is extended with tonal palettes (e.g. `smart_blue`, `regal_navy`, `prussian_blue`) and gradient utilities (`bg-gradient-navy`, `bg-gradient-panel`, `bg-gradient-royal`). General guidance:

- **Backgrounds** – `bg-prussian_blue_deep-100`, `bg-regal_navy-400`, or `bg-gradient-navy` for hero/section wrappers.
- **Surfaces** – use lighter tints (`regal_navy-600`, `twilight_indigo-500`) with translucent borders (`twilight_indigo-300/40`).
- **Typography** – pair `text-lavender_grey-900` for light-on-dark and `text-light_text` for dark-on-light contexts.
- **Emphasis** – CTA gradients lean on `smart_blue`, `turquoise_surf`, and `brandText` highlights.

Enable dark mode by toggling the `dark` class on `<html>` (handled via `ThemeProvider`).

## Interview Simulator Overview

1. Candidate enters role, experience, education, and question type.
2. Frontend calls `/ai/generate` to retrieve a list of questions.
3. Built-in text-to-speech (`speechSynthesis`) can read the prompt back.
4. Web Speech API streams the candidate answer, storing transcripts per question.
5. A lightweight score is computed (#answered / total) before redirecting to `/home`.

Ensure you develop in Chrome for SpeechRecognition support or detect fallbacks before shipping.

## Available NPM Scripts

| Script        | Description                                                |
|---------------|------------------------------------------------------------|
| `npm run dev` | Start Vite dev server with HMR.                            |
| `npm run build` | Type-check with `tsc -b` then emit production assets.      |
| `npm run preview` | Preview the built app locally.                           |
| `npm run lint` | Run ESLint across the workspace.                           |

## Deploying

- Replace the hard-coded `baseURL` in `src/services/api.ts` or introduce environment-driven config (`import.meta.env.VITE_API_BASE_URL`).
- Provide `https` origins for speech APIs when hosting in production.
- Serve the built `dist/` directory on any static host (Vercel, Netlify, Azure Static Web Apps, etc.).

## Accessibility Notes

- Maintain contrast ratios of 4.5:1+ for body copy (`lavender_grey-900` and `light_text` pairs hit target ratios).
- Avoid placing body text across the mid-transition of gradients; add a solid overlay such as `bg-prussian_blue-500/70 backdrop-blur-sm` when necessary.

---

Need help extending the app (new routes, more AI insights, or analytics)? Open an issue with context about the backend contract and UI expectations.

