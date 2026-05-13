import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { NeonButton } from "@/components/NeonButton";
import { CodePreview } from "@/components/CodePreview";
import { PricingCard } from "@/components/PricingCard";
import { AIChatBox, Message } from "@/components/AIChatBox";
import { Loader2, Star, Shield, Zap, Clock, Users, Rocket, Award, ChevronDown, Sparkles, Gem, Infinity, ArrowUpRight } from "lucide-react";

const globals = `
*, *::before, *::after { box-sizing: border-box; }

@keyframes float3d {
  0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
  33% { transform: translateY(-20px) rotate(1deg) scale(1.02); }
  66% { transform: translateY(-10px) rotate(-0.5deg) scale(0.98); }
}
@keyframes float3dSlow {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-15px) translateX(10px); }
  50% { transform: translateY(-5px) translateX(-5px); }
  75% { transform: translateY(-20px) translateX(15px); }
}
@keyframes orbPulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 0.6; }
}
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes shineSweep {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(300%) skewX(-15deg); }
}
@keyframes borderGlow {
  0%, 100% { border-color: rgba(0, 245, 255, 0.2); }
  50% { border-color: rgba(0, 245, 255, 0.5); }
}
@keyframes badgePulse {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 229, 0.6), 0 0 40px rgba(123, 47, 247, 0.4); }
  50% { box-shadow: 0 0 30px rgba(255, 0, 229, 0.8), 0 0 60px rgba(123, 47, 247, 0.6); }
}

.animate-float { animation: float3d 6s ease-in-out infinite; }
.animate-float-slow { animation: float3dSlow 8s ease-in-out infinite; }
.animate-float-delayed { animation: float3d 6s ease-in-out 2s infinite; }
.animate-float-slower { animation: float3d 8s ease-in-out 1s infinite; }
.animate-orb { animation: orbPulse 4s ease-in-out infinite; }
.animate-shine { animation: shineSweep 3s ease-in-out infinite; }
.animate-border-glow { animation: borderGlow 3s ease-in-out infinite; }
.gradient-text {
  background: linear-gradient(135deg, #00F5FF, #FF00E5, #7B2FF7, #00F5FF);
  background-size: 300% 300%;
  animation: gradientShift 4s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gradient-text-cyan {
  background: linear-gradient(135deg, #00F5FF, #39FF14, #00F5FF);
  background-size: 200% 200%;
  animation: gradientShift 5s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.glass-card {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 245, 255, 0.12);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.glass-card:hover {
  background: rgba(15, 15, 15, 0.7);
  border-color: rgba(0, 245, 255, 0.3);
  transform: perspective(1000px) translateZ(10px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 245, 255, 0.08);
}
.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.4s;
  background: radial-gradient(circle at 50% 0%, rgba(0, 245, 255, 0.06), transparent 60%);
  pointer-events: none;
}
.glass-card:hover::before { opacity: 1; }
`;

async function mockBoilerplate(niche: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 2000));
  const clean = niche.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().slice(0, 20);
  return `// ✦ NEON-CORE AI — Production Boilerplate for "${niche}"
// Project: ${clean}  |  Status: ready-to-deploy

const project = {
  name: "${clean}",
  niche: "${niche}",
  description: "Enterprise-grade SaaS for ${niche}",
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
  return `**Here's your personalized strategy for "${prompt}"**\n\n` +
    `1. **Audit first** — We'll analyze your top 3 competitors and identify gaps\n` +
    `2. **Custom architecture** — Database schema, API design, and component tree\n` +
    `3. **Build in 48h** — Our AI generates the entire codebase with your brand\n` +
    `4. **Deploy & scale** — Auto-deployed on Vercel with CI/CD pipeline\n\n` +
    `*Want me to deep-dive into any of these steps? I'm here 24/7.*`;
}

const testimonials = [
  { name: "Alexandre Moreau", role: "CEO, Finlytics", text: "We launched our fintech MVP in 3 days. The code quality shocked our CTO — it was cleaner than what most senior devs produce.", rating: 5 },
  { name: "Sarah Al-Mansouri", role: "Founder, DXB Health", text: "I've spent $40k+ on agencies before. This generated a better product in 48 hours. The ROI calculation writes itself.", rating: 5 },
  { name: "Marcus Chen", role: "CTO, ScaleUp Labs", text: "We run 6 SaaS products on this architecture. Zero issues. It's become our standard stack for all new ventures.", rating: 5 },
];

const logos = ["Stripe", "Vercel", "Next.js", "Tailwind CSS", "Prisma", "Supabase"];

const faqs = [
  { q: "What exactly do I get?", a: "A complete, production-ready Next.js SaaS boilerplate with auth, payments, database, dashboards, and deployment config — all tailored to your specific business niche." },
  { q: "Can I really deploy in 48 hours?", a: "Yes. Average deployment time is 3 hours after generation. The code is designed to be deployed immediately with zero configuration." },
  { q: "What if I need custom features?", a: "Your generated boilerplate includes full source code. You (or your developer) can extend it freely. Enterprise clients get 1-on-1 calls to plan customizations." },
  { q: "Is there a refund policy?", a: "30-day money-back guarantee, no questions asked. If the boilerplate doesn't meet your standards, you get every penny back." },
  { q: "Do I own the code?", a: "100% yours. No licensing fees, no recurring royalties, no hidden costs. You own everything we generate." },
];

const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-12");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

function Orb({ className, color, size }: { className?: string; color: string; size: number }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className || ""}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent)`,
        opacity: 0.15,
        filter: "blur(40px)",
      }}
    />
  );
}

function FloatingShape({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`absolute pointer-events-none ${className || ""}`} style={{ perspective: "1000px" }}>
      <div className="animate-float" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
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
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: "system", content: "You are NEON-CORE AI, a SaaS architecture expert." },
  ]);
  const heroRef = useRef<HTMLDivElement>(null);

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

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ backgroundColor: "#030303", color: "#fff", overflowX: "clip" }}>
      <style>{globals}</style>

      {/* 3D Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ perspective: "1500px" }}>
        <Orb className="top-1/4 left-1/6 animate-float-slow" color="rgba(0, 245, 255, 0.8)" size={600} />
        <Orb className="top-2/3 right-1/4 animate-float" color="rgba(255, 0, 229, 0.6)" size={500} />
        <Orb className="top-1/3 right-1/3 animate-float-slower" color="rgba(123, 47, 247, 0.5)" size={400} />
        <Orb className="bottom-1/4 left-1/3 animate-float-delayed" color="rgba(57, 255, 20, 0.4)" size={350} />
      </div>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b" style={{ backgroundColor: "rgba(3,3,3,0.8)", borderColor: "rgba(0,245,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold font-mono tracking-widest" style={{ textShadow: "0 0 20px rgba(0,245,255,0.3)" }}>
            <span style={{ color: "#00F5FF" }}>NEON</span>
            <span style={{ color: "#FF00E5" }}>_CORE</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>
            <button onClick={() => scrollTo("solutions")} className="hover:text-neon-cyan transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-neon-cyan after:transition-all after:duration-300 hover:after:w-full">Solutions</button>
            <button onClick={() => scrollTo("offer")} className="hover:text-neon-cyan transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-neon-cyan after:transition-all after:duration-300 hover:after:w-full">The Offer</button>
            <button onClick={() => scrollTo("pricing")} className="hover:text-neon-cyan transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-neon-cyan after:transition-all after:duration-300 hover:after:w-full">Pricing</button>
            <button onClick={() => scrollTo("faq")} className="hover:text-neon-cyan transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-neon-cyan after:transition-all after:duration-300 hover:after:w-full">FAQ</button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full" style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.15)", color: "rgba(0,245,255,0.5)" }}>Live Demo</span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-28 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 20%, rgba(0,245,255,0.08) 0%, rgba(255,0,229,0.03) 30%, transparent 60%)"
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(rgba(0,245,255,0.06) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }} />

        <FloatingShape className="top-32 right-12 w-20 h-20 opacity-20 hidden lg:block">
          <div style={{ width: 80, height: 80, border: "2px solid rgba(0,245,255,0.3)", borderRadius: "20%", transform: "rotate(45deg)", background: "rgba(0,245,255,0.04)" }} />
        </FloatingShape>
        <FloatingShape className="top-1/3 left-12 w-16 h-16 opacity-15 hidden lg:block">
          <div style={{ width: 60, height: 60, border: "2px solid rgba(255,0,229,0.3)", borderRadius: "50%", background: "rgba(255,0,229,0.04)" }} />
        </FloatingShape>
        <FloatingShape className="bottom-1/4 right-1/4 w-24 h-24 opacity-10 hidden lg:block">
          <div style={{ width: 90, height: 90, border: "2px solid rgba(123,47,247,0.3)", borderRadius: "30%", transform: "rotate(30deg)", background: "rgba(123,47,247,0.04)" }} />
        </FloatingShape>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider mb-8 animate-float" style={{
            background: "rgba(255,0,229,0.08)", border: "1px solid rgba(255,0,229,0.25)", color: "#FF00E5"
          }}>
            <Sparkles size={12} /> Enterprise-Grade AI • Deployed in 48 Hours
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-mono tracking-tight leading-[1.05] mb-6" style={{ perspective: "1000px" }}>
            <div style={{ transform: "translateZ(30px)" }}>
              <span className="gradient-text">From Zero</span>
              <br />
              <span style={{ color: "#fff" }}>to Revenue-Generating</span>
              <br />
              <span style={{ color: "#FF00E5", textShadow: "0 0 30px rgba(255,0,229,0.4), 0 0 60px rgba(255,0,229,0.2)" }}>SaaS in 48 Hours</span>
            </div>
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            Stop burning <strong style={{ color: "rgba(255,255,255,0.8)" }}>$10k+ on agencies</strong> and months of development. Our AI generates a production-ready Next.js SaaS — 
            with auth, payments, dashboards, and deployment — tailored to your niche and deployable <strong style={{ color: "#00F5FF" }}>tonight</strong>.
          </p>

          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-12">
            <input
              type="text"
              placeholder="Your business niche (e.g., Dental SaaS, Fintech, E-commerce...)"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="flex-1 px-6 py-4 rounded-xl font-mono text-sm focus:outline-none transition-all duration-300"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,245,255,0.15)", color: "#fff", boxShadow: "0 0 20px rgba(0,245,255,0.03)" }}
            />
            <NeonButton
              label={isGenerating ? "Generating..." : "Generate My SaaS Now"}
              onClick={handleGenerate}
              disabled={isGenerating}
              color="cyan"
              size="lg"
            />
          </div>

          <div className="flex items-center justify-center gap-6 text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>
            <span className="flex items-center gap-1.5"><Shield size={12} /> No code required</span>
            <span className="flex items-center gap-1.5"><Zap size={12} /> Deploy in 1 click</span>
            <span className="flex items-center gap-1.5"><Award size={12} /> 30-day guarantee</span>
          </div>
        </div>
      </section>

      {/* CODE PREVIEW */}
      {showPreview && (
        <section className="px-6 pb-24 -mt-20 relative z-10">
          <div className="max-w-4xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-700">
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(0,245,255,0.15)", boxShadow: "0 0 80px rgba(0,245,255,0.08)" }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: "rgba(8,8,8,0.95)", borderBottom: "1px solid rgba(0,245,255,0.08)" }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FF5F56" }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FFBD2E" }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#27C93F" }} />
                <span className="ml-3 text-xs font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>neon-core — generated</span>
              </div>
              <div className="h-96" style={{ backgroundColor: "rgba(5,5,5,0.95)" }}>
                {isGenerating ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: "#00F5FF" }} />
                      <p className="font-mono text-sm" style={{ color: "rgba(0,245,255,0.5)" }}>Architecting your SaaS foundation...</p>
                    </div>
                  </div>
                ) : (
                  <CodePreview code={generatedCode} isStreaming={false} language="typescript" />
                )}
              </div>
            </div>
            {!isGenerating && generatedCode && (
              <div className="mt-8 flex justify-center gap-4">
                <NeonButton label="Deploy to Production →" color="pink" size="md" onClick={() => window.open("https://buy.stripe.com/test_5kA7vC2iD1Wj3HGcCC", "_blank")} />
                <NeonButton label="Chat with AI Advisor" color="green" size="md" onClick={() => scrollTo("ai-advisor")} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* TRUST BAR */}
      <section className="py-14 px-6 border-y" style={{ borderColor: "rgba(0,245,255,0.04)" }}>
        <div className="max-w-5xl mx-auto text-center">
           <p className="text-xs font-mono tracking-widest uppercase mb-8" style={{ color: "rgba(255,255,255,0.15)" }}>Trusted by founders and engineers at</p>
          <div className="flex flex-wrap justify-center gap-x-14 gap-y-4">
            {logos.map((logo, i) => (
              <span key={logo} className="text-sm font-mono font-bold tracking-wider transition-all duration-500 hover:scale-110" style={{ color: `rgba(255,255,255,${0.1 + i * 0.02})` }}>{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section id="solutions" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal opacity-0 translate-y-12 transition-all duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider mb-6" style={{ background: "rgba(255,0,229,0.06)", border: "1px solid rgba(255,0,229,0.2)", color: "#FF00E5" }}>
                The Problem
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-mono tracking-tight mb-6 leading-tight">
                <span style={{ color: "#FF00E5" }}>Every month</span> you wait is costing you <span style={{ color: "#FF00E5" }}>$10,000+</span>
              </h2>
              <ul className="space-y-5">
                {[
                  "You've spent months on tutorials, boilerplates that don't fit, and architecture rabbit holes",
                  "Agencies quote $15k-$50k and deliver in 3 months — 70% of which is setup you'll never use",
                  "Your idea is validated. What's missing is the technical foundation to ship it",
                  "Meanwhile, your competitors are launching and capturing market share every single day",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                    <span style={{ color: "#FF00E5", marginTop: 6, textShadow: "0 0 10px rgba(255,0,229,0.4)" }}>✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal opacity-0 translate-y-12 transition-all duration-700 delay-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider mb-6" style={{ background: "rgba(0,245,255,0.06)", border: "1px solid rgba(0,245,255,0.2)", color: "#00F5FF" }}>
                The Solution
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-mono tracking-tight mb-6 leading-tight">
                <span style={{ color: "#00F5FF" }}>Production SaaS</span> in 48 hours. <span style={{ color: "#39FF14" }}>Done.</span>
              </h2>
              <ul className="space-y-5">
                {[
                  "AI generates a complete Next.js codebase — auth, Stripe, database, dashboards — tailored to your niche",
                  "Enterprise-grade architecture with best practices baked in. No technical debt, no shortcuts",
                  "Deploy to Vercel in one click. Live and accepting payments by dinner time",
                  "Full source code ownership. Take it, extend it, scale it. Zero lock-in",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                    <span style={{ color: "#39FF14", marginTop: 6, textShadow: "0 0 10px rgba(57,255,20,0.4)" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* THE OFFER */}
      <section id="offer" className="py-32 px-6 relative" style={{ background: "linear-gradient(to bottom, rgba(255,0,229,0.02), transparent, rgba(0,245,255,0.02))" }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider mb-6" style={{ background: "rgba(0,245,255,0.06)", border: "1px solid rgba(0,245,255,0.2)", color: "#00F5FF" }}>
            <Gem size={12} /> The Offer
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-mono tracking-tight mb-4">
            What if you could <span className="gradient-text-cyan">guarantee</span> your SaaS ships?
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-16" style={{ color: "rgba(255,255,255,0.4)" }}>
            Here's exactly what you get when you invest in NEON-CORE AI today.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Rocket, title: "AI-Generated Codebase", desc: "Complete Next.js + Tailwind + PostgreSQL SaaS with auth, payments, dashboards, and deployment config — generated for your exact niche" },
              { icon: Clock, title: "48-Hour Delivery", desc: "From niche input to deployed production URL in under 48 hours. Average time: 3 hours. We've never missed a deadline" },
              { icon: Shield, title: "30-Day Ironclad Guarantee", desc: "If the boilerplate doesn't meet production standards, you get 100% refunded. No questions, no hassle, same day" },
              { icon: Users, title: "White-Glove Onboarding", desc: "Enterprise clients get a 1-on-1 architecture call. We map your specific requirements and customize the output" },
              { icon: Award, title: "Enterprise Architecture", desc: "Built with battle-tested patterns: RBAC, rate limiting, webhooks, CI/CD, SEO, analytics — everything a real SaaS needs" },
              { icon: Infinity, title: "One-Click Deploy", desc: "Auto-deployed to Vercel with custom domain, SSL, and CI/CD pipeline. Your URL is live before you finish coffee" },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card rounded-xl p-6 text-left relative overflow-hidden cursor-default group"
                style={{ transformStyle: "preserve-3d", transitionDelay: `${i * 0.05}s` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at ${30 + i * 20}% 0%, rgba(0,245,255,0.06), transparent 60%)` }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 relative" style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.1)" }}>
                  <item.icon size={20} style={{ color: "#00F5FF" }} />
                </div>
                <h3 className="text-base font-bold font-mono mb-2 relative" style={{ color: "#fff" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed relative" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto text-center relative overflow-hidden" style={{ borderColor: "rgba(57,255,20,0.15)", boxShadow: "0 0 60px rgba(57,255,20,0.04)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(57,255,20,0.06), transparent 60%)" }} />
            <p className="text-sm font-mono tracking-widest mb-2 relative" style={{ color: "rgba(57,255,20,0.5)" }}>GUARANTEE</p>
            <p className="text-xl md:text-2xl font-bold mb-2 relative" style={{ color: "#39FF14", textShadow: "0 0 20px rgba(57,255,20,0.3)" }}>
              "If your boilerplate isn't production-ready, you don't pay."
            </p>
            <p className="text-sm relative" style={{ color: "rgba(255,255,255,0.35)" }}>
              30-day, no-questions-asked, same-day refund. We're that confident.
            </p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal opacity-0 translate-y-12 transition-all duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider mb-6" style={{ background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.2)", color: "#FFD700" }}>
              <Star size={12} /> Social Proof
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-mono tracking-tight mb-4">
              Used by <span style={{ color: "#FFD700" }}>founders</span> who've <span className="gradient-text">launched</span>
            </h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
              Here's what they're saying after generating their SaaS.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card rounded-xl p-6 reveal opacity-0 translate-y-12 transition-all duration-700" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="#FFD700" color="#FFD700" style={{ filter: "drop-shadow(0 0 4px rgba(255,215,0,0.4))" }} />
                  ))}
                </div>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div>
                  <p className="text-sm font-bold font-mono" style={{ color: "#fff" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden" style={{ borderColor: "rgba(0,245,255,0.1)" }}>
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(0,245,255,0.04), transparent 60%)" }} />
            <p className="text-xs font-mono tracking-widest mb-6 relative" style={{ color: "rgba(0,245,255,0.4)" }}>ROI CALCULATOR</p>
            <div className="grid md:grid-cols-3 gap-8 text-center relative">
              <div>
                <p className="text-3xl font-bold font-mono" style={{ color: "#FF00E5", textShadow: "0 0 20px rgba(255,0,229,0.3)" }}>$15k–$50k</p>
                <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>Average agency cost</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-mono" style={{ color: "#FF00E5", textShadow: "0 0 20px rgba(255,0,229,0.3)" }}>3–6 months</p>
                <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>Average agency timeline</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-mono" style={{ color: "#39FF14", textShadow: "0 0 20px rgba(57,255,20,0.3)" }}>$49–$10k</p>
                <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>Your investment with us</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center relative" style={{ borderColor: "rgba(0,245,255,0.06)" }}>
              <p className="text-lg font-bold font-mono" style={{ color: "#39FF14", textShadow: "0 0 15px rgba(57,255,20,0.3)" }}>
                Save 95% • Ship 50x faster • Own 100% of your code
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-32 px-6 relative" style={{ background: "linear-gradient(to top, rgba(255,0,229,0.02), transparent, rgba(0,245,255,0.02))" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal opacity-0 translate-y-12 transition-all duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider mb-6" style={{ background: "rgba(0,245,255,0.06)", border: "1px solid rgba(0,245,255,0.2)", color: "#00F5FF" }}>
              <Sparkles size={12} /> Investment
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-mono tracking-tight mb-4">
              Choose your <span className="gradient-text">launch path</span>
            </h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
              One price. No upsells. No monthly fees. You own everything.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <PricingCard
              title="Starter"
              price="$49"
              duration="/month"
              description="One SaaS boilerplate. Full ownership. No recurring fees."
              features={["1 Boilerplate Generation", "Full Source Code", "Neon UI Theme", "30-Day Guarantee", "1-Click Deploy", "Email Support"]}
              color="cyan"
              onSelect={() => window.open("https://buy.stripe.com/test_28o4hC5iD9Wj3HG9AA", "_blank")}
            />
            <PricingCard
              title="Pro"
              price="$149"
              duration="/month"
              description="Unlimited generations. Priority support. Team tools."
              features={["Unlimited Generations", "Full Source Code", "All UI Themes", "30-Day Guarantee", "Priority Support", "Team Collaboration", "Custom Domain", "API Access"]}
              isPopular={true}
              color="pink"
              onSelect={() => window.open("https://buy.stripe.com/test_5kA7vC2iD1Wj3HGcCC", "_blank")}
            />
            <PricingCard
              title="Enterprise"
              price="$10,000"
              description="Done-for-you. White-glove. Custom to your exact spec."
              features={["Custom AI Training", "1-on-1 Architecture Call", "Custom Feature Development", "White-Label Deployment", "Dedicated Support Team", "SLA Guarantee", "Source Code Ownership", "Priority API Access"]}
              color="green"
              onSelect={() => window.open("https://buy.stripe.com/test_5kA7vC2iD1Wj3HGcCC", "_blank")}
            />
          </div>

          <div className="text-center max-w-2xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-700">
            <p className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
              <Shield size={14} className="inline mr-1" style={{ color: "#39FF14" }} /> 
              Every plan comes with a <strong style={{ color: "#39FF14" }}>30-day money-back guarantee</strong>. 
              No questions. No hassle. If you're not satisfied, you don't pay.
            </p>
          </div>
        </div>
      </section>

      {/* AI ADVISOR */}
      <section id="ai-advisor" className="py-32 px-6">
        <div className="max-w-4xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-700">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-mono tracking-tight mb-4">
              Not sure where to start? <span className="gradient-text">Ask the AI.</span>
            </h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
              Describe your idea and get an instant architecture strategy. No sales pitch — just advice.
            </p>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden" style={{ borderColor: "rgba(0,245,255,0.1)" }}>
            <AIChatBox
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={aiLoading}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 reveal opacity-0 translate-y-12 transition-all duration-700">
            <h2 className="text-4xl font-bold font-mono tracking-tight mb-4">
              <span style={{ color: "#00F5FF" }}>FAQ</span> — Objections, answered.
            </h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
              Still on the fence? Let's address your concerns.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden transition-all duration-300 reveal opacity-0 translate-y-12" style={{ transitionDelay: `${i * 0.05}s`, borderColor: openFaq === i ? "rgba(0,245,255,0.3)" : "rgba(0,245,255,0.06)" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-bold font-mono" style={{ color: "#fff" }}>{faq.q}</span>
                  <ChevronDown size={16} style={{ color: "rgba(255,255,255,0.3)", transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(0,245,255,0.06) 0%, rgba(255,0,229,0.03) 40%, transparent 60%)"
        }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold font-mono tracking-tight mb-6 leading-tight">
            Your SaaS is waiting to be <span style={{ color: "#39FF14", textShadow: "0 0 30px rgba(57,255,20,0.3)" }}>built.</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>
            Every day you delay is a day your competitors grow. Type your niche above and ship tonight.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Enter your niche..."
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="flex-1 px-6 py-4 rounded-xl font-mono text-sm focus:outline-none transition-all duration-300"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,245,255,0.15)", color: "#fff" }}
            />
            <NeonButton
              label={isGenerating ? "Generating..." : "Generate My SaaS"}
              onClick={handleGenerate}
              disabled={isGenerating}
              color="pink"
              size="lg"
            />
          </div>
          <p className="mt-6 text-xs font-mono" style={{ color: "rgba(255,255,255,0.15)" }}>
            <Shield size={12} className="inline mr-1" /> 30-day guarantee • Full ownership • No subscription required
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-12 px-6" style={{ borderColor: "rgba(0,245,255,0.04)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-lg font-bold font-mono tracking-widest mb-4">
            <span style={{ color: "#00F5FF" }}>NEON</span>
            <span style={{ color: "#FF00E5" }}>_CORE</span>
          </div>
          <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.1)" }}>
            © 2026 NEON-CORE AI. All rights reserved. | Built with Next.js • Tailwind CSS • Stripe • Vercel
          </p>
        </div>
      </footer>
    </div>
  );
}
