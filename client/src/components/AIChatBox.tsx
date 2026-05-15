import { Loader2, Send, User, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Streamdown } from "streamdown";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIChatBoxProps = {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  height?: string | number;
  emptyStateMessage?: string;
  suggestedPrompts?: string[];
};

const glassStyles = `
.chat-scroll::-webkit-scrollbar { width: 6px; }
.chat-scroll::-webkit-scrollbar-track { background: transparent; }
.chat-scroll::-webkit-scrollbar-thumb { background: var(--chat-scrollbar); border-radius: 3px; }
.chat-scroll::-webkit-scrollbar-thumb:hover { background: var(--chat-scrollbar-hover); }
`;

export function AIChatBox({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = "Type your message...",
  className,
  height = "600px",
  emptyStateMessage = "Start a conversation with AI",
  suggestedPrompts,
}: AIChatBoxProps) {
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const displayMessages = messages.filter((msg) => msg.role !== "system");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isLoading) scrollToBottom();
  }, [displayMessages.length, isLoading]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;
    onSendMessage(trimmedInput);
    setInput("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      <style>{glassStyles}</style>
      <div
        ref={containerRef}
        className={className}
        style={{ height, display: "flex", flexDirection: "column" }}
      >
        {/* Messages Area */}
        <div
          className="chat-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
          }}
        >
          {displayMessages.length === 0 ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <Sparkles size={48} style={{ opacity: 0.15, color: "#6366f1" }} />
                <p style={{ fontSize: 14, color: "var(--text-quaternary)" }}>{emptyStateMessage}</p>
              </div>
              {suggestedPrompts && suggestedPrompts.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, maxWidth: 500 }}>
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => onSendMessage(prompt)}
                      disabled={isLoading}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 12,
                        fontSize: 13,
                        border: "1px solid rgba(0,0,0,0.06)",
                        background: "rgba(255,255,255,0.5)",
                        color: "var(--text-quaternary)",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        opacity: isLoading ? 0.5 : 1,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.background = "rgba(99,102,241,0.06)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.15)"; } }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "var(--border-faint)"; }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {displayMessages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  {message.role === "assistant" && (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "rgba(99,102,241,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                    >
                      <Sparkles size={16} style={{ color: "#6366f1" }} />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: "80%",
                      borderRadius: 12,
                      padding: "10px 16px",
                      background: message.role === "user"
                        ? "rgba(99,102,241,0.9)"
                        : "var(--chat-assistant-bg)",
                      color: message.role === "user" ? "#fff" : "var(--text-primary)",
                      border: message.role === "assistant" ? "1px solid rgba(255,255,255,0.8)" : "none",
                    }}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none" style={{ fontSize: 14, lineHeight: 1.6 }}>
                        <Streamdown>{message.content}</Streamdown>
                      </div>
                    ) : (
                      <p style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.5 }}>{message.content}</p>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "var(--border-faint)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                    >
                      <User size={16} style={{ color: "var(--text-quaternary)" }} />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "rgba(99,102,241,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  >
                    <Sparkles size={16} style={{ color: "#6366f1" }} />
                  </div>
                  <div
                    style={{
                      borderRadius: 12,
                      padding: "10px 16px",
                      background: "var(--chat-assistant-bg)",
                      border: "1px solid rgba(255,255,255,0.8)",
                    }}
                  >
                    <Loader2 size={16} className="animate-spin" style={{ color: "var(--text-faint)" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <form
          ref={inputAreaRef}
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: 8,
            padding: 16,
            borderTop: "1px solid rgba(0,0,0,0.04)",
            background: "var(--chat-input-area)",
            alignItems: "flex-end",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            style={{
              flex: 1,
              maxHeight: 128,
              resize: "none",
              minHeight: 38,
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 12,
              padding: "10px 16px",
              fontSize: 14,
              color: "var(--text-primary)",
              outline: "none",
              fontFamily: "inherit",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.background = "var(--chat-assistant-border)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-faint)"; e.currentTarget.style.background = "rgba(255,255,255,0.5)"; }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              height: 38,
              width: 38,
              borderRadius: 12,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: input.trim() && !isLoading ? "#6366f1" : "var(--border-faint)",
              color: input.trim() && !isLoading ? "#fff" : "var(--text-faint)",
              cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
      </div>
    </>
  );
}
