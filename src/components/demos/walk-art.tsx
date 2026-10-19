"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

function hash(seed: number) {
  let value = seed || 1;
  return () => {
    value = Math.imul(value ^ (value >>> 16), 2246822507);
    value = Math.imul(value ^ (value >>> 13), 3266489909);
    return ((value ^= value >>> 16) >>> 0) / 4294967296;
  };
}

export default function WalkArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [steps, setSteps] = useState(1800);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const draw = () => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const width = rect.width;
    const height = rect.height;
    const random = hash(steps + 17);
    context.fillStyle = "#e7f4ee";
    context.fillRect(0, 0, width, height);

    const lines = Math.max(6, Math.min(90, Math.round(steps / 180)));
    const fog = Math.max(0, Math.min(1, (steps - 3500) / 9000));
    context.lineWidth = steps < 4000 ? 0.8 : 1.6;
    context.strokeStyle = `rgba(20, 63, 56, ${0.18 + Math.min(steps, 8000) / 20000})`;
    for (let index = 0; index < lines; index += 1) {
      context.beginPath();
      let x = random() * width;
      let y = random() * height;
      context.moveTo(x, y);
      const bends = 3 + Math.floor(random() * 4);
      for (let bend = 0; bend < bends; bend += 1) {
        x = (x + (random() - 0.45) * width * 0.45 + width) % width;
        y = (y + (random() - 0.45) * height * 0.45 + height) % height;
        context.lineTo(x, y);
      }
      context.stroke();
    }
    if (fog > 0) {
      const puffs = Math.round(fog * 18);
      for (let index = 0; index < puffs; index += 1) {
        context.fillStyle = `rgba(143, 196, 182, ${0.08 + fog * 0.16})`;
        context.beginPath();
        context.arc(random() * width, random() * height, 30 + random() * 90, 0, Math.PI * 2);
        context.fill();
      }
    }
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [steps]);

  return (
    <section className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-3xl flex-col px-5 py-10 sm:px-8">
      <h1 className="font-display text-4xl text-ink sm:text-5xl">散步成画</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-pine/75">
        步数少是细线，步数多就铺成一层雾。今天走了 {steps} 步。
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => setSteps((value) => Math.max(0, value - 500))}>
          少 500
        </Button>
        <Button type="button" onClick={() => setSteps((value) => Math.min(20000, value + 500))}>
          多 500
        </Button>
      </div>
      <label className="mt-4 block text-sm text-pine">
        直接改步数
        <input
          type="number"
          min={0}
          max={20000}
          value={steps}
          onChange={(event) => setSteps(Math.max(0, Math.min(20000, Number(event.target.value) || 0)))}
          className="mt-2 h-11 w-full rounded-sm border border-pine/15 bg-foam/70 px-3 text-ink outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
        />
      </label>
      <canvas ref={canvasRef} className="mt-6 h-80 w-full border border-pine/10 sm:h-[28rem]" />
    </section>
  );
}
