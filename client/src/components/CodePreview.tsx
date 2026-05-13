import React, { useEffect, useState } from "react";

interface CodePreviewProps {
  code: string;
  isStreaming?: boolean;
  language?: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  isStreaming = false,
  language = "typescript",
}) => {
  const [displayedCode, setDisplayedCode] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedCode(code);
      return;
    }
    let index = 0;
    const interval = setInterval(() => {
      if (index < code.length) {
        setDisplayedCode(code.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [code, isStreaming]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "rgba(0,0,0,0.02)",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
          background: "rgba(255,255,255,0.3)",
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F56" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27C93F" }} />
        <span style={{ marginLeft: 8, fontSize: 11, color: "rgba(0,0,0,0.15)", fontFamily: "ui-monospace, SFMono-Regular, monospace" }}>
          {language}
        </span>
      </div>

      {/* Code content */}
      <div
        style={{
          padding: 16,
          overflow: "auto",
          maxHeight: 384,
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", color: "rgba(0,0,0,0.7)" }}>
          {displayedCode}
          {isStreaming && cursorVisible && (
            <span style={{ color: "#6366f1", animation: "blink 1s step-end infinite" }}>|</span>
          )}
        </pre>
      </div>

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};
