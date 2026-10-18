"use client";

import { useEffect, useState } from "react";

function lineForHour(hour: number) {
  if (hour < 5) return "夜还很长，字幕先停在这里。";
  if (hour < 11) return "早晨的光还薄，句子也轻轻的。";
  if (hour < 17) return "下午被拉长了，时钟走得很慢。";
  return "灯一盏盏亮起来，这一分钟还醒着。";
}

export default function FilmClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 200);
    return () => window.clearInterval(timer);
  }, []);

  const time = now
    ? new Intl.DateTimeFormat("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }).format(now)
    : "--:--:--";
  const date = now
    ? new Intl.DateTimeFormat("zh-CN", {
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(now)
    : "对表中";

  return (
    <section className="relative flex min-h-[calc(100svh-3.5rem)] items-center justify-center overflow-hidden bg-[#071412] text-[#e7f6f0]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.72) 100%)",
        }}
        aria-hidden
      />
      <div
        className="grain pointer-events-none absolute -inset-8 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.18) 0.6px, transparent 0.6px)",
          backgroundSize: "3px 3px",
        }}
        aria-hidden
      />
      <div className="relative z-10 px-6 text-center">
        <p className="text-xs tracking-[0.55em] text-[#9dcec2] uppercase">现场</p>
        <p className="font-display mt-6 text-[clamp(4rem,14vw,9rem)] leading-none font-medium tracking-wide">
          {time}
        </p>
        <p className="mt-6 text-sm tracking-[0.2em] text-[#d5eee6]/80">{date}</p>
        <p className="font-display mt-4 text-xl text-[#f3fff9]/90 italic sm:text-2xl">
          {now ? lineForHour(now.getHours()) : "字幕正在对焦。"}
        </p>
      </div>
    </section>
  );
}
