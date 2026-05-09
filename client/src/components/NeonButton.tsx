import React from "react";

interface NeonButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  color?: "cyan" | "pink" | "green";
  size?: "sm" | "md" | "lg";
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  label,
  onClick,
  disabled = false,
  className = "",
  color = "cyan",
  size = "lg",
}) => {
  const colorMap = {
    cyan: "neon-cyan",
    pink: "neon-pink",
    green: "neon-green",
  };

  const sizeMap = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const colorHex = {
    cyan: "#00F5FF",
    pink: "#FF00E5",
    green: "#39FF14",
  };

  const colorRgb = {
    cyan: "0, 245, 255",
    pink: "255, 0, 229",
    green: "57, 255, 20",
  };

  const colorClass = colorMap[color];
  const sizeClass = sizeMap[size];
  const hexColor = colorHex[color];
  const rgbColor = colorRgb[color];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative font-bold font-mono tracking-wider
        ${sizeClass}
        bg-neon-dark hover:bg-neon-gray
        transition-all duration-300 ease-out
        rounded-lg
        shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        group
        overflow-hidden
        ${className}
      `}
      style={{
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: hexColor,
        color: hexColor,
        boxShadow: disabled
          ? "none"
          : `0 0 20px rgba(${rgbColor}, 0.5), inset 0 0 20px rgba(${rgbColor}, 0.1)`,
      }}
    >
      {/* Animated background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${hexColor}, transparent)`,
        }}
      />

      {/* Text content */}
      <span className="relative z-10 block">{label}</span>
    </button>
  );
};
