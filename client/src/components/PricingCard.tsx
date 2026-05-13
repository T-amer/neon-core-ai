import React, { useRef, useState } from "react";
import { NeonButton } from "./NeonButton";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  onSelect?: () => void;
  color?: "cyan" | "pink" | "green";
  duration?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  onSelect,
  color = "cyan",
  duration,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-xl p-8 backdrop-blur-md transition-all duration-200 ease-out cursor-default group"
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${isHovered ? 20 : 0}px)`,
        transformStyle: "preserve-3d",
        borderWidth: isPopular ? "2px" : "1px",
        borderStyle: "solid",
        borderColor: isPopular ? hexColor : isHovered ? `rgba(${rgbColor}, 0.6)` : "rgba(0, 245, 255, 0.3)",
        backgroundColor: isPopular
          ? `rgba(10, 10, 10, 0.85)`
          : isHovered
          ? `rgba(15, 15, 15, 0.6)`
          : "rgba(10, 10, 10, 0.4)",
        boxShadow: isHovered
          ? `0 0 40px rgba(${rgbColor}, ${isPopular ? 0.5 : 0.3}), 0 20px 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(${rgbColor}, 0.08)`
          : isPopular
          ? `0 0 30px rgba(${rgbColor}, 0.4), inset 0 0 30px rgba(${rgbColor}, 0.1)`
          : "0 10px 30px rgba(0,0,0,0.3)",
        transition: isHovered ? "none" : "all 0.5s ease-out",
      }}
    >
      {/* Shine overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${50 + tilt.y * 3}% ${50 + tilt.x * 3}%, rgba(255,255,255,0.08), transparent 60%)`,
        }}
      />

      {/* Inner glow rim */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: isHovered ? `inset 0 0 60px rgba(${rgbColor}, 0.08)` : "none",
          transition: "box-shadow 0.5s",
        }}
      />

      {isPopular && (
        <div
          className="absolute -top-5 left-1/2 z-10"
          style={{
            transform: `translateX(-50%) translateZ(30px)`,
          }}
        >
          <div
            className="px-5 py-1.5 rounded-full text-xs font-bold font-mono tracking-widest uppercase"
            style={{
              background: "linear-gradient(135deg, #FF00E5, #7B2FF7)",
              color: "#fff",
              boxShadow: "0 0 20px rgba(255, 0, 229, 0.6), 0 0 40px rgba(123, 47, 247, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
              animation: "badgePulse 2s ease-in-out infinite",
            }}
          >
            ⚡ PRO
          </div>
        </div>
      )}

      <div style={{ transform: "translateZ(15px)" }}>
        <h3 className="text-xl font-bold font-mono mb-2" style={{ color: hexColor }}>{title}</h3>

        <div className="mb-4">
          <span className="text-4xl font-bold font-mono" style={{ color: hexColor, textShadow: `0 0 20px rgba(${rgbColor}, 0.4)` }}>{price}</span>
          {duration !== undefined && <span className="ml-2 text-sm font-mono" style={{ color: `rgba(${rgbColor}, 0.6)` }}>{duration}</span>}
        </div>

        <p className="text-sm mb-6" style={{ color: `rgba(${rgbColor}, 0.6)` }}>{description}</p>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <span
                className="mt-1 font-bold text-sm"
                style={{
                  color: "#39FF14",
                  textShadow: "0 0 10px rgba(57, 255, 20, 0.6)",
                }}
              >
                ✓
              </span>
              <span className="text-sm" style={{ color: `rgba(${rgbColor}, 0.7)` }}>{feature}</span>
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
    </div>
  );
};
