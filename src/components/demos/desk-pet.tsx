"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type PetMood = "idle" | "poked" | "sleepy";

export default function DeskPet() {
  const petRef = useRef<HTMLButtonElement>(null);
  const xRef = useRef(22);
  const dirRef = useRef(1);
  const moodRef = useRef<PetMood>("idle");
  const [mood, setMood] = useState<PetMood>("idle");
  const [pokes, setPokes] = useState(0);
  const [poking, setPoking] = useState(false);

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      if (moodRef.current === "sleepy") {
        xRef.current += dirRef.current * dt * 0.01;
        if (xRef.current > 72) dirRef.current = -1;
        if (xRef.current < 6) dirRef.current = 1;
      }
      if (petRef.current) petRef.current.style.left = `${xRef.current}%`;
      frame = window.requestAnimationFrame(loop);
      return frame;
    };
    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (mood === "sleepy") return;
    const timer = window.setTimeout(() => setMood("sleepy"), mood === "poked" ? 1400 : 6000);
    return () => window.clearTimeout(timer);
  }, [mood, pokes]);

  function poke() {
    setPokes((count) => count + 1);
    setMood("idle");
    setPoking(true);
    window.setTimeout(() => setPoking(false), 550);
  }

  const sleepy = mood === "sleepy";

  return (
    <section className="relative min-h-[calc(100svh-3.5rem)] overflow-hidden bg-[linear-gradient(180deg,#f4fbf8_0%,#d5eee6_70%,#c5e4da_100%)]">
      <div className="px-5 pt-10 sm:px-8">
        <p className="text-xs tracking-[0.28em] text-lagoon uppercase">Desk mate</p>
        <h1 className="font-display mt-2 text-4xl text-ink">桌面小动物</h1>
        <p className="mt-2 text-sm text-pine/75">
          {sleepy ? "它打起瞌睡，自己慢慢挪开了。" : "戳它一下。你不去理它，它就会睡着。"}
        </p>
        <p className="mt-1 text-xs text-pine/50">戳了 {pokes} 下</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[#b7d9ce]" aria-hidden />
      <button
        ref={petRef}
        type="button"
        onClick={poke}
        aria-label="戳一下桌宠"
        className={cn(
          "absolute bottom-16 h-40 w-36 focus-visible:outline-none",
          poking && "pet-poke",
        )}
        style={{ left: "22%" }}
      >
        <span
          className={cn(
            "font-display absolute -top-8 left-1/2 -translate-x-1/2 text-lg text-pine/50 transition-opacity",
            sleepy ? "opacity-100" : "opacity-0",
          )}
        >
          z z
        </span>
        <svg viewBox="0 0 160 180" className="h-full w-full drop-shadow-[0_16px_16px_rgba(20,63,56,0.18)]">
          <ellipse cx="80" cy="168" rx="36" ry="8" fill="#143f38" opacity="0.15" />
          <ellipse cx="46" cy="58" rx="16" ry="22" fill="#1c7d6c" />
          <ellipse cx="114" cy="58" rx="16" ry="22" fill="#1c7d6c" />
          <ellipse cx="46" cy="58" rx="8" ry="12" fill="#f5fffb" />
          <ellipse cx="114" cy="58" rx="8" ry="12" fill="#f5fffb" />
          <ellipse cx="80" cy="108" rx="52" ry="46" fill="#1f8f7c" />
          <ellipse cx="80" cy="118" rx="28" ry="22" fill="#d7f3eb" />
          <ellipse
            cx="62"
            cy="102"
            rx="7"
            ry={sleepy ? 1.4 : 7}
            fill="#102824"
          />
          <ellipse
            cx="98"
            cy="102"
            rx="7"
            ry={sleepy ? 1.4 : 7}
            fill="#102824"
          />
          {!sleepy ? (
            <>
              <circle cx="64" cy="100" r="2" fill="#f5fffb" />
              <circle cx="100" cy="100" r="2" fill="#f5fffb" />
            </>
          ) : null}
          <ellipse cx="80" cy="118" rx="5" ry="3.5" fill="#143f38" />
          <path d="M52 124 Q40 132 50 136" stroke="#143f38" strokeWidth="2" fill="none" />
          <path d="M108 124 Q120 132 110 136" stroke="#143f38" strokeWidth="2" fill="none" />
        </svg>
      </button>
    </section>
  );
}
