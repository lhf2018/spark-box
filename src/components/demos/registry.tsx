"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

function loadDemo(loader: () => Promise<{ default: ComponentType }>) {
  return dynamic(loader, {
    ssr: false,
    loading: () => (
      <p className="px-5 py-24 text-center text-pine/70">正在铺开这个点子…</p>
    ),
  });
}

export const playDemos: Record<string, ComponentType> = {
  "rain-mixer": loadDemo(() => import("@/components/demos/rain-mixer")),
  "typewriter-journal": loadDemo(() => import("@/components/demos/typewriter-journal")),
  "cafe-pomodoro": loadDemo(() => import("@/components/demos/cafe-pomodoro")),
  "mood-palette": loadDemo(() => import("@/components/demos/mood-palette")),
  "film-clock": loadDemo(() => import("@/components/demos/film-clock")),
  "desk-pet": loadDemo(() => import("@/components/demos/desk-pet")),
  "pixel-weather": loadDemo(() => import("@/components/demos/pixel-weather")),
  "synth-pad": loadDemo(() => import("@/components/demos/synth-pad")),
  "walk-art": loadDemo(() => import("@/components/demos/walk-art")),
  "brew-timer": loadDemo(() => import("@/components/demos/brew-timer")),
  "sticky-wall": loadDemo(() => import("@/components/demos/sticky-wall")),
  "city-generator": loadDemo(() => import("@/components/demos/city-generator")),
  "reading-ring": loadDemo(() => import("@/components/demos/reading-ring")),
  "idle-aquarium": loadDemo(() => import("@/components/demos/idle-aquarium")),
  "late-radio": loadDemo(() => import("@/components/demos/late-radio")),
  "plant-care": loadDemo(() => import("@/components/demos/plant-care")),
};
