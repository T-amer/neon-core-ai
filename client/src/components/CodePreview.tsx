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

  // Typewriter effect for streaming
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

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-neon-cyan/50 bg-neon-gray/50 backdrop-blur-sm">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-neon-dark border-b border-neon-cyan/30">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-neon-pink" />
          <div className="w-3 h-3 rounded-full bg-neon-green" />
          <div className="w-3 h-3 rounded-full bg-neon-cyan" />
        </div>
        <span className="text-xs text-neon-cyan/70 ml-2 font-mono">{language}</span>
      </div>

      {/* Code content */}
      <div className="p-4 overflow-auto max-h-96 font-mono text-sm">
        <pre className="text-neon-cyan whitespace-pre-wrap break-words">
          {displayedCode}
          {isStreaming && cursorVisible && <span className="animate-blink">|</span>}
        </pre>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 pointer-events-none rounded-lg shadow-neon-cyan" />
    </div>
  );
};
