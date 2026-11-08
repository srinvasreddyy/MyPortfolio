import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  X,
  Github,
  Linkedin,
  Zap,
  Copy,
  Check,
  Award,
  CreditCard,
  Store,
  ShieldCheck,
  Compass,
  Cpu,
  GraduationCap,
  Briefcase,
  Trophy,
  Mail,
  Phone,
  MapPin,
  Menu,
  Wand2,
  Workflow,
  CheckCircle2,
  Info,
} from "lucide-react";

// ============================================================================
// AUTOMATICALLY DISCOVER THE 4 PROFILE PHOTOS IN "Complete details"
// ============================================================================
const rawDetailImages = import.meta.glob(
  "../../Complete details/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP}",
  { eager: true, import: "default" }
);

function resolveFourProfilePhotos() {
  const entries = Object.entries(rawDetailImages).map(([path, url]) => {
    const filename = path.split("/").pop().toLowerCase();
    return { path, filename, url };
  });

  const fallbackUrl = entries[0]?.url || "/user.png";

  const findByKeywords = (keywords, fallbackIndex) => {
    const match = entries.find((item) =>
      keywords.some((kw) => item.filename.includes(kw))
    );
    if (match) return match.url;
    if (entries[fallbackIndex]) return entries[fallbackIndex].url;
    return fallbackUrl;
  };

  return {
    camera: findByKeywords(
      ["camera", "front", "center", "straight", "userimage", "main"],
      0
    ),
    goggles: findByKeywords(
      ["goggle", "google", "glass", "sunglass", "shade", "spec", "cool"],
      1
    ),
    left: findByKeywords(["left"], 2),
    right: findByKeywords(["right"], 3),
  };
}

const PROFILE_PHOTOS = resolveFourProfilePhotos();

const SECTION_PHOTO_SRC = {
  hero: PROFILE_PHOTOS.camera,
  works: PROFILE_PHOTOS.goggles,
  labs: PROFILE_PHOTOS.left,
  journey: PROFILE_PHOTOS.right,
  certs: PROFILE_PHOTOS.goggles,
  contact: PROFILE_PHOTOS.camera,
};

// ============================================================================
// 16 LARGE COLORFUL BRAND TECH STACK ICONS (ICONS ONLY — NO TEXT LABELS)
// ============================================================================
const COLORFUL_TECH_ICONS = [
  {
    id: "python",
    bg: "#FFFFFF",
    border: "#3776AB",
    svg: (
      <svg viewBox="0 0 24 24" className="w-7 h-7">
        <path
          fill="#3776AB"
          d="M11.9 2C7.3 2 7.6 4 7.6 4v2.1h4.5v.7H5.7S2 6.4 2 11.9s3.2 5.3 3.2 5.3h1.9v-2.6s-.1-3.2 3.1-3.2h5.3s3-.1 3-2.9V4.8S19 2 11.9 2zm-2.5 1.6c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z"
        />
        <path
          fill="#FFD43B"
          d="M12.1 22c4.6 0 4.3-2 4.3-2v-2.1h-4.5v-.7h6.4S22 17.6 22 12.1s-3.2-5.3-3.2-5.3h-1.9v2.6s.1 3.2-3.1 3.2H8.5s-3 .1-3 2.9v3.7S5 22 12.1 22zm2.5-1.6c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z"
        />
      </svg>
    ),
  },
  {
    id: "js",
    bg: "#F7DF1E",
    border: "#D4B800",
    svg: (
      <svg viewBox="0 0 24 24" className="w-7 h-7">
        <rect width="24" height="24" rx="5" fill="#F7DF1E" />
        <path
          fill="#1E1916"
          d="M13.5 16.8c0 1.6-.9 2.3-2.3 2.3-1.2 0-2-.6-2.3-1.4l1.3-.8c.2.4.5.7 1 .7.5 0 .8-.2.8-1v-5.2h1.5v5.4zm4.8 2.3c-1.5 0-2.4-.7-2.8-1.7l1.3-.8c.3.6.8 1 1.6 1 .7 0 1.1-.3 1.1-.8 0-.5-.4-.7-1.2-1.1l-.4-.2c-1.2-.5-1.9-1.1-1.9-2.4 0-1.2.9-2.1 2.3-2.1 1 0 1.8.3 2.3 1.3l-1.2.8c-.3-.5-.6-.7-1.1-.7-.5 0-.8.3-.8.7 0 .5.3.7 1.1 1l.4.2c1.4.6 2.1 1.2 2.1 2.5 0 1.5-1.1 2.3-2.8 2.3z"
        />
      </svg>
    ),
  },
  {
    id: "react",
    bg: "#20232A",
    border: "#61DAFB",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7"
        fill="none"
        stroke="#61DAFB"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="2.2" fill="#61DAFB" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4.2"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4.2"
          transform="rotate(120 12 12)"
        />
      </svg>
    ),
  },
  {
    id: "node",
    bg: "#ECFDF5",
    border: "#339933",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7"
        fill="none"
        stroke="#339933"
        strokeWidth="2.2"
      >
        <polygon
          points="12 2 21 7 21 17 12 22 3 17 3 7 12 2"
          fill="#339933"
          fillOpacity="0.18"
        />
        <path d="M12 8v8m-3-6l3-2 3 2" />
      </svg>
    ),
  },
  {
    id: "mongodb",
    bg: "#F0FDF4",
    border: "#47A248",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7"
        fill="none"
        stroke="#47A248"
        strokeWidth="2"
      >
        <path
          d="M12 2C7.5 7 6 11 6 14.5A6 6 0 0 0 12 20.5a6 6 0 0 0 6-6C18 11 16.5 7 12 2z"
          fill="#47A248"
          fillOpacity="0.22"
        />
        <line x1="12" y1="22" x2="12" y2="10" />
      </svg>
    ),
  },
  {
    id: "express",
    bg: "#1E1916",
    border: "#C96541",
    svg: (
      <svg viewBox="0 0 24 24" className="w-7 h-7">
        <text
          x="2.5"
          y="16"
          fontSize="10.5"
          fontWeight="900"
          fill="#F4F0EA"
          fontFamily="monospace"
        >
          EX
        </text>
      </svg>
    ),
  },
  {
    id: "java",
    bg: "#FFF7ED",
    border: "#EA580C",
    svg: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" strokeWidth="2">
        <path stroke="#2563EB" d="M17 9h1a3.5 3.5 0 1 1 0 7h-1" />
        <path
          stroke="#2563EB"
          fill="#DBEAFE"
          d="M4 9h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9z"
        />
        <line stroke="#EA580C" x1="7" y1="3" x2="7" y2="6" />
        <line stroke="#EA580C" x1="10.5" y1="2" x2="10.5" y2="6" />
        <line stroke="#EA580C" x1="14" y1="3" x2="14" y2="6" />
      </svg>
    ),
  },
  {
    id: "sql",
    bg: "#EFF6FF",
    border: "#336791",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7"
        fill="none"
        stroke="#336791"
        strokeWidth="2"
      >
        <ellipse cx="12" cy="5" rx="8" ry="3" fill="#BFDBFE" />
        <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
      </svg>
    ),
  },
  {
    id: "flask",
    bg: "#F0FDFA",
    border: "#0D9488",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7"
        fill="none"
        stroke="#0D9488"
        strokeWidth="2"
      >
        <path
          fill="#CCFBF1"
          d="M9 3h6m-5 0v5.2L4.4 18.6A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.8-2.4L14 8.2V3"
        />
      </svg>
    ),
  },
  {
    id: "tailwind",
    bg: "#F0F9FF",
    border: "#06B6D4",
    svg: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#06B6D4">
        <path d="M12 6c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.8.2 1.3.7 1.9 1.3 1 1 2.1 2.2 4.6 2.2 2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.8-.2-1.3-.7-1.9-1.3C15.6 7.2 14.5 6 12 6zM7 12c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.8.2 1.3.7 1.9 1.3 1 1 2.1 2.2 4.6 2.2 2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.8-.2-1.3-.7-1.9-1.3C10.6 13.2 9.5 12 7 12z" />
      </svg>
    ),
  },
  {
    id: "docker",
    bg: "#EFF6FF",
    border: "#2496ED",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7"
        fill="none"
        stroke="#2496ED"
        strokeWidth="2"
      >
        <rect x="3" y="10" width="4" height="4" fill="#BFDBFE" />
        <rect x="8" y="10" width="4" height="4" fill="#BFDBFE" />
        <rect x="13" y="10" width="4" height="4" fill="#BFDBFE" />
        <rect x="8" y="5" width="4" height="4" fill="#BFDBFE" />
        <path d="M2 14h19c0 4-3.5 6-9 6S2 18 2 14z" fill="#93C5FD" />
      </svg>
    ),
  },
  {
    id: "aws",
    bg: "#FFFBEB",
    border: "#FF9900",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7"
        fill="none"
        stroke="#FF9900"
        strokeWidth="2.2"
      >
        <path
          fill="#FEF3C7"
          d="M17.5 19H7a5 5 0 0 1-.5-9.97A6.5 6.5 0 0 1 19 10.5a4.5 4.5 0 0 1-1.5 8.5z"
        />
      </svg>
    ),
  },
  {
    id: "git",
    bg: "#FEF2F2",
    border: "#F05032",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7"
        fill="none"
        stroke="#F05032"
        strokeWidth="2.2"
      >
        <circle cx="6" cy="6" r="2.5" fill="#FECACA" />
        <circle cx="18" cy="6" r="2.5" fill="#FECACA" />
        <circle cx="6" cy="18" r="2.5" fill="#FECACA" />
        <path d="M6 8.5v7M18 8.5c0 4-6 3.5-12 7" />
      </svg>
    ),
  },
  {
    id: "redis",
    bg: "#FFF1F2",
    border: "#DC382D",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7"
        fill="none"
        stroke="#DC382D"
        strokeWidth="2"
      >
        <polygon points="12 3 21 8 12 13 3 8 12 3" fill="#FECDD3" />
        <polyline points="3 13 12 18 21 13" />
        <polyline points="3 17 12 22 21 17" />
      </svg>
    ),
  },
  {
    id: "pytorch",
    bg: "#FFF7ED",
    border: "#EE4C2C",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7"
        fill="none"
        stroke="#EE4C2C"
        strokeWidth="2.2"
      >
        <path d="M12 2l4 4-4 4" />
        <path d="M8 6a7 7 0 1 0 8 0" />
        <circle cx="15" cy="6" r="1.4" fill="#EE4C2C" />
      </svg>
    ),
  },
  {
    id: "c-lang",
    bg: "#EEF2FF",
    border: "#4F46E5",
    svg: (
      <svg viewBox="0 0 24 24" className="w-7 h-7">
        <text
          x="6"
          y="17"
          fontSize="14"
          fontWeight="900"
          fill="#4F46E5"
          fontFamily="monospace"
        >
          C
        </text>
      </svg>
    ),
  },
];

// ============================================================================
// EXACT 7 TEXT-ONLY ORBIT PILLS
// ============================================================================
const ORBIT_TEXT_ONLY_PILLS = [
  "LLMs",
  "REST APIs",
  "Machine Learning",
  "Prompt Engineering",
  "Stripe",
  "Payment Gateway",
  "System Design",
];

// ============================================================================
// 6 REVOLVING MESSAGE DIALOGUE BOXES
// ============================================================================
const ORBIT_MESSAGE_DIALOGUES = [
  { tag: "CORE ROLE", title: "Backend Developer", dot: "#C96541" },
  { tag: "ARCHITECTURE", title: "Full Stack", dot: "#2A6B53" },
  { tag: "INTELLIGENCE", title: "AI Engineer", dot: "#3B4CCA" },
  { tag: "PRODUCTION", title: "35% Faster APIs", dot: "#C96541" },
  { tag: "MARKETPLACE", title: "Stripe Connect", dot: "#635BFF" },
  { tag: "COMPETITIONS", title: "2× 1st Prize Winner", dot: "#D97706" },
];

// ============================================================================
// EXPANDED RIGHT-ALIGNED 60FPS ORBITAL & ELASTIC BOUNCE PHYSICS ARENA
// ============================================================================
function HeroCircularPortraitPhysicsArena({ photoSrc }) {
  const arenaRef = useRef(null);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });

  const iconNodeRefs = useRef([]);
  const pillNodeRefs = useRef([]);
  const msgNodeRefs = useRef([]);

  useEffect(() => {
    const width = window.innerWidth;
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    const R_ICONS = isMobile ? 115 : isTablet ? 150 : 162;
    const R_PILLS = isMobile ? 158 : isTablet ? 210 : 228;
    const R_MSGS = isMobile ? 202 : isTablet ? 272 : 296;

    const createRingNodes = (count, baseRadius, baseSpeed) =>
      Array.from({ length: count }, (_, i) => ({
        angle: (2 * Math.PI * i) / count,
        vAngle: 0,
        baseSpeed,
        baseRadius,
        rOffset: 0,
        vr: 0,
        scale: 1,
        vScale: 0,
        phase: i * 1.3,
      }));

    // Slower, calmer orbital speeds
    const ringIcons = createRingNodes(
      COLORFUL_TECH_ICONS.length,
      R_ICONS,
      0.0016
    );
    const ringPills = createRingNodes(
      ORBIT_TEXT_ONLY_PILLS.length,
      R_PILLS,
      -0.0011
    );
    const ringMsgs = createRingNodes(
      ORBIT_MESSAGE_DIALOGUES.length,
      R_MSGS,
      0.00085
    );

    let rafId;
    let time = 0;

    const stepRingPhysics = (nodes, domRefs, minArcRatio, hitRadius) => {
      const N = nodes.length;
      const idealGap = (2 * Math.PI) / N;
      const minGap = idealGap * minArcRatio;

      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N;
        let diff = nodes[j].angle - nodes[i].angle;
        while (diff < 0) diff += 2 * Math.PI;
        while (diff >= 2 * Math.PI) diff -= 2 * Math.PI;

        if (diff < minGap) {
          const push = (minGap - diff) * 0.11;
          nodes[i].vAngle -= push;
          nodes[j].vAngle += push;
        }
      }

      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const floatBob = Math.sin(time * 0.016 + n.phase) * 3.5;
        const currentR = n.baseRadius + n.rOffset + floatBob;
        const x = Math.cos(n.angle) * currentR;
        const y = Math.sin(n.angle) * currentR;

        if (pointerRef.current.active) {
          const dx = x - pointerRef.current.x;
          const dy = y - pointerRef.current.y;
          const dist = Math.hypot(dx, dy);

          if (dist < hitRadius && dist > 0.001) {
            const strength = (hitRadius - dist) / hitRadius;
            const tx = -Math.sin(n.angle);
            const ty = Math.cos(n.angle);
            const dotTangential = (dx * tx + dy * ty) / dist;
            const bounceDir =
              Math.abs(dotTangential) > 0.15
                ? Math.sign(dotTangential)
                : -Math.sign(n.baseSpeed);

            n.vAngle += bounceDir * strength * 0.018;
            n.vr += strength * 2.6;
            n.vScale += strength * 0.04;
          }
        }

        n.vAngle *= 0.92;
        n.angle = (n.angle + n.baseSpeed + n.vAngle) % (2 * Math.PI);
        if (n.angle < 0) n.angle += 2 * Math.PI;

        const rForce = -0.11 * n.rOffset;
        n.vr = (n.vr + rForce) * 0.85;
        n.rOffset += n.vr;

        const sForce = -0.16 * (n.scale - 1);
        n.vScale = (n.vScale + sForce) * 0.82;
        n.scale = Math.max(0.92, Math.min(1.2, n.scale + n.vScale));

        const el = domRefs.current[i];
        if (el) {
          const finalR = n.baseRadius + n.rOffset + floatBob;
          const fx = Math.cos(n.angle) * finalR;
          const fy = Math.sin(n.angle) * finalR;
          el.style.transform = `translate3d(${fx.toFixed(1)}px, ${fy.toFixed(
            1
          )}px, 0) scale(${n.scale.toFixed(3)})`;
        }
      }
    };

    const loop = () => {
      time += 1;
      stepRingPhysics(ringIcons, iconNodeRefs, 0.84, 64);
      stepRingPhysics(ringPills, pillNodeRefs, 0.86, 82);
      stepRingPhysics(ringMsgs, msgNodeRefs, 0.9, 105);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handlePointerMove = (e) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    pointerRef.current = {
      x: e.clientX - cx,
      y: e.clientY - cy,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
  };

  return (
    <div
      ref={arenaRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onClick={handlePointerMove}
      className="relative ml-auto w-[380px] h-[380px] sm:w-[560px] sm:h-[560px] lg:w-[640px] lg:h-[640px] flex items-center justify-center select-none"
    >
      <div
        className="absolute inset-14 rounded-full blur-3xl opacity-65 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201, 101, 65, 0.24) 0%, rgba(234, 227, 216, 0.65) 52%, rgba(244, 240, 234, 0) 80%)",
        }}
      />

      <div className="absolute w-[230px] h-[230px] sm:w-[300px] sm:h-[300px] lg:w-[324px] lg:h-[324px] rounded-full border border-[#1E1916]/10 pointer-events-none" />
      <div className="absolute w-[316px] h-[316px] sm:w-[420px] sm:h-[420px] lg:w-[456px] lg:h-[456px] rounded-full border border-dashed border-[#1E1916]/12 pointer-events-none" />
      <div className="absolute w-[404px] h-[404px] sm:w-[544px] sm:h-[544px] lg:w-[592px] lg:h-[592px] rounded-full border border-[#1E1916]/8 pointer-events-none" />

      <div className="relative w-44 h-44 sm:w-60 sm:h-60 lg:w-64 lg:h-64 rounded-full flex items-center justify-center z-10 pointer-events-none">
        <img
          src={photoSrc}
          onError={(e) => {
            e.currentTarget.src = "/user.png";
          }}
          alt="Srinivasa Reddy Sanikommu"
          className="w-44 h-44 sm:w-60 sm:h-60 lg:w-64 lg:h-64 object-cover object-top portrait-fade-circle"
        />
      </div>

      {/* RING 1: 16 LARGER COLORFUL TECH STACK ICON PODS */}
      {COLORFUL_TECH_ICONS.map((item, idx) => (
        <div
          key={item.id}
          ref={(el) => (iconNodeRefs.current[idx] = el)}
          style={{
            backgroundColor: item.bg,
            borderColor: item.border,
          }}
          className="absolute top-1/2 left-1/2 -ml-6 -mt-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 shadow-md flex items-center justify-center z-20 gpu cursor-pointer"
        >
          {item.svg}
        </div>
      ))}

      {/* RING 2: 7 EXACT TEXT-ONLY DOMAIN PILLS */}
      {ORBIT_TEXT_ONLY_PILLS.map((label, idx) => (
        <div
          key={label}
          ref={(el) => (pillNodeRefs.current[idx] = el)}
          className="absolute top-1/2 left-1/2 z-20 gpu cursor-pointer"
        >
          <div className="-translate-x-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-full bg-[#EAE3D8] border border-[#1E1916]/20 shadow-sm font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#1E1916] whitespace-nowrap hover:border-[#C96541] hover:text-[#C96541] transition-colors">
            {label}
          </div>
        </div>
      ))}

      {/* RING 3: 6 EXPANDED MESSAGE DIALOGUE BOXES */}
      {ORBIT_MESSAGE_DIALOGUES.map((msg, idx) => (
        <div
          key={msg.title}
          ref={(el) => (msgNodeRefs.current[idx] = el)}
          className="absolute top-1/2 left-1/2 z-30 gpu cursor-pointer"
        >
          <div className="-translate-x-1/2 -translate-y-1/2 floating-pill px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl flex items-center gap-3 border border-[#1E1916]/15 hover:border-[#C96541] shadow-md transition-colors min-w-[155px] sm:min-w-[180px]">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{
                backgroundColor: msg.dot,
                boxShadow: `0 0 10px ${msg.dot}80`,
              }}
            />
            <div className="leading-tight">
              <span className="font-mono text-[8.5px] sm:text-[9px] font-bold uppercase tracking-widest text-[#6E655F] block">
                {msg.tag}
              </span>
              <span className="font-display text-xs sm:text-sm font-extrabold text-[#1E1916] whitespace-nowrap block mt-0.5">
                {msg.title}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// TOP-RIGHT CORNER SHRUNK PORTRAIT DOCK
// ============================================================================
function ShrunkCornerPortraitDock({ activeSection, scrolledPastHero, onJumpTop }) {
  const activePhotoSrc =
    SECTION_PHOTO_SRC[activeSection] || PROFILE_PHOTOS.camera;

  return (
    <AnimatePresence>
      {scrolledPastHero && (
        <motion.div
          key="shrunk-corner-avatar"
          initial={{ opacity: 0, scale: 0.4, x: -80, y: 80 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.4, y: 40 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="fixed top-20 right-4 sm:right-8 z-[8800]"
        >
          <button
            onClick={onJumpTop}
            title="Scroll to Top"
            className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center group"
          >
            <div
              className="absolute inset-1 rounded-full blur-xl opacity-70 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(201, 101, 65, 0.32) 0%, rgba(244, 240, 234, 0) 72%)",
              }}
            />
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#C96541]/55 animate-spin-ring" />
            <div className="absolute inset-2 rounded-full border border-[#1E1916]/15" />

            <AnimatePresence mode="wait">
              <motion.img
                key={activePhotoSrc + activeSection}
                src={activePhotoSrc}
                onError={(e) => {
                  e.currentTarget.src = "/user.png";
                }}
                initial={{ opacity: 0, scale: 0.84 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.84 }}
                transition={{ duration: 0.3 }}
                alt="Srinivasa Reddy"
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover object-top portrait-fade-circle shadow-xl"
              />
            </AnimatePresence>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// CRYSTAL-CLEAR INTERACTIVE COMPANION MASCOT ("NOVA")
// ============================================================================
function NovaMascot({ activeSection, mascotMood, onQuickJump }) {
  const [isOpen, setIsOpen] = useState(true);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const mascotRef = useRef(null);

  useEffect(() => {
    let rafId = null;
    const handleMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        if (mascotRef.current) {
          const rect = mascotRef.current.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const angle = Math.atan2(dy, dx);
          const dist = Math.min(3.2, Math.hypot(dx, dy) / 60);
          setEyeOffset({
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
          });
        }
        rafId = null;
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const guideMessages = {
    hero: {
      badge: "CHAPTER 01 // INTRO",
      title: "Hi! Touch the Revolving Orbit!",
      text: "Move your cursor over the large tech icons or dialogue boxes on the right—they gently bounce back with smooth physics!",
    },
    works: {
      badge: "CHAPTER 02 // MY WORKS",
      title: "4 Production Projects",
      text: "Click any card to inspect OrderNow (with Stripe Connect), InsureAI, the LangGraph Resume Agent, or Enron AI.",
    },
    labs: {
      badge: "CHAPTER 03 // LIVE LABS",
      title: "Interactive UI Simulators",
      text: "Try out the interactive math & routing demos! (Simulation only — does not resemble actual behaviour).",
    },
    journey: {
      badge: "CHAPTER 04 // TIMELINE",
      title: "2021 — 2027 Journey",
      text: "From 95% in Intermediate MPC to cutting MongoDB API latency by 35% at KriBud Web Tech.",
    },
    certs: {
      badge: "CHAPTER 05 // CREDENTIALS",
      title: "Certifications & 1st Prize Wins",
      text: "Explore Srinivasa's 1st Prize wins in AI Ad Creation & Automations Building, plus 5 verified certifications!",
    },
  };

  const currentMsg = guideMessages[activeSection] || guideMessages.hero;

  return (
    <div
      ref={mascotRef}
      className="fixed bottom-5 right-5 z-[8500] flex items-end gap-3 select-none"
    >
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key={activeSection + mascotMood}
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.94 }}
            transition={{ duration: 0.22 }}
            className="w-72 sm:w-80 rounded-2xl floating-pill p-4 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C96541]/15 text-[#C96541] border border-[#C96541]/30">
                {currentMsg.badge}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#6E655F] hover:text-[#1E1916] text-xs font-mono font-bold"
              >
                Hide
              </button>
            </div>

            <div className="font-display text-sm font-extrabold text-[#1E1916]">
              {mascotMood || currentMsg.title}
            </div>

            <p className="text-xs text-[#6E655F] leading-relaxed font-medium">
              {currentMsg.text}
            </p>

            <div className="pt-1 flex flex-wrap gap-1.5">
              {[
                { id: "works", label: "Works" },
                { id: "labs", label: "Live Labs" },
                { id: "journey", label: "Timeline" },
                { id: "certs", label: "Certs & Wins" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onQuickJump(tab.id)}
                  className={`font-mono text-[10px] px-2.5 py-1 rounded-lg border transition-colors ${
                    activeSection === tab.id
                      ? "bg-[#C96541] text-[#F4F0EA] border-[#C96541] font-extrabold"
                      : "bg-[#EAE3D8] text-[#1E1916] border-[#1E1916]/15 hover:border-[#C96541]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title="Toggle Nova Guide"
        className="group relative w-20 h-20 rounded-2xl bg-[#EAE3D8] border-2 border-[#C96541] shadow-xl flex items-center justify-center animate-float gpu"
      >
        <svg viewBox="0 0 100 100" className="w-16 h-16 overflow-visible">
          <circle
            cx="50"
            cy="88"
            r="6"
            fill="#C96541"
            opacity="0.55"
            className="animate-ping"
          />
          <path d="M 44 82 L 50 95 L 56 82 Z" fill="#C96541" />

          <line
            x1="50"
            y1="8"
            x2="50"
            y2="19"
            stroke="#1E1916"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="50" cy="7" r="4.5" fill="#C96541" />

          <rect x="14" y="32" width="7" height="16" rx="3.5" fill="#C96541" />
          <rect x="79" y="32" width="7" height="16" rx="3.5" fill="#C96541" />

          <rect
            x="19"
            y="18"
            width="62"
            height="44"
            rx="20"
            fill="#F4F0EA"
            stroke="#1E1916"
            strokeWidth="2.5"
          />

          <rect
            x="25"
            y="24"
            width="50"
            height="32"
            rx="14"
            fill="#1E1916"
          />

          <g
            style={{
              transform: `translate3d(${eyeOffset.x}px, ${eyeOffset.y}px, 0)`,
            }}
          >
            <circle cx="40" cy="39" r="5" fill="#F4F0EA" />
            <circle cx="60" cy="39" r="5" fill="#F4F0EA" />
            <path
              d="M 45 47 Q 50 51 55 47"
              stroke="#C96541"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          <rect
            x="32"
            y="62"
            width="36"
            height="20"
            rx="8"
            fill="#F4F0EA"
            stroke="#1E1916"
            strokeWidth="2.2"
          />
          <rect x="43" y="67" width="14" height="9" rx="3" fill="#C96541" />
        </svg>

        <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#C96541] text-[#F4F0EA] font-mono text-[9px] font-extrabold shadow">
          NOVA
        </span>
      </button>
    </div>
  );
}

// ============================================================================
// MY WORKS — 4 FLAGSHIP PROJECTS
// ============================================================================
const PROJECTS = [
  {
    id: "01",
    slug: "ordernow",
    title: "OrderNow",
    tagline: "Multi-Vendor Food & Grocery Marketplace with Stripe Connect",
    repo: "srinvasreddyy/ordernow-backend",
    year: "2026",
    role: "Backend Developer (KriBud Web Tech Internship)",
    stack: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Stripe Connect",
      "Stripe Webhooks",
      "React.js",
      "JWT Auth",
    ],
    metrics: [
      { label: "PAYMENT ENGINE", value: "Stripe Connect" },
      { label: "VENDOR FLOW", value: "Automated Onboarding" },
      { label: "WEBHOOK SAFETY", value: "Signature Verified" },
      { label: "CONCURRENCY", value: "Zero Double-Orders" },
    ],
    quickStory:
      "Built to power a real multi-vendor delivery marketplace where restaurants onboard with Stripe Connect, customers check out smoothly, and payouts split automatically.",
    summary:
      "A complete multi-vendor food, grocery, and table reservation platform. I engineered the backend architecture for vendor onboarding via Stripe Connect, automated merchant split-payouts, real-time cart and order tracking, and webhook-verified payment status updates that stay reliable even under heavy simultaneous traffic.",
    steps: [
      {
        title: "1. Vendor Onboarding with Stripe Connect",
        sub: "Express Connected Accounts",
        detail:
          "Restaurants and grocery partners onboard in minutes through Stripe Connect links, enabling automated KYC verification and direct bank payouts.",
      },
      {
        title: "2. Customer Checkout & Marketplace Split",
        sub: "PaymentIntents + Transfer Groups",
        detail:
          "When a customer places an order, Stripe processes the payment, keeps the small platform service fee, and routes the vendor's share automatically.",
      },
      {
        title: "3. Asynchronous Stripe Webhooks",
        sub: "Cryptographic Signature Verification",
        detail:
          "Listens to Stripe webhook events (payment_intent.succeeded) to update order statuses deterministically even if the user closes their browser.",
      },
      {
        title: "4. Concurrency-Safe Bookings & Carts",
        sub: "Atomic MongoDB State Updates",
        detail:
          "Prevents race conditions and duplicate orders when multiple users book the same table slot or last inventory item at the same time.",
      },
    ],
    codeTitle: "Stripe Connect Vendor Onboarding & Marketplace Split Checkout",
    codeSnippet: `// 1. Onboard vendor with Stripe Connect Express Account
const account = await stripe.accounts.create({
  type: "express",
  country: "IN",
  email: vendor.email,
  capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
});

// 2. Create Marketplace Checkout with automatic vendor split payout
const session = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items: cartItems,
  payment_intent_data: {
    application_fee_amount: platformFeeInPaise, // Platform commission
    transfer_data: { destination: vendor.stripeConnectAccountId }, // Instant vendor split
  },
  success_url: \`\${CLIENT_URL}/orders/\${order.id}/success\`,
});`,
  },
  {
    id: "02",
    slug: "insureai",
    title: "InsureAI (InsurePred)",
    tagline: "Real-Time Health Insurance Cost Predictor & AI Advisor",
    repo: "srinvasreddyy/ai-health-insurance-manager",
    year: "2026",
    role: "Full-Stack & Machine Learning Developer",
    stack: [
      "React.js",
      "Node.js & Express",
      "Python Flask",
      "Scikit-Learn",
      "Gemini 2.5 Flash",
      "MongoDB",
      "Postman",
    ],
    metrics: [
      { label: "TRAINING DATASET", value: "1,338 Health Profiles" },
      { label: "ARCHITECTURE", value: "MERN + Flask ML" },
      { label: "BASE AVERAGE", value: "$13,270 / yr" },
      { label: "AI GUIDANCE", value: "Personalized Tips" },
    ],
    quickStory:
      "Connects a React & Node.js web app to a Python Flask machine learning service so anyone can estimate insurance costs in seconds.",
    summary:
      "A 3-tier web application that combines a friendly React dashboard, a Node.js/Express API gateway, and a Python Flask machine learning microservice. It predicts annual health insurance premiums using a trained Scikit-Learn regression model and explains how lifestyle factors affect your price.",
    steps: [
      {
        title: "1. Interactive React Health Form",
        sub: "Clean User Input & Live Charts",
        detail:
          "Users enter simple details like age, BMI, children, smoker status, and region to see an instant cost breakdown.",
      },
      {
        title: "2. Node.js API Gateway & MongoDB",
        sub: "Validation & Prediction History",
        detail:
          "Validates incoming data, manages user accounts, and saves past predictions in MongoDB so users can track changes over time.",
      },
      {
        title: "3. Python Flask ML Microservice",
        sub: "Scikit-Learn StandardScaler + Linear Regression",
        detail:
          "Normalizes the 8 health inputs and runs the trained regression model to return accurate dollar estimates with low latency.",
      },
      {
        title: "4. Plain-English AI Health Tips",
        sub: "Gemini 2.5 Flash Integration",
        detail:
          "Turns raw numbers into clear, practical advice on how to lower future insurance premiums.",
      },
    ],
    codeTitle: "Node.js Gateway Calling the Python Flask ML Microservice",
    codeSnippet: `// Express controller validating payload and calling Python Flask ML service
export const predictInsurancePremium = async (req, res) => {
  const { age, bmi, children, sex, smoker, region } = req.body;

  // Call isolated Python Flask Scikit-Learn inference service
  const mlResponse = await axios.post(\`\${process.env.FLASK_ML_URL}/predict\`, {
    age, bmi, children, sex, smoker, region
  });

  const record = await PredictionLog.create({
    userId: req.user.id,
    inputs: { age, bmi, children, sex, smoker, region },
    estimatedPremium: mlResponse.data.predicted_premium,
  });

  return res.status(200).json(record);
};`,
  },
  {
    id: "03",
    slug: "resume-evaluator",
    title: "AI Resume Evaluator",
    tagline: "Smart LangGraph Agent for Resume Scoring & Interview Prep",
    repo: "srinvasreddyy/resume_evaluator",
    year: "2026",
    role: "AI Engineer",
    stack: [
      "LangGraph",
      "Gemini 2.5 Flash",
      "Pydantic v2",
      "LangChain",
      "PyPDF",
      "Streamlit",
      "Python",
    ],
    metrics: [
      { label: "AI WORKFLOW", value: "LangGraph StateGraph" },
      { label: "DECISION GATE", value: "70% ATS Cutoff" },
      { label: "STRUCTURED DATA", value: "Pydantic v2 JSON" },
      { label: "CONSISTENCY", value: "0.2 Temperature" },
    ],
    quickStory:
      "An AI agent that reads your PDF resume, scores it against a job description, and automatically picks the most helpful next step.",
    summary:
      "Instead of a basic one-prompt chatbot, I built a stateful multi-step AI agent using LangGraph. It extracts text from a PDF resume, calculates an ATS match score against your target job, and routes you down one of two paths: a step-by-step resume fix plan (if under 70%) or custom technical interview questions (if 70% or above).",
    steps: [
      {
        title: "1. PDF Resume Parsing",
        sub: "PyPDF Text Extraction",
        detail:
          "Reads multi-page PDF resumes cleanly and initializes the shared LangGraph state memory.",
      },
      {
        title: "2. ATS Score & Skill Gap Analysis",
        sub: "Node 1: analyze_resume",
        detail:
          "Compares the resume with the job description to list matching skills, missing skills, and a 0–100 score.",
      },
      {
        title: "3. Smart 70% Score Router",
        sub: "route_based_on_score Conditional Edge",
        detail:
          "Automatically checks if the candidate's score is below 70% or 70%+ to choose the right coaching node.",
      },
      {
        title: "4. Tailored Action Plan or Mock Interview",
        sub: "Node 2A / Node 2B",
        detail:
          "Delivers concrete resume rewrite steps for lower scores, or custom interview questions with answer hints for strong matches.",
      },
    ],
    codeTitle: "LangGraph Conditional Routing Based on ATS Score",
    codeSnippet: `def route_based_on_score(state: EvaluatorState):
    # Deterministic routing gate at 70% ATS score
    if state["ats_score"] < 70:
        return "generate_action_plan"
    return "generate_interview_prep"

workflow = StateGraph(EvaluatorState)
workflow.add_node("analyze_resume", analyze_resume_node)
workflow.add_node("generate_action_plan", action_plan_node)
workflow.add_node("generate_interview_prep", interview_prep_node)
workflow.add_conditional_edges("analyze_resume", route_based_on_score)`,
  },
  {
    id: "04",
    slug: "enron-email-ai",
    title: "Enron Smart Email Classifier",
    tagline: "Machine Learning Email Sorter & Automated Inbox Assistant",
    repo: "srinvasreddyy/enron-email-classification-agent",
    year: "2025",
    role: "Machine Learning Developer",
    stack: [
      "Python",
      "Scikit-Learn",
      "NLP",
      "Class Weighting",
      "Oversampling",
      "Pandas / NumPy",
    ],
    metrics: [
      { label: "CORPUS SIZE", value: "1.43 GB Dataset" },
      { label: "LABELED EMAILS", value: "2,105 Samples" },
      { label: "PEAK ACCURACY", value: "88.9% Accuracy" },
      { label: "RARE-CLASS BOOST", value: "10.5% -> 68.4%" },
    ],
    quickStory:
      "Trained on 2,105 real emails from the 1.43 GB Enron dataset to sort messages into 5 folders without missing rare personal emails.",
    summary:
      "Real-world email datasets are heavily unbalanced—Work emails outnumbered Personal emails 7-to-1. I trained and compared three machine learning pipelines (Baseline, Class Weighting, and Oversampling) to raise Personal email detection from 10.5% to 68.4% and reach 88.9% overall accuracy.",
    steps: [
      {
        title: "1. Cleaning 1.43 GB of Raw Emails",
        sub: "2,105 Mapped Messages",
        detail:
          "Organized raw email text into 5 practical folders: Work (998), Finance (340), Shopping (326), Promotions (300), and Personal (141).",
      },
      {
        title: "2. Solving Data Imbalance",
        sub: "Class Weighting & Oversampling",
        detail:
          "Fixed the model's blind spot for rare Personal emails, jumping recall from 10.5% to 68.4%.",
      },
      {
        title: "3. Smart Inbox Organization",
        sub: "Automated Category Triage",
        detail:
          "Enables fast category filtering, priority inbox sorting, and natural-language email cleanup.",
      },
    ],
    codeTitle: "Benchmarking Imbalanced Email Classification Approaches",
    codeSnippet: `# Results on 2,105 Enron Emails (Work: 998 | Personal: 141)
experiment_results = {
    "Baseline":        {"accuracy": "87.3%", "macro_f1": 0.756, "personal_recall": "10.5%"},
    "Class_Weighting": {"accuracy": "84.8%", "macro_f1": 0.816, "personal_recall": "68.4%"},
    "Oversampling":    {"accuracy": "88.9%", "macro_f1": 0.825, "personal_recall": "36.8%"},
}`,
  },
];

// ============================================================================
// CLEAR, VISUAL JOURNEY TIMELINE MILESTONES (2X HACKATHON WINNER REMOVED)
// ============================================================================
const JOURNEY_MILESTONES = [
  {
    id: "step-1",
    year: "2021 — 2023",
    phase: "CHAPTER 01 • THE ANALYTICAL FOUNDATION",
    title: "Intermediate (MPC) — 95.0% Distinction",
    place: "Sri Chaitanya Junior College, Narasaraopet",
    icon: GraduationCap,
    highlight: "95.0% Score",
    summary:
      "Built a rock-solid foundation in Mathematics, Physics, and Chemistry. Graduating with 95% sparked my love for logical problem-solving and algorithmic thinking.",
    tags: ["Mathematics", "Physics", "Analytical Problem Solving", "95% Distinction"],
  },
  {
    id: "step-2",
    year: "AUG 2023 — PRESENT",
    phase: "CHAPTER 02 • ENTERING COMPUTER SCIENCE & AI",
    title: "B.Tech in CSE (Artificial Intelligence & ML)",
    place: "R.V.R. & J.C. College of Engineering, Guntur (Class of 2027)",
    icon: Cpu,
    highlight: "CSE • AI & ML",
    summary:
      "Dived deep into Data Structures & Algorithms, Object-Oriented Design, Operating Systems, DBMS, Computer Networks, and Machine Learning while building full-stack web apps.",
    tags: ["DSA", "OOP", "DBMS", "Operating Systems", "AI & Machine Learning"],
  },
  {
    id: "step-3",
    year: "2024 — 2025",
    phase: "CHAPTER 03 • AI & AUTOMATION COMPETITIONS",
    title: "1st Prize Winner in AI Ad Creation & Automations Building",
    place: "Technical Symposiums & National Engineering Competitions",
    icon: Trophy,
    highlight: "2× 1st Prize Wins",
    summary:
      "Won 1st Prize in the Advertisement Creation Using AI Tools competition and 1st Prize in the Automations Building Competition, while participating in national engineering challenges including Flipkart GRiD 8.0 and Statathon 2025.",
    tags: [
      "1st Prize: AI Advertisement Creation",
      "1st Prize: Automations Building",
      "Flipkart GRiD 8.0",
      "Statathon 2025",
    ],
  },
  {
    id: "step-4",
    year: "AUG 2025 — MAR 2026",
    phase: "CHAPTER 04 • REAL-WORLD PRODUCTION ENGINEERING",
    title: "Backend Developer Intern (Node.js & MERN)",
    place: "KriBud Web Tech",
    icon: Briefcase,
    highlight: "35% Faster APIs",
    summary:
      "Designed and shipped production Node.js, Express, and MongoDB backend services for multi-vendor ordering (OrderNow), Stripe Connect vendor onboarding, and webhook payment flows. Refactored MongoDB compound indexes and aggregation pipelines to cut API latency by 35%.",
    tags: [
      "Node.js & Express",
      "MongoDB Optimization (-35% Latency)",
      "Stripe Connect",
      "REST APIs & Postman",
    ],
  },
  {
    id: "step-5",
    year: "2026 — 2027",
    phase: "CHAPTER 05 • POLYGLOT ML & AI AGENTS",
    title: "Building Production AI Systems & Graduating Class of 2027",
    place: "Guntur, Andhra Pradesh • Open to High-Impact Roles",
    icon: Sparkles,
    highlight: "Full-Stack + AI",
    summary:
      "Combining scalable Node.js & Python backends with Scikit-Learn ML microservices (InsureAI) and stateful LangGraph AI agents (Resume Evaluator) to build software that feels fast, smart, and reliable.",
    tags: ["LangGraph Agents", "Python Flask ML", "React 19", "System Design"],
  },
];

// ============================================================================
// SPOTLIGHT COMPETITIONS (5.1 & 5.2) + VERIFIED CERTIFICATIONS
// ============================================================================
const COMPETITION_WINS = [
  {
    id: "comp-1",
    rank: "1ST PRIZE WINNER",
    title: "Advertisement Creation Using AI Tools",
    category: "Generative AI & Creative Prompt Engineering",
    icon: Wand2,
    description:
      "Won 1st Prize for conceptualizing, scripting, and producing a high-impact commercial advertisement end-to-end using generative AI tools, visual synthesis, and creative prompt engineering workflows.",
    skills: ["Generative AI Tools", "Prompt Engineering", "AI Ad Production", "Creative Direction"],
  },
  {
    id: "comp-2",
    rank: "1ST PRIZE WINNER",
    title: "Automations Building Competition",
    category: "Intelligent Workflows & Systems Automation",
    icon: Workflow,
    description:
      "Won 1st Prize for designing and building an end-to-end automated workflow pipeline that eliminated manual steps through smart event triggers, API integrations, and autonomous task execution.",
    skills: ["Workflow Automation", "API Integrations", "Smart Triggers", "System Efficiency"],
  },
];

const CERTIFICATIONS = [
  {
    id: "cert-1",
    name: "Cloud Engineering",
    issuer: "AWS Academy",
    domain: "Cloud & Backend",
    badge: "AWS Verified",
    highlights: ["EC2 & S3 Architecture", "IAM Security", "Cloud Deployment"],
  },
  {
    id: "cert-2",
    name: "Node.js Complete Course",
    issuer: "GeeksforGeeks",
    domain: "Cloud & Backend",
    badge: "Backend Core",
    highlights: ["Express REST APIs", "Async Event Loop", "JWT & Middleware"],
  },
  {
    id: "cert-3",
    name: "Certified React.JS Developer",
    issuer: "GeeksforGeeks",
    domain: "Frontend & Full-Stack",
    badge: "Frontend Pro",
    highlights: ["React Hooks & State", "Component Architecture", "Performance"],
  },
  {
    id: "cert-4",
    name: "Full-Stack Web Development",
    issuer: "Udemy",
    domain: "Frontend & Full-Stack",
    badge: "MERN Stack",
    highlights: ["MongoDB & Express", "React & Node.js", "End-to-End Apps"],
  },
  {
    id: "cert-5",
    name: "Java Full Stack Training",
    issuer: "Wipro TalentNext",
    domain: "Cloud & Backend",
    badge: "Enterprise Java",
    highlights: ["OOP & Core Java", "Relational Databases", "Enterprise Patterns"],
  },
];

// ============================================================================
// INTERACTIVE LAB 01: ORDERNOW + STRIPE CONNECT MARKETPLACE & BOOKING LAB
// ============================================================================
function OrderNowStripeSimulator({ onCelebrate }) {
  const [orderAmount, setOrderAmount] = useState(1200);
  const [platformPct, setPlatformPct] = useState(10);
  const [vendorStatus, setVendorStatus] = useState("ONBOARDED");
  const [webhookStatus, setWebhookStatus] = useState("IDLE");
  const [bookingStatus, setBookingStatus] = useState("AVAILABLE");

  const splitMath = useMemo(() => {
    const stripeFee = Math.round(orderAmount * 0.02 + 3);
    const platformFee = Math.round((orderAmount * platformPct) / 100);
    const vendorPayout = Math.max(0, orderAmount - stripeFee - platformFee);
    return { stripeFee, platformFee, vendorPayout };
  }, [orderAmount, platformPct]);

  const simulateStripeCheckout = () => {
    setWebhookStatus("VERIFYING");
    setTimeout(() => {
      setWebhookStatus("VERIFIED");
      onCelebrate?.("Stripe Webhook verified! Vendor payout transferred.");
    }, 450);
  };

  const simulateConcurrentBooking = () => {
    setBookingStatus("LOCKED_SAFE");
    onCelebrate?.("Race condition blocked! Zero duplicate orders.");
  };

  return (
    <div className="rounded-3xl surface-card p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E1916]/10 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#C96541] font-extrabold">
              // INTERACTIVE LAB 01 • ORDERNOW MARKETPLACE
            </span>
            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#1E1916]/10 text-[#6E655F] font-bold">
              SIMULATION ONLY • NOT ACTUAL BEHAVIOUR
            </span>
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-extrabold text-[#1E1916] mt-1">
            Stripe Connect Split-Payout &amp; Concurrency Simulator
          </h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs px-3.5 py-1.5 rounded-full bg-[#F4F0EA] border border-[#1E1916]/15 text-[#1E1916] font-bold">
          <CreditCard className="w-3.5 h-3.5 text-[#C96541]" /> Stripe Connect Express
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-2xl border border-[#1E1916]/12 bg-[#F4F0EA] p-5 space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#1E1916] font-bold flex items-center gap-2">
              <Store className="w-4 h-4 text-[#C96541]" />
              1. Vendor Onboarding &amp; Order Split
            </span>
            <button
              onClick={() =>
                setVendorStatus((s) =>
                  s === "ONBOARDED" ? "PENDING_KYC" : "ONBOARDED"
                )
              }
              className="font-mono text-[11px] px-2.5 py-1 rounded-full border border-[#C96541]/40 bg-[#C96541]/10 text-[#C96541] font-bold"
            >
              {vendorStatus === "ONBOARDED"
                ? "acct_1OrderNowVendor: ACTIVE"
                : "KYC PENDING (Click to Activate)"}
            </button>
          </div>

          <div>
            <div className="flex justify-between font-mono text-xs mb-2">
              <span className="text-[#6E655F] font-semibold">
                CUSTOMER CART CHECKOUT AMOUNT
              </span>
              <span className="text-[#1E1916] font-extrabold text-sm">
                ₹{orderAmount}
              </span>
            </div>
            <input
              type="range"
              min="250"
              max="5000"
              step="50"
              value={orderAmount}
              onChange={(e) => setOrderAmount(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between font-mono text-xs mb-2">
              <span className="text-[#6E655F] font-semibold">
                MARKETPLACE PLATFORM COMMISSION
              </span>
              <span className="text-[#C96541] font-extrabold">{platformPct}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={platformPct}
              onChange={(e) => setPlatformPct(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-1 font-mono">
            <div className="p-3 rounded-xl bg-[#EAE3D8] border border-[#1E1916]/10">
              <span className="text-[10px] text-[#6E655F] block">STRIPE FEE</span>
              <span className="text-sm font-extrabold text-[#1E1916]">
                ₹{splitMath.stripeFee}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#EAE3D8] border border-[#1E1916]/10">
              <span className="text-[10px] text-[#6E655F] block">PLATFORM CUT</span>
              <span className="text-sm font-extrabold text-[#C96541]">
                ₹{splitMath.platformFee}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#C96541]/15 border border-[#C96541]/40">
              <span className="text-[10px] text-[#C96541] font-bold block">
                VENDOR PAYOUT
              </span>
              <span className="text-sm font-extrabold text-[#1E1916]">
                ₹{splitMath.vendorPayout}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl border border-[#1E1916]/12 bg-[#F4F0EA] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="font-mono text-xs text-[#1E1916] font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C96541]" />
              2. Webhook Verification &amp; Concurrent Order Guard
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={simulateStripeCheckout}
                className="py-3 px-4 rounded-xl bg-[#C96541] text-[#F4F0EA] font-mono text-xs font-extrabold uppercase tracking-wider hover:bg-[#1E1916] transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" /> Fire Stripe Webhook
              </button>
              <button
                onClick={simulateConcurrentBooking}
                className="py-3 px-4 rounded-xl border border-[#1E1916]/20 bg-[#EAE3D8] text-[#1E1916] font-mono text-xs font-bold uppercase tracking-wider hover:border-[#C96541] hover:text-[#C96541] transition-colors"
              >
                Test 2× Simultaneous Orders
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-[#1E1916] text-[#F4F0EA] p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#F4F0EA]/60 border-b border-[#F4F0EA]/15 pb-1.5">
              <span>STRIPE CONNECT + MONGODB LOGS</span>
              <span className="text-[#C96541] font-bold">SIMULATED</span>
            </div>
            <div className="leading-relaxed">
              &gt; Connected Vendor:{" "}
              <span className="text-[#C96541] font-bold">{vendorStatus}</span> •
              Auto-Transfer:{" "}
              <span className="font-bold">₹{splitMath.vendorPayout}</span>
            </div>
            <div className="leading-relaxed">
              &gt; Stripe Webhook:{" "}
              {webhookStatus === "VERIFIED" ? (
                <span className="text-[#C96541] font-bold">
                  checkout.session.completed verified! Order marked PAID.
                </span>
              ) : webhookStatus === "VERIFYING" ? (
                <span className="text-[#F4F0EA]/70">
                  Checking stripe-signature header...
                </span>
              ) : (
                <span className="text-[#F4F0EA]/60">
                  Ready — click &quot;Fire Stripe Webhook&quot; above.
                </span>
              )}
            </div>
            {bookingStatus === "LOCKED_SAFE" && (
              <div className="text-[#C96541] font-bold leading-relaxed">
                &gt; Concurrency Guard: 2nd duplicate request blocked atomically (HTTP 409).
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INTERACTIVE LAB 02: INSUREAI + LANGGRAPH QUICK LABS
// ============================================================================
function AIPlaygroundsRow({ onCelebrate }) {
  const [age, setAge] = useState(30);
  const [bmi, setBmi] = useState(24.5);
  const [smoker, setSmoker] = useState(0);
  const [atsScore, setAtsScore] = useState(76);

  const estimatedPremium = useMemo(() => {
    const zAge = (age - 39.207) / 14.045;
    const zBmi = (bmi - 30.663) / 6.096;
    const zSmoker = (smoker - 0.205) / 0.404;
    const total =
      13270.42 + zAge * 3607.47 + zBmi * 2067.69 + zSmoker * 9620.99;
    return Math.max(1200, total);
  }, [age, bmi, smoker]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-3xl surface-card p-6 md:p-7 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1E1916]/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#C96541] font-bold uppercase">
                // LAB 02 • INSUREAI
              </span>
              <span className="font-mono text-[9.5px] px-2 py-0.5 rounded-full bg-[#1E1916]/10 text-[#6E655F] font-bold">
                SIMULATION ONLY
              </span>
            </div>
            <h4 className="font-display text-xl font-extrabold text-[#1E1916] mt-0.5">
              Health Insurance Cost Estimator
            </h4>
          </div>
          <div className="font-mono text-xl font-extrabold text-[#C96541]">
            ${estimatedPremium.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            <span className="text-[10px] text-[#6E655F] block text-right">/ yr</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between font-mono text-xs mb-1">
              <span className="text-[#6E655F] font-semibold">AGE</span>
              <span className="text-[#1E1916] font-bold">{age} yrs</span>
            </div>
            <input
              type="range"
              min="18"
              max="64"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between font-mono text-xs mb-1">
              <span className="text-[#6E655F] font-semibold">BMI</span>
              <span className="text-[#1E1916] font-bold">{bmi.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="16"
              max="45"
              step="0.5"
              value={bmi}
              onChange={(e) => setBmi(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-mono text-xs text-[#6E655F] font-semibold">
              SMOKER STATUS:
            </span>
            <div className="flex gap-2 font-mono text-xs">
              <button
                onClick={() => {
                  setSmoker(0);
                  onCelebrate?.("Non-smoker selected: saves ~$23,000/yr!");
                }}
                className={`px-3.5 py-1.5 rounded-xl border ${
                  smoker === 0
                    ? "bg-[#C96541] text-[#F4F0EA] border-[#C96541] font-extrabold"
                    : "bg-[#F4F0EA] border-[#1E1916]/15 text-[#6E655F]"
                }`}
              >
                Non-Smoker
              </button>
              <button
                onClick={() => {
                  setSmoker(1);
                  onCelebrate?.("Smoker weight (+$9,620/σ) applied by ML model.");
                }}
                className={`px-3.5 py-1.5 rounded-xl border ${
                  smoker === 1
                    ? "bg-[#C96541] text-[#F4F0EA] border-[#C96541] font-extrabold"
                    : "bg-[#F4F0EA] border-[#1E1916]/15 text-[#6E655F]"
                }`}
              >
                Smoker
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl surface-card p-6 md:p-7 space-y-5 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[#1E1916]/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#C96541] font-bold uppercase">
                // LAB 03 • LANGGRAPH AGENT
              </span>
              <span className="font-mono text-[9.5px] px-2 py-0.5 rounded-full bg-[#1E1916]/10 text-[#6E655F] font-bold">
                SIMULATION ONLY
              </span>
            </div>
            <h4 className="font-display text-xl font-extrabold text-[#1E1916] mt-0.5">
              70% ATS Score Conditional Router
            </h4>
          </div>
          <span className="font-mono text-lg font-extrabold px-3 py-1 rounded-xl border border-[#C96541]/40 bg-[#C96541]/15 text-[#C96541]">
            {atsScore}% ATS
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-[#6E655F] font-semibold">
              DRAG SIMULATED RESUME SCORE:
            </span>
            <span className="text-[#1E1916] font-bold">Cutoff = 70%</span>
          </div>
          <input
            type="range"
            min="25"
            max="98"
            value={atsScore}
            onChange={(e) => setAtsScore(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="rounded-2xl p-4 border border-[#1E1916]/12 bg-[#F4F0EA] font-mono text-xs space-y-1.5">
          <div className="font-extrabold text-[#C96541] uppercase">
            {atsScore >= 70
              ? "ACTIVE NODE: generate_interview_prep (Score >= 70%)"
              : "ACTIVE NODE: generate_action_plan (Score < 70%)"}
          </div>
          <p className="text-[#6E655F] leading-relaxed font-medium">
            {atsScore >= 70
              ? "Candidate passes threshold! LangGraph generates tailored system design & backend interview questions with hints."
              : "Score is below 70%. LangGraph generates a 4-step resume rewrite plan to highlight missing skills."}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PORTFOLIO APPLICATION
// ============================================================================
export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [mascotMood, setMascotMood] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [certFilter, setCertFilter] = useState("All");
  const [activeCertId, setActiveCertId] = useState("cert-1");

  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  const heroPortraitScale = useTransform(scrollY, [0, 380], [1, 0.58]);
  const heroPortraitX = useTransform(scrollY, [0, 380], [0, 120]);
  const heroPortraitY = useTransform(scrollY, [0, 380], [0, -140]);
  const heroPortraitOpacity = useTransform(scrollY, [0, 340], [1, 0]);

  useEffect(() => {
    const unsub = scrollY.on("change", (y) => {
      setScrolledPastHero(y > 290);
    });
    return () => unsub();
  }, [scrollY]);

  const spotlightRef = useRef(null);
  useEffect(() => {
    let rafId = null;
    const onMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        if (spotlightRef.current) {
          spotlightRef.current.style.background = `
            radial-gradient(420px circle at ${e.clientX}px ${e.clientY}px, rgba(201, 101, 65, 0.16), rgba(234, 227, 216, 0.35) 48%, transparent 80%)
          `;
        }
        rafId = null;
      });
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const sections = ["hero", "works", "labs", "journey", "certs", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.25 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const triggerMascotCelebration = (msg) => {
    setMascotMood(msg);
    setTimeout(() => setMascotMood(""), 4000);
  };

  const scrollToSection = (id) => {
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText("sanikommusrinivasareddy2@gmail.com");
    setCopiedEmail(true);
    triggerMascotCelebration("Email copied! Srinivasa would love to hear from you.");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const filteredCerts = useMemo(() => {
    if (certFilter === "All") return CERTIFICATIONS;
    return CERTIFICATIONS.filter((c) => c.domain === certFilter);
  }, [certFilter]);

  const NAV_ITEMS = [
    { id: "hero", label: "Intro" },
    { id: "works", label: "My Works" },
    { id: "labs", label: "Live Labs" },
    { id: "journey", label: "Journey" },
    { id: "certs", label: "Certifications" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F0EA] text-[#1E1916] bg-grid-pattern relative">
      <div
        ref={spotlightRef}
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-200"
      />

      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-[#C96541] origin-left z-[9600]"
      />

      {/* =================================================================== */}
      {/* FIXED, FULL-WIDTH ARCHITECTURAL NAVBAR                              */}
      {/* =================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-[9000] bg-[#F4F0EA]/90 backdrop-blur-xl border-b border-[#1E1916]/10">
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2.5 text-left group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#C96541] group-hover:scale-125 transition-transform" />
            <span className="font-display font-extrabold text-sm sm:text-base text-[#1E1916] tracking-tight">
              SRINIVASA<span className="text-[#C96541]">.DEV</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#EAE3D8] border border-[#1E1916]/10 font-mono text-xs font-bold">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  activeSection === item.id
                    ? "bg-[#C96541] text-[#F4F0EA] font-extrabold shadow-sm"
                    : "text-[#6E655F] hover:text-[#1E1916]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => scrollToSection("contact")}
              className="font-mono text-xs font-extrabold px-4 py-2 rounded-full bg-[#C96541] text-[#F4F0EA] hover:bg-[#1E1916] transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>Hire / Contact</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setMobileNavOpen((o) => !o)}
              className="md:hidden p-2 rounded-xl bg-[#EAE3D8] border border-[#1E1916]/15 text-[#1E1916]"
              aria-label="Toggle Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#1E1916]/10 bg-[#EAE3D8] px-5 py-3 flex flex-wrap gap-2"
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-mono text-xs px-3.5 py-1.5 rounded-full ${
                    activeSection === item.id
                      ? "bg-[#C96541] text-[#F4F0EA] font-extrabold"
                      : "bg-[#F4F0EA] text-[#1E1916]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Larger Top-Right Shrinking Portrait Dock */}
      <ShrunkCornerPortraitDock
        activeSection={activeSection}
        scrolledPastHero={scrolledPastHero}
        onJumpTop={() => scrollToSection("hero")}
      />

      {/* NOVA — Interactive Companion Mascot */}
      <NovaMascot
        activeSection={activeSection}
        mascotMood={mascotMood}
        onQuickJump={scrollToSection}
      />

      {/* =================================================================== */}
      {/* CHAPTER 01: PERSONAL PORTFOLIO HERO                                 */}
      {/* =================================================================== */}
      <section
        id="hero"
        className="relative z-10 pt-24 pb-24 md:pt-32 md:pb-32 border-b border-[#1E1916]/10 overflow-hidden"
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            {/* Left 5 Columns: Editorial Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 space-y-6 z-20"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#EAE3D8] border border-[#1E1916]/15 font-mono text-xs text-[#C96541] font-extrabold">
                <span className="w-2 h-2 rounded-full bg-[#C96541] animate-ping" />
                PERSONAL DEVELOPER PORTFOLIO • CLASS OF 2027
              </div>

              <div className="space-y-2">
                <p className="font-mono text-sm md:text-base text-[#6E655F] font-bold uppercase tracking-widest">
                  HI THERE, I&apos;M
                </p>
                <h1 className="display-hero font-extrabold uppercase text-[#1E1916]">
                  SRINIVASA REDDY{" "}
                  <span className="text-[#C96541]">SANIKOMMU</span>
                </h1>
              </div>

              <p className="text-base md:text-lg text-[#6E655F] font-body font-medium leading-relaxed">
                I&apos;m a{" "}
                <strong className="text-[#1E1916] font-extrabold">
                  Backend Developer &amp; AI/ML Engineer
                </strong>{" "}
                studying B.Tech CSE (AI &amp; ML) at{" "}
                <strong className="text-[#1E1916] font-extrabold">
                  R.V.R. &amp; J.C. College of Engineering
                </strong>
                . I engineer high-speed, production-grade systems—from{" "}
                <span className="text-[#C96541] font-bold underline decoration-[#C96541]/40 underline-offset-4">
                  Stripe Connect marketplaces
                </span>{" "}
                and{" "}
                <span className="text-[#1E1916] font-bold underline decoration-[#1E1916]/30 underline-offset-4">
                  35% faster MongoDB APIs
                </span>{" "}
                to{" "}
                <span className="text-[#1E1916] font-bold">
                  stateful LangGraph AI agents
                </span>
                .
              </p>

              {/* Quick Impact Counters */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl surface-card">
                  <div className="font-display text-2xl md:text-3xl font-extrabold text-[#C96541]">
                    35%
                  </div>
                  <div className="font-mono text-[11px] text-[#6E655F] font-bold mt-1">
                    Faster APIs at KriBud Internship
                  </div>
                </div>
                <div className="p-4 rounded-2xl surface-card">
                  <div className="font-display text-2xl md:text-3xl font-extrabold text-[#1E1916]">
                    2× 1st
                  </div>
                  <div className="font-mono text-[11px] text-[#6E655F] font-bold mt-1">
                    Prize AI &amp; Automation Wins
                  </div>
                </div>
                <div className="p-4 rounded-2xl surface-card">
                  <div className="font-display text-2xl md:text-3xl font-extrabold text-[#C96541]">
                    4+ Apps
                  </div>
                  <div className="font-mono text-[11px] text-[#6E655F] font-bold mt-1">
                    Production Full-Stack &amp; AI Builds
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => scrollToSection("works")}
                  className="px-6 py-3.5 rounded-2xl bg-[#C96541] text-[#F4F0EA] font-mono text-xs font-extrabold uppercase tracking-wider hover:bg-[#1E1916] transition-colors flex items-center gap-2 shadow-lg shadow-[#C96541]/25"
                >
                  Explore My Works <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToSection("journey")}
                  className="px-5 py-3.5 rounded-2xl bg-[#EAE3D8] border border-[#1E1916]/15 text-[#1E1916] font-mono text-xs font-bold uppercase tracking-wider hover:border-[#C96541] hover:text-[#C96541] transition-colors flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-[#C96541]" /> Follow My Journey
                </button>
                <a
                  href="https://github.com/srinvasreddyy"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-[#EAE3D8] border border-[#1E1916]/15 text-[#1E1916] hover:border-[#C96541] hover:text-[#C96541] transition-colors"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/srinivasreddysanikommu2/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-[#EAE3D8] border border-[#1E1916]/15 text-[#1E1916] hover:border-[#C96541] hover:text-[#C96541] transition-colors"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Right 7 Columns: Expanded Right-Aligned Orbital & Elastic Bounce Physics Arena */}
            <motion.div
              style={{
                scale: heroPortraitScale,
                x: heroPortraitX,
                y: heroPortraitY,
                opacity: heroPortraitOpacity,
              }}
              className="lg:col-span-7 flex justify-end lg:pr-2 gpu"
            >
              <HeroCircularPortraitPhysicsArena
                photoSrc={PROFILE_PHOTOS.camera}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* CHAPTER 02: MY WORKS (4 CURATED FLAGSHIP PROJECTS)                  */}
      {/* =================================================================== */}
      <section
        id="works"
        className="relative z-10 py-24 md:py-32 border-b border-[#1E1916]/10"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-wrap items-end justify-between gap-6"
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C96541] font-extrabold block mb-2">
                // CHAPTER 02 • SELECTED PROJECTS &amp; ARCHITECTURE
              </span>
              <h2 className="display-section font-extrabold uppercase text-[#1E1916]">
                My Works
              </h2>
            </div>
            <p className="text-sm text-[#6E655F] max-w-md font-medium">
              Every project below solves a real engineering problem. Click any card to inspect its architecture workflow and code implementation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {PROJECTS.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                onClick={() => setSelectedProject(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedProject(project);
                }}
                className="group relative rounded-3xl surface-card p-7 md:p-8 hover:border-[#C96541] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="px-3 py-1 rounded-full bg-[#C96541]/15 border border-[#C96541]/30 text-[#C96541] font-extrabold">
                      PROJECT {project.id} • {project.year}
                    </span>
                    <span className="text-[#6E655F] group-hover:text-[#C96541] font-bold transition-colors flex items-center gap-1">
                      Open Case Study <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-extrabold text-[#1E1916] group-hover:text-[#C96541] transition-colors">
                      {project.title}
                    </h3>
                    <p className="font-mono text-xs font-bold text-[#6E655F] mt-1">
                      {project.tagline}
                    </p>
                  </div>

                  <p className="text-sm text-[#6E655F] leading-relaxed font-medium">
                    {project.quickStory}
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {project.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#F4F0EA] border border-[#1E1916]/10"
                      >
                        <span className="font-mono text-[9px] text-[#6E655F] block">
                          {m.label}
                        </span>
                        <span className="font-mono text-xs font-extrabold text-[#1E1916] mt-0.5 block">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-6 mt-6 border-t border-[#1E1916]/10">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[10px] px-2.5 py-1 rounded-lg bg-[#F4F0EA] text-[#1E1916] border border-[#1E1916]/12 font-bold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* CHAPTER 03: LIVE INTERACTIVE PLAYGROUNDS (WITH SIMULATION TAG)      */}
      {/* =================================================================== */}
      <section
        id="labs"
        className="relative z-10 py-24 md:py-32 border-b border-[#1E1916]/10"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-wrap items-end justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C96541] font-extrabold">
                  // CHAPTER 03 • HANDS-ON INTERACTIVE PLAYGROUNDS
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] px-3 py-1 rounded-full bg-[#EAE3D8] border border-[#C96541]/40 text-[#1E1916] font-extrabold">
                  <Info className="w-3.5 h-3.5 text-[#C96541]" />
                  SIMULATION ONLY • DOES NOT RESEMBLE ACTUAL BEHAVIOUR
                </span>
              </div>
              <h2 className="display-section font-extrabold uppercase text-[#1E1916]">
                Test My Systems Live
              </h2>
            </div>
            <p className="text-sm text-[#6E655F] max-w-md font-medium">
              Interactive frontend simulations of OrderNow&apos;s Stripe Connect split-math, InsureAI&apos;s regression weights, and the LangGraph score router.
            </p>
          </motion.div>

          <OrderNowStripeSimulator onCelebrate={triggerMascotCelebration} />
          <AIPlaygroundsRow onCelebrate={triggerMascotCelebration} />
        </div>
      </section>

      {/* =================================================================== */}
      {/* CHAPTER 04: THE ROAD SO FAR — CLEAR VISUAL JOURNEY TIMELINE         */}
      {/* =================================================================== */}
      <section
        id="journey"
        className="relative z-10 py-24 md:py-32 border-b border-[#1E1916]/10"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-10 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C96541] font-extrabold block">
              // CHAPTER 04 • STEP-BY-STEP ROADMAP (2021 — 2027)
            </span>
            <h2 className="display-section font-extrabold uppercase text-[#1E1916]">
              My Journey &amp; Timeline
            </h2>
            <p className="text-sm text-[#6E655F] font-medium">
              Every milestone that shaped me as a software engineer—from my 95% MPC foundation to building production Node.js &amp; AI systems.
            </p>
          </motion.div>

          <div className="relative pl-6 md:pl-12 border-l-2 border-[#C96541]/50 space-y-12">
            {JOURNEY_MILESTONES.map((m, idx) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className="relative group"
                >
                  <div className="absolute -left-[41px] md:-left-[65px] top-1 w-9 h-9 rounded-xl bg-[#EAE3D8] border-2 border-[#C96541] flex items-center justify-center shadow-sm">
                    <Icon className="w-4 h-4 text-[#C96541]" />
                  </div>

                  <div className="rounded-3xl surface-card p-6 md:p-8 hover:border-[#C96541] transition-colors space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="px-3 py-1 rounded-full bg-[#1E1916] text-[#F4F0EA] font-extrabold">
                          {m.year}
                        </span>
                        <span className="text-[#C96541] font-extrabold">
                          {m.phase}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full font-extrabold border border-[#C96541]/40 bg-[#C96541]/10 text-[#C96541]">
                        {m.highlight}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-2xl md:text-3xl font-extrabold text-[#1E1916]">
                        {m.title}
                      </h3>
                      <p className="font-mono text-xs md:text-sm text-[#6E655F] font-bold mt-1">
                        {m.place}
                      </p>
                    </div>

                    <p className="text-sm md:text-base text-[#6E655F] leading-relaxed font-medium">
                      {m.summary}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {m.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[11px] px-3 py-1 rounded-lg bg-[#F4F0EA] border border-[#1E1916]/12 text-[#1E1916] font-bold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* CHAPTER 05: CREATIVE, INTERACTIVE CERTIFICATIONS & ACHIEVEMENTS     */}
      {/* =================================================================== */}
      <section
        id="certs"
        className="relative z-10 py-24 md:py-32 border-b border-[#1E1916]/10"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-wrap items-end justify-between gap-6"
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C96541] font-extrabold block mb-2">
                // CHAPTER 05 • COMPETITIONS, HONORS &amp; VERIFIED CREDENTIALS
              </span>
              <h2 className="display-section font-extrabold uppercase text-[#1E1916]">
                Achievements &amp; Certifications
              </h2>
            </div>
            <p className="text-sm text-[#6E655F] max-w-md font-medium">
              Spotlight 1st Prize victories in AI &amp; Automation competitions alongside verified industry certifications.
            </p>
          </motion.div>

          {/* PART A: 2 SPOTLIGHT 1ST PRIZE COMPETITION VICTORIES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-[#1E1916] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#C96541]" />
                01 // 1ST PRIZE COMPETITION VICTORIES
              </span>
              <span className="font-mono text-xs text-[#C96541] font-bold">
                2× 1st Prize Gold Honors
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
              {COMPETITION_WINS.map((win, idx) => {
                const WinIcon = win.icon;
                return (
                  <motion.div
                    key={win.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    onMouseEnter={() =>
                      triggerMascotCelebration(`${win.rank}: ${win.title}!`)
                    }
                    className="group relative rounded-3xl surface-card p-7 md:p-8 border-2 border-[#1E1916]/12 hover:border-[#C96541] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute -right-3 -top-4 font-display text-8xl font-extrabold text-[#1E1916]/[0.04] pointer-events-none select-none">
                      #1
                    </div>

                    <div className="space-y-5 relative z-10">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C96541] text-[#F4F0EA] font-mono text-xs font-extrabold uppercase tracking-wider shadow-sm">
                          <Trophy className="w-3.5 h-3.5" />
                          {win.rank}
                        </span>
                        <div className="w-11 h-11 rounded-2xl bg-[#F4F0EA] border border-[#1E1916]/15 flex items-center justify-center group-hover:bg-[#C96541] group-hover:text-[#F4F0EA] transition-colors">
                          <WinIcon className="w-5 h-5 text-[#C96541] group-hover:text-[#F4F0EA]" />
                        </div>
                      </div>

                      <div>
                        <span className="font-mono text-xs font-bold text-[#C96541] block">
                          {win.category}
                        </span>
                        <h3 className="font-display text-2xl md:text-3xl font-extrabold text-[#1E1916] mt-1">
                          {win.title}
                        </h3>
                      </div>

                      <p className="text-sm text-[#6E655F] leading-relaxed font-medium">
                        {win.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-[#1E1916]/10 relative z-10">
                      {win.skills.map((sk) => (
                        <span
                          key={sk}
                          className="font-mono text-[10.5px] px-3 py-1 rounded-lg bg-[#F4F0EA] text-[#1E1916] border border-[#1E1916]/12 font-bold"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* PART B: INTERACTIVE FILTERABLE CERTIFICATIONS SHOWCASE */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E1916]/10 pb-4">
              <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-[#1E1916] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C96541]" />
                02 // VERIFIED TECHNICAL CERTIFICATIONS ({filteredCerts.length})
              </span>

              <div className="flex flex-wrap gap-1.5 p-1 rounded-full bg-[#EAE3D8] border border-[#1E1916]/12 font-mono text-xs">
                {["All", "Cloud & Backend", "Frontend & Full-Stack"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setCertFilter(tab)}
                      className={`px-3.5 py-1 rounded-full transition-all font-bold ${
                        certFilter === tab
                          ? "bg-[#C96541] text-[#F4F0EA] font-extrabold shadow-sm"
                          : "text-[#6E655F] hover:text-[#1E1916]"
                      }`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredCerts.map((cert) => {
                  const isActive = activeCertId === cert.id;
                  return (
                    <motion.div
                      key={cert.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => setActiveCertId(cert.id)}
                      onMouseEnter={() => setActiveCertId(cert.id)}
                      className={`rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between gap-4 border ${
                        isActive
                          ? "bg-[#1E1916] text-[#F4F0EA] border-[#1E1916] shadow-xl -translate-y-1"
                          : "surface-card text-[#1E1916] hover:border-[#C96541]"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                              isActive
                                ? "bg-[#C96541] text-[#F4F0EA] border-[#C96541]"
                                : "bg-[#C96541]/15 text-[#C96541] border-[#C96541]/30"
                            }`}
                          >
                            <Award className="w-4 h-4" />
                          </div>
                          <span
                            className={`font-mono text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              isActive
                                ? "bg-[#F4F0EA]/15 text-[#C96541]"
                                : "bg-[#F4F0EA] text-[#C96541]"
                            }`}
                          >
                            {cert.badge}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-display text-base font-extrabold leading-snug">
                            {cert.name}
                          </h3>
                          <p
                            className={`font-mono text-xs font-bold mt-1 ${
                              isActive ? "text-[#F4F0EA]/70" : "text-[#6E655F]"
                            }`}
                          >
                            {cert.issuer}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`pt-3 border-t space-y-1 font-mono text-[10px] ${
                          isActive
                            ? "border-[#F4F0EA]/15 text-[#F4F0EA]/85"
                            : "border-[#1E1916]/10 text-[#6E655F]"
                        }`}
                      >
                        {cert.highlights.map((h) => (
                          <div key={h} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-[#C96541] shrink-0" />
                            <span className="truncate">{h}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* CHAPTER 06: CONTACT & FOOTER                                        */}
      {/* =================================================================== */}
      <footer id="contact" className="relative z-10 py-24 bg-[#F4F0EA]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 space-y-12">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C96541] font-extrabold block">
              // CHAPTER 06 • LET&apos;S CONNECT
            </span>
            <h2 className="display-section font-extrabold uppercase text-[#1E1916]">
              Ready to Build Together?
            </h2>
            <p className="text-sm text-[#6E655F] max-w-xl font-medium">
              Whether it&apos;s a software engineering role, backend architecture challenge, or AI project—reach out anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-6 rounded-2xl surface-card space-y-3">
              <span className="text-[#6E655F] flex items-center gap-2 font-bold">
                <Mail className="w-4 h-4 text-[#C96541]" /> EMAIL ADDRESS
              </span>
              <div className="text-sm text-[#1E1916] font-extrabold break-all">
                sanikommusrinivasareddy2@gmail.com
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={copyEmail}
                  className="px-3.5 py-2 rounded-xl bg-[#C96541] text-[#F4F0EA] font-extrabold uppercase flex items-center gap-1.5 hover:bg-[#1E1916] transition-colors"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedEmail ? "Copied!" : "Copy Email"}
                </button>
                <a
                  href="mailto:sanikommusrinivasareddy2@gmail.com"
                  className="px-3.5 py-2 rounded-xl border border-[#1E1916]/20 bg-[#F4F0EA] text-[#1E1916] hover:border-[#C96541] font-bold"
                >
                  Send Mail &rarr;
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl surface-card space-y-3">
              <span className="text-[#6E655F] flex items-center gap-2 font-bold">
                <Phone className="w-4 h-4 text-[#C96541]" /> PHONE &amp; LOCATION
              </span>
              <div className="text-lg text-[#1E1916] font-extrabold">
                +91 6304089289
              </div>
              <div className="text-[#6E655F] font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C96541]" /> Guntur, Andhra Pradesh, India
              </div>
            </div>

            <div className="p-6 rounded-2xl surface-card space-y-3">
              <span className="text-[#6E655F] font-bold block">
                SOCIAL &amp; CODE PROFILES
              </span>
              <a
                href="https://github.com/srinvasreddyy"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-[#1E1916] hover:text-[#C96541] border-b border-[#1E1916]/10 pb-2.5 font-extrabold"
              >
                <span>github.com/srinvasreddyy</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/srinivasreddysanikommu2/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-[#1E1916] hover:text-[#C96541] pt-1 font-extrabold"
              >
                <span>linkedin.com/in/srinivasreddysanikommu2</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1E1916]/10 flex flex-wrap justify-between items-center font-mono text-xs text-[#6E655F] font-bold">
            <span>© 2026 SRINIVASA REDDY SANIKOMMU • PERSONAL PORTFOLIO</span>
            <span>ALABASTER &amp; TERRACOTTA EDITORIAL EDITION</span>
          </div>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* PROJECT DEEP-DIVE MODAL                                             */}
      {/* =================================================================== */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key="project-modal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[9500] bg-[#1E1916]/60 backdrop-blur-md overflow-y-auto p-4 md:p-10"
          >
            <div className="max-w-5xl mx-auto rounded-3xl bg-[#F4F0EA] border border-[#1E1916]/15 p-6 md:p-10 space-y-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1E1916]/10 pb-5">
                <div>
                  <span className="font-mono text-xs text-[#C96541] font-extrabold">
                    PROJECT {selectedProject.id} • {selectedProject.role}
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1E1916] mt-1">
                    {selectedProject.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl bg-[#C96541] text-[#F4F0EA] font-mono text-xs font-extrabold uppercase flex items-center gap-1.5 hover:bg-[#1E1916]"
                >
                  <X className="w-4 h-4" /> Close
                </button>
              </div>

              <p className="text-base text-[#6E655F] leading-relaxed font-medium">
                {selectedProject.summary}
              </p>

              <div className="space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-widest text-[#C96541] font-extrabold">
                  // HOW IT WORKS STEP-BY-STEP
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.steps.map((st, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl surface-card space-y-1.5"
                    >
                      <div className="font-display text-base font-extrabold text-[#1E1916]">
                        {st.title}
                      </div>
                      <div className="font-mono text-xs text-[#C96541] font-bold">
                        {st.sub}
                      </div>
                      <p className="text-xs text-[#6E655F] leading-relaxed pt-1 font-medium">
                        {st.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-widest text-[#C96541] font-extrabold">
                  // {selectedProject.codeTitle}
                </h4>
                <pre className="p-5 rounded-2xl bg-[#EAE3D8] border border-[#1E1916]/15 text-[#1E1916] font-mono text-xs overflow-x-auto leading-relaxed font-semibold">
                  {selectedProject.codeSnippet}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}