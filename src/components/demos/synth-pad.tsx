"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const PADS = [
  { id: "i", label: "一", freqs: [261.63, 329.63, 392] },
  { id: "vi", label: "二", freqs: [220, 261.63, 329.63] },
  { id: "iv", label: "三", freqs: [174.61, 220, 261.63] },
  { id: "v", label: "四", freqs: [196, 246.94, 293.66] },
] as const;

type Voice = {
  oscs: OscillatorNode[];
  gain: GainNode;
  thick: GainNode;
  started: number;
};

export default function SynthPad() {
  const ctxRef = useRef<AudioContext | null>(null);
  const voices = useRef<Record<string, Voice>>({});
  const [held, setHeld] = useState<string | null>(null);
  const [thick, setThick] = useState(0);

  function audio() {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }

  function release() {
    const context = ctxRef.current;
    for (const voice of Object.values(voices.current)) {
      if (!context) break;
      const now = context.currentTime;
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.001), now);
      voice.gain.gain.linearRampToValueAtTime(0.0001, now + 0.18);
      for (const osc of voice.oscs) osc.stop(now + 0.22);
    }
    voices.current = {};
    setHeld(null);
    setThick(0);
  }

  function press(id: string) {
    const context = audio();
    void context.resume();
    release();
    const pad = PADS.find((item) => item.id === id);
    if (!pad) return;
    const now = context.currentTime;
    const gain = context.createGain();
    const thickGain = context.createGain();
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(480, now);
    filter.frequency.linearRampToValueAtTime(2400, now + 3.2);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.16, now + 0.06);
    thickGain.gain.setValueAtTime(0.0001, now);
    gain.connect(filter).connect(context.destination);
    thickGain.connect(filter);
    const oscs: OscillatorNode[] = [];
    for (const freq of pad.freqs) {
      const tone = context.createOscillator();
      tone.type = "sine";
      tone.frequency.value = freq;
      tone.connect(gain);
      tone.start();
      const body = context.createOscillator();
      body.type = "triangle";
      body.frequency.value = freq / 2;
      body.connect(thickGain);
      body.start();
      oscs.push(tone, body);
    }
    voices.current[id] = { oscs, gain, thick: thickGain, started: performance.now() };
    setHeld(id);
  }

  useEffect(() => {
    if (!held) return;
    const timer = window.setInterval(() => {
      const voice = voices.current[held];
      const context = ctxRef.current;
      if (!voice || !context) return;
      const amount = Math.min(1, (performance.now() - voice.started) / 2400);
      voice.thick.gain.setTargetAtTime(0.001 + amount * 0.14, context.currentTime, 0.05);
      setThick(amount);
    }, 80);
    return () => window.clearInterval(timer);
  }, [held]);

  useEffect(() => {
    return () => {
      release();
      void ctxRef.current?.close();
    };
  }, []);

  return (
    <section className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-3xl flex-col px-5 py-10 sm:px-8">
      <h1 className="font-display text-4xl text-ink sm:text-5xl">四个键的合成器</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-pine/75">
        按住不放，声音会慢慢变厚。松手就收回去。
      </p>
      <div className="mt-10 grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
        {PADS.map((pad) => {
          const active = held === pad.id;
          return (
            <button
              key={pad.id}
              type="button"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                press(pad.id);
              }}
              onPointerUp={release}
              onPointerCancel={release}
              className={cn(
                "flex min-h-40 flex-col justify-between border border-pine/15 px-4 py-5 text-left",
                active ? "bg-pine text-foam" : "bg-foam/70 text-ink",
              )}
            >
              <span className="font-display text-4xl">{pad.label}</span>
              <span
                className={cn("h-1 w-full", active ? "bg-foam/40" : "bg-pine/10")}
                aria-hidden
              >
                <span
                  className={cn("block h-full", active ? "bg-foam" : "bg-transparent")}
                  style={{ width: active ? `${thick * 100}%` : "0%" }}
                />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
