"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

function hashSeed(text: string) {
  let hash = 2166136261;
  for (const char of text) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function randomOf(seed: number) {
  let value = seed || 1;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let next = Math.imul(value ^ (value >>> 15), 1 | value);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function paintCity(canvas: HTMLCanvasElement, seedText: string) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const width = rect.width;
  const height = rect.height;
  if (width < 2 || height < 2) return;
  const random = randomOf(hashSeed(seedText));
  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#123f38");
  sky.addColorStop(1, "#7eaea2");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#f7fffb";
  context.beginPath();
  context.arc(width * (0.2 + random() * 0.6), height * 0.18, 18 + random() * 10, 0, Math.PI * 2);
  context.fill();
  const ground = height * 0.78;
  context.fillStyle = "#0e332c";
  context.fillRect(0, ground, width, height - ground);
  let x = 8;
  while (x < width - 8) {
    const buildingWidth = 18 + random() * 42;
    const buildingHeight = 40 + random() * (height * 0.42);
    const top = ground - buildingHeight;
    context.fillStyle = random() > 0.5 ? "#1c7d6c" : "#143f38";
    context.fillRect(x, top, buildingWidth, buildingHeight);
    for (let row = top + 8; row < ground - 8; row += 10) {
      for (let col = x + 4; col < x + buildingWidth - 6; col += 8) {
        if (random() > 0.35) {
          context.fillStyle = random() > 0.8 ? "#f2e7a8" : "#d7eee6";
          context.fillRect(col, row, 3, 4);
        }
      }
    }
    x += buildingWidth + 4 + random() * 8;
  }
}

export default function CityGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [seed, setSeed] = useState("今晚");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => paintCity(canvas, seed.trim() || "今晚");
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [seed]);

  return (
    <section className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-3xl flex-col px-5 py-10 sm:px-8">
      <h1 className="font-display text-4xl text-ink sm:text-5xl">城市生成器</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-pine/75">种子相同，城市就相同。记下它，明天还能长出来。</p>
      <form
        className="mt-6 flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          setSeed(String(Math.floor(Math.random() * 999983)));
        }}
      >
        <label className="sr-only" htmlFor="city-seed">
          种子
        </label>
        <input
          id="city-seed"
          value={seed}
          onChange={(event) => setSeed(event.target.value)}
          className="h-11 flex-1 rounded-sm border border-pine/15 bg-foam/70 px-3 text-ink outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
        />
        <Button type="submit">再长一座</Button>
      </form>
      <canvas ref={canvasRef} className="mt-6 h-80 w-full border border-pine/10 sm:h-[28rem]" />
    </section>
  );
}
