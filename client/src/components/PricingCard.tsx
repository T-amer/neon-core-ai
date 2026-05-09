import React from "react";
import { NeonButton } from "./NeonButton";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  onSelect?: () => void;
  color?: "cyan" | "pink" | "green";
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  onSelect,
  color = "cyan",
}) => {
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

  const hexColor = colorHex[color];
  const rgbColor = colorRgb[color];

  return (
    <div
      className={`
        relative rounded-lg p-8 backdrop-blur-md
        transition-all duration-300 ease-out
        ${isPopular ? "scale-105" : ""}
      `}
      style={{
        borderWidth: isPopular ? "2px" : "1px",
        borderStyle: "solid",
        borderColor: isPopular ? hexColor : "rgba(0, 245, 255, 0.3)",
        backgroundColor: isPopular ? "rgba(10, 10, 10, 0.8)" : "rgba(10, 10, 10, 0.4)",
        boxShadow: isPopular
          ? `0 0 30px rgba(${rgbColor}, 0.4), inset 0 0 30px rgba(${rgbColor}, 0.1)`
          : "none",
      }}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span
            className="px-4 py-1 rounded-full text-xs font-bold font-mono tracking-wider bg-neon-dark border border-neon-pink text-neon-pink"
            style={{
              boxShadow: "0 0 15px rgba(255, 0, 229, 0.5)",
            }}
          >
            MOST POPULAR
          </span>
        </div>
      )}

      <h3 className="text-xl font-bold text-neon-cyan mb-2">{title}</h3>

      <div className="mb-4">
        <span className="text-4xl font-bold text-neon-cyan">{price}</span>
        <span className="text-neon-cyan/70 ml-2 text-sm">/month</span>
      </div>

      <p className="text-neon-cyan/70 text-sm mb-6">{description}</p>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span
              className="text-neon-green mt-1 font-bold"
              style={{
                textShadow: "0 0 10px rgba(57, 255, 20, 0.6)",
              }}
            >
              ✓
            </span>
            <span className="text-neon-cyan/80 text-sm">{feature}</span>
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
