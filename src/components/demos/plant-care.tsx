"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const PLANTS = [
  { id: "pothos", name: "绿萝", every: 7 },
  { id: "succulent", name: "多肉", every: 14 },
  { id: "mint", name: "薄荷", every: 3 },
] as const;

const KEY = "spark-box:plants";

function readDates(): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

function daysSince(iso: string | undefined) {
  if (!iso) return Number.POSITIVE_INFINITY;
  const then = new Date(iso);
  const now = new Date();
  const start = Date.UTC(then.getFullYear(), then.getMonth(), then.getDate());
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today - start) / 86400000);
}

export default function PlantCare() {
  const [dates, setDates] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDates(readDates());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(dates));
  }, [dates, ready]);

  return (
    <section className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-3xl flex-col px-5 py-10 sm:px-8">
      <h1 className="font-display text-4xl text-ink sm:text-5xl">植物值日生</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-pine/75">到了浇水日，叶子会比平时更亮一点。</p>
      <ul className="mt-10 grid gap-8 sm:grid-cols-3">
        {PLANTS.map((plant) => {
          const since = daysSince(dates[plant.id]);
          const due = since >= plant.every;
          return (
            <li key={plant.id}>
              <svg viewBox="0 0 120 140" className="h-36 w-full" aria-hidden>
                <rect x="48" y="78" width="24" height="28" fill="#143f38" />
                <ellipse cx="60" cy="108" rx="22" ry="6" fill="#0e332c" opacity="0.2" />
                <ellipse cx="60" cy="58" rx="16" ry="28" fill={due ? "#3dbea4" : "#1c7d6c"} />
                <ellipse cx="40" cy="70" rx="14" ry="20" fill={due ? "#7ddec8" : "#2a6b5c"} transform="rotate(-28 40 70)" />
                <ellipse cx="82" cy="68" rx="14" ry="20" fill={due ? "#7ddec8" : "#2a6b5c"} transform="rotate(26 82 68)" />
              </svg>
              <h2 className="font-display text-2xl text-ink">{plant.name}</h2>
              <p className="mt-1 text-sm text-pine/70">
                {due ? "今天该喝水" : `${plant.every - since} 天后喝水`}
              </p>
              <Button
                type="button"
                className="mt-3"
                variant={due ? "default" : "outline"}
                onClick={() => setDates((current) => ({ ...current, [plant.id]: new Date().toISOString() }))}
              >
                浇了
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}