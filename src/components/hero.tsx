import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_15%_10%,#f7fffb_0%,transparent_55%),radial-gradient(900px_600px_at_90%_80%,#b7e4d6_0%,transparent_50%),linear-gradient(180deg,#eef8f4_0%,#d7efe6_100%)]" />
        <div className="fog-a absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-[#9fd8c8]/70 blur-3xl" />
        <div className="fog-b absolute right-[-8rem] bottom-[-6rem] h-[32rem] w-[36rem] rounded-full bg-[#c6ebe0]/80 blur-3xl" />
        <div className="fog-a absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/50 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 sm:px-8">
        <p className="rise-in pt-7 text-xs tracking-[0.42em] text-pine/70 uppercase">
          Spark Box
        </p>

        <div className="flex flex-1 flex-col justify-center py-16">
          <h1 className="rise-in font-display text-[clamp(4.75rem,14vw,10.5rem)] leading-[0.88] font-medium tracking-tight text-ink">
            灵感盒
          </h1>
          <div className="horizon mt-6 h-px w-[min(28rem,72vw)] bg-pine/35" />
          <p className="rise-in-late mt-6 max-w-xl text-lg leading-relaxed text-pine/85 sm:text-xl">
            十六个周末能做完的小项目。按心情收一收，抽一个，或者直接打开已经能玩的六个。
          </p>
          <div className="rise-in-late mt-8">
            <Button asChild size="lg">
              <a href="#ideas">去翻点子</a>
            </Button>
          </div>
        </div>

        <p className="rise-in-late pb-8 font-display text-lg text-pine/55 sm:text-2xl">
          雨声
          <span className="px-3 text-pine/25">/</span>
          钟
          <span className="px-3 text-pine/25">/</span>
          色板
          <span className="px-3 text-pine/25">/</span>
          一张纸
          <span className="px-3 text-pine/25">/</span>
          桌宠
          <span className="px-3 text-pine/25">/</span>
          字幕
        </p>
      </div>
    </section>
  );
}
