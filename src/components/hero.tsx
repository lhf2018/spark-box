import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-svh overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f3faf7" />
              <stop offset="100%" stopColor="#c5e4d8" />
            </linearGradient>
            <linearGradient id="outside" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e7f6f1" />
              <stop offset="100%" stopColor="#7eaea2" />
            </linearGradient>
            <linearGradient id="lacquer" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2c7a68" />
              <stop offset="100%" stopColor="#123f36" />
            </linearGradient>
            <filter id="paper-grain" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.06" />
              </feComponentTransfer>
            </filter>
          </defs>

          <rect width="1440" height="900" fill="url(#wall)" />
          <polygon points="0,820 1440,820 1440,900 0,900" fill="#cfe8df" />

          <g className="box-lid">
            <polygon points="-40,790 1480,790 1400,720 -120,720" fill="#1c6858" />
            <polygon points="-120,720 1400,720 1400,698 -120,698" fill="#34967f" />
          </g>

          <rect x="-40" y="830" width="1520" height="120" fill="url(#lacquer)" />
          <rect x="28" y="792" width="1384" height="48" fill="#d7eee6" />
          <rect x="64" y="802" width="1312" height="28" fill="#f7fffb" />

          <rect width="1440" height="900" filter="url(#paper-grain)" />
        </svg>
      </div>

      <div className="relative z-10 flex min-h-svh flex-col px-5 pt-[10vh] sm:px-12 sm:pt-[12vh]">
        <h1 className="rise-in font-display text-[clamp(4.6rem,12vw,8.75rem)] leading-[0.88] text-ink">
          灵感盒
        </h1>
        <p className="rise-in-late mt-6 max-w-lg font-display text-2xl leading-snug text-pine sm:text-3xl">
          周末能做完的小项目
        </p>
        <p className="rise-in-late mt-2 max-w-md text-base leading-7 text-pine/80">
          按心情挑一个，或者直接打开玩。
        </p>
        <div className="rise-in-late mt-[18vh]">
          <Button asChild size="lg">
            <a href="#ideas">去翻点子</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
