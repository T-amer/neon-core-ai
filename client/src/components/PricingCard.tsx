import React from "react";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  onSelect?: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  onSelect,
}) => {
  const accent = "#6366f1";

  return (
    <div
      className="relative rounded-2xl p-8 transition-all duration-300"
      style={{
        background: isPopular ? "var(--card-bg-highlight)" : "var(--card-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: isPopular ? "1px solid var(--card-border-accent)" : "1px solid var(--glass-border)",
        boxShadow: isPopular ? "0 8px 40px var(--card-border-accent)" : "none",
      }}
    >
      {isPopular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold tracking-wider"
          style={{
            background: "rgba(99,102,241,0.9)",
            backdropFilter: "blur(8px)",
            color: "#fff",
          }}
        >
          Most Popular
        </div>
      )}

      <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{title}</h3>
      <p className="text-sm mb-6" style={{ color: "var(--text-quaternary)" }}>{description}</p>

      <div className="mb-8">
        <span className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>{price}</span>
      </div>

      <ul className="space-y-3 mb-10">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span style={{ color: accent, marginTop: 2, flexShrink: 0 }}>âœ“</span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className="w-full py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300"
        style={{
          background: isPopular ? accent : "transparent",
          color: isPopular ? "#fff" : accent,
          border: isPopular ? "none" : `1px solid ${accent}`,
        }}
      >
        {isPopular ? "Get Started" : "Choose Plan"}
      </button>
    </div>
  );
};
