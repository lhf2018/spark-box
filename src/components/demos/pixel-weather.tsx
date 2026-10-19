"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const COLS = 96;
const ROWS = 64;

const PALETTE = [
  "#102824",
  "#143f38",
  "#1c7d6c",
  "#d7eee6",
  "#e7f6f1",
  "#9fd0c4",
  "#5f9e90",
  "#f7fffb",
  "#c5e4d8",
  "#2a6b5c",
  "#1a4f44",
  "#f2e7a8",
  "#e7c15a",
  "#d8efe8",
  "#f4f7c8",
  "#0e332c",
] as const;

type Weather = "clear" | "fog" | "storm";

const WEATHERS: { id: Weather; label: string }[] = [
  { id: "clear", label: "晴" },
  { id: "fog", label: "雾" },
  { id: "storm", label: "雷" },
];

type Cloud = { x: number; y: number; w: number; h: number; speed: number };
type Drop = { x: number; y: number; vx: number; vy: number };

function cloudsFor(weather: Weather): Cloud[] {
  if (weather === "clear") {
    return [
      { x: 10, y: 12, w: 10, h: 3, speed: 0.012 },
      { x: 40, y: 8, w: 8, h: 2, speed: 0.008 },
      { x: 68, y: 16, w: 12, h: 3, speed: 0.015 },
    ];
  }
  if (weather === "fog") {
    return [
      { x: 0, y: 18, w: 40, h: 6, speed: 0.004 },
      { x: 36, y: 28, w: 50, h: 8, speed: -0.003 },
      { x: 8, y: 38, w: 70, h: 7, speed: 0.002 },
    ];
  }
  return [
    { x: 4, y: 6, w: 22, h: 5, speed: -0.05 },
    { x: 40, y: 12, w: 26, h: 6, speed: -0.07 },
    { x: 70, y: 4, w: 18, h: 4, speed: -0.04 },
  ];
}

function rainFor(weather: Weather): Drop[] {
  if (weather === "clear") return [];
  const count = weather === "fog" ? 18 : 42;
  return Array.from({ length: count }, () => ({
    x: Math.random() * COLS,
    y: Math.random() * 40,
    vx: weather === "fog" ? 0.35 : -0.55,
    vy: weather === "fog" ? 0.08 : 0.9,
  }));
}

export default function PixelWeather() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const weatherRef = useRef<Weather>("clear");
  const [weather, setWeather] = useState<Weather>("clear");

  useEffect(() => {
    weatherRef.current = weather;
  }, [weather]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.imageSmoothingEnabled = false;

    let clouds = cloudsFor("clear");
    let drops = rainFor("clear");
    let mode: Weather = "clear";
    let flash = 0;
    let frame = 0;

    const paint = () => {
      const next = weatherRef.current;
      if (next !== mode) {
        mode = next;
        clouds = cloudsFor(mode);
        drops = rainFor(mode);
        flash = 0;
      }
      if (mode === "storm" && Math.random() < 0.008) flash = 5;
      if (flash > 0) flash -= 1;

      const sky = flash > 0 ? 14 : mode === "storm" ? 6 : mode === "fog" ? 8 : 4;
      const skyDeep = flash > 0 ? 7 : mode === "storm" ? 15 : mode === "fog" ? 5 : 5;
      context.fillStyle = PALETTE[sky];
      context.fillRect(0, 0, COLS, ROWS);
      context.fillStyle = PALETTE[skyDeep];
      context.fillRect(0, 26, COLS, ROWS - 26);

      for (const cloud of clouds) {
        cloud.x += cloud.speed;
        if (cloud.x > COLS + 4) cloud.x = -cloud.w;
        if (cloud.x < -cloud.w - 4) cloud.x = COLS;
        const shade = mode === "fog" ? 7 : mode === "storm" ? 15 : 8;
        context.fillStyle = PALETTE[shade];
        context.fillRect(Math.round(cloud.x), cloud.y, cloud.w, cloud.h);
        context.fillStyle = PALETTE[mode === "storm" ? 1 : 7];
        context.fillRect(Math.round(cloud.x) + 1, cloud.y, Math.max(2, cloud.w - 4), 1);
      }

      if (mode === "clear" && flash === 0) {
        context.fillStyle = PALETTE[12];
        context.fillRect(16, 10, 8, 8);
        context.fillStyle = PALETTE[11];
        context.fillRect(17, 11, 6, 6);
        context.fillStyle = PALETTE[7];
        context.fillRect(18, 12, 4, 4);
      }

      for (let x = 2; x < COLS - 2; x += 1) {
        const hill = 46 + Math.round(Math.sin(x * 0.18) * 2 + Math.sin(x * 0.05) * 2);
        context.fillStyle = PALETTE[x % 7 === 0 ? 10 : 9];
        context.fillRect(x, hill, 1, ROWS - hill - 2);
      }

      for (const drop of drops) {
        drop.x += drop.vx;
        drop.y += drop.vy;
        if (drop.y > 46) {
          drop.y = 4;
          drop.x = Math.random() * COLS;
        }
        if (drop.x < 0) drop.x = COLS;
        if (drop.x > COLS) drop.x = 0;
        context.fillStyle = PALETTE[mode === "fog" ? 7 : 13];
        const px = Math.round(drop.x);
        const py = Math.round(drop.y);
        context.fillRect(px, py, 1, mode === "fog" ? 1 : 2);
        if (mode === "storm") context.fillRect(px - 1, py + 1, 1, 1);
      }

      context.fillStyle = PALETTE[0];
      context.fillRect(0, 0, COLS, 2);
      context.fillRect(0, ROWS - 2, COLS, 2);
      context.fillRect(0, 0, 2, ROWS);
      context.fillRect(COLS - 2, 0, 2, ROWS);
      context.fillStyle = PALETTE[1];
      context.fillRect(COLS / 2 - 1, 2, 2, ROWS - 4);
      context.fillRect(2, ROWS / 2 - 1, COLS - 4, 2);
      context.fillStyle = PALETTE[3];
      context.fillRect(0, ROWS - 4, COLS, 2);
    };

    const loop = () => {
      paint();
      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="flex min-h-[calc(100svh-3.5rem)] flex-col">
      <div className="px-5 pt-8 sm:px-8">
        <h1 className="font-display text-4xl text-ink sm:text-5xl">像素天气窗</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-pine/75">
          同一套十六色。晴、雾、雷只换云的步调，和雨往哪边落。
        </p>
        <div className="mt-6 flex gap-6" role="group" aria-label="天气">
          {WEATHERS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={weather === item.id}
              onClick={() => setWeather(item.id)}
              className={cn(
                "text-sm underline-offset-4",
                weather === item.id ? "text-ink underline" : "text-pine/60 hover:text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={COLS}
        height={ROWS}
        aria-label="像素天气窗"
        className="mt-8 min-h-0 w-full flex-1 [image-rendering:pixelated]"
      />
    </section>
  );
}
