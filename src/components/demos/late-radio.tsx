"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STATIONS = [
  { id: "night", name: "夜航", line: "城市还醒着的那一层。", notes: [220, 261.63, 329.63, 261.63], step: 520 },
  { id: "rain", name: "雨巷", line: "路灯把雨拉长了一点。", notes: [196, 246.94, 293.66, 246.94], step: 760 },
  { id: "light", name: "灯塔", line: "很远的地方，一下一下。", notes: [174.61, 220, 261.63, 220], step: 380 },
] as const;

function noiseBurst(context: AudioContext) {
  const length = Math.floor(context.sampleRate * 0.18);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) data[index] = Math.random() * 2 - 1;
  const source = context.createBufferSource();
  source.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 800;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.12, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.18);
  source.connect(filter).connect(gain).connect(context.destination);
  source.start();
}

export default function LateRadio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);
  const [station, setStation] = useState(0);
  const [on, setOn] = useState(false);

  function stopLoop() {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
  }

  function playNote(freq: number) {
    const context = ctxRef.current;
    if (!context) return;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const now = context.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc.connect(gain).connect(context.destination);
    osc.start();
    osc.stop(now + 0.3);
  }

  function tune(index: number, withStatic: boolean) {
    const context = ctxRef.current ?? new AudioContext();
    ctxRef.current = context;
    void context.resume();
    stopLoop();
    if (withStatic) noiseBurst(context);
    const chosen = STATIONS[index];
    stepRef.current = 0;
    timerRef.current = window.setInterval(() => {
      const note = chosen.notes[stepRef.current % chosen.notes.length];
      stepRef.current += 1;
      playNote(note);
    }, chosen.step);
  }

  function choose(index: number) {
    setStation(index);
    setOn(true);
    tune(index, true);
  }

  useEffect(() => {
    return () => {
      stopLoop();
      void ctxRef.current?.close();
    };
  }, []);

  const current = STATIONS[station];

  return (
    <section className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-xl flex-col px-5 py-10 sm:px-8">
      <h1 className="font-display text-4xl text-ink sm:text-5xl">深夜电台</h1>
      <p className="mt-3 text-sm leading-6 text-pine/75">只有三个台。换台时先沙沙一声，再落入下一段。</p>
      <div className="mt-10 flex gap-6" role="group" aria-label="电台">
        {STATIONS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={on && station === index}
            onClick={() => choose(index)}
            className={cn(
              "font-display text-3xl underline-offset-4",
              on && station === index ? "text-ink underline" : "text-pine/45 hover:text-ink",
            )}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="mt-8 text-lg text-pine">{on ? current.line : "收音机还关着。"}</p>
    </section>
  );
}
