"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const KEY = "spark-box:reading";
const RADIUS = 86;
const CIRC = 2 * Math.PI * RADIUS;

function readCount() {
  const value = Number(localStorage.getItem(KEY));
  return Number.isFinite(value) ? Math.max(0, Math.min(12, value)) : 0;
}

export default function ReadingRing() {
  const total = 8;
  const [done, setDone] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDone(readCount());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, String(done));
  }, [done, ready]);

  const progress = done / total;

  return (
    <section className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-xl flex-col items-start px-5 py-10 sm:px-8">
      <h1 className="font-display text-4xl text-ink sm:text-5xl">阅读环</h1>
      <p className="mt-3 text-sm leading-6 text-pine/75">读完一章，环上会多一段暖色。今晚 {done} / {total}。</p>
      <svg viewBox="0 0 220 220" className="mt-10 h-64 w-64" aria-hidden>
        <circle cx="110" cy="110" r={RADIUS} fill="none" stroke="#d7eee6" strokeWidth="14" />
        <circle
          cx="110"
          cy="110"
          r={RADIUS}
          fill="none"
          stroke="#1c7d6c"
          strokeWidth="14"
          strokeDasharray={`${CIRC * progress} ${CIRC}`}
          strokeLinecap="butt"
          transform="rotate(-90 110 110)"
        />
        {Array.from({ length: done }, (_, index) => {
          const start = (index / total) * CIRC;
          return (
            <circle
              key={index}
              cx="110"
              cy="110"
              r={RADIUS}
              fill="none"
              stroke="#e7c15a"
              strokeWidth="6"
              strokeDasharray={`${CIRC / total - 4} ${CIRC}`}
              strokeDashoffset={-start}
              transform="rotate(-90 110 110)"
            />
          );
        })}
      </svg>
      <div className="mt-8 flex gap-2">
        <Button type="button" onClick={() => setDone((value) => Math.min(total, value + 1))} disabled={done >= total}>
          读完一章
        </Button>
        <Button type="button" variant="outline" onClick={() => setDone(0)}>
          今晚重来
        </Button>
      </div>
    </section>
  );
}
