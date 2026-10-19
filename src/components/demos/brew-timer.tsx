"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STAGES = [
  { name: "闷蒸", seconds: 30 },
  { name: "第一段", seconds: 25 },
  { name: "第二段", seconds: 30 },
  { name: "收尾", seconds: 20 },
];

export default function BrewTimer() {
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(STAGES[0].seconds);
  const [running, setRunning] = useState(false);
  const remainingRef = useRef(remaining);
  const indexRef = useRef(index);
  remainingRef.current = remaining;
  indexRef.current = index;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      if (remainingRef.current <= 1) {
        const next = indexRef.current + 1;
        if (next >= STAGES.length) {
          setRemaining(0);
          setRunning(false);
          return;
        }
        setIndex(next);
        setRemaining(STAGES[next].seconds);
        return;
      }
      setRemaining(remainingRef.current - 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const stage = STAGES[index];
  const soon = running && remaining > 0 && remaining <= 5 && index < STAGES.length - 1;

  return (
    <section className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-3xl flex-col px-5 py-10 sm:px-8">
      <h1 className="font-display text-4xl text-ink sm:text-5xl">手冲计时条</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-pine/75">
        四段水。这一段快结束时，下一段会提前亮起来。
      </p>
      <p className="font-display mt-10 text-6xl text-ink tabular-nums" aria-live="polite">
        {String(Math.floor(remaining / 60)).padStart(2, "0")}:
        {String(remaining % 60).padStart(2, "0")}
      </p>
      <p className="mt-2 text-sm text-pine/70">{remaining === 0 && index === STAGES.length - 1 ? "这杯好了" : stage.name}</p>
      <div className="mt-8 grid grid-cols-4 gap-2">
        {STAGES.map((item, itemIndex) => {
          const active = itemIndex === index && remaining > 0;
          const done = itemIndex < index || (itemIndex === index && remaining === 0 && !running);
          const preview = soon && itemIndex === index + 1;
          return (
            <div key={item.name} className="min-w-0">
              <div
                className={cn(
                  "h-16 border border-pine/10",
                  active && "brew-breathe bg-lagoon",
                  done && "bg-pine/70",
                  preview && "bg-lagoon/40",
                  !active && !done && !preview && "bg-foam/60",
                )}
              />
              <p className="mt-2 truncate text-xs text-pine/70">{item.name}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex gap-2">
        <Button type="button" onClick={() => setRunning((value) => !value)} disabled={remaining === 0 && index === STAGES.length - 1}>
          {running ? "暂停" : "开始"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setRunning(false);
            setIndex(0);
            setRemaining(STAGES[0].seconds);
          }}
        >
          重来一杯
        </Button>
      </div>
    </section>
  );
}
