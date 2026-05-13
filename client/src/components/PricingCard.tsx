import React from "react";
import { NeonButton } from "./NeonButton";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  onSelect?: () => void;
  color?: "cyan" | "pink" | "green" | "indigo" | "gray";
  duration?: string;
}

const colorMap = {
  cyan: "#00F5FF",
  pink: "#FF00E5",
  green: "#39FF14",
  indigo: "#6366f1",
  gray: "#6b7280",
};

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  onSelect,
  color = "indigo",
}) => {
  const accent = colorMap[color];

  return (
    <div
      className="relative rounded-xl p-8 transition-all duration-300"
      style={{
        border: `1px solid ${isPopular ? accent : "rgba(255,255,255,0.06)"}`,
        background: isPopular
          ? "rgba(99,102,241,0.04)"
          : "rgba(255,255,255,0.02)",
      }}
    >
      {isPopular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold tracking-wider"
          style={{
            background: accent,
            color: "#fff",
          }}
        >
          Most Popular
        </div>
      )}

      <h3 className="text-lg font-semibold mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>{title}</h3>
      <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>{description}</p>

      <div className="mb-8">
        <span className="text-4xl font-bold" style={{ color: "#fff" }}>{price}</span>
      </div>

      <ul className="space-y-3 mb-10">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span style={{ color: accent, marginTop: 2, flexShrink: 0 }}>✓</span>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{feature}</span>
          </li>
        ))}
      </ul>

      <NeonButton
        label={isPopular ? "Get Started" : "Choose Plan"}
        onClick={onSelect}
        color={color}
        size="md"
        className="w-full"
      />
    </div>
  );
};
