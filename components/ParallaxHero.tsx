"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

interface ParallaxHeroProps {
  tagline: string;
  eyebrow?: string;
  titleMain?: string;
  titleAccent?: string;
  exploreNotesText?: string;
  viewProjectsText?: string;
  scrollText?: string;
}

export default function ParallaxHero({
  tagline,
  eyebrow = "THE CASTLE OF IDEAS",
  titleMain = "ARDA",
  titleAccent = "MOL",
  exploreNotesText = "Explore Notes",
  viewProjectsText = "View Projects",
  scrollText = "SCROLL",
}: ParallaxHeroProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  const starsOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.9]);
  const mtnFarY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const mtnMidY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const fogY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const fogOpacity = useTransform(scrollYProgress, [0, 1], [0.05, 0.12]);
  const mtnNearY = useTransform(scrollYProgress, [0, 1], [0, -230]);
  const castleY = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const castleScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const groundY = useTransform(scrollYProgress, [0, 1], [0, -340]);
  const torchL = useTransform(scrollYProgress, [0.4, 1], [0, 0.9]);
  const torchR = useTransform(scrollYProgress, [0.4, 1], [0, 0.9]);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);

  return (
    <div ref={wrapRef} className="relative h-[180vh]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#0b0b0d]">
        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <radialGradient id="skyGrad" cx="800" cy="120" r="900" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#3a2233" />
              <stop offset="0.35" stopColor="#241a28" />
              <stop offset="1" stopColor="#0b0b0d" />
            </radialGradient>
          </defs>

          <rect width="1600" height="900" fill="url(#skyGrad)" />

          <motion.g fill="#efe7d8" style={{ opacity: starsOpacity }}>
            <circle cx="120" cy="90" r="1.4" /><circle cx="260" cy="150" r="1" /><circle cx="410" cy="70" r="1.6" />
            <circle cx="560" cy="130" r="1" /><circle cx="700" cy="60" r="1.3" /><circle cx="860" cy="110" r="1" />
            <circle cx="990" cy="80" r="1.5" /><circle cx="1140" cy="140" r="1" /><circle cx="1280" cy="65" r="1.3" />
            <circle cx="1430" cy="120" r="1" /><circle cx="1540" cy="80" r="1.5" /><circle cx="60" cy="200" r="1" />
            <circle cx="330" cy="220" r="1.2" /><circle cx="620" cy="200" r="1" /><circle cx="950" cy="200" r="1.2" />
            <circle cx="1220" cy="210" r="1" /><circle cx="1480" cy="190" r="1.3" />
          </motion.g>

          <motion.polygon
            style={{ y: mtnFarY }}
            points="0,900 0,560 150,440 340,540 560,380 820,520 1060,400 1320,540 1600,430 1600,900"
            fill="#241d2c"
          />

          <motion.polygon
            style={{ y: mtnMidY }}
            points="0,900 0,640 220,520 460,620 720,460 980,610 1240,480 1600,600 1600,900"
            fill="#181420"
          />

          <motion.rect x="0" y="600" width="1600" height="140" fill="#efe7d8" style={{ y: fogY, opacity: fogOpacity }} />

          <motion.polygon
            style={{ y: mtnNearY }}
            points="0,900 0,720 260,620 540,700 880,560 1180,680 1600,600 1600,900"
            fill="#100d16"
          />

          <motion.g fill="#0a080b" style={{ y: castleY, scale: castleScale, transformOrigin: "50% 100%" }}>
            <rect x="700" y="500" width="200" height="220" />
            <rect x="660" y="460" width="40" height="260" />
            <rect x="900" y="460" width="40" height="260" />
            <rect x="760" y="430" width="80" height="290" />
            <polygon points="655,460 705,460 680,425" />
            <polygon points="895,460 945,460 920,425" />
            <polygon points="755,430 845,430 800,390" />
            <rect x="500" y="560" width="160" height="160" />
            <rect x="940" y="560" width="160" height="160" />
            <rect x="470" y="520" width="30" height="200" />
            <rect x="1100" y="520" width="30" height="200" />
            <rect x="0" y="680" width="1600" height="220" />
            <path d="M 780 720 L 780 630 A 20 20 0 0 1 820 630 L 820 720 Z" fill="#050405" />
          </motion.g>

          <motion.circle cx="740" cy="670" r="10" fill="#e8a94b" style={{ opacity: torchL }} />
          <motion.circle cx="860" cy="670" r="10" fill="#e8a94b" style={{ opacity: torchR }} />

          <motion.rect x="0" y="820" width="1600" height="200" fill="#050405" style={{ y: groundY }} />
        </svg>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="pointer-events-none absolute inset-0 z-[5] flex flex-col items-center justify-end pb-[9vh] text-center"
        >
          <p className="mb-[22px] text-xs tracking-[0.32em] text-[#8a712f]">{eyebrow}</p>
          <h1 className="font-display text-[clamp(3.4rem,9vw,8rem)] font-normal leading-[0.95] tracking-tight text-[#efe7d8]">
            {titleMain} <span className="italic font-light text-[#c9a24a]">{titleAccent}</span>
          </h1>
          <p className="mt-6 max-w-[420px] text-sm tracking-[0.06em] text-[#a9a196]">{tagline}</p>
          <div className="pointer-events-auto mt-9 flex items-center gap-6">
            <Link
              href="/notes"
              data-cursor-hover
              className="rounded-full bg-[#c9a24a] px-6 py-3 text-sm font-medium text-[#0b0b0d] transition-transform hover:scale-[1.03]"
            >
              {exploreNotesText}
            </Link>
            <Link href="/projects" data-cursor-hover className="ink-link text-sm text-[#efe7d8]">
              {viewProjectsText}
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-7 left-1/2 z-[6] flex -translate-x-1/2 flex-col items-center gap-2.5">
          <span
            className="h-[38px] w-px animate-pulse"
            style={{ background: "linear-gradient(180deg, #c9a24a, transparent)" }}
          />
          <span className="text-[10px] tracking-[0.28em] text-[#a9a196]">{scrollText}</span>
        </div>
      </div>
    </div>
  );
}