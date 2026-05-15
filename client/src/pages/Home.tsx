import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { NeonButton } from "@/components/NeonButton";
import { CodePreview } from "@/components/CodePreview";
import { PricingCard } from "@/components/PricingCard";
import { AIChatBox, Message } from "@/components/AIChatBox";
import { Loader2, Star, Shield, Clock, Check, ChevronDown, Menu, X, ArrowRight, Zap, Sparkles, ChevronUp } from "lucide-react";

const styles = `
*, *::before, *::after { box-sizing: border-box; }

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-30px) scale(1.02); }
}
@keyframes float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.shimmer-line {
  background: linear-gradient(90deg, transparent, rgba(99,102,241,0.08), transparent);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}
@keyframes pulse-soft {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
@keyframes gradient-text {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes glow-border {
  0% { border-color: rgba(99,102,241,0.1); box-shadow: 0 0 0px rgba(99,102,241,0); }
  50% { border-color: rgba(99,102,241,0.2); box-shadow: 0 0 24px rgba(99,102,241,0.06); }
  100% { border-color: rgba(99,102,241,0.1); box-shadow: 0 0 0px rgba(99,102,241,0); }
}
@keyframes bg-mesh {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes grain-move {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -5%); }
  20% { transform: translate(-10%, 5%); }
  30% { transform: translate(5%, -10%); }
  40% { transform: translate(-5%, 15%); }
  50% { transform: translate(-10%, 5%); }
  60% { transform: translate(15%, 0); }
  70% { transform: translate(0, 10%); }
  80% { transform: translate(-15%, 0); }
  90% { transform: translate(10%, 5%); }
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes blur-in {
  from { opacity: 0; filter: blur(8px); transform: translateY(12px); }
  to { opacity: 1; filter: blur(0); transform: translateY(0); }
}
@keyframes fade-left {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes fade-right {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

.float { animation: float 6s ease-in-out infinite; }
.float-delayed { animation: float-delayed 8s ease-in-out infinite; }
.float-slow { animation: float 10s ease-in-out infinite; }
.pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
.glow-border { animation: glow-border 4s ease-in-out infinite; }
.light-sweep {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.light-sweep::after {
  content: ""; position: absolute; top: 0; left: -50%; width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
  animation: light-sweep 8s ease-in-out infinite;
}
@keyframes light-sweep {
  0%, 100% { left: -50%; }
  50% { left: 200%; }
}

.gradient-text {
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa, #6366f1);
  background-size: 300% 300%;
  animation: gradient-text 4s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.025;
  mix-blend-mode: overlay;
}
.grain-overlay::before {
  content: "";
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  animation: grain-move 8s steps(10) infinite;
}

.dots-bg {
  background-image: radial-gradient(rgba(99,102,241,0.06) 1px, transparent 1px);
  background-size: 24px 24px;
}

.mesh-bg {
  background: linear-gradient(135deg, rgba(99,102,241,0.03) 0%, rgba(139,92,246,0.02) 25%, rgba(167,139,250,0.03) 50%, rgba(99,102,241,0.02) 75%, rgba(99,102,241,0.03) 100%);
  background-size: 400% 400%;
  animation: bg-mesh 15s ease infinite;
}

.glass-card {
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.8);
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  will-change: transform;
}
.glass-card:hover {
  background: rgba(255,255,255,0.85);
  border-color: rgba(99,102,241,0.15);
  box-shadow: 0 8px 40px rgba(99,102,241,0.08);
}

.glass-card-heavy {
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.9);
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  will-change: transform;
}
.glass-card-heavy:hover {
  background: rgba(255,255,255,0.9);
  border-color: rgba(99,102,241,0.12);
  box-shadow: 0 12px 48px rgba(99,102,241,0.06);
}

.glass-card-gradient {
  position: relative;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  will-change: transform;
}
.glass-card-gradient::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1px;
  background: conic-gradient(from var(--angle, 0deg), rgba(99,102,241,0.15), rgba(139,92,246,0.05), rgba(167,139,250,0.15), rgba(99,102,241,0.15));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  animation: rotate-border 6s linear infinite;
}
.glass-card-gradient:hover {
  background: rgba(255,255,255,0.9);
  box-shadow: 0 12px 48px rgba(99,102,241,0.06);
}

.glass-nav {
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border-faint);
  transition: background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease;
}

.glass-btn {
  background: rgba(255,255,255,0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 12px;
  padding: 14px 28px;
  font-weight: 600;
  font-size: 15px;
  color: #6366f1;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.glass-btn:hover {
  background: rgba(99,102,241,0.1);
  border-color: rgba(99,102,241,0.3);
  box-shadow: 0 4px 20px rgba(99,102,241,0.12);
  transform: translateY(-1px);
}
.glass-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
.glass-btn .ripple-effect {
  position: absolute;
  border-radius: 50%;
  background: rgba(99,102,241,0.15);
  transform: scale(0);
  animation: ripple-out 0.6s ease-out forwards;
  pointer-events: none;
}

.glass-input {
  background: rgba(255,255,255,0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-faint);
  border-radius: 12px;
  padding: 14px 20px;
  font-size: 15px;
  color: var(--text-primary);
  outline: none;
  transition: all 0.3s ease;
  width: 100%;
}
.glass-input:focus {
  border-color: rgba(99,102,241,0.3);
  box-shadow: 0 0 0 4px rgba(99,102,241,0.08);
  background: rgba(255,255,255,0.8);
  transform: translateY(-1px);
}
.glass-input::placeholder { color: rgba(0,0,0,0.2); }

.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #6366f1;
  background: rgba(99,102,241,0.06);
  border: 1px solid rgba(99,102,241,0.1);
  transition: all 0.3s ease;
}
.section-tag:hover {
  background: rgba(99,102,241,0.1);
  border-color: rgba(99,102,241,0.2);
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
}

.spotlight {
  position: fixed;
  pointer-events: none;
  z-index: 0;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(99,102,241,0.02) 30%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
}

.cursor-ring {
  position: fixed;
  pointer-events: none;
  z-index: 99999;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(99,102,241,0.2);
  transition: width 0.3s, height 0.3s, border-color 0.3s, opacity 0.3s, background 0.3s;
  transform: translate(-50%, -50%);
}
.cursor-ring.hovering {
  width: 60px;
  height: 60px;
  border-color: rgba(99,102,241,0.3);
  background: rgba(99,102,241,0.03);
}
.cursor-ring .cursor-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(99,102,241,0.3);
  transform: translate(-50%, -50%);
  transition: background 0.3s;
}
.cursor-ring.hovering .cursor-dot {
  width: 6px;
  height: 6px;
  background: rgba(99,102,241,0.5);
}

.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  z-index: 99998;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa);
  transition: width 0.1s linear;
}

.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(99,102,241,0.06), rgba(99,102,241,0.1), rgba(99,102,241,0.06), transparent);
  margin: 0 auto;
  max-width: 70%;
  animation: divider-pulse 4s ease-in-out infinite;
}
@keyframes divider-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.typewriter-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: #6366f1;
  margin-left: 4px;
  animation: cursor-blink 0.8s step-end infinite;
  vertical-align: text-bottom;
}

.back-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 50;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99,102,241,0.15);
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
}
.back-to-top.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
}
.back-to-top:hover {
  background: rgba(99,102,241,0.1);
  border-color: rgba(99,102,241,0.3);
  transform: translateY(-2px);
}

/* Light beam */
.light-beam {
  position: absolute;
  top: -20%;
  width: 60%;
  height: 140%;
  background: linear-gradient(90deg, transparent, rgba(99,102,241,0.03), transparent);
  transform-origin: center;
  pointer-events: none;
}

/* Floating shape */
.floating-shape {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 8px 32px rgba(99,102,241,0.04);
}

/* Shape variant: triangle */
.floating-shape.tri {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  border-radius: 0;
  background: rgba(99,102,241,0.06);
  border: none;
}

/* Shape variant: rounded square */
.floating-shape.square {
  border-radius: 30%;
}

/* Marquee */
.marquee-track {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
}
.marquee-content {
  display: flex;
  gap: 56px;
  width: max-content;
  animation: marquee-scroll 30s linear infinite;
}
.marquee-track:hover .marquee-content {
  animation-play-state: paused;
}

/* Reveal animations staggered groups */
[data-reveal] {
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
[data-reveal].revealed {
  opacity: 1;
}
[data-reveal="fade-up"] { transform: translateY(30px); }
[data-reveal="fade-up"].revealed { transform: translateY(0); }
[data-reveal="fade-left"] { transform: translateX(-30px); }
[data-reveal="fade-left"].revealed { transform: translateX(0); }
[data-reveal="fade-right"] { transform: translateX(30px); }
[data-reveal="fade-right"].revealed { transform: translateX(0); }
[data-reveal="scale-in"] { transform: scale(0.9); }
[data-reveal="scale-in"].revealed { transform: scale(1); }
[data-reveal="blur-in"] { filter: blur(8px); transform: translateY(16px); }
[data-reveal="blur-in"].revealed { filter: blur(0); transform: translateY(0); }

/* Scramble text */
.scramble-char {
  display: inline-block;
  animation: scramble-reveal 0.6s ease forwards;
  opacity: 0;
}

/* Particle canvas */
#particle-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

/* Tilt cards */
[data-tilt] {
  transition: transform 0.15s ease-out;
}
`;

const typewriterNiches = [
  "Fintech", "HealthTech", "E-commerce", "SaaS Analytics",
  "EdTech", "PropTech", "LegalTech", "HR Tech",
];

const testimonials = [
  { name: "Alexandre Moreau", role: "CEO, Finlytics", text: "We launched our fintech MVP in 3 days. The code quality was production-grade — cleaner than what most senior devs produce.", rating: 5 },
  { name: "Sarah Al-Mansouri", role: "Founder, DXB Health", text: "I spent $40k+ on agencies before. NEON-CORE delivered a better product in 48 hours. The math is simple.", rating: 5 },
  { name: "Marcus Chen", role: "CTO, ScaleUp Labs", text: "We run 6 SaaS products on this architecture. Zero issues. It's become our standard stack for all new ventures.", rating: 5 },
];

const logos = ["Stripe", "Vercel", "Next.js", "Tailwind CSS", "Prisma", "Supabase"];

const faqs = [
  { q: "What exactly do I get?", a: "A complete, production-ready Next.js SaaS boilerplate with authentication, payment integration, database schema, admin dashboard, and deployment configuration — all tailored to your specific business niche." },
  { q: "Can I really deploy in 48 hours?", a: "Yes. The average deployment time is 3 hours after generation. The code is designed to deploy immediately on Vercel with zero configuration required." },
  { q: "What if I need custom features?", a: "You receive full source code with no restrictions. Your team can extend it freely. Enterprise clients also receive 1-on-1 architecture calls to plan customizations." },
  { q: "Is there a refund policy?", a: "30-day money-back guarantee, no questions asked. If the boilerplate doesn't meet your standards, you receive a full refund." },
  { q: "Do I own the code?", a: "100% yours. No licensing fees, no recurring royalties, no hidden costs. You own everything we generate." },
];

const features = [
  { title: "Authentication & RBAC", desc: "Complete auth system with role-based access control, social login, session management, and security best practices built in.", icon: "🔐" },
  { title: "Payment Processing", desc: "Stripe integration with subscription management, invoicing, webhooks, and revenue analytics dashboard.", icon: "💳" },
  { title: "Database Schema", desc: "PostgreSQL with Prisma ORM. Optimized migrations, relationships, and query performance for SaaS applications.", icon: "🗄️" },
  { title: "Admin Dashboard", desc: "Full admin panel with user management, analytics, logs, and system configuration. Ready to customize.", icon: "📊" },
  { title: "API Infrastructure", desc: "Type-safe API routes with rate limiting, caching, validation, and comprehensive error handling.", icon: "⚡" },
  { title: "Deployment Pipeline", desc: "One-click deploy to Vercel with custom domain, SSL, CI/CD, and monitoring out of the box.", icon: "🚀" },
];

async function mockBoilerplate(niche: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 2000));
  const clean = niche.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().slice(0, 20);
  return `// NEON-CORE AI — Production Boilerplate for "${niche}"
// Project: ${clean}

const project = {
  name: "${clean}",
  niche: "${niche}",
  description: "Production-grade SaaS for ${niche}",
  techStack: ["Next.js 15", "Tailwind CSS v4", "PostgreSQL", "Stripe", "Auth.js"],
  features: [
    "Authentication + RBAC",
    "Payment processing",
    "Dashboard & Analytics",
    "SEO-optimized pages",
    "API routes + Webhooks",
    "Email notifications"
  ],
  performance: { lighthouse: 96, loadTime: "0.8s" }
};

export default project;`;
}

async function mockAiResponse(prompt: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 1500));
  return `**Architecture strategy for "${prompt}"**\n\n` +
    `1. **Audit** — Analyze top 3 competitors and identify technical gaps\n` +
    `2. **Architecture** — Database schema, API design, component hierarchy\n` +
    `3. **Generation** — AI builds the complete codebase with your brand\n` +
    `4. **Deployment** — Auto-deployed on Vercel with CI/CD pipeline\n\n` +
    `*Want to dive deeper into any of these steps? I'm here 24/7.*`;
}

/* ─── PARTICLE CANVAS ─── */
function ParticleCanvas({ isVisible }: { isVisible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * 2;
      mouse.y = (e.clientY - rect.top) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    const count = 70;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        o: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          p.vx -= (dx / dist) * force * 0.02;
          p.vy -= (dy / dist) * force * 0.02;
        }

        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1) { p.vx = (p.vx / speed) * 1; p.vy = (p.vy / speed) * 1; }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.o})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 30000) {
            const alpha = (1 - Math.sqrt(d2) / 174) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [isVisible]);

  return <canvas ref={canvasRef} id="particle-canvas" />;
}

/* ─── SCRAMBLE TEXT ─── */
function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  const [display, setDisplay] = useState(text);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let frame: number;
    let step = 0;
    const totalSteps = 30;

    const scramble = () => {
      step++;
      if (step > totalSteps) {
        setDisplay(text);
        setDone(true);
        return;
      }
      const progress = step / totalSteps;
      const visibleLen = Math.floor(progress * text.length);
      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (i < visibleLen) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplay(result);
      frame = requestAnimationFrame(scramble);
    };
    frame = requestAnimationFrame(scramble);
    return () => cancelAnimationFrame(frame);
  }, [text]);

  return (
    <span className={className} style={done ? {} : {}}>
      {display}
    </span>
  );
}

/* ─── COUNTER ─── */
function Counter({ to, prefix = "", suffix = "", label }: { to: number; prefix?: string; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = Math.ceil(to / 60);
          const timer = setInterval(() => {
            start += step;
            if (start >= to) { setCount(to); clearInterval(timer); }
            else setCount(start);
          }, 25);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);
  return (
    <div ref={ref}>
      <p className="text-4xl font-bold tracking-tight" style={{ color: "#6366f1" }}>
        {prefix}{count}{suffix}
      </p>
      <p className="text-sm mt-2" style={{ color: "var(--text-quaternary)" }}>{label}</p>
    </div>
  );
}

/* ─── MAIN ─── */
export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [niche, setNiche] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const [cursorHovering, setCursorHovering] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");
  const [typewriterDeleting, setTypewriterDeleting] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: "system", content: "You are NEON-CORE AI, a SaaS architecture expert." },
  ]);
  const heroRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);

  useScrollReveal();

  /* ─── GLOBAL TILT ─── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll<HTMLElement>("[data-tilt]");
      for (const el of cards) {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (y - 0.5) * -8;
        const tiltY = (x - 0.5) * 8;
        el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
    };
    const onLeave = () => {
      const cards = document.querySelectorAll<HTMLElement>("[data-tilt]");
      for (const el of cards) {
        el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
      }
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ─── MAGNETIC BUTTONS ─── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const btns = document.querySelectorAll<HTMLElement>(".glass-btn");
      for (const btn of btns) {
        if (btn.disabled) continue;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const dist = Math.sqrt(x * x + y * y);
        const maxDist = 100;
        if (dist < maxDist) {
          const pull = (1 - dist / maxDist) * 4;
          const angle = Math.atan2(y, x);
          btn.style.transform = `translate(${Math.cos(angle) * pull}px, ${Math.sin(angle) * pull}px)`;
        } else {
          btn.style.transform = "";
        }
      }
    };
    const onLeave = () => {
      const btns = document.querySelectorAll<HTMLElement>(".glass-btn");
      for (const btn of btns) btn.style.transform = "";
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ─── RIPPLE ─── */
  const addRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    const existing = btn.querySelector(".ripple-effect");
    if (existing) existing.remove();
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  /* ─── MOUSE ─── */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* ─── CURSOR HOVER ─── */
  useEffect(() => {
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, .glass-card, .glass-card-heavy, .glass-card-gradient, input, textarea, [role=button]");
      setCursorHovering(!!isInteractive);
    };
    window.addEventListener("mouseover", handleHover);
    return () => window.removeEventListener("mouseover", handleHover);
  }, []);

  /* ─── SCROLL ─── */
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setNavScrolled(scrollTop > 50);
      setShowBackToTop(scrollTop > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ─── HERO PARALLAX ─── */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleHeroMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const bg = el.querySelector(".hero-bg") as HTMLElement;
      if (bg) bg.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
      const shapes = el.querySelectorAll<HTMLElement>(".parallax-shape");
      for (const s of shapes) {
        const speed = parseFloat(s.dataset.speed || "1");
        s.style.transform = `translate(${x * 30 * speed}px, ${y * 30 * speed}px)`;
      }
    };
    el.addEventListener("mousemove", handleHeroMove);
    return () => el.removeEventListener("mousemove", handleHeroMove);
  }, []);

  /* ─── TYPEWRITER ─── */
  useEffect(() => {
    const currentNiche = typewriterNiches[typewriterIndex];
    let timer: ReturnType<typeof setTimeout>;
    if (!typewriterDeleting) {
      if (typewriterText.length < currentNiche.length) {
        timer = setTimeout(() => setTypewriterText(currentNiche.slice(0, typewriterText.length + 1)), 80);
      } else {
        timer = setTimeout(() => setTypewriterDeleting(true), 2000);
      }
    } else {
      if (typewriterText.length > 0) {
        timer = setTimeout(() => setTypewriterText(typewriterText.slice(0, -1)), 40);
      } else {
        setTypewriterDeleting(false);
        setTypewriterIndex((prev) => (prev + 1) % typewriterNiches.length);
      }
    }
    return () => clearTimeout(timer);
  }, [typewriterText, typewriterDeleting, typewriterIndex]);

  const handleGenerate = async () => {
    if (!niche.trim()) { alert("Enter your business niche"); return; }
    setIsGenerating(true); setShowPreview(true);
    try { setGeneratedCode(await mockBoilerplate(niche)); }
    catch (e) { setGeneratedCode(`// Error: ${e instanceof Error ? e.message : "Generation failed"}`); }
    finally { setIsGenerating(false); }
  };

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = { role: "user", content };
    setChatMessages((p) => [...p, newMessage]);
    setAiLoading(true);
    try {
      const response = await mockAiResponse(content);
      setChatMessages((p) => [...p, { role: "assistant", content: response }]);
    } catch (e) { console.error(e); }
    finally { setAiLoading(false); }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const navLinks = [
    { id: "solutions", label: "Solutions" },
    { id: "features", label: "Features" },
    { id: "pricing", label: "Pricing" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div ref={mainRef} style={{ backgroundColor: "#f8f9fb", color: "var(--text-primary)", minHeight: "100vh" }}>
      <style>{styles}</style>

      {/* GRAIN OVERLAY */}
      <div className="grain-overlay" />

      {/* PROGRESS BAR */}
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* CURSOR RING */}
      <div
        className={`cursor-ring ${cursorHovering ? "hovering" : ""}`}
        style={{ left: mousePos.x, top: mousePos.y, opacity: mousePos.x < 0 ? 0 : 1 }}
      >
        <span className="cursor-dot" />
      </div>

      {/* BACK TO TOP */}
      <button
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ChevronUp size={20} />
      </button>

      {/* SPOTLIGHT */}
      <div
        className="spotlight"
        style={{ left: mousePos.x, top: mousePos.y, opacity: mousePos.x < 0 ? 0 : 1 }}
      />

      {/* AMBIENT ORBS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="float" style={{ position: "absolute", top: "5%", left: "2%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)" }} />
        <div className="float-delayed" style={{ position: "absolute", bottom: "10%", right: "3%", width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)" }} />
        <div className="float-slow" style={{ position: "absolute", top: "30%", right: "22%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.03) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "65%", left: "12%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)", animation: "float 7s ease-in-out infinite", animationDelay: "2s" }} />
      </div>

      {/* DOT PATTERN */}
      <div className="fixed inset-0 pointer-events-none z-0 dots-bg" />

      {/* NAV */}
      <nav
        className="glass-nav fixed top-0 left-0 right-0 z-50"
        style={{
          background: navScrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.7)",
          backdropFilter: navScrolled ? "blur(32px)" : "blur(20px)",
          boxShadow: navScrolled ? "0 1px 40px var(--border-faint)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-bold tracking-tight">
            <span style={{ color: "#6366f1" }}>NEON</span><span style={{ color: "var(--text-strong)" }}>_CORE</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-sm transition-all relative group"
                style={{ color: "var(--text-quaternary)", fontWeight: 500 }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-strong)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-quaternary)"}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-indigo-500 transition-all duration-300 group-hover:w-full" style={{ background: "#6366f1", borderRadius: 1 }} />
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={20} style={{ color: "var(--text-tertiary)" }} /> : <Menu size={20} style={{ color: "var(--text-tertiary)" }} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden px-6 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="block w-full text-left py-3 px-4 rounded-lg text-sm"
                style={{ color: "var(--text-tertiary)", background: "var(--bg-faint)" }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative pt-36 pb-24 px-6 overflow-hidden" style={{ zIndex: 1 }}>
        <div className="light-sweep" />
        {/* Floating 3D shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="floating-shape tri parallax-shape"
            data-speed="1.5"
            style={{ width: 60, height: 80, top: "15%", left: "8%", animation: "float-shape 8s ease-in-out infinite" }}
          />
          <div
            className="floating-shape square parallax-shape"
            data-speed="2"
            style={{ width: 50, height: 50, top: "60%", right: "6%", animation: "float-shape-2 10s ease-in-out infinite", background: "rgba(99,102,241,0.05)" }}
          />
          <div
            className="floating-shape parallax-shape"
            data-speed="1"
            style={{ width: 35, height: 35, top: "25%", right: "15%", animation: "float-shape-3 7s ease-in-out infinite", background: "rgba(99,102,241,0.04)" }}
          />
          <div
            className="floating-shape square parallax-shape"
            data-speed="1.8"
            style={{ width: 40, height: 40, top: "70%", left: "15%", animation: "float-shape-2 9s ease-in-out infinite", background: "rgba(139,92,246,0.04)" }}
          />
          <div
            className="floating-shape tri parallax-shape"
            data-speed="0.8"
            style={{ width: 45, height: 55, top: "35%", left: "90%", animation: "float-shape 11s ease-in-out infinite" }}
          />
        </div>

        {/* Light beams */}
        <div className="light-beam" style={{ left: "-10%", animation: "ray-move 12s ease-in-out infinite" }} />
        <div className="light-beam" style={{ left: "30%", animation: "ray-move-2 15s ease-in-out infinite 3s" }} />

        <div className="max-w-5xl mx-auto text-center relative" style={{ zIndex: 2 }}>
          <div ref={heroCardRef} className="glass-card-gradient p-10 md:p-16 relative overflow-hidden" data-tilt>
            <div className="hero-bg absolute inset-0 pointer-events-none mesh-bg" style={{ transition: "transform 0.1s ease-out" }} />
            <div className="shimmer-line absolute top-0 left-0 right-0 h-[1px]" />
            <ParticleCanvas isVisible={true} />
            <div className="relative" style={{ zIndex: 2, transformStyle: "preserve-3d" }}>
              <div className="flex justify-center mb-8" data-reveal="fade-up" data-stagger="hero">
                <div className="section-tag pulse-soft">
                  <Sparkles size={12} />
                  AI-Powered SaaS Generation
                </div>
              </div>
              <h1
                className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-4"
                data-reveal="blur-in"
                data-stagger="hero"
                style={{ transitionDelay: "0.15s" }}
              >
                From zero to{" "}
                <span className="gradient-text">
                  <ScrambleText text="production SaaS" />
                </span>
                <br />
                in <span style={{ color: "#6366f1" }}>48 hours</span>
              </h1>
              <div className="h-8 mb-8" data-reveal="fade-up" data-stagger="hero" style={{ transitionDelay: "0.25s" }}>
                <span className="text-base md:text-lg" style={{ color: "var(--text-quaternary)" }}>
                  Built for{" "}
                  <span style={{ color: "#6366f1", fontWeight: 600 }}>{typewriterText}</span>
                  <span className="typewriter-cursor" />
                </span>
              </div>
              <p
                className="text-lg md:text-xl max-w-3xl mx-auto mb-12"
                data-reveal="fade-up"
                data-stagger="hero"
                style={{ color: "var(--text-quaternary)", lineHeight: 1.7, transitionDelay: "0.35s" }}
              >
                NEON-CORE AI generates a complete, production-ready Next.js SaaS boilerplate with authentication, payments, database, and deployment — tailored to your specific business niche.
              </p>
              <div
                className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8"
                data-reveal="fade-up"
                data-stagger="hero"
                style={{ transitionDelay: "0.45s" }}
              >
                <input
                  type="text"
                  placeholder="Your business niche (e.g., Fintech, Health, E-commerce)"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  className="glass-input"
                />
                <button
                  onClick={(e) => { addRipple(e); handleGenerate(); }}
                  disabled={isGenerating}
                  className="glass-btn whitespace-nowrap"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Generating...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Zap size={16} /> Generate My SaaS</span>
                  )}
                </button>
              </div>
              <div
                className="flex items-center justify-center gap-6 text-sm flex-wrap"
                data-reveal="fade-up"
                data-stagger="hero"
                style={{ color: "var(--text-quaternary)", transitionDelay: "0.55s" }}
              >
                <span className="flex items-center gap-1.5"><Shield size={14} /> 30-day guarantee</span>
                <span className="flex items-center gap-1.5"><Check size={14} /> Full ownership</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> Deploy in hours</span>
                <span className="flex items-center gap-1.5"><Sparkles size={14} /> AI-generated code</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CODE PREVIEW */}
      {showPreview && (
        <section className="px-6 pb-24 -mt-16 relative" style={{ zIndex: 1 }}>
          <div className="max-w-4xl mx-auto" data-reveal="scale-in">
            <div className="glass-card-heavy overflow-hidden glow-border">
              <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--border-faint)" }}>
                <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F56" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#27C93F" }} />
                <span className="ml-3 text-xs" style={{ color: "var(--text-faint)" }}>generated-boilerplate.ts</span>
              </div>
              <div className="h-80" style={{ background: "var(--bg-faint)" }}>
                {isGenerating ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: "#6366f1" }} />
                      <p className="text-sm" style={{ color: "var(--text-quaternary)" }}>Generating your boilerplate...</p>
                    </div>
                  </div>
                ) : (
                  <CodePreview code={generatedCode} isStreaming={false} language="typescript" />
                )}
              </div>
            </div>
            {!isGenerating && generatedCode && (
              <div className="mt-6 flex justify-center gap-4">
                <button
                  className="glass-btn"
                  onClick={(e) => { addRipple(e); window.open("https://buy.stripe.com/test_5kA7vC2iD1Wj3HGcCC", "_blank"); }}
                >
                  Deploy to Production <ArrowRight size={16} style={{ marginLeft: 6, display: "inline" }} />
                </button>
                <button
                  className="glass-btn"
                  style={{ borderColor: "var(--text-faint)", color: "var(--text-tertiary)" }}
                  onClick={() => scrollTo("ai-advisor")}
                >
                  Chat with AI Advisor
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TRUST BAR (Marquee) */}
      <section className="py-20 px-6 relative" style={{ zIndex: 1 }}>
        <div className="glass-card-heavy max-w-5xl mx-auto py-12 px-8 text-center">
          <p className="text-xs tracking-widest uppercase mb-8" style={{ color: "var(--text-faint)" }}>Trusted by founders and engineers at</p>
          <div className="marquee-track">
            <div className="marquee-content">
              {[...logos, ...logos].map((logo, i) => (
                <span
                  key={i}
                  className="text-sm font-bold tracking-wider transition-all duration-300 hover:scale-110 flex-shrink-0"
                  style={{ color: "var(--text-faint)" }}
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* PROBLEM / SOLUTION */}
      <section id="solutions" className="py-20 px-6 relative" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14" data-reveal="fade-up">
            <div className="flex justify-center mb-6">
              <div className="section-tag">Why NEON-CORE?</div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-4 leading-tight" style={{ color: "var(--text-primary)" }}>
              The old way vs.{" "}
              <span className="gradient-text">the new way</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <div className="glass-card-heavy p-10" data-tilt data-reveal="fade-left" style={{ transitionDelay: "0.1s" }}>
              <div className="section-tag" style={{ borderColor: "rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.05)", color: "#ef4444" }}>
                ✕ The Problem
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-6 leading-tight" style={{ color: "var(--text-primary)" }}>
                Every month you wait is costing you{" "}
                <span style={{ color: "#ef4444" }}>$10,000+</span>
              </h2>
              <ul className="space-y-5">
                {[
                  "Agencies quote $15k–$50k and deliver in 3 months — most of which is generic setup",
                  "Months spent on tutorials and boilerplates that don't fit your specific needs",
                  "Your idea is validated. What's missing is the technical foundation to ship it",
                  "Competitors are launching and capturing market share every day",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base" style={{ color: "var(--text-quaternary)", lineHeight: 1.7 }}>
                    <span style={{ color: "#ef4444", marginTop: 5, flexShrink: 0 }}>✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card-heavy p-10" data-tilt data-reveal="fade-right" style={{ transitionDelay: "0.2s" }}>
              <div className="section-tag" style={{ borderColor: "rgba(5,150,105,0.15)", background: "rgba(5,150,105,0.05)", color: "#059669" }}>
                ✓ The Solution
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-6 leading-tight" style={{ color: "var(--text-primary)" }}>
                Production SaaS in{" "}
                <span style={{ color: "#059669" }}>48 hours</span>
              </h2>
              <ul className="space-y-5">
                {[
                  "AI generates a complete Next.js codebase with auth, Stripe, database, and dashboards",
                  "Enterprise-grade architecture with best practices — no technical debt",
                  "Deploy to Vercel in one click. Live and accepting payments the same day",
                  "Full source code ownership. Extend it, scale it, own it. Zero lock-in",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base" style={{ color: "var(--text-tertiary)", lineHeight: 1.7 }}>
                    <span style={{ color: "#059669", marginTop: 5, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 relative" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-reveal="fade-up">
            <div className="flex justify-center mb-6">
              <div className="section-tag pulse-soft"><Zap size={12} /> Features</div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-4" style={{ color: "var(--text-primary)" }}>
              Everything you need to launch
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: "var(--text-quaternary)" }}>
              A complete production infrastructure, generated for your exact niche.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass-card-heavy p-8 group"
                data-tilt
                data-reveal="blur-in"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ background: "var(--accent-bg)" }}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-quaternary)", lineHeight: 1.7 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 relative" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-reveal="fade-up">
            <div className="flex justify-center mb-6">
              <div className="section-tag"><Star size={12} /> Testimonials</div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-4" style={{ color: "var(--text-primary)" }}>
              Trusted by founders worldwide
            </h2>
            <p className="text-lg" style={{ color: "var(--text-quaternary)" }}>
              Here's what teams are saying after shipping with NEON-CORE.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="glass-card-heavy p-8"
                data-tilt
                data-reveal="fade-up"
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-quaternary)", lineHeight: 1.7 }}>
                  "{t.text}"
                </p>
                <div style={{ borderTop: "1px solid var(--border-faint)", paddingTop: 16 }}>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-quaternary)" }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ROI */}
          <div className="glass-card-heavy p-10 md:p-14 max-w-4xl mx-auto text-center" data-tilt>
            <p className="text-xs tracking-widest mb-8" style={{ color: "var(--text-faint)" }}>ROI COMPARISON</p>
            <div className="grid md:grid-cols-3 gap-10">
              <Counter to={50} prefix="$" suffix="k" label="Average agency cost" />
              <Counter to={6} suffix=" months" label="Average agency timeline" />
              <div>
                <p className="text-4xl font-bold tracking-tight" style={{ color: "#059669" }}>$49–$10k</p>
                <p className="text-sm mt-2" style={{ color: "var(--text-quaternary)" }}>Your investment</p>
              </div>
            </div>
            <div className="mt-10 pt-8" style={{ borderTop: "1px solid var(--border-faint)" }}>
              <p className="text-lg font-semibold" style={{ color: "var(--text-tertiary)" }}>
                Save 95% · Ship 50x faster · Own 100% of your code
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* PRICING */}
      <section id="pricing" className="py-20 px-6 relative" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-reveal="fade-up">
            <div className="flex justify-center mb-6">
              <div className="section-tag pulse-soft"><Sparkles size={12} /> Pricing</div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-4" style={{ color: "var(--text-primary)" }}>
              Choose your launch path
            </h2>
            <p className="text-lg" style={{ color: "var(--text-quaternary)" }}>
              One price. Full ownership. No recurring fees.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <div data-tilt><PricingCard
              title="Starter"
              price="$49"
              description="One SaaS boilerplate. Full ownership."
              features={["1 Boilerplate Generation", "Full Source Code", "Neon UI Theme", "30-Day Guarantee", "1-Click Deploy", "Email Support"]}
              color="indigo"
              onSelect={() => window.open("https://buy.stripe.com/test_28o4hC5iD9Wj3HG9AA", "_blank")}
            /></div>
            <div data-tilt><PricingCard
              title="Pro"
              price="$149"
              description="Unlimited generations. Priority support."
              features={["Unlimited Generations", "Full Source Code", "All UI Themes", "30-Day Guarantee", "Priority Support", "Team Collaboration", "Custom Domain", "API Access"]}
              isPopular={true}
              color="indigo"
              onSelect={() => window.open("https://buy.stripe.com/test_5kA7vC2iD1Wj3HGcCC", "_blank")}
            /></div>
            <div data-tilt><PricingCard
              title="Enterprise"
              price="$10,000"
              description="Done-for-you. White-glove custom build."
              features={["Custom AI Training", "1-on-1 Architecture Call", "Custom Feature Development", "White-Label Deployment", "Dedicated Support Team", "SLA Guarantee", "Source Code Ownership", "Priority API Access"]}
              color="indigo"
              onSelect={() => window.open("https://buy.stripe.com/test_5kA7vC2iD1Wj3HGcCC", "_blank")}
            /></div>
          </div>
          <div
            className="glass-card-gradient py-8 px-6 max-w-2xl mx-auto text-center"
            data-reveal="scale-in"
          >
            <p className="text-sm" style={{ color: "var(--text-faint)" }}>
              <Shield size={14} className="inline mr-1" style={{ color: "#059669" }} /> 
              Every plan includes a <strong style={{ color: "#059669" }}>30-day money-back guarantee</strong>. No questions asked.
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* AI ADVISOR */}
      <section id="ai-advisor" className="py-20 px-6 relative" style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto" data-reveal="fade-up">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="section-tag"><Sparkles size={12} /> AI Advisor</div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-4" style={{ color: "var(--text-primary)" }}>
              Not sure where to start? Ask the AI.
            </h2>
            <p className="text-lg" style={{ color: "var(--text-quaternary)" }}>
              Describe your idea and get an instant architecture strategy.
            </p>
          </div>
          <div className="glass-card-gradient overflow-hidden">
            <AIChatBox
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={aiLoading}
            />
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 relative" style={{ zIndex: 1 }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16" data-reveal="fade-up">
            <div className="flex justify-center mb-6">
              <div className="section-tag">FAQ</div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-4" style={{ color: "var(--text-primary)" }}>
              Common questions
            </h2>
            <p className="text-lg" style={{ color: "var(--text-quaternary)" }}>
              Everything you need to know before getting started.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="glass-card-heavy overflow-hidden"
                data-tilt
                data-reveal="fade-up"
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{faq.q}</span>
                  <ChevronDown size={16} style={{ color: "var(--text-faint)", transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s", flexShrink: 0 }} />
                </button>
                <div
                  style={{
                    maxHeight: openFaq === i ? "300px" : "0px",
                    opacity: openFaq === i ? 1 : 0,
                    overflow: "hidden",
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  }}
                >
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-quaternary)", lineHeight: 1.7 }}>{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FINAL CTA */}
      <section className="py-20 px-6 relative" style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto" data-reveal="scale-in">
          <div className="glass-card-gradient p-12 md:p-16 text-center relative overflow-hidden">
            <div className="mesh-bg absolute inset-0 pointer-events-none" />
            <div className="shimmer-line absolute top-0 left-0 right-0 h-[1px]" />
            <div className="relative" style={{ zIndex: 1 }}>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight" style={{ color: "var(--text-primary)" }}>
                Your SaaS is ready to be{" "}
                <span className="gradient-text">built</span>
              </h2>
              <p className="text-lg mb-10" style={{ color: "var(--text-quaternary)" }}>
                Enter your niche above and ship your production SaaS tonight.
              </p>
              <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Enter your niche..."
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  className="glass-input"
                />
                <button
                  onClick={(e) => { addRipple(e); handleGenerate(); }}
                  disabled={isGenerating}
                  className="glass-btn whitespace-nowrap"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Generating...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Zap size={16} /> Generate My SaaS</span>
                  )}
                </button>
              </div>
              <p className="mt-6 text-sm" style={{ color: "var(--text-faint)" }}>
                <Shield size={14} className="inline mr-1" /> 30-day guarantee · Full ownership · No subscription
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 relative" style={{ zIndex: 1 }}>
        <div className="glass-card-heavy max-w-7xl mx-auto py-10 px-8 text-center">
          <div className="text-base font-bold tracking-tight mb-4">
            <span style={{ color: "#6366f1" }}>NEON</span><span style={{ color: "var(--text-quaternary)" }}>_CORE</span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>
            © 2026 NEON-CORE AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ─── SCROLL REVEAL ─── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        }
      },
      { threshold: 0.08 }
    );
    const els = document.querySelectorAll("[data-reveal]");
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);
}
