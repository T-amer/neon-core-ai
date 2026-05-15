import React, { useState } from "react";
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
