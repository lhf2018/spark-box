"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ideas, moods, type Idea, type Mood } from "@/data/ideas";
import { cn } from "@/lib/utils";

const FAVORITES_KEY = "spark-box:favorites";

type MoodFilter = "全部" | Mood;

function readFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function IdeaBrowser() {
  const [mood, setMood] = useState<MoodFilter>("全部");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[] | null>(null);
  const [drawnId, setDrawnId] = useState<string | null>(null);

  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  useEffect(() => {
    if (favorites === null) return;
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const visible = useMemo(() => {
    return ideas.filter((idea) => {
      if (mood !== "全部" && idea.mood !== mood) return false;
      if (favoritesOnly && !favorites?.includes(idea.id)) return false;
      return true;
    });
  }, [mood, favoritesOnly, favorites]);

  const drawn = ideas.find((idea) => idea.id === drawnId) ?? null;

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const list = current ?? [];
      return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
    });
  }

  function drawOne() {
    const pool = visible.length > 0 ? visible : ideas;
    if (pool.length === 0) return;
    let next = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1) {
      let guard = 0;
      while (next.id === drawnId && guard < 8) {
        next = pool[Math.floor(Math.random() * pool.length)];
        guard += 1;
      }
    }
    setDrawnId(next.id);
    window.requestAnimationFrame(() => {
      document.getElementById(`idea-${next.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  return (
    <section id="ideas" className="scroll-mt-6 border-t border-pine/10">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="font-display text-4xl text-ink sm:text-5xl">盒子里</h2>
        <p className="mt-3 max-w-md text-base leading-7 text-pine/80">
          先按心情收一收，再抽一张。
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2" role="group" aria-label="按心情筛选">
            <FilterButton active={mood === "全部"} onClick={() => setMood("全部")}>
              全部
            </FilterButton>
            {moods.map((item) => (
              <FilterButton
                key={item}
                active={mood === item}
                onClick={() => setMood(item)}
              >
                {item}
              </FilterButton>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <button
              type="button"
              onClick={() => setFavoritesOnly((value) => !value)}
              aria-pressed={favoritesOnly}
              className={cn(
                "inline-flex items-center gap-2 text-sm",
                favoritesOnly ? "text-ink" : "text-pine/70",
              )}
            >
              <Star className="size-4" fill={favoritesOnly ? "currentColor" : "none"} />
              只看收藏
            </button>
            <Button type="button" onClick={drawOne}>
              再抽一个
            </Button>
          </div>
        </div>

        {drawn ? <DrawnBanner idea={drawn} /> : null}

        {visible.length === 0 ? (
          <p className="mt-12 max-w-md text-pine/75">
            {favoritesOnly
              ? "这个心情下还没有收藏。先取消「只看收藏」，或给一条点子点上星。"
              : "这里还是空的。"}
          </p>
        ) : (
          <div key={`${mood}-${favoritesOnly}`} className="mt-10">
            {visible.map((idea, index) => (
              <IdeaRow
                key={idea.id}
                idea={idea}
                index={index + 1}
                active={idea.id === drawnId}
                saved={favorites?.includes(idea.id) ?? false}
                onToggle={() => toggleFavorite(idea.id)}
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              />
            ))}
          </div>
        )}

        <p className="mt-14 text-sm text-pine/50">
          灵感盒 · spark-box
        </p>
      </div>
    </section>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "text-sm underline-offset-4",
        active ? "text-ink underline" : "text-pine/60 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function DrawnBanner({ idea }: { idea: Idea }) {
  return (
    <div
      key={idea.id}
      className="swap-in mt-8"
      aria-live="polite"
    >
      <p className="text-sm text-lagoon">抽到了</p>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-display text-4xl text-ink">{idea.title}</h3>
          <p className="mt-2 max-w-xl text-pine/80">{idea.hook}</p>
        </div>
        {idea.playable ? (
          <Button asChild variant="lagoon">
            <Link href={`/play/${idea.id}`}>打开玩玩</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function IdeaRow({
  idea,
  index,
  active,
  saved,
  onToggle,
  style,
}: {
  idea: Idea;
  index: number;
  active: boolean;
  saved: boolean;
  onToggle: () => void;
  style?: CSSProperties;
}) {
  return (
    <article
      id={`idea-${idea.id}`}
      style={style}
      className={cn(
        "idea-row scroll-mt-24 grid gap-4 border-t border-pine/10 py-7 md:grid-cols-[4.5rem_minmax(0,1fr)_auto] md:items-start",
      )}
    >
      <p className="font-display text-3xl text-lagoon/80">
        {String(index).padStart(2, "0")}
      </p>
      <div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className={cn("font-display text-3xl", active ? "text-lagoon" : "text-ink")}>
            {idea.title}
          </h3>
          <span className="text-sm text-pine/60">{idea.mood}</span>
          {idea.playable ? <span className="text-sm text-pine/60">可玩</span> : null}
        </div>
        <p className="mt-2 max-w-2xl text-base text-pine">{idea.hook}</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-pine/70">{idea.why}</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/80">火花：{idea.spark}</p>
        <p className="mt-3 text-xs tracking-wide text-pine/55">
          {idea.weekend}
          <span className="px-2">·</span>
          {idea.stack.join(" · ")}
        </p>
      </div>
      <div className="flex gap-2 md:flex-col md:items-stretch">
        {idea.playable ? (
          <Button asChild>
            <Link href={`/play/${idea.id}`}>打开玩玩</Link>
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          onClick={onToggle}
          aria-pressed={saved}
          aria-label={saved ? `取消收藏${idea.title}` : `收藏${idea.title}`}
        >
          <Star fill={saved ? "currentColor" : "none"} />
          {saved ? "已收藏" : "收藏"}
        </Button>
      </div>
    </article>
  );
}
