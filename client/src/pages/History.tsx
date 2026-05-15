import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, Download, Trash2, ArrowLeft, Clock } from "lucide-react";

export default function History() {
  const [boilerplates, setBoilerplates] = useState<any[]>([]);
  const utils = trpc.useUtils();

  const listQuery = trpc.boilerplate.list.useQuery(undefined, {
    enabled: false,
  });

  const deleteMutation = trpc.boilerplate.delete.useMutation();

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
      setBoilerplates(boilerplates.filter((bp: any) => bp.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete boilerplate");
    }
  };

  return (
    <div className="app-root" style={{ minHeight: "100vh" }}>
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-bold tracking-tight">
            <span style={{ color: "#6366f1" }}>NEON</span><span style={{ color: "var(--text-strong)" }}>_CORE</span>
          </div>
          <Link href="/" className="glass-btn text-sm !py-2 !px-4 !rounded-lg" style={{ textDecoration: "none" }}>
            <ArrowLeft size={14} className="inline mr-1" /> Back to Home
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="section-tag"><Clock size={12} /> History</div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 mb-4" style={{ color: "var(--text-primary)" }}>
              Your Boilerplates
            </h1>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              View and manage your generated boilerplates.
            </p>
          </div>

          {listQuery.isLoading ? (
            <div className="text-center py-20">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "#6366f1" }} />
              <p className="mt-4" style={{ color: "var(--text-secondary)" }}>Loading your boilerplates...</p>
            </div>
          ) : boilerplates.length === 0 && !listQuery.data?.length ? (
            <div className="glass-card-heavy max-w-lg mx-auto p-12 text-center">
              <div className="mb-6">
                <Clock size={48} style={{ color: "var(--text-muted)", opacity: 0.5 }} />
              </div>
              <p className="text-lg mb-2" style={{ color: "var(--text-primary)" }}>No boilerplates yet</p>
              <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>Create your first one from the home page.</p>
              <Link href="/" className="glass-btn inline-block" style={{ textDecoration: "none" }}>
                Generate Now
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {(boilerplates.length ? boilerplates : listQuery.data || []).map((bp: any) => (
                <div key={bp.id} className="glass-card-heavy p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                        {bp.projectName}
                      </h3>
                      <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
                        Niche: <span style={{ color: "#6366f1" }}>{bp.niche}</span>
                      </p>
                      <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                        Created: {new Date(bp.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(bp.id)}
                        className="glass-btn !p-2 !rounded-lg"
                        aria-label="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bp.id)}
                        className="glass-btn !p-2 !rounded-lg"
                        style={{ borderColor: "rgba(239,68,68,0.2)", color: "#ef4444" }}
                        aria-label="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {bp.description && (
                    <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{bp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
