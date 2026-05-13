import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { NeonButton } from "@/components/NeonButton";
import { CodePreview } from "@/components/CodePreview";
import { PricingCard } from "@/components/PricingCard";
import { AIChatBox, Message } from "@/components/AIChatBox";
import { Loader2, Star, Shield, Clock, Users, ArrowUpRight, Check, ChevronDown, Menu, X } from "lucide-react";

const styles = `
*, *::before, *::after { box-sizing: border-box; }

.card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  transition: all 0.3s ease;
}
.card:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(99,102,241,0.2);
  box-shadow: 0 8px 40px rgba(0,0,0,0.3);
}

.gradient-text {
  background: linear-gradient(135deg, #818cf8, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px;
  border-radius: 100px;
  font-size: 12px;
  font-family: monospace;
  letter-spacing: 0.05em;
  background: rgba(99,102,241,0.08);
  border: 1px solid rgba(99,102,241,0.15);
  color: #818cf8;
}

.input-field {
  width: 100%;
  padding: 14px 20px;
  border-radius: 12px;
  font-family: monospace;
  font-size: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: #fff;
  outline: none;
  transition: all 0.3s;
}
.input-field:focus {
  border-color: rgba(99,102,241,0.3);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.input-field::placeholder {
  color: rgba(255,255,255,0.2);
}
`;

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="section-label">{children}</div>;
}

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
      <p className="text-4xl font-bold tracking-tight" style={{ color: "#818cf8" }}>
        {prefix}{count}{suffix}
      </p>
      <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</p>
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [niche, setNiche] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: "system", content: "You are NEON-CORE AI, a SaaS architecture expert." },
  ]);

  useScrollReveal();

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
      const aiMessage: Message = { role: "assistant", content: response };
      setChatMessages((p) => [...p, aiMessage]);
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
    <div style={{ backgroundColor: "#0a0a0a", color: "#fff" }}>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-bold tracking-tight">
            <span style={{ color: "#818cf8" }}>NEON</span><span style={{ color: "rgba(255,255,255,0.9)" }}>_CORE</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-sm transition-colors"
                style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.02em" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
              >
                {link.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={20} style={{ color: "rgba(255,255,255,0.6)" }} /> : <Menu size={20} style={{ color: "rgba(255,255,255,0.6)" }} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden px-6 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="block w-full text-left py-3 px-4 rounded-lg text-sm transition-colors"
                style={{ color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.03)" }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 60%)"
        }} />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="flex justify-center mb-8 reveal opacity-0 translate-y-8 transition-all duration-700">
            <SectionLabel>AI-Powered SaaS Generation</SectionLabel>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 reveal opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: "0.1s" }}>
            From zero to{" "}
            <span className="gradient-text">production SaaS</span>
            <br />
            <span style={{ color: "rgba(255,255,255,0.9)" }}>in 48 hours</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 reveal opacity-0 translate-y-8 transition-all duration-700" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7, transitionDelay: "0.2s" }}>
            NEON-CORE AI generates a complete, production-ready Next.js SaaS boilerplate with authentication, payments, database, and deployment — tailored to your specific business niche.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8 reveal opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: "0.3s" }}>
            <input
              type="text"
              placeholder="Your business niche (e.g., Fintech, Health, E-commerce)"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="input-field"
            />
            <NeonButton
              label={isGenerating ? "Generating..." : "Generate My SaaS"}
              onClick={handleGenerate}
              disabled={isGenerating}
              color="indigo"
              size="lg"
            />
          </div>
          <div className="flex items-center justify-center gap-6 text-sm reveal opacity-0 translate-y-8 transition-all duration-700" style={{ color: "rgba(255,255,255,0.2)", transitionDelay: "0.4s" }}>
            <span className="flex items-center gap-1.5"><Shield size={14} /> 30-day guarantee</span>
            <span className="flex items-center gap-1.5"><Check size={14} /> Full ownership</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> Deploy in hours</span>
          </div>
        </div>
      </section>

      {/* CODE PREVIEW */}
      {showPreview && (
        <section className="px-6 pb-24 -mt-16">
          <div className="max-w-4xl mx-auto reveal opacity-0 translate-y-8 transition-all duration-700">
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.5)" }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F56" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#27C93F" }} />
                <span className="ml-3 text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>generated-boilerplate.ts</span>
              </div>
              <div className="h-80" style={{ background: "rgba(0,0,0,0.3)" }}>
                {isGenerating ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: "#818cf8" }} />
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Generating your boilerplate...</p>
                    </div>
                  </div>
                ) : (
                  <CodePreview code={generatedCode} isStreaming={false} language="typescript" />
                )}
              </div>
            </div>
            {!isGenerating && generatedCode && (
              <div className="mt-6 flex justify-center gap-4">
                <NeonButton label="Deploy to Production" color="indigo" size="md" onClick={() => window.open("https://buy.stripe.com/test_5kA7vC2iD1Wj3HGcCC", "_blank")} />
                <NeonButton label="Chat with AI Advisor" color="gray" size="md" onClick={() => scrollTo("ai-advisor")} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* TRUST BAR */}
      <section className="py-16 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase mb-8" style={{ color: "rgba(255,255,255,0.15)" }}>Trusted by founders and engineers at</p>
          <div className="flex flex-wrap justify-center gap-x-14 gap-y-4">
            {logos.map((logo, i) => (
              <span key={logo} className="text-sm font-bold tracking-wider" style={{ color: `rgba(255,255,255,${0.15 + i * 0.03})` }}>{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section id="solutions" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal opacity-0 translate-y-8 transition-all duration-700">
              <SectionLabel>The Problem</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-6 leading-tight">
                Every month you wait is costing you{" "}
                <span style={{ color: "#f87171" }}>$10,000+</span>
              </h2>
              <ul className="space-y-4">
                {[
                  "Agencies quote $15k–$50k and deliver in 3 months — most of which is generic setup",
                  "Months spent on tutorials and boilerplates that don't fit your specific needs",
                  "Your idea is validated. What's missing is the technical foundation to ship it",
                  "Competitors are launching and capturing market share every day",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                    <span style={{ color: "#f87171", marginTop: 5, flexShrink: 0 }}>✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: "0.15s" }}>
              <SectionLabel>The Solution</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-6 leading-tight">
                Production SaaS in{" "}
                <span style={{ color: "#34d399" }}>48 hours</span>
              </h2>
              <ul className="space-y-4">
                {[
                  "AI generates a complete Next.js codebase with auth, Stripe, database, and dashboards",
                  "Enterprise-grade architecture with best practices — no technical debt",
                  "Deploy to Vercel in one click. Live and accepting payments the same day",
                  "Full source code ownership. Extend it, scale it, own it. Zero lock-in",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                    <span style={{ color: "#34d399", marginTop: 5, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 px-6" style={{ background: "rgba(99,102,241,0.02)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal opacity-0 translate-y-8 transition-all duration-700">
            <SectionLabel>Features</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-4">
              Everything you need to launch
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
              A complete production infrastructure, generated for your exact niche.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Authentication & RBAC", desc: "Complete auth system with role-based access control, social login, session management, and security best practices built in." },
              { title: "Payment Processing", desc: "Stripe integration with subscription management, invoicing, webhooks, and revenue analytics dashboard." },
              { title: "Database Schema", desc: "PostgreSQL with Prisma ORM. Optimized migrations, relationships, and query performance for SaaS applications." },
              { title: "Admin Dashboard", desc: "Full admin panel with user management, analytics, logs, and system configuration. Ready to customize." },
              { title: "API Infrastructure", desc: "Type-safe API routes with rate limiting, caching, validation, and comprehensive error handling." },
              { title: "Deployment Pipeline", desc: "One-click deploy to Vercel with custom domain, SSL, CI/CD, and monitoring out of the box." },
            ].map((feature, i) => (
              <div key={i} className="card p-8 reveal opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: `${i * 0.05}s` }}>
                <h3 className="text-base font-semibold mb-3" style={{ color: "rgba(255,255,255,0.9)" }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal opacity-0 translate-y-8 transition-all duration-700">
            <SectionLabel>Testimonials</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-4">
              Trusted by founders worldwide
            </h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
              Here's what teams are saying after shipping with NEON-CORE.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-8 reveal opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                  "{t.text}"
                </p>
                <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.04)", paddingTop: 16 }}>
                  <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ROI CALCULATOR */}
          <div className="card p-10 md:p-14 max-w-4xl mx-auto text-center">
            <p className="text-xs tracking-widest mb-8" style={{ color: "rgba(255,255,255,0.2)" }}>ROI COMPARISON</p>
            <div className="grid md:grid-cols-3 gap-10">
              <Counter to={50} prefix="$" suffix="k" label="Average agency cost" />
              <Counter to={6} suffix=" months" label="Average agency timeline" />
              <div>
                <p className="text-4xl font-bold tracking-tight" style={{ color: "#34d399" }}>$49–$10k</p>
                <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>Your investment</p>
              </div>
            </div>
            <div className="mt-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-lg font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                Save 95% · Ship 50x faster · Own 100% of your code
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28 px-6" style={{ background: "rgba(99,102,241,0.02)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal opacity-0 translate-y-8 transition-all duration-700">
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-4">
              Choose your launch path
            </h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
              One price. Full ownership. No recurring fees.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <PricingCard
              title="Starter"
              price="$49"
              duration=""
              description="One SaaS boilerplate. Full ownership."
              features={["1 Boilerplate Generation", "Full Source Code", "Neon UI Theme", "30-Day Guarantee", "1-Click Deploy", "Email Support"]}
              color="indigo"
              onSelect={() => window.open("https://buy.stripe.com/test_28o4hC5iD9Wj3HG9AA", "_blank")}
            />
            <PricingCard
              title="Pro"
              price="$149"
              duration=""
              description="Unlimited generations. Priority support."
              features={["Unlimited Generations", "Full Source Code", "All UI Themes", "30-Day Guarantee", "Priority Support", "Team Collaboration", "Custom Domain", "API Access"]}
              isPopular={true}
              color="indigo"
              onSelect={() => window.open("https://buy.stripe.com/test_5kA7vC2iD1Wj3HGcCC", "_blank")}
            />
            <PricingCard
              title="Enterprise"
              price="$10,000"
              duration=""
              description="Done-for-you. White-glove custom build."
              features={["Custom AI Training", "1-on-1 Architecture Call", "Custom Feature Development", "White-Label Deployment", "Dedicated Support Team", "SLA Guarantee", "Source Code Ownership", "Priority API Access"]}
              color="indigo"
              onSelect={() => window.open("https://buy.stripe.com/test_5kA7vC2iD1Wj3HGcCC", "_blank")}
            />
          </div>
          <div className="text-center max-w-2xl mx-auto reveal opacity-0 translate-y-8 transition-all duration-700">
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
              <Shield size={14} className="inline mr-1" style={{ color: "#34d399" }} /> 
              Every plan includes a <strong style={{ color: "#34d399" }}>30-day money-back guarantee</strong>. No questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* AI ADVISOR */}
      <section id="ai-advisor" className="py-28 px-6">
        <div className="max-w-4xl mx-auto reveal opacity-0 translate-y-8 transition-all duration-700">
          <div className="text-center mb-12">
            <SectionLabel>AI Advisor</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-4">
              Not sure where to start? Ask the AI.
            </h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
              Describe your idea and get an instant architecture strategy.
            </p>
          </div>
          <div className="card overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <AIChatBox
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={aiLoading}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 px-6" style={{ background: "rgba(99,102,241,0.02)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 reveal opacity-0 translate-y-8 transition-all duration-700">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-4">
              Common questions
            </h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
              Everything you need to know before getting started.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card overflow-hidden reveal opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: `${i * 0.05}s`, borderColor: openFaq === i ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>{faq.q}</span>
                  <ChevronDown size={16} style={{ color: "rgba(255,255,255,0.2)", transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s", flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight reveal opacity-0 translate-y-8 transition-all duration-700">
            Your SaaS is ready to be{" "}
            <span className="gradient-text">built</span>
          </h2>
          <p className="text-lg mb-10 reveal opacity-0 translate-y-8 transition-all duration-700" style={{ color: "rgba(255,255,255,0.4)", transitionDelay: "0.1s" }}>
            Enter your niche above and ship your production SaaS tonight.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto reveal opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: "0.2s" }}>
            <input
              type="text"
              placeholder="Enter your niche..."
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="input-field"
            />
            <NeonButton
              label={isGenerating ? "Generating..." : "Generate My SaaS"}
              onClick={handleGenerate}
              disabled={isGenerating}
              color="indigo"
              size="lg"
            />
          </div>
          <p className="mt-6 text-sm reveal opacity-0 translate-y-8 transition-all duration-700" style={{ color: "rgba(255,255,255,0.15)", transitionDelay: "0.3s" }}>
            <Shield size={14} className="inline mr-1" /> 30-day guarantee · Full ownership · No subscription
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-base font-bold tracking-tight mb-4">
            <span style={{ color: "#818cf8" }}>NEON</span><span style={{ color: "rgba(255,255,255,0.5)" }}>_CORE</span>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.1)" }}>
            © 2026 NEON-CORE AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
