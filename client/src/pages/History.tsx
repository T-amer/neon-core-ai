import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, Download, Trash2 } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#030303", color: "#00F5FF" }}>
        <div className="text-center">
          <p className="text-xl mb-4">Please log in to view your boilerplates</p>
          <Link href="/">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#030303", color: "#00F5FF" }}>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: "rgba(3, 3, 3, 0.8)", borderColor: "rgba(0, 245, 255, 0.2)" }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold font-mono tracking-wider">
            <span style={{ color: "#00F5FF" }}>NEON</span>
            <span style={{ color: "#FF00E5" }}>-CORE</span>
            <span style={{ color: "#39FF14" }}> AI</span>
          </Link>
          <Link href="/" className="text-sm font-mono" style={{ color: "#00F5FF" }}>
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold font-mono tracking-wider mb-12" style={{ color: "#00F5FF" }}>
            Your Boilerplates
          </h1>

          {listQuery.isLoading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto" style={{ color: "#00F5FF" }} />
              <p className="mt-4" style={{ color: "rgba(0, 245, 255, 0.7)" }}>
                Loading your boilerplates...
              </p>
            </div>
          ) : boilerplates.length === 0 ? (
            <div className="text-center">
              <p className="text-xl mb-4" style={{ color: "rgba(0, 245, 255, 0.7)" }}>
                No boilerplates yet. Create your first one!
              </p>
              <Link href="/">Generate Now</Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {boilerplates.map((bp) => (
                <div
                  key={bp.id}
                  className="p-6 rounded-lg border-2"
                  style={{
                    backgroundColor: "rgba(10, 10, 10, 0.5)",
                    borderColor: "rgba(0, 245, 255, 0.3)",
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold font-mono" style={{ color: "#00F5FF" }}>
                        {bp.projectName}
                      </h3>
                      <p className="text-sm mt-2" style={{ color: "rgba(0, 245, 255, 0.7)" }}>
                        Niche: <span style={{ color: "#FF00E5" }}>{bp.niche}</span>
                      </p>
                      <p className="text-sm mt-1" style={{ color: "rgba(0, 245, 255, 0.5)" }}>
                        Created: {new Date(bp.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(bp.id)}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                          backgroundColor: "rgba(0, 245, 255, 0.1)",
                          color: "#00F5FF",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 245, 255, 0.2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 245, 255, 0.1)")}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bp.id)}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                          backgroundColor: "rgba(255, 0, 229, 0.1)",
                          color: "#FF00E5",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 0, 229, 0.2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 0, 229, 0.1)")}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p style={{ color: "rgba(0, 245, 255, 0.6)" }}>{bp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
