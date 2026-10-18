import { Suspense } from "react";
import type { Metadata } from "next";
import { PlayStage } from "@/components/play-stage";
import { getIdea, ideas } from "@/data/ideas";

type PlayPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return ideas.filter((idea) => idea.playable).map((idea) => ({ id: idea.id }));
}

export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
  const { id } = await params;
  const idea = getIdea(id);
  return {
    title: idea?.title ?? "没有这个点子",
    description: idea?.hook ?? "灵感盒里没有这个点子。",
  };
}

export default function PlayPage({ params }: PlayPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-svh bg-background px-5 py-24 text-center text-pine/70">
          正在打开这个点子…
        </div>
      }
    >
      <PlayContent params={params} />
    </Suspense>
  );
}

async function PlayContent({ params }: PlayPageProps) {
  const { id } = await params;
  return <PlayStage id={id} />;
}
