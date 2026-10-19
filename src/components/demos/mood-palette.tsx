"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

type Swatch = { value: string; label: string };

function hashString(input: string) {
  let hash = 2166136261;
  for (const char of input) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function paletteFrom(word: string): Swatch[] {
  const seed = hashString(word.trim().toLowerCase());
  const hue = seed % 360;
  const steps = [
    { l: 0.28, c: 0.05, turn: 0, name: "墨" },
    { l: 0.42, c: 0.09, turn: 18, name: "影" },
    { l: 0.58, c: 0.12, turn: 36, name: "中" },
    { l: 0.76, c: 0.08, turn: -14, name: "雾" },
    { l: 0.92, c: 0.035, turn: 8, name: "纸" },
  ];
  return steps.map((step, index) => {
    const twist = ((seed >> (index * 3)) & 15) - 7;
    const h = (hue + step.turn + twist + 360) % 360;
    const value = `oklch(${step.l.toFixed(3)} ${step.c.toFixed(3)} ${h.toFixed(1)})`;
    return { value, label: step.name };
  });
}

export default function MoodPalette() {
  const [word, setWord] = useState("雾");
  const [colors, setColors] = useState<Swatch[]>(() => paletteFrom("雾"));
  const [copied, setCopied] = useState<string | null>(null);

  function generate(event?: FormEvent) {
    event?.preventDefault();
    const next = word.trim();
    if (!next) return;
    setColors(paletteFrom(next));
    setCopied(null);
  }

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      return;
    } catch {
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      setCopied(ok ? value : null);
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-5xl flex-col px-5 py-10 sm:px-8">
      <h1 className="font-display text-4xl text-ink sm:text-5xl">情绪色板</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-pine/75">
        同一个词永远得到同一套五色。点一块，复制它的 oklch。
      </p>
      <form onSubmit={generate} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="mood-word">
          情绪词
        </label>
        <input
          id="mood-word"
          value={word}
          onChange={(event) => setWord(event.target.value)}
          placeholder="比如：雾、想家、刚下班"
          className="h-12 flex-1 rounded-sm border border-pine/15 bg-foam/70 px-4 text-ink outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
        />
        <Button type="submit">生成色板</Button>
      </form>
      <div className="mt-8 grid flex-1 grid-cols-2 gap-3 sm:grid-cols-5">
        {colors.map((swatch) => (
          <button
            key={swatch.value}
            type="button"
            onClick={() => void copy(swatch.value)}
            className="flex min-h-44 flex-col justify-between p-4 text-left focus-visible:ring-2 focus-visible:ring-pine focus-visible:outline-none"
            style={{ backgroundColor: swatch.value }}
          >
            <span className="font-display text-2xl text-ink/80">{swatch.label}</span>
            <span className="text-[11px] leading-4 break-all text-ink/75">
              {copied === swatch.value ? "已复制" : swatch.value}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
