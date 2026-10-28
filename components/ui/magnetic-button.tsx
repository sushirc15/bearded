"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  strength?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function MagneticButton({
  children,
  className,
  variant = "primary",
  size = "md",
  strength = 0.25,
  onClick,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variantStyles = {
    primary:
      "bg-gradient-brand text-black font-black shadow-glow hover:shadow-glow-lg border border-brand-lime/50",
    secondary:
      "bg-surface-elevated hover:bg-surface-hover text-text-primary border border-white/10 hover:border-brand-neon/40",
    outline:
      "bg-transparent border border-brand-neon/50 text-text-primary hover:bg-brand-neon/10 hover:border-brand-neon",
    ghost:
      "bg-transparent text-text-muted hover:text-text-primary hover:bg-white/5",
  };

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-xl",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-7 py-3.5 text-base rounded-2xl",
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative inline-flex items-center justify-center font-heading tracking-wide transition-all duration-300 overflow-hidden group select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ember focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      onClick={onClick}
      {...(props as any)}
    >
      {/* Shine sweep effect */}
      <span className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <span className="absolute -inset-[100%] top-0 block w-[200%] h-full bg-shimmer-gradient -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer-slide transition-opacity duration-300" />
      </span>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
