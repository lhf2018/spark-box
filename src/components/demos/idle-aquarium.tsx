"use client";

import { useEffect, useRef } from "react";

type Fish = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tint: string;
  pair: number;
  pairUntil: number;
};

export default function IdleAquarium() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const fish: Fish[] = [
      { x: 80, y: 80, vx: 0.45, vy: 0.12, tint: "#143f38", pair: -1, pairUntil: 0 },
      { x: 180, y: 140, vx: -0.35, vy: 0.08, tint: "#1c7d6c", pair: -1, pairUntil: 0 },
      { x: 260, y: 90, vx: 0.28, vy: -0.1, tint: "#0e332c", pair: -1, pairUntil: 0 },
      { x: 120, y: 200, vx: -0.22, vy: 0.16, tint: "#2a6b5c", pair: -1, pairUntil: 0 },
    ];
    let frame = 0;
    let last = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const loop = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      const width = canvas.getBoundingClientRect().width;
      const height = canvas.getBoundingClientRect().height;
      for (let index = 0; index < fish.length; index += 1) {
        const one = fish[index];
        if (one.pair >= 0 && now > one.pairUntil) one.pair = -1;
        for (let other = index + 1; other < fish.length; other += 1) {
          const two = fish[other];
          const distance = Math.hypot(one.x - two.x, one.y - two.y);
          if (distance < 54 && one.pair < 0 && two.pair < 0) {
            one.pair = other;
            two.pair = index;
            one.pairUntil = now + 1600;
            two.pairUntil = now + 1600;
            const vx = (one.vx + two.vx) / 2 || 0.2;
            const vy = (one.vy + two.vy) / 2;
            one.vx = vx;
            two.vx = vx;
            one.vy = vy;
            two.vy = vy;
          }
        }
        one.x += one.vx * dt * 0.06;
        one.y += one.vy * dt * 0.06;
        if (one.x < 24 || one.x > width - 24) one.vx *= -1;
        if (one.y < 24 || one.y > height - 24) one.vy *= -1;
      }
      context.fillStyle = "#d5eee6";
      context.fillRect(0, 0, width, height);
      context.strokeStyle = "rgba(20,63,56,0.18)";
      for (let y = 20; y < height; y += 28) {
        context.beginPath();
        context.moveTo(0, y);
        context.bezierCurveTo(width * 0.3, y + 6, width * 0.7, y - 6, width, y);
        context.stroke();
      }
      for (const one of fish) {
        context.save();
        context.translate(one.x, one.y);
        context.scale(one.vx < 0 ? -1 : 1, 1);
        context.fillStyle = one.tint;
        context.beginPath();
        context.ellipse(0, 0, 18, 8, 0, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.moveTo(-16, 0);
        context.lineTo(-26, -7);
        context.lineTo(-26, 7);
        context.fill();
        context.fillStyle = "#f7fffb";
        context.fillRect(6, -2, 3, 3);
        context.restore();
      }
      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="flex min-h-[calc(100svh-3.5rem)] flex-col">
      <div className="px-5 pt-8 sm:px-8">
        <h1 className="font-display text-4xl text-ink sm:text-5xl">挂机水族箱</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-pine/75">不用喂。两条鱼靠近时，会短暂地并排游一段。</p>
      </div>
      <canvas ref={canvasRef} className="mt-6 min-h-80 w-full flex-1" aria-label="水族箱" />
    </section>
  );
}
