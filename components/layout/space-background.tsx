"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  alphaSpeed: number;
  color: string;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  color: string;
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Initialize stars
    const starColors = ["#FFFFFF", "#FFFFFF", "#E0FFE5", "#BDF76B", "#00E700"];
    const starsCount = Math.min(80, Math.floor(width / 18));
    const stars: Star[] = [];

    for (let i = 0; i < starsCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        alphaSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // Meteors
    const activeMeteors: Meteor[] = [];
    let lastMeteorSpawn = Date.now();

    function spawnMeteor() {
      // Spawn near the top/right
      activeMeteors.push({
        x: Math.random() * width * 0.8 + width * 0.2,
        y: Math.random() * height * 0.3,
        length: Math.random() * 120 + 80,
        speed: Math.random() * 10 + 12,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1), // ~45 deg diagonal down-left
        alpha: 1,
        color: Math.random() > 0.4 ? "#00E700" : "#BDF76B",
      });
    }

    // Spawn first meteor after 1s
    setTimeout(spawnMeteor, 1000);

    // Animation Loop (60fps optimized, zero layout thrashing)
    function render() {
      ctx!.clearRect(0, 0, width, height);

      // 1. Draw & twinkle stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha += star.alphaSpeed;
        if (star.alpha <= 0.15 || star.alpha >= 0.95) {
          star.alphaSpeed = -star.alphaSpeed;
        }

        ctx!.save();
        ctx!.fillStyle = star.color;
        ctx!.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      // 2. Spawn meteors periodically (every 3.5 - 6 seconds)
      const now = Date.now();
      if (now - lastMeteorSpawn > 4000 && activeMeteors.length < 2) {
        spawnMeteor();
        lastMeteorSpawn = now;
      }

      // 3. Draw & update meteors
      for (let i = activeMeteors.length - 1; i >= 0; i--) {
        const m = activeMeteors[i];
        const dx = Math.cos(m.angle) * m.speed;
        const dy = Math.sin(m.angle) * m.speed;

        m.x -= dx;
        m.y += dy;
        m.alpha -= 0.012;

        if (m.alpha <= 0 || m.x < -100 || m.y > height + 100) {
          activeMeteors.splice(i, 1);
          continue;
        }

        const tailX = m.x + Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        ctx!.save();
        ctx!.globalAlpha = Math.max(0, m.alpha);

        // Fading tail gradient
        const grad = ctx!.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.6, m.color);
        grad.addColorStop(1, "#FFFFFF");

        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 2;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(tailX, tailY);
        ctx!.lineTo(m.x, m.y);
        ctx!.stroke();

        // Glowing meteor head
        ctx!.fillStyle = "#FFFFFF";
        ctx!.shadowColor = m.color;
        ctx!.shadowBlur = 8;
        ctx!.beginPath();
        ctx!.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
    >
      {/* Static Cosmic Nebulae (Zero Blur Filter Overhead) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(circle 700px at 85% 15%, rgba(0, 231, 0, 0.12) 0%, transparent 70%), radial-gradient(circle 600px at 15% 65%, rgba(189, 247, 107, 0.08) 0%, transparent 70%), radial-gradient(circle 800px at 50% 100%, rgba(0, 231, 0, 0.1) 0%, transparent 75%)",
        }}
      />

      {/* Ultra-Fast Hardware-Accelerated Canvas for Stars & Meteors */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
