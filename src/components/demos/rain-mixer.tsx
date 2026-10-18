"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

type Drop = { x: number; y: number; length: number; speed: number };

type Graph = {
  ctx: AudioContext;
  body: GainNode;
  hiss: GainNode;
  filter: BiquadFilterNode;
};

export default function RainMixer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const rainRef = useRef(55);
  const windRef = useRef(12);
  const runningRef = useRef(false);
  const [running, setRunning] = useState(false);
  const [rain, setRain] = useState(55);
  const [wind, setWind] = useState(12);

  useEffect(() => {
    rainRef.current = rain;
    const graph = graphRef.current;
    if (!graph || !runningRef.current) return;
    const amount = rain / 100;
    const now = graph.ctx.currentTime;
    graph.body.gain.setTargetAtTime(0.04 + amount * 0.22, now, 0.08);
    graph.hiss.gain.setTargetAtTime(0.015 + amount * 0.08, now, 0.08);
    graph.filter.frequency.setTargetAtTime(420 + amount * 1600, now, 0.08);
  }, [rain]);

  useEffect(() => {
    windRef.current = wind;
  }, [wind]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const drops: Drop[] = [];
    let frame = 0;
    let lastDrop = 0;

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

    const loop = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const amount = rainRef.current / 100;
      const windValue = windRef.current;

      const sky = context.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#d9f1ea");
      sky.addColorStop(1, "#8fb6ae");
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);

      if (runningRef.current) {
        const spawn = Math.ceil(amount * 6);
        for (let i = 0; i < spawn; i += 1) {
          drops.push({
            x: Math.random() * (width + 80) - 40,
            y: -20,
            length: 10 + Math.random() * 16 * (0.4 + amount),
            speed: 4 + Math.random() * 8 * (0.5 + amount),
          });
        }
        if (graphRef.current && time - lastDrop > Math.max(70, 420 - amount * 340)) {
          lastDrop = time;
          pluck(graphRef.current.ctx, 0.04 + amount * 0.12);
        }
      }

      context.strokeStyle = "rgba(16, 52, 46, 0.38)";
      context.lineWidth = 1.2;
      context.beginPath();
      for (let i = drops.length - 1; i >= 0; i -= 1) {
        const drop = drops[i];
        if (runningRef.current) {
          drop.y += drop.speed;
          drop.x += windValue * 0.08;
        }
        const x2 = drop.x - windValue * 0.18;
        const y2 = drop.y - drop.length;
        context.moveTo(drop.x, drop.y);
        context.lineTo(x2, y2);
        if (drop.y > height + 30) drops.splice(i, 1);
      }
      context.stroke();

      if (drops.length > 500) drops.splice(0, drops.length - 500);

      frame = window.requestAnimationFrame(loop);
    };

    frame = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      void graphRef.current?.ctx.close();
    };
  }, []);

  async function toggle() {
    if (!graphRef.current) {
      const ctx = new AudioContext();
      const noise = createNoise(ctx);
      const bodySource = ctx.createBufferSource();
      bodySource.buffer = noise;
      bodySource.loop = true;
      const hissSource = ctx.createBufferSource();
      hissSource.buffer = noise;
      hissSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 900;
      const body = ctx.createGain();
      body.gain.value = 0.12;

      const hissFilter = ctx.createBiquadFilter();
      hissFilter.type = "highpass";
      hissFilter.frequency.value = 1800;
      const hiss = ctx.createGain();
      hiss.gain.value = 0.04;

      bodySource.connect(filter).connect(body).connect(ctx.destination);
      hissSource.connect(hissFilter).connect(hiss).connect(ctx.destination);
      bodySource.start();
      hissSource.start();
      graphRef.current = { ctx, body, hiss, filter };
      runningRef.current = true;
      setRunning(true);
      return;
    }

    const { ctx } = graphRef.current;
    if (ctx.state === "suspended") {
      await ctx.resume();
      runningRef.current = true;
      setRunning(true);
    } else {
      await ctx.suspend();
      runningRef.current = false;
      setRunning(false);
    }
  }

  return (
    <section className="relative h-[calc(100svh-3.5rem)] min-h-[32rem]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/50 bg-foam/80 p-5 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl text-ink">雨声混音器</h1>
              <p className="mt-1 text-sm text-pine/70">
                {running ? "雨还在下" : "先开始，再把雨量和风调到顺手"}
              </p>
            </div>
            <Button type="button" onClick={() => void toggle()} aria-pressed={running}>
              {running ? "暂停" : "开始"}
            </Button>
          </div>
          <label className="mt-5 block text-sm text-pine">
            雨量 {rain}
            <Slider
              className="mt-2"
              min={0}
              max={100}
              value={[rain]}
              onValueChange={([value]) => setRain(value)}
              aria-label="雨量"
            />
          </label>
          <label className="mt-4 block text-sm text-pine">
            风向 {wind > 0 ? "向右" : wind < 0 ? "向左" : "无风"} {wind}
            <Slider
              className="mt-2"
              min={-50}
              max={50}
              value={[wind]}
              onValueChange={([value]) => setWind(value)}
              aria-label="风向"
            />
          </label>
        </div>
      </div>
    </section>
  );
}

function createNoise(ctx: AudioContext) {
  const length = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

function pluck(ctx: AudioContext, gainValue: number) {
  const length = Math.floor(ctx.sampleRate * 0.09);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900 + Math.random() * 1400;
  filter.Q.value = 0.7;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainValue, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();
  source.stop(ctx.currentTime + 0.1);
}
