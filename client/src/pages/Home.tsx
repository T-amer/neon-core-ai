import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { NeonButton } from "@/components/NeonButton";
import { CodePreview } from "@/components/CodePreview";
import { PricingCard } from "@/components/PricingCard";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { AIChatBox, Message } from "@/components/AIChatBox";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [niche, setNiche] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: "system", content: "You are a helpful assistant for Neon Core AI." },
  ]);

  const generateMutation = trpc.boilerplate.generate.useMutation();
  const aiMutation = trpc.ai.generateResponse.useMutation();

  const handleGenerate = async () => {
    if (!niche.trim()) {
      alert("Please enter a business niche");
      return;
    }

    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    setIsGenerating(true);
    setShowPreview(true);

    try {
      const result = await generateMutation.mutateAsync({ niche });
      const code = `// Generated boilerplate for ${result.niche}\n// Project: ${result.projectName}\n\nconst project = {\n  name: "${result.projectName}",\n  niche: "${result.niche}",\n  description: "${result.description}",\n  status: "ready-to-deploy"\n};\n\nexport default project;`;
      setGeneratedCode(code);
    } catch (error) {
      console.error("Generation failed:", error);
      const errorMsg = error instanceof Error ? error.message : "Generation failed";
      setGeneratedCode(`// Error: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    const newUserMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newUserMessage]);

    try {
      const result = await aiMutation.mutateAsync({ prompt: content });
      const aiResponseMessage: Message = { role: "assistant", content: result.response };
      setChatMessages((prev) => [...prev, aiResponseMessage]);
    } catch (error) {
      console.error("AI Error:", error);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: "#030303", color: "#00F5FF" }}>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: "rgba(3, 3, 3, 0.8)", borderColor: "rgba(0, 245, 255, 0.2)" }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold font-mono tracking-wider">
            <span style={{ color: "#00F5FF" }}>NEON</span>
            <span style={{ color: "#FF00E5" }}>-CORE</span>
            <span style={{ color: "#39FF14" }}> AI</span>
          </div>
          <div className="flex gap-4 items-center">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm" style={{ color: "rgba(0, 245, 255, 0.7)" }}>
                  Welcome, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="text-sm font-mono transition-colors"
                  style={{ color: "#00F5FF" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FF00E5")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#00F5FF")}
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href={getLoginUrl()}
                className="text-sm font-mono transition-colors"
                style={{ color: "#00F5FF" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FF00E5")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#00F5FF")}
              >
                Login
              </a>
            )}
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(0, 245, 255, 0.1) 0%, rgba(255, 0, 229, 0.05) 50%, rgba(57, 255, 20, 0) 100%)" }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold font-mono tracking-wider mb-6" style={{ animation: "neon-pulse 3s ease-in-out infinite", textShadow: "0 0 10px rgba(0, 245, 255, 0.8), 0 0 20px rgba(0, 245, 255, 0.6)" }}>
              <span style={{ color: "#00F5FF" }}>Generate</span>
              <br />
              <span style={{ color: "#FF00E5" }}>Your SaaS</span>
              <br />
              <span style={{ color: "#39FF14" }}>in Seconds</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: "rgba(0, 245, 255, 0.8)" }}>
              Enter your business niche and instantly receive a production-ready Next.js boilerplate with Neon UI theme.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-4 flex-col md:flex-row">
              <input
                type="text"
                placeholder="e.g., Dental Clinic, Gym, Lawyer, E-commerce..."
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                className="flex-1 px-6 py-4 rounded-lg focus:outline-none font-mono"
                style={{
                  backgroundColor: "rgba(10, 10, 10, 0.5)",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderColor: "rgba(0, 245, 255, 0.5)",
                  color: "#00F5FF",
                }}
              />
              <NeonButton
                label="Generate My SaaS"
                onClick={handleGenerate}
                disabled={isGenerating}
                color="cyan"
                size="lg"
              />
            </div>
          </div>

          {showPreview && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-4">
                <h3 className="text-lg font-mono mb-2" style={{ color: "#00F5FF" }}>
                  Live Preview
                </h3>
              </div>
              <div className="h-96 rounded-lg overflow-hidden border-2" style={{ borderColor: "rgba(0, 245, 255, 0.5)", backgroundColor: "rgba(10, 10, 10, 0.5)" }}>
                {isGenerating ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: "#00F5FF" }} />
                      <p className="font-mono" style={{ color: "rgba(0, 245, 255, 0.7)" }}>
                        Generating your boilerplate...
                      </p>
                    </div>
                  </div>
                ) : (
                  <CodePreview code={generatedCode} isStreaming={false} language="typescript" />
                )}
              </div>
            </div>
          )}

          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-mono mb-8 text-center" style={{ color: "#00F5FF" }}>
              AI Assistant
            </h2>
            <AIChatBox
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={aiMutation.isPending}
              className="border-2 border-[rgba(0,245,255,0.3)]"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4" style={{ background: "linear-gradient(to bottom, #030303, rgba(3, 3, 3, 0.5))" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold font-mono tracking-wider mb-4">
              <span style={{ color: "#00F5FF" }}>Simple</span>
              <span style={{ color: "#FF00E5" }}> Pricing</span>
            </h2>
            <p className="text-lg" style={{ color: "rgba(0, 245, 255, 0.7)" }}>
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              title="Single Codebase"
              price="$49"
              description="Perfect for testing or a single project"
              features={["1 Boilerplate Generation", "Full Source Code Access", "Neon UI Theme Included", "30 Days of Support"]}
              color="cyan"
              onSelect={() => alert("Redirecting to checkout...")}
            />
            <PricingCard
              title="Unlimited Access"
              price="$149"
              description="Unlimited boilerplates for your entire team"
              features={["Unlimited Boilerplate Generations", "Full Source Code Access", "All Neon UI Themes", "Priority Support", "Team Collaboration Tools", "Custom Domain Support"]}
              isPopular={true}
              color="pink"
              onSelect={() => alert("Redirecting to checkout...")}
            />
          </div>
        </div>
      </section>

      <footer className="border-t py-8 px-4" style={{ borderColor: "rgba(0, 245, 255, 0.2)", backgroundColor: "rgba(3, 3, 3, 0.5)" }}>
        <div className="max-w-6xl mx-auto text-center text-sm font-mono" style={{ color: "rgba(0, 245, 255, 0.5)" }}>
          <p>© 2026 NEON-CORE AI. All rights reserved. | Powered by Next.js + Neon UI</p>
        </div>
      </footer>
    </div>
  );
}
