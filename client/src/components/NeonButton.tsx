import React from "react";

interface NeonButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  color?: "cyan" | "pink" | "green" | "indigo" | "gray";
  size?: "sm" | "md" | "lg";
}

const colorHex: Record<string, string> = {
  cyan: "#00F5FF",
  pink: "#FF00E5",
  green: "#39FF14",
  indigo: "#6366f1",
  gray: "#6b7280",
};

const sizeMap = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const NeonButton: React.FC<NeonButtonProps> = ({
  label,
  onClick,
  disabled = false,
  className = "",
  color = "indigo",
  size = "lg",
}) => {
  const hexColor = colorHex[color];
  const sizeClass = sizeMap[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative font-semibold tracking-wide
        ${sizeClass}
        transition-all duration-300 ease-out
        rounded-xl
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        background: "rgba(255,255,255,0.5)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${hexColor}20`,
        color: hexColor,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `rgba(99,102,241,0.08)`;
        e.currentTarget.style.borderColor = `${hexColor}50`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.5)";
        e.currentTarget.style.borderColor = `${hexColor}20`;
      }}
    >
      {label}
    </button>
  );
};
