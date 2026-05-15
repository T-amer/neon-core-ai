const fs = require('fs');
const path = require('path');

function read(f) { return fs.readFileSync(f, 'utf-8'); }
function write(f, c) { fs.writeFileSync(f, c, 'utf-8'); console.log('  wrote ' + path.relative(process.cwd(), f)); }
function replaceAll(c, from, to) { return c.split(from).join(to); }

// ─── 1. main.tsx ───
let c = `import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./lib/trpc";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import superjson from "superjson";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
});
const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })],
});

const rootEl = document.getElementById("root") || document.body.appendChild(document.createElement("div"));
rootEl.id = "root";
createRoot(rootEl).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider switchable={true}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </trpc.Provider>
);
`;
write('client/src/main.tsx', c);

// ─── 2. App.tsx ───
c = `import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import History from "./pages/History";
import ComponentShowcase from "./pages/ComponentShowcase";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/history" component={History} />
      <Route path="/showcase" component={ComponentShowcase} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
`;
write('client/src/App.tsx', c);

// ─── 3. index.css ───
c = read('client/src/index.css');

c = c.replace(
  '  --sidebar-ring: #6366f1;\n}',
  `  --sidebar-ring: #6366f1;
  --text-strong: rgba(0,0,0,0.8);
  --text-tertiary: rgba(0,0,0,0.5);
  --text-quaternary: rgba(0,0,0,0.35);
  --text-faint: rgba(0,0,0,0.12);
  --border-faint: rgba(0,0,0,0.04);
  --bg-faint: rgba(0,0,0,0.02);
  --accent-bg: rgba(99,102,241,0.08);
  --card-bg: rgba(255,255,255,0.5);
  --card-bg-highlight: rgba(255,255,255,0.8);
  --card-border-accent: rgba(99,102,241,0.2);
  --chat-assistant-bg: rgba(255,255,255,0.6);
  --chat-assistant-border: rgba(255,255,255,0.8);
  --chat-input-area: rgba(255,255,255,0.3);
  --chat-scrollbar: rgba(0,0,0,0.08);
  --chat-scrollbar-hover: rgba(0,0,0,0.15);
}`
);

c = c.replace(
  '  --chart-5: #8b5cf6;\n}',
  `  --chart-5: #8b5cf6;
  --text-strong: rgba(255,255,255,0.85);
  --text-tertiary: rgba(255,255,255,0.6);
  --text-quaternary: rgba(255,255,255,0.45);
  --text-faint: rgba(255,255,255,0.15);
  --border-faint: rgba(255,255,255,0.04);
  --bg-faint: rgba(255,255,255,0.02);
  --accent-bg: rgba(129,140,248,0.08);
  --card-bg: rgba(20,20,30,0.5);
  --card-bg-highlight: rgba(20,20,30,0.8);
  --card-border-accent: rgba(129,140,248,0.2);
  --chat-assistant-bg: rgba(20,20,30,0.6);
  --chat-assistant-border: rgba(255,255,255,0.06);
  --chat-input-area: rgba(255,255,255,0.04);
  --chat-scrollbar: rgba(255,255,255,0.08);
  --chat-scrollbar-hover: rgba(255,255,255,0.15);
}`
);

write('client/src/index.css', c);

// ─── 4. Home.tsx ───
c = read('client/src/pages/Home.tsx');

// Replace #6366f1 with var(--primary) only in JSX style objects (not in CSS template)
// Wait, #6366f1 in CSS template is fine as-is, replacing won't hurt
c = replaceAll(c, '#1a1a1a', 'var(--text-primary)');

const HOME_REPLACEMENTS = [
  ['"rgba(0,0,0,0.04)"', '"var(--border-faint)"'],
  ['"rgba(0,0,0,0.02)"', '"var(--bg-faint)"'],
  ['"rgba(0,0,0,0.45)"', '"var(--text-quaternary)"'],
  ['"rgba(0,0,0,0.4)"', '"var(--text-quaternary)"'],
  ['"rgba(0,0,0,0.35)"', '"var(--text-quaternary)"'],
  ['"rgba(0,0,0,0.3)"', '"var(--text-quaternary)"'],
  ['"rgba(0,0,0,0.25)"', '"var(--text-quaternary)"'],
  ['"rgba(0,0,0,0.2)"', '"var(--text-faint)"'],
  ['"rgba(0,0,0,0.15)"', '"var(--text-faint)"'],
  ['"rgba(0,0,0,0.1)"', '"var(--text-faint)"'],
  ['"rgba(0,0,0,0.5)"', '"var(--text-tertiary)"'],
  ['"rgba(0,0,0,0.6)"', '"var(--text-tertiary)"'],
  ['"rgba(0,0,0,0.8)"', '"var(--text-strong)"'],
  ['"rgba(99,102,241,0.08)"', '"var(--accent-bg)"'],
];
for (const [from, to] of HOME_REPLACEMENTS) {
  c = replaceAll(c, from, to);
}

// Also replace unquoted rgba in CSS template (outside inline styles)
// These appear in the template literal CSS
c = replaceAll(c, 'rgba(0,0,0,0.04)', 'var(--border-faint)');
c = replaceAll(c, 'rgba(0,0,0,0.06)', 'var(--border-faint)');
c = replaceAll(c, 'rgba(0,0,0,0.02)', 'var(--bg-faint)');
c = replaceAll(c, 'rgba(0,0,0,0.08)', 'var(--chat-scrollbar)');
c = replaceAll(c, 'rgba(0,0,0,0.15)', 'var(--chat-scrollbar-hover)');

// Marquee dynamic color
c = c.replace(
  'style={{ color: `rgba(0,0,0,${0.15 + (i % logos.length) * 0.03})` }}',
  'style={{ color: "var(--text-faint)" }}'
);

// Background-color on the root div
c = c.replace(
  'style={{ backgroundColor: "#f8f9fb", color: "#1a1a1a", minHeight: "100vh" }}',
  'style={{ backgroundColor: "var(--background)", color: "var(--foreground)", minHeight: "100vh" }}'
);

write('client/src/pages/Home.tsx', c);

// ─── 5. PricingCard.tsx ───
c = read('client/src/components/PricingCard.tsx');
c = replaceAll(c, '"#1a1a1a"', '"var(--text-primary)"');
c = replaceAll(c, '"rgba(0,0,0,0.35)"', '"var(--text-quaternary)"');
c = replaceAll(c, '"rgba(0,0,0,0.45)"', '"var(--text-quaternary)"');
c = replaceAll(c, '"rgba(99,102,241,0.9)"', '"var(--primary)"');
c = c.replace(
  'background: isPopular ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)"',
  'background: isPopular ? "var(--card-bg-highlight)" : "var(--card-bg)"'
);
c = c.replace(
  'border: isPopular ? `1px solid rgba(99,102,241,0.2)` : "1px solid rgba(255,255,255,0.8)"',
  'border: isPopular ? "1px solid var(--card-border-accent)" : "1px solid var(--chat-assistant-border)"'
);
c = c.replace(
  'boxShadow: isPopular ? "0 8px 40px rgba(99,102,241,0.08)" : "none"',
  'boxShadow: isPopular ? "0 8px 40px var(--card-border-accent)" : "none"'
);
write('client/src/components/PricingCard.tsx', c);

// ─── 6. AIChatBox.tsx ───
c = read('client/src/components/AIChatBox.tsx');

c = c.replace(
  '.chat-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 3px; }',
  '.chat-scroll::-webkit-scrollbar-thumb { background: var(--chat-scrollbar); border-radius: 3px; }'
);
c = c.replace(
  '.chat-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.15); }',
  '.chat-scroll::-webkit-scrollbar-thumb:hover { background: var(--chat-scrollbar-hover); }'
);

const CHAT_REPLACEMENTS = [
  ['"rgba(0,0,0,0.25)"', '"var(--text-quaternary)"'],
  ['"rgba(0,0,0,0.4)"', '"var(--text-quaternary)"'],
  ['"rgba(0,0,0,0.3)"', '"var(--text-quaternary)"'],
  ['"rgba(0,0,0,0.2)"', '"var(--text-faint)"'],
  ['"rgba(0,0,0,0.15)"', '"var(--text-faint)"'],
  ['"rgba(0,0,0,0.04)"', '"var(--border-faint)"'],
  ['"rgba(0,0,0,0.06)"', '"var(--border-faint)"'],
  ['"rgba(255,255,255,0.6)"', '"var(--chat-assistant-bg)"'],
  ['"rgba(255,255,255,0.8)"', '"var(--chat-assistant-border)"'],
  ['"rgba(255,255,255,0.3)"', '"var(--chat-input-area)"'],
  ['#1a1a1a', 'var(--text-primary)'],
];
for (const [from, to] of CHAT_REPLACEMENTS) {
  c = replaceAll(c, from, to);
}

write('client/src/components/AIChatBox.tsx', c);

// ─── 7. CodePreview.tsx ───
c = read('client/src/components/CodePreview.tsx');

const CODE_REPLACEMENTS = [
  ['"rgba(0,0,0,0.02)"', '"var(--bg-faint)"'],
  ['"rgba(0,0,0,0.04)"', '"var(--border-faint)"'],
  ['"rgba(0,0,0,0.15)"', '"var(--text-faint)"'],
  ['"rgba(0,0,0,0.7)"', '"var(--text-primary)"'],
  ['"rgba(255,255,255,0.3)"', '"var(--chat-input-area)"'],
];
for (const [from, to] of CODE_REPLACEMENTS) {
  c = replaceAll(c, from, to);
}

write('client/src/components/CodePreview.tsx', c);

// ─── 8. NeonButton.tsx ───
c = read('client/src/components/NeonButton.tsx');

c = c.replace(
  'background: "rgba(255,255,255,0.5)"',
  'background: "var(--card-bg)"'
);
c = c.replace(
  'background: `rgba(99,102,241,0.08)`',
  'background: "var(--accent-bg)"'
);
c = c.replace(
  'e.currentTarget.style.background = "rgba(255,255,255,0.5)"',
  'e.currentTarget.style.background = "var(--card-bg)"'
);

write('client/src/components/NeonButton.tsx', c);

// ─── 9. History.tsx ───
c = `import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, Download, Trash2, History as HistoryIcon } from "lucide-react";

export default function History() {
  const { user, isAuthenticated } = useAuth();
  const [boilerplates, setBoilerplates] = useState<any[]>([]);
  const utils = trpc.useUtils();

  const listQuery = trpc.boilerplate.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const deleteMutation = trpc.boilerplate.delete.useMutation();

  React.useEffect(() => {
    if (listQuery.data) {
      setBoilerplates(listQuery.data);
    }
  }, [listQuery.data]);

  const handleDownload = async (id: number) => {
    try {
      const result = await utils.boilerplate.download.fetch({ id });
      const blob = new Blob([result.content], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download boilerplate");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this boilerplate?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      setBoilerplates(boilerplates.filter((bp) => bp.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete boilerplate");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <div className="text-center glass-card-heavy p-10 max-w-md" data-tilt>
          <HistoryIcon size={40} style={{ color: "var(--accent-bg)", margin: "0 auto 16px", opacity: 0.5 }} />
          <p className="text-lg mb-6" style={{ color: "var(--text-tertiary)" }}>Please log in to view your boilerplates</p>
          <Link href="/" className="glass-btn inline-block" style={{ textDecoration: "none" }}>Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* NAV */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight" style={{ textDecoration: "none" }}>
            <span style={{ color: "var(--primary)" }}>NEON</span>
            <span style={{ color: "var(--text-tertiary)" }}>_CORE</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm transition-all" style={{ color: "var(--text-tertiary)", fontWeight: 500, textDecoration: "none" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-strong)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-tertiary)"}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <HistoryIcon size={28} style={{ color: "var(--primary)" }} />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
              Your Boilerplates
            </h1>
          </div>

          {listQuery.isLoading ? (
            <div className="glass-card-heavy p-16 text-center">
              <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: "var(--primary)" }} />
              <p style={{ color: "var(--text-tertiary)" }}>Loading your boilerplates...</p>
            </div>
          ) : boilerplates.length === 0 ? (
            <div className="glass-card-heavy p-16 text-center" data-reveal="scale-in">
              <p className="text-lg mb-6" style={{ color: "var(--text-tertiary)" }}>
                No boilerplates yet. Create your first one!
              </p>
              <Link href="/" className="glass-btn inline-block" style={{ textDecoration: "none" }}>Generate Now</Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {boilerplates.map((bp) => (
                <div
                  key={bp.id}
                  className="glass-card p-8"
                  data-tilt
                  data-reveal="fade-up"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                        {bp.projectName}
                      </h3>
                      <p className="text-sm mt-2" style={{ color: "var(--text-tertiary)" }}>
                        Niche: <span style={{ color: "var(--primary)", fontWeight: 600 }}>{bp.niche}</span>
                      </p>
                      <p className="text-sm mt-1" style={{ color: "var(--text-quaternary)" }}>
                        Created: {new Date(bp.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(bp.id)}
                        className="p-2.5 rounded-xl transition-all duration-200"
                        style={{
                          background: "var(--accent-bg)",
                          color: "var(--primary)",
                          border: "1px solid transparent",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--chat-assistant-bg)"; e.currentTarget.style.borderColor = "var(--card-border-accent)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent-bg)"; e.currentTarget.style.borderColor = "transparent"; }}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bp.id)}
                        className="p-2.5 rounded-xl transition-all duration-200"
                        style={{
                          background: "rgba(239,68,68,0.08)",
                          color: "#ef4444",
                          border: "1px solid transparent",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor = "transparent"; }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-tertiary)", lineHeight: 1.7 }}>{bp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`;
write('client/src/pages/History.tsx', c);

console.log('\n=== All 9 files updated successfully ===');
