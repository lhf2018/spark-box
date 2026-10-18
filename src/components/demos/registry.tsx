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
};
