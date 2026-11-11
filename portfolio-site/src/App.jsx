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
  Footprints,
  Mountain,
  Minimize2,
} from "lucide-react";

// ============================================================================
// SLOW, CINEMATIC INSTAGRAM REELS-STYLE DYNAMIC MARKER & BRUSH UNDERLINE
// Used across both headings (H1/H2/H3) and key body phrases with slow drawing
// ============================================================================
function ReelHighlight({
  children,
  tone = "terracotta", // "terracotta" | "linen" | "sage" | "amber"
  variant = "marker",  // "marker" | "underline"
  delay = 0.15,
  isHeading = false,
  className = "",
}) {
  const palette = {
    terracotta: {
      gradient: "linear-gradient(104deg, #FF5722 0%, #D94E28 100%)",
      shadow: "0 6px 18px rgba(255, 87, 34, 0.34)",
      stroke: "#FF4D1C",
      underlineGlow: "rgba(255, 87, 34, 0.22)",
      markerText: "text-[#FFFDF9]",
      underlineText: "text-inherit",
    },
    linen: {
      gradient: "linear-gradient(104deg, #FFE135 0%, #FACC15 100%)",
      shadow: "0 6px 18px rgba(250, 204, 21, 0.42)",
      stroke: "#EAB308",
      underlineGlow: "rgba(250, 204, 21, 0.32)",
      markerText: "text-[#1E1916]",
      underlineText: "text-inherit",
    },
    sage: {
      gradient: "linear-gradient(104deg, #10B981 0%, #059669 100%)",
      shadow: "0 6px 18px rgba(16, 185, 129, 0.34)",
      stroke: "#059669",
      underlineGlow: "rgba(16, 185, 129, 0.24)",
      markerText: "text-[#FFFDF9]",
      underlineText: "text-inherit",
    },
    amber: {
      gradient: "linear-gradient(104deg, #4F46E5 0%, #3730A3 100%)",
      shadow: "0 6px 18px rgba(79, 70, 229, 0.34)",
      stroke: "#4F46E5",
      underlineGlow: "rgba(79, 70, 229, 0.22)",
      markerText: "text-[#FFFDF9]",
      underlineText: "text-inherit",
    },
  }[tone] || {
    gradient: "linear-gradient(104deg, #FF5722 0%, #D94E28 100%)",
    shadow: "0 6px 18px rgba(255, 87, 34, 0.34)",
    stroke: "#FF4D1C",
    underlineGlow: "rgba(255, 87, 34, 0.22)",
    markerText: "text-[#FFFDF9]",
    underlineText: "text-inherit",
  };

  if (variant === "underline") {
    return (
      <span
        className={`relative inline-block px-1 -mx-0.5 ${
          isHeading ? "" : "font-extrabold"
        } ${palette.underlineText} ${className}`}
      >
        {/* Slow luminous wash behind underlined keywords */}
        <motion.span
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 1.75,
            delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ backgroundColor: palette.underlineGlow }}
          className="absolute inset-x-0 bottom-0.5 h-[38%] -z-10 rounded-sm origin-left pointer-events-none"
        />
        <span className="relative z-10">{children}</span>
        {/* Slow dual-stroke hand-drawn Reels brush underline */}
        <svg
          viewBox="0 0 120 14"
          preserveAspectRatio="none"
          className={`absolute left-0 ${
            isHeading ? "-bottom-2 h-4" : "-bottom-1.5 h-3.5"
          } w-full pointer-events-none overflow-visible`}
        >
          <motion.path
            d="M 2 9 Q 48 2 118 8"
            fill="none"
            stroke={palette.stroke}
            strokeWidth={isHeading ? "5" : "4.4"}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 2.1,
              delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
          <motion.path
            d="M 8 12.5 Q 65 9 114 11.5"
            fill="none"
            stroke={palette.stroke}
            strokeWidth="2.4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.78 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 1.9,
              delay: delay + 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      className={`reel-marker-wrap ${
        isHeading ? "" : "font-extrabold"
      } ${palette.markerText} ${className}`}
    >
      <motion.span
        initial={{ scaleX: 0, opacity: 0, skewX: -8, rotate: -0.6 }}
        whileInView={{ scaleX: 1, opacity: 1, skewX: -8, rotate: -0.6 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          duration: 1.85,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          background: palette.gradient,
          boxShadow: palette.shadow,
        }}
        className="reel-marker-bg"
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}

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
// EXACT 18 COLORFUL BRAND TECH STACK ICONS (MULTI-COLOR, NON-THEMED)
// ============================================================================
const COLORFUL_TECH_ICONS = [
  {
    id: "Java",
    bg: "#FFFFFF",
    border: "#E76F00",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" fill="none">
        <path
          d="M8.5 14.5c0 1.3 2.5 2 5 1.5 1.5-.3 2.5-1 2.5-2 0-1-1.5-1.5-3.5-1.8-2-.3-4-.9-4-2.2 0-1.2 1.8-2 4-2"
          stroke="#5382A1"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M17.2 11.5c1.2 0 2.3.8 2.3 2s-1.1 2-2.3 2"
          stroke="#5382A1"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6.5 18.2c2.5 1.5 8.5 1.5 11 0"
          stroke="#E76F00"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M10 3.2c0 1.4 1.6 1.8 1.6 3.2M13.5 2.5c0 1.5 1.5 2 1.5 3.5"
          stroke="#E76F00"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "JavaScript",
    bg: "#F7DF1E",
    border: "#D4B800",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7">
        <rect width="24" height="24" rx="5" fill="#F7DF1E" />
        <path
          fill="#000000"
          d="M13.5 16.8c0 1.6-.9 2.3-2.3 2.3-1.2 0-2-.6-2.3-1.4l1.3-.8c.2.4.5.7 1 .7.5 0 .8-.2.8-1v-5.2h1.5v5.4zm4.8 2.3c-1.5 0-2.4-.7-2.8-1.7l1.3-.8c.3.6.8 1 1.6 1 .7 0 1.1-.3 1.1-.8 0-.5-.4-.7-1.2-1.1l-.4-.2c-1.2-.5-1.9-1.1-1.9-2.4 0-1.2.9-2.1 2.3-2.1 1 0 1.8.3 2.3 1.3l-1.2.8c-.3-.5-.6-.7-1.1-.7-.5 0-.8.3-.8.7 0 .5.3.7 1.1 1l.4.2c1.4.6 2.1 1.2 2.1 2.5 0 1.5-1.1 2.3-2.8 2.3z"
        />
      </svg>
    ),
  },
  {
    id: "Python",
    bg: "#FFFFFF",
    border: "#3776AB",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7">
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
    id: "SQL",
    bg: "#FFFFFF",
    border: "#00758F",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" fill="none">
        <ellipse cx="12" cy="5.5" rx="7.5" ry="3" fill="#00758F" />
        <path
          d="M4.5 5.5v13c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-13"
          fill="#E0F2FE"
          stroke="#00758F"
          strokeWidth="1.8"
        />
        <text
          x="6.2"
          y="15.5"
          fontSize="6.2"
          fontWeight="900"
          fill="#F29111"
          fontFamily="monospace"
        >
          SQL
        </text>
      </svg>
    ),
  },
  {
    id: "HTML5",
    bg: "#FFFFFF",
    border: "#E34F26",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7">
        <path fill="#E34F26" d="M4 2l1.5 17L12 22l6.5-3L20 2H4z" />
        <path fill="#EF652A" d="M12 3.5v16.8l5.2-2.4L18.4 3.5H12z" />
        <path
          fill="#FFFFFF"
          d="M7.5 7h9l-.2 2.2H9.6l.2 2.3h6.3l-.6 6.2-3.5 1-3.5-1-.2-3h2.2l.1 1.5 1.4.4 1.4-.4.2-2H7.9L7.5 7z"
        />
      </svg>
    ),
  },
  {
    id: "CSS3",
    bg: "#FFFFFF",
    border: "#1572B6",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7">
        <path fill="#1572B6" d="M4 2l1.5 17L12 22l6.5-3L20 2H4z" />
        <path fill="#33A9DC" d="M12 3.5v16.8l5.2-2.4L18.4 3.5H12z" />
        <path
          fill="#FFFFFF"
          d="M7.5 7h9l-.4 4.5H9.8l.2 2h5.8l-.4 4.2-3.4 1-3.4-1-.2-2.6h2.2l.1 1.2 1.3.4 1.3-.4.1-1.6H7.9L7.5 7z"
        />
      </svg>
    ),
  },
  {
    id: "React.js",
    bg: "#20232A",
    border: "#61DAFB",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 sm:w-7 sm:h-7"
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
    id: "Node.js",
    bg: "#FFFFFF",
    border: "#339933",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7">
        <polygon
          points="12 2 21 7 21 17 12 22 3 17 3 7 12 2"
          fill="#339933"
        />
        <text
          x="6.5"
          y="14.5"
          fontSize="6.8"
          fontWeight="900"
          fill="#FFFFFF"
          fontFamily="monospace"
        >
          JS
        </text>
      </svg>
    ),
  },
  {
    id: "Express.js",
    bg: "#FFFFFF",
    border: "#259DFF",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7">
        <circle cx="12" cy="12" r="10" fill="#EFF6FF" />
        <text
          x="3.5"
          y="15.5"
          fontSize="9.5"
          fontWeight="900"
          fill="#1D4ED8"
          fontFamily="monospace"
        >
          EX
        </text>
      </svg>
    ),
  },
  {
    id: "MongoDB",
    bg: "#FFFFFF",
    border: "#47A248",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7">
        <path
          d="M12 2C7.8 6.8 6.5 10.8 6.5 14.2A5.5 5.5 0 0 0 12 19.8a5.5 5.5 0 0 0 5.5-5.6C17.5 10.8 16.2 6.8 12 2z"
          fill="#47A248"
        />
        <path
          d="M12 2v17.8a5.5 5.5 0 0 0 5.5-5.6C17.5 10.8 16.2 6.8 12 2z"
          fill="#58AA50"
        />
        <line
          x1="12"
          y1="22"
          x2="12"
          y2="14"
          stroke="#A6A385"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    id: "PostgreSQL",
    bg: "#FFFFFF",
    border: "#336791",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" fill="none">
        <path
          d="M7 6c0-2 2.2-3.5 5-3.5S17 4 17 6v6c0 3.5-2.2 6-5 6s-5-2.5-5-6V6z"
          fill="#336791"
        />
        <path
          d="M5 7c-1.5 0-2.5 1.5-2.5 3.5S4 14 5.5 14M19 7c1.5 0 2.5 1.5 2.5 3.5S20 14 18.5 14"
          stroke="#336791"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="10" cy="8.5" r="1" fill="#FFFFFF" />
        <circle cx="14" cy="8.5" r="1" fill="#FFFFFF" />
        <path
          d="M12 11v8c0 1.5 1.5 2 2.5 1"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "Pinecone",
    bg: "#FFFFFF",
    border: "#00B4AB",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" fill="none">
        <polygon points="12 2 18 9 6 9" fill="#00B4AB" />
        <polygon points="12 6 19 14 5 14" fill="#1C64F2" />
        <polygon points="12 10 20 19 4 19" fill="#00B4AB" />
        <rect x="10.5" y="19" width="3" height="3" fill="#1C64F2" />
      </svg>
    ),
  },
  {
    id: "LangChain",
    bg: "#FFFFFF",
    border: "#10B981",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 sm:w-7 sm:h-7"
        fill="none"
        strokeWidth="2.4"
      >
        <path
          stroke="#10B981"
          strokeLinecap="round"
          d="M10 13a4.5 4.5 0 0 0 6.4.4l2.5-2.5a4.5 4.5 0 0 0-6.4-6.4l-1.4 1.4"
        />
        <path
          stroke="#0EA5E9"
          strokeLinecap="round"
          d="M14 11a4.5 4.5 0 0 0-6.4-.4l-2.5 2.5a4.5 4.5 0 0 0 6.4 6.4l1.4-1.4"
        />
      </svg>
    ),
  },
  {
    id: "Git",
    bg: "#FFFFFF",
    border: "#F05032",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7">
        <rect
          x="5"
          y="5"
          width="14"
          height="14"
          rx="2.5"
          transform="rotate(45 12 12)"
          fill="#F05032"
        />
        <circle cx="12" cy="8.5" r="1.6" fill="#FFFFFF" />
        <circle cx="12" cy="15.5" r="1.6" fill="#FFFFFF" />
        <circle cx="15.5" cy="12" r="1.6" fill="#FFFFFF" />
        <line
          x1="12"
          y1="8.5"
          x2="12"
          y2="15.5"
          stroke="#FFFFFF"
          strokeWidth="1.6"
        />
        <line
          x1="12"
          y1="9.5"
          x2="15.5"
          y2="12"
          stroke="#FFFFFF"
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
  {
    id: "Docker",
    bg: "#FFFFFF",
    border: "#2496ED",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" fill="none">
        <rect x="4" y="10" width="3.5" height="3.2" fill="#2496ED" />
        <rect x="8.2" y="10" width="3.5" height="3.2" fill="#2496ED" />
        <rect x="12.4" y="10" width="3.5" height="3.2" fill="#2496ED" />
        <rect x="8.2" y="6.2" width="3.5" height="3.2" fill="#2496ED" />
        <path
          d="M2.5 14h18.5c0 4.2-3.5 6.5-9 6.5S2.5 18.2 2.5 14z"
          fill="#2496ED"
        />
        <circle cx="7" cy="16.8" r="1" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "Postman",
    bg: "#FFFFFF",
    border: "#FF6C37",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7">
        <circle cx="12" cy="12" r="9.5" fill="#FF6C37" />
        <path
          d="M8.5 15.5l7-7M11.5 8.5h4v4"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    id: "Ollama",
    bg: "#FFFFFF",
    border: "#8B5CF6",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" fill="none">
        <path
          d="M7 9V5.5a1.5 1.5 0 0 1 3 0V8h4V5.5a1.5 1.5 0 0 1 3 0V9a5 5 0 0 1 1 3v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5a5 5 0 0 1 1-3z"
          fill="#EDE9FE"
          stroke="#7C3AED"
          strokeWidth="1.8"
        />
        <circle cx="10" cy="12.5" r="1.3" fill="#7C3AED" />
        <circle cx="14" cy="12.5" r="1.3" fill="#7C3AED" />
        <ellipse cx="12" cy="15.2" rx="2" ry="1.2" fill="#F43F5E" />
      </svg>
    ),
  },
  {
    id: "AWS",
    bg: "#FFFFFF",
    border: "#FF9900",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" fill="none">
        <path
          d="M17.5 15.5H6.8a4.2 4.2 0 0 1-.4-8.4A5.5 5.5 0 0 1 17.2 8a3.8 3.8 0 0 1 .3 7.5z"
          fill="#232F3E"
        />
        <path
          d="M6.5 18.2c3.5 2.2 7.5 2.2 11 0M16 17.2l2 1-.6 2"
          stroke="#FF9900"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
// RESPONSIVE, FLUID-MECHANICS ORBITAL & ELASTIC BOUNCE ARENA
// ============================================================================
function HeroCircularPortraitPhysicsArena({ photoSrc }) {
  const arenaRef = useRef(null);
  const pointerRef = useRef({
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    active: false,
  });

  const iconNodeRefs = useRef([]);
  const pillNodeRefs = useRef([]);
  const msgNodeRefs = useRef([]);

  useEffect(() => {
    const getRadii = () => {
      const width = window.innerWidth;
      if (width < 400) {
        return { rIcons: 78, rPills: 112, rMsgs: 146, hitScale: 0.72 };
      }
      if (width < 640) {
        return { rIcons: 88, rPills: 124, rMsgs: 160, hitScale: 0.78 };
      }
      if (width < 1024) {
        return { rIcons: 152, rPills: 212, rMsgs: 274, hitScale: 0.95 };
      }
      return { rIcons: 174, rPills: 242, rMsgs: 310, hitScale: 1 };
    };

    let radii = getRadii();

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
        tilt: 0,
        vTilt: 0,
        phaseA: i * 1.37,
        phaseB: i * 2.19 + 0.7,
      }));

    const ringIcons = createRingNodes(
      COLORFUL_TECH_ICONS.length,
      radii.rIcons,
      0.00085
    );
    const ringPills = createRingNodes(
      ORBIT_TEXT_ONLY_PILLS.length,
      radii.rPills,
      -0.0006
    );
    const ringMsgs = createRingNodes(
      ORBIT_MESSAGE_DIALOGUES.length,
      radii.rMsgs,
      0.00042
    );

    const handleResize = () => {
      radii = getRadii();
      ringIcons.forEach((n) => (n.baseRadius = radii.rIcons));
      ringPills.forEach((n) => (n.baseRadius = radii.rPills));
      ringMsgs.forEach((n) => (n.baseRadius = radii.rMsgs));
    };

    window.addEventListener("resize", handleResize);

    let rafId;
    let time = 0;

    const stepFluidRingPhysics = (nodes, domRefs, minArcRatio, baseHitRadius) => {
      const N = nodes.length;
      const idealGap = (2 * Math.PI) / N;
      const minGap = idealGap * minArcRatio;
      const hitRadius = baseHitRadius * radii.hitScale;

      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N;
        let diff = nodes[j].angle - nodes[i].angle;
        while (diff < 0) diff += 2 * Math.PI;
        while (diff >= 2 * Math.PI) diff -= 2 * Math.PI;

        if (diff < minGap) {
          const push = (minGap - diff) * 0.042;
          nodes[i].vAngle -= push;
          nodes[j].vAngle += push;
        }
      }

      for (let i = 0; i < N; i++) {
        const n = nodes[i];

        const radialWave =
          Math.sin(time * 0.012 + n.phaseA) * 4.8 +
          Math.cos(time * 0.008 + n.phaseB) * 2.8;
        const tangentialWave = Math.sin(time * 0.01 + n.phaseB) * 0.00015;

        const currentR = n.baseRadius + n.rOffset + radialWave;
        const x = Math.cos(n.angle) * currentR;
        const y = Math.sin(n.angle) * currentR;

        if (pointerRef.current.active) {
          const dx = x - pointerRef.current.x;
          const dy = y - pointerRef.current.y;
          const dist = Math.hypot(dx, dy);

          if (dist < hitRadius && dist > 0.001) {
            const strength = Math.pow((hitRadius - dist) / hitRadius, 1.35);
            const tx = -Math.sin(n.angle);
            const ty = Math.cos(n.angle);
            const dotTangential = (dx * tx + dy * ty) / dist;
            const bounceDir =
              Math.abs(dotTangential) > 0.12
                ? Math.sign(dotTangential)
                : -Math.sign(n.baseSpeed);

            n.vAngle += bounceDir * strength * 0.01;
            n.vr += strength * 1.8;
            n.vScale += strength * 0.024;
            n.vTilt += bounceDir * strength * 1.6;
          }
        }

        n.vAngle *= 0.968;
        n.angle =
          (n.angle + n.baseSpeed + tangentialWave + n.vAngle) % (2 * Math.PI);
        if (n.angle < 0) n.angle += 2 * Math.PI;

        const rForce = -0.048 * n.rOffset;
        n.vr = (n.vr + rForce) * 0.935;
        n.rOffset += n.vr;

        const sForce = -0.075 * (n.scale - 1);
        n.vScale = (n.vScale + sForce) * 0.91;
        n.scale = Math.max(0.92, Math.min(1.22, n.scale + n.vScale));

        const tForce = -0.08 * n.tilt;
        n.vTilt = (n.vTilt + tForce) * 0.9;
        n.tilt += n.vTilt;

        const el = domRefs.current[i];
        if (el) {
          const finalR = n.baseRadius + n.rOffset + radialWave;
          const fx = Math.cos(n.angle) * finalR;
          const fy = Math.sin(n.angle) * finalR;
          el.style.transform = `translate3d(${fx.toFixed(1)}px, ${fy.toFixed(
            1
          )}px, 0) scale(${n.scale.toFixed(3)}) rotate(${n.tilt.toFixed(1)}deg)`;
        }
      }
    };

    const loop = () => {
      time += 1;
      stepFluidRingPhysics(ringIcons, iconNodeRefs, 0.85, 68);
      stepFluidRingPhysics(ringPills, pillNodeRefs, 0.86, 86);
      stepFluidRingPhysics(ringMsgs, msgNodeRefs, 0.9, 108);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePointerMove = (e) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = e.clientX - cx;
    const ny = e.clientY - cy;
    pointerRef.current = {
      vx: nx - pointerRef.current.x,
      vy: ny - pointerRef.current.y,
      x: nx,
      y: ny,
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
      onTouchMove={(e) => {
        if (e.touches?.[0]) {
          handlePointerMove(e.touches[0]);
        }
      }}
      onTouchEnd={handlePointerLeave}
      onClick={handlePointerMove}
      className="relative mx-auto lg:ml-auto w-[330px] h-[330px] sm:w-[580px] sm:h-[580px] lg:w-[660px] lg:h-[660px] flex items-center justify-center select-none"
    >
      <div
        className="absolute inset-8 sm:inset-14 rounded-full blur-3xl opacity-65 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201, 101, 65, 0.24) 0%, rgba(234, 227, 216, 0.65) 52%, rgba(244, 240, 234, 0) 80%)",
        }}
      />

      <div className="absolute w-[176px] h-[176px] sm:w-[304px] sm:h-[304px] lg:w-[348px] lg:h-[348px] rounded-full border border-[#1E1916]/10 pointer-events-none" />
      <div className="absolute w-[248px] h-[248px] sm:w-[424px] sm:h-[424px] lg:w-[484px] lg:h-[484px] rounded-full border border-dashed border-[#1E1916]/12 pointer-events-none" />
      <div className="absolute w-[320px] h-[320px] sm:w-[548px] sm:h-[548px] lg:w-[620px] lg:h-[620px] rounded-full border border-[#1E1916]/8 pointer-events-none" />

      <div className="relative w-28 h-28 sm:w-56 sm:h-56 lg:w-60 lg:h-60 rounded-full flex items-center justify-center z-10 pointer-events-none">
        <img
          src={photoSrc}
          onError={(e) => {
            e.currentTarget.src = "/user.png";
          }}
          alt="Srinivasa Reddy Sanikommu"
          className="w-28 h-28 sm:w-56 sm:h-56 lg:w-60 lg:h-60 object-cover object-top portrait-fade-circle"
        />
      </div>

      {/* RING 1: 18 COLORFUL BRAND TECH STACK ICON PODS */}
      {COLORFUL_TECH_ICONS.map((item, idx) => (
        <div
          key={item.id}
          ref={(el) => (iconNodeRefs.current[idx] = el)}
          title={item.id}
          style={{
            backgroundColor: item.bg,
            borderColor: item.border,
          }}
          className="absolute top-1/2 left-1/2 -ml-4 -mt-4 sm:-ml-6 sm:-mt-6 w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 shadow-md flex items-center justify-center z-20 gpu cursor-pointer"
        >
          <div className="scale-75 sm:scale-100 flex items-center justify-center">
            {item.svg}
          </div>
        </div>
      ))}

      {/* RING 2: 7 EXACT TEXT-ONLY DOMAIN PILLS */}
      {ORBIT_TEXT_ONLY_PILLS.map((label, idx) => (
        <div
          key={label}
          ref={(el) => (pillNodeRefs.current[idx] = el)}
          className="absolute top-1/2 left-1/2 z-20 gpu cursor-pointer"
        >
          <div className="-translate-x-1/2 -translate-y-1/2 px-2 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full bg-[#EAE3D8] border border-[#1E1916]/20 shadow-sm font-mono text-[8px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#1E1916] whitespace-nowrap hover:border-[#C96541] hover:text-[#C96541] transition-colors">
            {label}
          </div>
        </div>
      ))}

      {/* RING 3: 6 FLOATING MESSAGE DIALOGUE BOXES */}
      {ORBIT_MESSAGE_DIALOGUES.map((msg, idx) => (
        <div
          key={msg.title}
          ref={(el) => (msgNodeRefs.current[idx] = el)}
          className="absolute top-1/2 left-1/2 z-20 gpu cursor-pointer"
        >
          <div className="-translate-x-1/2 -translate-y-1/2 floating-pill px-2.5 py-1.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-1.5 sm:gap-3 border border-[#1E1916]/15 hover:border-[#C96541] shadow-md transition-colors">
            <span
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full shrink-0"
              style={{
                backgroundColor: msg.dot,
                boxShadow: `0 0 10px ${msg.dot}80`,
              }}
            />
            <div className="leading-tight">
              <span className="font-mono text-[6.5px] sm:text-[9px] font-bold uppercase tracking-widest text-[#6E655F] block">
                {msg.tag}
              </span>
              <span className="font-display text-[9.5px] sm:text-sm font-extrabold text-[#1E1916] whitespace-nowrap block">
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
          className="fixed top-20 right-3 sm:right-8 z-[8800]"
        >
          <button
            onClick={onJumpTop}
            title="Scroll to Top"
            className="relative w-20 h-20 sm:w-36 sm:h-36 rounded-full flex items-center justify-center group"
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
                className="w-16 h-16 sm:w-32 sm:h-32 object-cover object-top portrait-fade-circle shadow-xl"
              />
            </AnimatePresence>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// CINEMATIC, SLOW-PACED ARTICULATED MASCOT ("NOVA")
// - Slow, deliberate movement across the viewport (3.2s to 3.8s travel)
// - Richly articulated Walking (hip + knee + foot + torso bob + step dust puffs)
// - Richly articulated Climbing (visible suction/ladder rungs + alternating reach)
// - Richly articulated Squeezing (dual clamping pincer arms + compression sparks)
// - Redesigned luxury Editorial Companion HUD Dialogue Box (closed at startup)
// ============================================================================
function NovaMascot({ activeSection, mascotMood, onQuickJump }) {
  const [isOpen, setIsOpen] = useState(false);
  const [actionState, setActionState] = useState("IDLE_PATROL");
  // States: IDLE_PATROL | WALKING_CORNER | BONK_FALLEN | CLIMBING_WALL | SQUEEZE_TEXT
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [facing, setFacing] = useState(-1);
  const [bodyRotation, setBodyRotation] = useState(0);
  const [bodyScale, setBodyScale] = useState({ x: 1, y: 1 });
  const [kinematics, setKinematics] = useState({
    leftHip: 0,
    leftKnee: 0,
    rightHip: 0,
    rightKnee: 0,
    leftArm: 0,
    rightArm: 0,
    torsoBob: 0,
    headTilt: 0,
    squeezePulse: 0,
  });
  const [quips, setQuips] = useState("");
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  const mascotRef = useRef(null);
  const activeTargetElRef = useRef(null);
  const animRef = useRef({
    tick: 0,
    leftHip: 0,
    leftKnee: 0,
    rightHip: 0,
    rightKnee: 0,
    leftArm: 0,
    rightArm: 0,
    torsoBob: 0,
    headTilt: 0,
    squeezePulse: 0,
  });

  const releaseTargetText = () => {
    if (activeTargetElRef.current) {
      activeTargetElRef.current.classList.remove(
        "mascot-squeezed-text",
        "mascot-damaged-text"
      );
      activeTargetElRef.current = null;
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPos({
      x: window.innerWidth - 164,
      y: window.innerHeight - 164,
    });
    return () => releaseTargetText();
  }, []);

  // Eye tracking toward mouse cursor
  useEffect(() => {
    let rafId = null;
    const handleMouseMove = (e) => {
      if (window.innerWidth < 768 || rafId) return;
      rafId = requestAnimationFrame(() => {
        if (mascotRef.current) {
          const rect = mascotRef.current.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const angle = Math.atan2(dy, dx);
          const dist = Math.min(3.8, Math.hypot(dx, dy) / 65);
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

  // Slow, deliberate, high-craft mischief routines
  const runMischiefRoutine = (type) => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    releaseTargetText();

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // 1. SQUEEZE_TEXT: Walks slowly to a visible heading, plants feet, clamps both arms, and slowly squeezes
    if (type === "SQUEEZE_TEXT") {
      const targets = Array.from(
        document.querySelectorAll('[data-mascot-target="true"]')
      ).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top > 100 && r.bottom < vh - 100 && r.width > 60;
      });

      if (targets.length > 0) {
        const target = targets[Math.floor(Math.random() * targets.length)];
        const rect = target.getBoundingClientRect();

        setActionState("WALKING_CORNER");
        const targetX = Math.min(vw - 156, Math.max(28, rect.right - 10));
        const targetY = Math.min(vh - 156, Math.max(95, rect.top - 26));

        setFacing(-1);
        setBodyRotation(-4);
        setBodyScale({ x: 1, y: 1 });
        setPos({ x: targetX, y: targetY });
        setQuips("Strolling over to inspect this typography... 🐾");

        // Arrive after slow 3.2s walk
        setTimeout(() => {
          setActionState("SQUEEZE_TEXT");
          setBodyScale({ x: 1.06, y: 0.94 });
          setBodyRotation(-8);
          activeTargetElRef.current = target;
          target.classList.add("mascot-squeezed-text", "mascot-damaged-text");
          setQuips("*HNNNNGH!* Slowly squeezing & compressing this heading! 🗜️✨");

          // Hold the slow squeeze for 4.4s, then release and stroll home
          setTimeout(() => {
            releaseTargetText();
            setBodyRotation(0);
            setBodyScale({ x: 1, y: 1 });
            setActionState("WALKING_CORNER");
            setFacing(1);
            setPos({ x: vw - 164, y: vh - 164 });
            setQuips("Elastic typography test passed! Walking back~");

            setTimeout(() => {
              setFacing(-1);
              setActionState("IDLE_PATROL");
              setQuips("");
            }, 3200);
          }, 4400);
        }, 3200);
        return;
      }
    }

    // 2. WALKING_CORNER: Slow, natural walk across the bottom edge & gentle corner tumble
    if (type === "WALK_BONK_LEFT" || type === "WALK_BONK_RIGHT") {
      const goLeft = type === "WALK_BONK_LEFT";
      setActionState("WALKING_CORNER");
      setFacing(goLeft ? -1 : 1);
      setBodyRotation(goLeft ? -5 : 5);
      setBodyScale({ x: 1.02, y: 0.98 });
      setQuips(
        goLeft
          ? "Taking a slow, scenic walk to the left corner... 🚶"
          : "Strolling over to the right corner... 🚶"
      );

      const crashX = goLeft ? 26 : vw - 152;
      const floorY = vh - 160;
      setPos({ x: crashX, y: floorY });

      setTimeout(() => {
        setActionState("BONK_FALLEN");
        setBodyScale({ x: 0.92, y: 1.08 });
        setBodyRotation(goLeft ? 82 : -82);
        setPos({ x: goLeft ? 56 : vw - 182, y: floorY + 10 });
        setQuips("*Bonk!* Reached the edge of the screen & tipped over! 💫");

        setTimeout(() => {
          setBodyRotation(0);
          setBodyScale({ x: 1, y: 1 });
          setActionState("WALKING_CORNER");
          setFacing(1);
          setPos({ x: vw - 164, y: vh - 164 });
          setQuips("Dusted off and strolling back to base~");

          setTimeout(() => {
            setFacing(-1);
            setActionState("IDLE_PATROL");
            setQuips("");
          }, 3200);
        }, 3800);
      }, 3300);
      return;
    }

    // 3. CLIMBING_WALL: Slow, methodical hand-over-hand climb up the right margin
    if (type === "CLIMB_MARGIN") {
      setActionState("CLIMBING_WALL");
      setFacing(1);
      setBodyRotation(-8);
      setPos({ x: vw - 148, y: 165 });
      setQuips("Climbing slowly up the editorial margin rungs... 🧗");

      setTimeout(() => {
        setActionState("BONK_FALLEN");
        setBodyRotation(75);
        setPos({ x: vw - 164, y: vh - 156 });
        setQuips("*Wheee!* Floated back down to the floor! 💫");

        setTimeout(() => {
          setBodyRotation(0);
          setBodyScale({ x: 1, y: 1 });
          setActionState("IDLE_PATROL");
          setFacing(-1);
          setQuips("");
        }, 3400);
      }, 3600);
    }
  };

  // Unhurried autonomous schedule (every 17 seconds when dialogue is closed)
  useEffect(() => {
    const routines = [
      "SQUEEZE_TEXT",
      "WALK_BONK_LEFT",
      "CLIMB_MARGIN",
      "SQUEEZE_TEXT",
      "WALK_BONK_RIGHT",
    ];
    let idx = 0;

    const timer = setInterval(() => {
      if (window.innerWidth < 768 || isOpen) return;
      runMischiefRoutine(routines[idx % routines.length]);
      idx += 1;
    }, 17000);

    const initialKick = setTimeout(() => {
      if (window.innerWidth >= 768 && !isOpen) {
        runMischiefRoutine("SQUEEZE_TEXT");
      }
    }, 5200);

    return () => {
      clearInterval(timer);
      clearTimeout(initialKick);
    };
  }, [isOpen]);

  // Slow, multi-jointed 60fps kinematic animation loop (Hip + Knee + Arm + Torso Bob + Squeeze)
  useEffect(() => {
    let raf;
    const animateLimbs = () => {
      const s = animRef.current;
      s.tick += 1;

      let tLeftHip = 0;
      let tLeftKnee = 0;
      let tRightHip = 0;
      let tRightKnee = 0;
      let tLeftArm = 0;
      let tRightArm = 0;
      let tTorsoBob = 0;
      let tHeadTilt = 0;
      let tSqueeze = 0;

      if (actionState === "WALKING_CORNER") {
        // Slow, natural walking gait cycle (0.065 rad/frame)
        const w = s.tick * 0.065;
        tLeftHip = Math.sin(w) * 18;
        tLeftKnee = Math.max(0, Math.cos(w) * 16);
        tRightHip = Math.sin(w + Math.PI) * 18;
        tRightKnee = Math.max(0, Math.cos(w + Math.PI) * 16);
        tLeftArm = Math.sin(w + Math.PI) * 15;
        tRightArm = Math.sin(w) * 15;
        tTorsoBob = Math.abs(Math.sin(w)) * -4.5;
        tHeadTilt = Math.sin(w) * 3;
      } else if (actionState === "CLIMBING_WALL") {
        // Slow hand-over-hand ladder climbing cycle (0.055 rad/frame)
        const c = s.tick * 0.055;
        tLeftArm = -45 + Math.sin(c) * 26;
        tRightArm = -45 + Math.sin(c + Math.PI) * 26;
        tLeftHip = Math.sin(c + Math.PI) * 16;
        tLeftKnee = 14 + Math.cos(c) * 10;
        tRightHip = Math.sin(c) * 16;
        tRightKnee = 14 + Math.cos(c + Math.PI) * 10;
        tTorsoBob = Math.sin(c * 2) * -3;
        tHeadTilt = -8;
      } else if (actionState === "SQUEEZE_TEXT") {
        // Slow rhythmic clamping & squeezing effort (0.05 rad/frame)
        const sq = s.tick * 0.05;
        tLeftArm = 42 + Math.sin(sq) * 12;
        tRightArm = 36 + Math.sin(sq) * 12;
        tLeftHip = -10;
        tRightHip = 12;
        tTorsoBob = Math.sin(sq) * 3.5;
        tHeadTilt = -6 + Math.sin(sq) * 4;
        tSqueeze = (Math.sin(sq) + 1) * 0.5;
      } else if (actionState === "BONK_FALLEN") {
        // Gentle leg wiggle while fallen
        const b = s.tick * 0.05;
        tLeftHip = Math.sin(b) * 8;
        tRightHip = -Math.sin(b) * 8;
        tLeftArm = 20;
        tRightArm = -20;
      } else {
        // Calm idle breathing
        const idle = s.tick * 0.028;
        tTorsoBob = Math.sin(idle) * -2.2;
        tLeftArm = Math.sin(idle) * 3;
        tRightArm = -Math.sin(idle) * 3;
        tHeadTilt = Math.cos(idle * 0.7) * 1.8;
      }

      // Smooth viscous lerp (0.08) so every transition between states is butter-smooth
      const lerp = 0.08;
      s.leftHip += (tLeftHip - s.leftHip) * lerp;
      s.leftKnee += (tLeftKnee - s.leftKnee) * lerp;
      s.rightHip += (tRightHip - s.rightHip) * lerp;
      s.rightKnee += (tRightKnee - s.rightKnee) * lerp;
      s.leftArm += (tLeftArm - s.leftArm) * lerp;
      s.rightArm += (tRightArm - s.rightArm) * lerp;
      s.torsoBob += (tTorsoBob - s.torsoBob) * lerp;
      s.headTilt += (tHeadTilt - s.headTilt) * lerp;
      s.squeezePulse += (tSqueeze - s.squeezePulse) * lerp;

      setKinematics({
        leftHip: s.leftHip,
        leftKnee: s.leftKnee,
        rightHip: s.rightHip,
        rightKnee: s.rightKnee,
        leftArm: s.leftArm,
        rightArm: s.rightArm,
        torsoBob: s.torsoBob,
        headTilt: s.headTilt,
        squeezePulse: s.squeezePulse,
      });

      raf = requestAnimationFrame(animateLimbs);
    };
    raf = requestAnimationFrame(animateLimbs);
    return () => cancelAnimationFrame(raf);
  }, [actionState]);

  const guideMessages = {
    hero: {
      badge: "CHAPTER 01 // INTRO",
      title: "Nova Companion OS • Ready",
      text: "I stroll around at a calm pace, climb the margin ladder, and playfully squeeze Srinivasa's headings! Trigger any animation below:",
    },
    works: {
      badge: "CHAPTER 02 // MY WORKS",
      title: "4 Production Architectures",
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

  const stateBadgeLabel = {
    IDLE_PATROL: "CALM PATROL",
    WALKING_CORNER: "SLOW STROLL",
    CLIMBING_WALL: "LADDER CLIMB",
    SQUEEZE_TEXT: "SQUEEZING TEXT",
    BONK_FALLEN: "CORNER TUMBLE",
  }[actionState];

  return (
    <div
      ref={mascotRef}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition:
          actionState === "WALKING_CORNER"
            ? "transform 3.2s cubic-bezier(0.25, 1, 0.5, 1)"
            : actionState === "CLIMBING_WALL"
            ? "transform 3.5s cubic-bezier(0.22, 1, 0.36, 1)"
            : actionState === "BONK_FALLEN"
            ? "transform 1.05s cubic-bezier(0.34, 1.45, 0.64, 1)"
            : "transform 2.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className="hidden md:block fixed top-0 left-0 z-[8900] select-none gpu"
    >
      {/* Overhead Editorial Quip Pill (When Main Dialogue is Closed) */}
      <AnimatePresence>
        {!isOpen && (quips || mascotMood) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.92 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-2xl bg-[#1E1916] text-[#F4F0EA] font-mono text-[11px] font-extrabold shadow-2xl border border-[#C96541] flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#C96541] animate-ping" />
            <span>{mascotMood || quips}</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1E1916] border-r border-b border-[#C96541] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* ENHANCED EDITORIAL COMPANION HUD DIALOGUE BOX (CLOSED AT START)   */}
      {/* ================================================================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-36 right-0 w-[340px] rounded-3xl bg-[#F4F0EA]/98 backdrop-blur-2xl p-5 space-y-4 shadow-[0_24px_60px_rgba(30,25,22,0.22)] border-2 border-[#1E1916]/15"
          >
            {/* Top Telemetry Header Bar */}
            <div className="flex items-center justify-between border-b border-[#1E1916]/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#1E1916]">
                  NOVA COMPANION // {stateBadgeLabel}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg bg-[#EAE3D8] text-[#6E655F] hover:text-[#1E1916] hover:bg-[#C96541]/20 transition-colors"
                title="Minimize Dialogue"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chapter Context Card */}
            <div className="p-3.5 rounded-2xl bg-[#EAE3D8]/75 border border-[#1E1916]/10 space-y-1.5">
              <span className="font-mono text-[9.5px] font-extrabold uppercase tracking-widest text-[#C96541] block">
                {currentMsg.badge}
              </span>
              <div className="font-display text-base font-extrabold text-[#1E1916]">
                {mascotMood || currentMsg.title}
              </div>
              <p className="text-xs text-[#6E655F] leading-relaxed font-medium">
                {currentMsg.text}
              </p>
            </div>

            {/* Interactive Animation Studio Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[9.5px] font-extrabold uppercase tracking-wider text-[#6E655F]">
                <span>PLAYFUL ANIMATION CONTROLS</span>
                <span className="text-[#C96541]">SLOW &amp; FLUID</span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    runMischiefRoutine("SQUEEZE_TEXT");
                  }}
                  className="py-2.5 px-2 rounded-xl bg-[#C96541] text-[#F4F0EA] font-extrabold hover:bg-[#1E1916] transition-all flex flex-col items-center gap-1 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Squeeze</span>
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    runMischiefRoutine("WALK_BONK_LEFT");
                  }}
                  className="py-2.5 px-2 rounded-xl bg-[#EAE3D8] text-[#1E1916] border border-[#1E1916]/15 font-extrabold hover:border-[#C96541] transition-all flex flex-col items-center gap-1"
                >
                  <Footprints className="w-3.5 h-3.5 text-[#C96541]" />
                  <span>Stroll</span>
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    runMischiefRoutine("CLIMB_MARGIN");
                  }}
                  className="py-2.5 px-2 rounded-xl bg-[#1E1916] text-[#F4F0EA] font-extrabold hover:bg-[#C96541] transition-all flex flex-col items-center gap-1"
                >
                  <Mountain className="w-3.5 h-3.5" />
                  <span>Climb</span>
                </button>
              </div>
            </div>

            {/* Quick Section Jump Bar */}
            <div className="pt-2 border-t border-[#1E1916]/10 flex flex-wrap gap-1.5">
              {[
                { id: "works", label: "Works" },
                { id: "labs", label: "Live Labs" },
                { id: "journey", label: "Timeline" },
                { id: "certs", label: "Certs & Wins" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onQuickJump(tab.id)}
                  className={`font-mono text-[10px] px-3 py-1 rounded-full border transition-colors ${
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

      {/* ================================================================= */}
      {/* MULTI-JOINTED ARTICULATED ROBOT MASCOT SVG                        */}
      {/* ================================================================= */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title="Click Nova to open Companion Studio!"
        style={{
          transform: `rotate(${bodyRotation}deg) scaleX(${
            bodyScale.x * (facing === 1 ? -1 : 1)
          }) scaleY(${bodyScale.y})`,
          transition: "transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="group relative w-32 h-32 flex items-center justify-center focus:outline-none"
      >
        <svg viewBox="0 0 130 130" className="w-32 h-32 overflow-visible">
          <defs>
            <radialGradient id="novaBodyLarge" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F4F0EA" />
              <stop offset="100%" stopColor="#DFD5C6" />
            </radialGradient>
            <radialGradient id="novaVisorLarge" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#2D2521" />
              <stop offset="100%" stopColor="#14110F" />
            </radialGradient>
            <filter
              id="novaDropShadow"
              x="-25%"
              y="-20%"
              width="150%"
              height="150%"
            >
              <feDropShadow
                dx="0"
                dy="8"
                stdDeviation="6"
                floodColor="#1E1916"
                floodOpacity="0.22"
              />
            </filter>
          </defs>

          {/* Visible Climbing Ladder Rungs when CLIMBING_WALL */}
          {actionState === "CLIMBING_WALL" && (
            <g opacity="0.65">
              <line
                x1="34"
                y1="10"
                x2="34"
                y2="122"
                stroke="#C96541"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
              <line
                x1="96"
                y1="10"
                x2="96"
                y2="122"
                stroke="#C96541"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
              {[24, 48, 72, 96, 114].map((ry) => (
                <line
                  key={ry}
                  x1="34"
                  y1={ry}
                  x2="96"
                  y2={ry}
                  stroke="#1E1916"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}
            </g>
          )}

          {/* Ground Shadow + Walking Step Dust Puffs */}
          <ellipse
            cx="65"
            cy="118"
            rx="28"
            ry="5.5"
            fill="#1E1916"
            opacity="0.16"
          />
          {actionState === "WALKING_CORNER" && (
            <g opacity="0.45">
              <circle
                cx={88 + kinematics.leftHip * 0.4}
                cy="114"
                r="4.5"
                fill="#EAE3D8"
                stroke="#6E655F"
                strokeWidth="1"
              />
              <circle
                cx={98 + kinematics.rightHip * 0.4}
                cy="111"
                r="3"
                fill="#EAE3D8"
              />
            </g>
          )}

          {/* Compression Effort Sparks when SQUEEZE_TEXT */}
          {actionState === "SQUEEZE_TEXT" && (
            <g opacity={0.45 + kinematics.squeezePulse * 0.55}>
              <path
                d="M 4 44 L 14 48 M 6 58 L 16 56 M 10 32 L 18 39"
                stroke="#C96541"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx="10"
                cy="50"
                r={5 + kinematics.squeezePulse * 4}
                fill="none"
                stroke="#C96541"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Dizzy Stars when BONK_FALLEN */}
          {actionState === "BONK_FALLEN" && (
            <g>
              <circle cx="36" cy="14" r="4" fill="#D97706" />
              <circle cx="65" cy="8" r="5" fill="#C96541" />
              <circle cx="94" cy="14" r="4" fill="#2A6B53" />
              <path
                d="M 34 14 Q 65 2 96 14"
                stroke="#C96541"
                strokeWidth="1.8"
                strokeDasharray="4 4"
                fill="none"
              />
            </g>
          )}

          {/* Whole Upper & Lower Body with Smooth Torso Bob */}
          <g
            filter="url(#novaDropShadow)"
            style={{
              transform: `translateY(${kinematics.torsoBob}px)`,
            }}
          >
            {/* MULTI-JOINTED LEFT LEG (Hip + Knee + Foot) */}
            <g
              style={{
                transform: `rotate(${kinematics.leftHip}deg)`,
                transformOrigin: "52px 88px",
              }}
            >
              <rect
                x="46"
                y="86"
                width="12"
                height="15"
                rx="6"
                fill="#EAE3D8"
                stroke="#1E1916"
                strokeWidth="2.4"
              />
              <g
                style={{
                  transform: `rotate(${kinematics.leftKnee}deg)`,
                  transformOrigin: "52px 100px",
                }}
              >
                <rect
                  x="47"
                  y="98"
                  width="10"
                  height="12"
                  rx="5"
                  fill="#F4F0EA"
                  stroke="#1E1916"
                  strokeWidth="2.2"
                />
                <ellipse
                  cx="50"
                  cy="111"
                  rx="9.5"
                  ry="5"
                  fill="#C96541"
                  stroke="#1E1916"
                  strokeWidth="2.2"
                />
              </g>
            </g>

            {/* MULTI-JOINTED RIGHT LEG (Hip + Knee + Foot) */}
            <g
              style={{
                transform: `rotate(${kinematics.rightHip}deg)`,
                transformOrigin: "78px 88px",
              }}
            >
              <rect
                x="72"
                y="86"
                width="12"
                height="15"
                rx="6"
                fill="#EAE3D8"
                stroke="#1E1916"
                strokeWidth="2.4"
              />
              <g
                style={{
                  transform: `rotate(${kinematics.rightKnee}deg)`,
                  transformOrigin: "78px 100px",
                }}
              >
                <rect
                  x="73"
                  y="98"
                  width="10"
                  height="12"
                  rx="5"
                  fill="#F4F0EA"
                  stroke="#1E1916"
                  strokeWidth="2.2"
                />
                <ellipse
                  cx="80"
                  cy="111"
                  rx="9.5"
                  ry="5"
                  fill="#C96541"
                  stroke="#1E1916"
                  strokeWidth="2.2"
                />
              </g>
            </g>

            {/* ARTICULATED LEFT ARM + CLAMPING GRIPPER HAND */}
            <g
              style={{
                transform: `rotate(${kinematics.leftArm}deg)`,
                transformOrigin: "35px 68px",
              }}
            >
              <path
                d="M 35 68 Q 16 64 14 50"
                stroke="#1E1916"
                strokeWidth="6.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle
                cx="14"
                cy="50"
                r="6.5"
                fill="#C96541"
                stroke="#1E1916"
                strokeWidth="2.2"
              />
            </g>

            {/* ARTICULATED RIGHT ARM + CLAMPING GRIPPER HAND */}
            <g
              style={{
                transform: `rotate(${kinematics.rightArm}deg)`,
                transformOrigin: "95px 68px",
              }}
            >
              <path
                d={
                  actionState === "SQUEEZE_TEXT"
                    ? "M 95 68 Q 55 76 18 62"
                    : "M 95 68 Q 112 72 114 84"
                }
                stroke="#1E1916"
                strokeWidth="6.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle
                cx={actionState === "SQUEEZE_TEXT" ? "18" : "114"}
                cy={actionState === "SQUEEZE_TEXT" ? "62" : "84"}
                r="6.5"
                fill="#C96541"
                stroke="#1E1916"
                strokeWidth="2.2"
              />
            </g>

            {/* Torso / Chest Core */}
            <rect
              x="41"
              y="66"
              width="48"
              height="25"
              rx="10"
              fill="url(#novaBodyLarge)"
              stroke="#1E1916"
              strokeWidth="2.5"
            />
            <rect
              x="51"
              y="72"
              width="28"
              height="13"
              rx="4.5"
              fill="#EAE3D8"
              stroke="#1E1916"
              strokeWidth="1.8"
            />
            <circle cx="58" cy="78.5" r="2.6" fill="#2A6B53" />
            <circle cx="65" cy="78.5" r="2.6" fill="#C96541" />
            <circle cx="72" cy="78.5" r="2.6" fill="#3B4CCA" />

            {/* Articulated Head & Helmet Group */}
            <g
              style={{
                transform: `rotate(${kinematics.headTilt}deg)`,
                transformOrigin: "65px 52px",
              }}
            >
              {/* Antenna */}
              <line
                x1="65"
                y1="22"
                x2="65"
                y2="8"
                stroke="#1E1916"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle
                cx="65"
                cy="7"
                r="5.5"
                fill="#C96541"
                stroke="#1E1916"
                strokeWidth="2"
              />

              {/* Side Ear Modules */}
              <rect
                x="21"
                y="36"
                width="9"
                height="20"
                rx="4.5"
                fill="#C96541"
                stroke="#1E1916"
                strokeWidth="2.2"
              />
              <rect
                x="100"
                y="36"
                width="9"
                height="20"
                rx="4.5"
                fill="#C96541"
                stroke="#1E1916"
                strokeWidth="2.2"
              />

              {/* Main Helmet Shell */}
              <rect
                x="28"
                y="20"
                width="74"
                height="50"
                rx="24"
                fill="url(#novaBodyLarge)"
                stroke="#1E1916"
                strokeWidth="2.8"
              />

              {/* Visor Screen */}
              <rect
                x="36"
                y="28"
                width="58"
                height="34"
                rx="15"
                fill="url(#novaVisorLarge)"
                stroke="#1E1916"
                strokeWidth="2"
              />

              {/* Visor Gloss */}
              <path
                d="M 43 33 Q 53 30 63 33"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Expressive Eyes & Mouth inside Visor */}
              <g
                style={{
                  transform: `translate3d(${eyeOffset.x}px, ${eyeOffset.y}px, 0)`,
                }}
              >
                {actionState === "BONK_FALLEN" ? (
                  <>
                    <path
                      d="M 47 40 L 55 48 M 55 40 L 47 48"
                      stroke="#F4F0EA"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 75 40 L 83 48 M 83 40 L 75 48"
                      stroke="#F4F0EA"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="65"
                      cy="55"
                      r="4"
                      fill="none"
                      stroke="#C96541"
                      strokeWidth="2.4"
                    />
                  </>
                ) : actionState === "SQUEEZE_TEXT" ? (
                  <>
                    <path
                      d="M 44 38 L 57 43"
                      stroke="#C96541"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <circle cx="51" cy="45" r="5" fill="#F4F0EA" />
                    <circle cx="51" cy="45" r="2.2" fill="#C96541" />

                    <path
                      d="M 86 38 L 73 43"
                      stroke="#C96541"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <circle cx="79" cy="45" r="5" fill="#F4F0EA" />
                    <circle cx="79" cy="45" r="2.2" fill="#C96541" />

                    <path
                      d="M 53 54 Q 65 50 77 54"
                      stroke="#C96541"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </>
                ) : (
                  <>
                    <circle cx="51" cy="44" r="6" fill="#F4F0EA" />
                    <circle cx="52.5" cy="43" r="2.5" fill="#C96541" />
                    <circle cx="53.5" cy="41.8" r="1" fill="#FFFFFF" />

                    <circle cx="79" cy="44" r="6" fill="#F4F0EA" />
                    <circle cx="80.5" cy="43" r="2.5" fill="#C96541" />
                    <circle cx="81.5" cy="41.8" r="1" fill="#FFFFFF" />

                    <path
                      d="M 55 54 Q 65 59 75 54"
                      stroke="#C96541"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </>
                )}
              </g>
            </g>
          </g>
        </svg>
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
    quickStory: (
      <>
        Built to power a real multi-vendor delivery marketplace where restaurants onboard with{" "}
        <ReelHighlight tone="terracotta" delay={0.1}>
          Stripe Connect
        </ReelHighlight>
        , customers check out smoothly, and{" "}
        <ReelHighlight tone="sage" variant="underline" delay={0.2}>
          payouts split automatically
        </ReelHighlight>
        .
      </>
    ),
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
    quickStory: (
      <>
        Connects a React &amp; Node.js web app to a{" "}
        <ReelHighlight tone="sage" delay={0.12}>
          Python Flask ML service
        </ReelHighlight>{" "}
        so anyone can estimate{" "}
        <ReelHighlight tone="terracotta" variant="underline" delay={0.22}>
          insurance costs in seconds
        </ReelHighlight>
        .
      </>
    ),
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
    quickStory: (
      <>
        An AI agent built with{" "}
        <ReelHighlight tone="amber" delay={0.14}>
          LangGraph StateGraph
        </ReelHighlight>{" "}
        that scores your PDF resume and{" "}
        <ReelHighlight tone="terracotta" variant="underline" delay={0.24}>
          routes your next step
        </ReelHighlight>{" "}
        automatically.
      </>
    ),
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
    quickStory: (
      <>
        Trained on 2,105 real emails from the{" "}
        <ReelHighlight tone="terracotta" delay={0.16}>
          1.43 GB Enron dataset
        </ReelHighlight>{" "}
        to reach{" "}
        <ReelHighlight tone="sage" variant="underline" delay={0.26}>
          88.9% classification accuracy
        </ReelHighlight>
        .
      </>
    ),
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
// CLEAR, VISUAL JOURNEY TIMELINE MILESTONES WITH DYNAMIC REEL HIGHLIGHTS
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
    summary: (
      <>
        Built a rock-solid foundation in Mathematics, Physics, and Chemistry. Graduating with{" "}
        <ReelHighlight tone="terracotta" delay={0.1}>
          95.0% distinction
        </ReelHighlight>{" "}
        sparked my passion for{" "}
        <ReelHighlight tone="sage" variant="underline" delay={0.2}>
          algorithmic problem-solving
        </ReelHighlight>
        .
      </>
    ),
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
    summary: (
      <>
        Dived deep into{" "}
        <ReelHighlight tone="linen" delay={0.1}>
          Data Structures &amp; Algorithms
        </ReelHighlight>
        , Object-Oriented Design, Operating Systems, DBMS, and{" "}
        <ReelHighlight tone="terracotta" variant="underline" delay={0.2}>
          Machine Learning
        </ReelHighlight>{" "}
        while building full-stack web apps.
      </>
    ),
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
    summary: (
      <>
        Won{" "}
        <ReelHighlight tone="terracotta" delay={0.1}>
          1st Prize in AI Advertisement Creation
        </ReelHighlight>{" "}
        and{" "}
        <ReelHighlight tone="amber" delay={0.2}>
          1st Prize in Automations Building
        </ReelHighlight>
        , while competing in national challenges like Flipkart GRiD 8.0 and Statathon 2025.
      </>
    ),
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
    summary: (
      <>
        Designed and shipped production Node.js, Express, and MongoDB services for{" "}
        <ReelHighlight tone="linen" delay={0.1}>
          Stripe Connect vendor onboarding
        </ReelHighlight>{" "}
        and refactored compound indexes to{" "}
        <ReelHighlight tone="terracotta" variant="underline" delay={0.2}>
          cut API latency by 35%
        </ReelHighlight>
        .
      </>
    ),
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
    summary: (
      <>
        Combining scalable Node.js &amp; Python backends with{" "}
        <ReelHighlight tone="sage" delay={0.1}>
          Scikit-Learn ML microservices
        </ReelHighlight>{" "}
        and stateful{" "}
        <ReelHighlight tone="terracotta" variant="underline" delay={0.2}>
          LangGraph AI agents
        </ReelHighlight>{" "}
        to build fast, reliable software.
      </>
    ),
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
    description: (
      <>
        Won 1st Prize for conceptualizing, scripting, and producing a{" "}
        <ReelHighlight tone="terracotta" delay={0.1}>
          high-impact commercial advertisement
        </ReelHighlight>{" "}
        end-to-end using generative AI tools, visual synthesis, and{" "}
        <ReelHighlight tone="linen" variant="underline" delay={0.2}>
          prompt engineering workflows
        </ReelHighlight>
        .
      </>
    ),
    skills: ["Generative AI Tools", "Prompt Engineering", "AI Ad Production", "Creative Direction"],
  },
  {
    id: "comp-2",
    rank: "1ST PRIZE WINNER",
    title: "Automations Building Competition",
    category: "Intelligent Workflows & Systems Automation",
    icon: Workflow,
    description: (
      <>
        Won 1st Prize for designing and building an{" "}
        <ReelHighlight tone="sage" delay={0.14}>
          end-to-end automated workflow pipeline
        </ReelHighlight>{" "}
        that eliminated manual steps through smart event triggers and{" "}
        <ReelHighlight tone="terracotta" variant="underline" delay={0.24}>
          autonomous task execution
        </ReelHighlight>
        .
      </>
    ),
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
          <h3
            data-mascot-target="true"
            className="font-display text-2xl md:text-3xl font-extrabold text-[#1E1916] mt-1"
          >
            <ReelHighlight tone="linen" isHeading delay={0.1}>
              Stripe Connect
            </ReelHighlight>{" "}
            Split-Payout &amp;{" "}
            <ReelHighlight tone="terracotta" variant="underline" isHeading delay={0.25}>
              Concurrency Simulator
            </ReelHighlight>
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
            <h4
              data-mascot-target="true"
              className="font-display text-xl font-extrabold text-[#1E1916] mt-0.5"
            >
              Health Insurance{" "}
              <ReelHighlight tone="sage" variant="underline" isHeading delay={0.15}>
                Cost Estimator
              </ReelHighlight>
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
            <h4
              data-mascot-target="true"
              className="font-display text-xl font-extrabold text-[#1E1916] mt-0.5"
            >
              70% ATS Score{" "}
              <ReelHighlight tone="amber" variant="underline" isHeading delay={0.18}>
                Conditional Router
              </ReelHighlight>
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
              SRINIVASAREDDY<span className="text-[#C96541]">.DEV</span>
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

      {/* Top-Right Shrinking Portrait Dock */}
      <ShrunkCornerPortraitDock
        activeSection={activeSection}
        scrolledPastHero={scrolledPastHero}
        onJumpTop={() => scrollToSection("hero")}
      />

      {/* NOVA — Slow, Articulated Mascot with Upgraded Companion Dialogue Box */}
      <NovaMascot
        activeSection={activeSection}
        mascotMood={mascotMood}
        onQuickJump={scrollToSection}
      />

      {/* =================================================================== */}
      {/* CHAPTER 01: PERSONAL PORTFOLIO HERO                                 */}
      {/* - Generous gap between Name column & Profile Photo column           */}
      {/* - Interleaved Z-Index Stacking:                                     */}
      {/*   * "SRINIVASA" sits at z-10 (orbiting tags at z-20 CAN pass over)  */}
      {/*   * "SANIKOMMU" sits at z-30 (orbiting tags at z-20 CANNOT hide it) */}
      {/* =================================================================== */}
      <section
        id="hero"
        className="relative z-10 pt-24 pb-24 md:pt-32 md:pb-36 border-b border-[#1E1916]/10 overflow-hidden"
      >
        <div className="max-w-[1480px] mx-auto px-5 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 xl:gap-28 items-center">
            {/* Right 6 Columns: Orbiting Profile Photo Arena at z-20 */}
            <motion.div
              style={{
                scale: heroPortraitScale,
                x: heroPortraitX,
                y: heroPortraitY,
                opacity: heroPortraitOpacity,
              }}
              className="lg:col-span-6 relative z-20 flex justify-center lg:justify-end lg:pl-8 xl:pl-14 gpu order-first lg:order-last"
            >
              <HeroCircularPortraitPhysicsArena
                photoSrc={PROFILE_PHOTOS.camera}
              />
            </motion.div>

            {/* Left 6 Columns: No wrapper z-index so child z-10 & z-30 interleave with right column z-20! */}
            <div className="lg:col-span-6 space-y-7 lg:pr-6 xl:pr-10 order-last lg:order-first">
              <div className="relative z-10 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#EAE3D8] border border-[#1E1916]/15 font-mono text-xs text-[#C96541] font-extrabold">
                <span className="w-2 h-2 rounded-full bg-[#C96541] animate-ping" />
                PERSONAL DEVELOPER PORTFOLIO • CLASS OF 2027
              </div>

              <div className="space-y-3">
                <p className="relative z-10 font-mono text-sm md:text-base text-[#6E655F] font-bold uppercase tracking-widest">
                  HI THERE, I&apos;M
                </p>
                <h1 className="display-hero font-extrabold uppercase text-[#1E1916]">
                  {/* First name at z-10: orbiting tags (z-20) CAN pass in front of SRINIVASA */}
                  <span
                    data-mascot-target="true"
                    className="relative z-10 inline-block mr-3"
                  >
                    SRINIVASA REDDY
                  </span>
                  <br className="hidden sm:block" />
                  {/* Last name at z-30: strictly above orbiting tags (z-20) so tags NEVER hide SANIKOMMU */}
                  <span className="relative z-30 inline-block mt-1">
                    <ReelHighlight
                      tone="terracotta"
                      variant="underline"
                      isHeading
                      delay={0.2}
                      className="text-[#C96541]"
                    >
                      SANIKOMMU
                    </ReelHighlight>
                  </span>
                </h1>
              </div>

              <p className="relative z-30 text-base md:text-lg text-[#6E655F] font-body font-medium leading-relaxed">
                I&apos;m a{" "}
                <ReelHighlight tone="terracotta" delay={0.25}>
                  Backend Developer &amp; AI/ML Engineer
                </ReelHighlight>{" "}
                studying B.Tech CSE (AI &amp; ML) at{" "}
                <strong className="text-[#1E1916] font-extrabold">
                  R.V.R. &amp; J.C. College of Engineering
                </strong>
                . I engineer high-speed, production-grade systems—from{" "}
                <ReelHighlight tone="linen" delay={0.45}>
                  Stripe Connect marketplaces
                </ReelHighlight>{" "}
                and{" "}
                <ReelHighlight tone="sage" delay={0.65}>
                  35% faster MongoDB APIs
                </ReelHighlight>{" "}
                to{" "}
                <ReelHighlight
                  tone="terracotta"
                  variant="underline"
                  delay={0.85}
                >
                  stateful LangGraph AI agents
                </ReelHighlight>
                .
              </p>

              {/* Quick Impact Counters */}
              <div className="relative z-30 grid grid-cols-3 gap-3.5 pt-2">
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
              <div className="relative z-30 flex flex-wrap items-center gap-3.5 pt-2">
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
                  rel="noreferrer me"
                  className="p-3.5 rounded-2xl bg-[#EAE3D8] border border-[#1E1916]/15 text-[#1E1916] hover:border-[#C96541] hover:text-[#C96541] transition-colors"
                  title="Srinivasa Reddy Sanikommu on GitHub"
                  aria-label="Srinivasa Reddy Sanikommu GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/srinivasreddysanikommu2/"
                  target="_blank"
                  rel="noreferrer me"
                  className="p-3.5 rounded-2xl bg-[#EAE3D8] border border-[#1E1916]/15 text-[#1E1916] hover:border-[#C96541] hover:text-[#C96541] transition-colors"
                  title="Srinivasa Reddy Sanikommu on LinkedIn"
                  aria-label="Srinivasa Reddy Sanikommu LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
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
              <h2
                data-mascot-target="true"
                className="display-section font-extrabold uppercase text-[#1E1916]"
              >
                My{" "}
                <ReelHighlight
                  tone="terracotta"
                  variant="underline"
                  isHeading
                  delay={0.15}
                >
                  Works
                </ReelHighlight>
              </h2>
            </div>
            <p className="text-sm text-[#6E655F] max-w-md font-medium">
              Every project below solves a{" "}
              <ReelHighlight tone="linen" delay={0.2}>
                real engineering problem
              </ReelHighlight>
              . Click any card to inspect its architecture workflow and code implementation.
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
                    <h3
                      data-mascot-target="true"
                      className="font-display text-2xl md:text-3xl font-extrabold text-[#1E1916] group-hover:text-[#C96541] transition-colors"
                    >
                      <ReelHighlight
                        tone={idx % 2 === 0 ? "terracotta" : "sage"}
                        variant="underline"
                        isHeading
                        delay={0.18}
                      >
                        {project.title}
                      </ReelHighlight>
                    </h3>
                    <p className="font-mono text-xs font-bold text-[#6E655F] mt-2">
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
              <h2
                data-mascot-target="true"
                className="display-section font-extrabold uppercase text-[#1E1916]"
              >
                Test My{" "}
                <ReelHighlight
                  tone="sage"
                  variant="underline"
                  isHeading
                  delay={0.18}
                >
                  Systems Live
                </ReelHighlight>
              </h2>
            </div>
            <p className="text-sm text-[#6E655F] max-w-md font-medium">
              Interactive frontend simulations of OrderNow&apos;s{" "}
              <ReelHighlight tone="terracotta" delay={0.2}>
                Stripe Connect split-math
              </ReelHighlight>
              , InsureAI&apos;s regression weights, and the{" "}
              <ReelHighlight tone="sage" variant="underline" delay={0.35}>
                LangGraph score router
              </ReelHighlight>
              .
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
            <h2
              data-mascot-target="true"
              className="display-section font-extrabold uppercase text-[#1E1916]"
            >
              My Journey &amp;{" "}
              <ReelHighlight
                tone="terracotta"
                variant="underline"
                isHeading
                delay={0.18}
              >
                Timeline
              </ReelHighlight>
            </h2>
            <p className="text-sm text-[#6E655F] font-medium">
              Every milestone that shaped me as a software engineer—from my{" "}
              <ReelHighlight tone="terracotta" delay={0.2}>
                95% MPC foundation
              </ReelHighlight>{" "}
              to building{" "}
              <ReelHighlight tone="sage" variant="underline" delay={0.35}>
                production Node.js &amp; AI systems
              </ReelHighlight>
              .
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
                      <h3
                        data-mascot-target="true"
                        className="font-display text-2xl md:text-3xl font-extrabold text-[#1E1916]"
                      >
                        <ReelHighlight
                          tone={idx % 2 === 0 ? "linen" : "terracotta"}
                          variant="underline"
                          isHeading
                          delay={0.15}
                        >
                          {m.title}
                        </ReelHighlight>
                      </h3>
                      <p className="font-mono text-xs md:text-sm text-[#6E655F] font-bold mt-2">
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
              <h2
                data-mascot-target="true"
                className="display-section font-extrabold uppercase text-[#1E1916]"
              >
                Achievements &amp;{" "}
                <ReelHighlight
                  tone="linen"
                  variant="marker"
                  isHeading
                  delay={0.18}
                >
                  Certifications
                </ReelHighlight>
              </h2>
            </div>
            <p className="text-sm text-[#6E655F] max-w-md font-medium">
              Spotlight{" "}
              <ReelHighlight tone="terracotta" delay={0.2}>
                1st Prize victories
              </ReelHighlight>{" "}
              in AI &amp; Automation competitions alongside{" "}
              <ReelHighlight tone="sage" variant="underline" delay={0.35}>
                verified industry certifications
              </ReelHighlight>
              .
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
                        <h3
                          data-mascot-target="true"
                          className="font-display text-2xl md:text-3xl font-extrabold text-[#1E1916] mt-1"
                        >
                          <ReelHighlight
                            tone={idx === 0 ? "terracotta" : "sage"}
                            variant="underline"
                            isHeading
                            delay={0.2}
                          >
                            {win.title}
                          </ReelHighlight>
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
            <h2
              data-mascot-target="true"
              className="display-section font-extrabold uppercase text-[#1E1916]"
            >
              Ready to{" "}
              <ReelHighlight
                tone="terracotta"
                variant="underline"
                isHeading
                delay={0.18}
              >
                Build Together?
              </ReelHighlight>
            </h2>
            <p className="text-sm text-[#6E655F] max-w-xl font-medium">
              Whether it&apos;s a{" "}
              <ReelHighlight tone="terracotta" delay={0.2}>
                software engineering role
              </ReelHighlight>
              , backend architecture challenge, or{" "}
              <ReelHighlight tone="sage" variant="underline" delay={0.35}>
                AI project
              </ReelHighlight>
              —reach out anytime.
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
                rel="noreferrer me"
                className="flex items-center justify-between text-[#1E1916] hover:text-[#C96541] border-b border-[#1E1916]/10 pb-2.5 font-extrabold"
                aria-label="Srinivasa Reddy Sanikommu on GitHub"
              >
                <span>github.com/srinvasreddyy</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/srinivasreddysanikommu2/"
                target="_blank"
                rel="noreferrer me"
                className="flex items-center justify-between text-[#1E1916] hover:text-[#C96541] pt-1 font-extrabold"
                aria-label="Srinivasa Reddy Sanikommu on LinkedIn"
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