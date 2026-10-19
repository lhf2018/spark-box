"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

type Mode = "focus" | "break";

function formatTime(total: number) {
  const safe = Math.max(0, total);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function CafePomodoro() {
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const remainingRef = useRef(remaining);
  remainingRef.current = remaining;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      if (remainingRef.current <= 1) {
        setRemaining(0);
        setRunning(false);
        return;
      }
      setRemaining(remainingRef.current - 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const total = mode === "focus" ? FOCUS_SECONDS : BREAK_SECONDS;
  const progress = 1 - remaining / total;
  const light =
    mode === "focus"
      ? `oklch(${0.9 - progress * 0.16} ${0.035 + progress * 0.07} ${175 - progress * 80})`
      : `oklch(${0.86 - progress * 0.06} 0.04 ${200 - progress * 20})`;

  function switchMode(next: Mode) {
    setRunning(false);
    setMode(next);
    setRemaining(next === "focus" ? FOCUS_SECONDS : BREAK_SECONDS);
  }

  return (
    <section
      className="flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center px-5 py-16 transition-[background-color] duration-700"
      style={{ backgroundColor: light }}
    >
      <h1 className="font-display text-center text-4xl text-ink sm:text-5xl">咖啡馆番茄钟</h1>
      <p
        className="font-display mt-10 text-[clamp(4.5rem,16vw,8rem)] leading-none text-ink tabular-nums"
        aria-live="polite"
      >
        {formatTime(remaining)}
      </p>
      <p className="mt-4 text-sm text-pine/75">
        {mode === "focus" ? "灯光会跟着这二十五分钟慢慢变暖。" : "休息五分钟，光线收一点。"}
      </p>
      <div
        className="mt-8 h-1 w-56 overflow-hidden bg-pine/10"
        aria-hidden
      >
        <div
          className="h-full bg-pine/70 transition-[width] duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        <Button type="button" onClick={() => setRunning((value) => !value)} aria-pressed={running}>
          {running ? "暂停" : "开始"}
        </Button>
        <Button
          type="button"
          variant={mode === "focus" ? "default" : "outline"}
          onClick={() => switchMode("focus")}
        >
          专注
        </Button>
        <Button
          type="button"
          variant={mode === "break" ? "default" : "outline"}
          onClick={() => switchMode("break")}
        >
          休息
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setRunning(false);
            setRemaining(mode === "focus" ? FOCUS_SECONDS : BREAK_SECONDS);
          }}
        >
          重置
        </Button>
      </div>
    </section>
  );
}
