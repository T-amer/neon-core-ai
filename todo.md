# NEON-CORE AI - Project TODO

## Phase 1: Design System
- [x] White/glass theme with indigo (#6366f1) as primary
- [x] Glassmorphism utilities (glass-card, glass-card-heavy, glass-card-gradient)
- [x] Global CSS with tailwind v4 + shadcn/ui
- [x] Outfit (headings) + Inter (body) fonts
- [x] Custom scrollbar, selection colors

## Phase 2: Visual Effects
- [x] Spotlight cursor follower (800px radial)
- [x] 4 ambient orbs floating in background
- [x] Particle canvas (70 interactive particles in hero)
- [x] Light beams (2 rays in hero)
- [x] Light sweep animation
- [x] Gradient borders on premium cards
- [x] Gradient text animation
- [x] Shimmer line
- [x] Dot pattern background
- [x] Mesh gradient background
- [x] Grain noise overlay
- [x] 3D tilt on cards
- [x] Magnetic buttons
- [x] Ripple effect on click
- [x] Text scramble on "production SaaS"
- [x] Typewriter effect (8 niches)
- [x] Marquee for logos in Trust Bar
- [x] Floating 3D shapes in hero
- [x] Hero parallax with mesh bg
- [x] Reading progress bar
- [x] Custom cursor ring with dot
- [x] Back to top button
- [x] Nav scroll enhancement + active section highlight
- [x] Section dividers with glow pulse
- [x] Scroll reveals (5 types: fade-up, fade-left, fade-right, scale-in, blur-in)
- [x] Section tags with glow
- [x] Staggered entrance animations

## Phase 3: Backend Infrastructure
- [ ] Express + tRPC server (needs .env variables)
- [ ] Database schema (MySQL via Drizzle)
- [ ] AI router for boilerplate generation via LLM
- [ ] OAuth integration (Manus OAuth)
- [ ] Boilerplate generation with real LLM (currently mock)

## Phase 4: Authentication & User Features
- [ ] History page (client/src/pages/History.tsx exists but disconnected)
- [ ] Connect useAuth to backend
- [ ] Download boilerplate functionality
- [ ] User boilerplate association in database

## Phase 5: Polish & Cleanup
- [x] Remove neon color remnants from components
- [x] Remove unused imports (useAuth, NeonButton)
- [x] Remove unused refs (mainRef, heroCardRef)
- [ ] Performance optimization
- [ ] Mobile responsiveness audit

## Phase 6: Delivery
- [ ] Final checkpoint and project verification
- [ ] User documentation
