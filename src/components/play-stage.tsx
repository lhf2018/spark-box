"use client";

import Link from "next/link";
import { getIdea } from "@/data/ideas";
import { playDemos } from "@/components/demos/registry";

export function PlayStage({ id }: { id: string }) {
  const idea = getIdea(id);
  const Demo = playDemos[id];

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-20 border-b border-pine/10 bg-[#eef8f4]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-sm text-pine/80 hover:text-ink">
            返回首页
          </Link>
          <Link href="/" className="font-display text-xl text-ink">
            灵感盒
          </Link>
        </div>
      </header>
      <main>
        {Demo ? (
          <Demo />
        ) : (
          <EmptyPlay id={id} title={idea?.title} hook={idea?.hook} why={idea?.why} />
        )}
      </main>
    </div>
  );
}

function EmptyPlay({
  id,
  title,
  hook,
  why,
}: {
  id: string;
  title?: string;
  hook?: string;
  why?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-xl flex-col justify-center px-5 py-20">
      <p className="text-xs tracking-[0.32em] text-lagoon uppercase">Still in the box</p>
      <h1 className="font-display mt-3 text-5xl text-ink">
        {title ?? "没有这个点子"}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-pine/80">
        {title
          ? "这个点子还停在纸面上，周末可以自己把它做出来。"
          : `盒子里找不到「${id}」。回到首页再抽一张。`}
      </p>
      {hook ? <p className="mt-4 text-pine">{hook}</p> : null}
      {why ? <p className="mt-2 text-sm leading-6 text-pine/70">{why}</p> : null}
      <Link href="/#ideas" className="mt-8 text-sm text-lagoon underline-offset-4 hover:underline">
        回盒子里看看
      </Link>
    </div>
  );
}
