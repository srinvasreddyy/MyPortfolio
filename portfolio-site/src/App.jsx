import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useScroll,
} from "framer-motion";
import {
  ArrowUpRight,
  Terminal,
  Activity,
  Lock,
  Sparkles,
  AlertTriangle,
  X,
  Play,
  RotateCcw,
  MapPin,
  Github,
  Linkedin,
  Zap,
  Copy,
  Check,
  GraduationCap,
  Briefcase,
  Award,
  Cpu,
  Bot,
} from "lucide-react";
import userPortrait from "../../Complete details/UserImage.png";

// ============================================================================
// CLEAR PLAIN-ENGLISH PROJECTS DATA (01 TO 06) — GROUNDED IN RESUMES & SPECS
// ============================================================================
const PROJECTS = [
  {
    id: "01",
    slug: "orderdabba",
    title: "OrderDabba / OrderNow",
    repo: "srinvasreddyy/od_backend",
    commit: "238367d86d13ef0ba469a7994b876445169ca95c",
    domain: "Food Delivery, Grocery & Table Booking Backend",
    year: "2026",
    role: "Backend Architect",
    stack: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Stripe Connect",
      "Razorpay Webhooks",
      "OpenStreetMap",
      "JWT / OAuth",
    ],
    metrics: [
      { label: "API MODULES", value: "17 Express Routers" },
      { label: "DATABASE MODELS", value: "12 Mongoose Schemas" },
      { label: "BOOKING SAFETY", value: "10-Min Auto-Lock" },
      { label: "DELIVERY LIMIT", value: "20.0 km Radius" },
    ],
    telemetryPreview:
      "Stops double-bookings automatically • Calculates exact delivery fees by distance • Verifies online payments safely",
    summary:
      "A complete multi-vendor food, grocery, and table reservation backend. It prevents two people from booking the same restaurant table at the same second, calculates accurate delivery charges using map distances, and processes Stripe Connect & Razorpay payments reliably.",
    architectureNodes: [
      {
        id: "client",
        title: "Role-Based Access Control",
        sub: "Customer | Restaurant | Delivery Partner | Admin",
        detail:
          "Secures 17 API route groups using JWT cookies and Google OAuth 2.0 so each user role only accesses its own data.",
      },
      {
        id: "slotlock",
        title: "Double-Booking Prevention (SlotLock)",
        sub: "Unique Table + Date + Time Lock",
        detail:
          "Holds a table for 10 minutes while the customer pays. If someone else clicks at the exact same millisecond, MongoDB blocks the duplicate and returns HTTP 409 Conflict.",
      },
      {
        id: "geo",
        title: "Map Distance & Bill Calculator",
        sub: "Haversine Formula (R = 6,371 km)",
        detail:
          "Finds the exact distance between restaurant and customer. Charges Rs. 30 for the first 3 km, Rs. 10/km after that, adds 5% GST, and blocks orders beyond 20 km.",
      },
      {
        id: "webhook",
        title: "Payment Webhook Verification",
        sub: "Razorpay & Stripe Connect Webhooks",
        detail:
          "Verifies payment signatures directly from the payment gateway so orders and table bookings confirm even if the user closes their browser.",
      },
    ],
    decisions: [
      {
        title: "Stopping Double Table Bookings (`SlotLock` Engine)",
        code: `// Unique index on tableId + date + time prevents race conditions
SlotLockSchema.index({ tableId: 1, date: 1, time: 1 }, { unique: true });
SlotLockSchema.index({ lockExpiresAt: 1 }, { expireAfterSeconds: 0 });

try {
  await SlotLock.create({
    tableId, date, time, bookingId,
    lockExpiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10-min hold
  });
} catch (err) {
  if (err.code === 11000) {
    await Booking.findByIdAndDelete(orphanBookingId);
    return res.status(409).json({ error: "Table is already being booked." });
  }
}`,
        explanation:
          "Instead of relying on slow checks in code, the database itself enforces a unique lock on the table, date, and time. Unpaid locks disappear automatically after 10 minutes, and confirmed bookings lock permanently.",
      },
      {
        title: "Transparent Distance-Based Delivery Billing",
        code: `const distanceKm = calculateHaversineDistance(restaurantCoords, userCoords);
if (distanceKm > 20.0) throw new Error("Outside 20 km delivery zone");

const deliveryFee = distanceKm <= 3 ? 30 : 30 + Math.ceil(distanceKm - 3) * 10;
const gst = Math.round((itemTotal - promoDiscount) * 0.05 * 100) / 100;
const grandTotal = (itemTotal - promoDiscount) + gst + deliveryFee + 5;`,
        explanation:
          "All bill calculations happen on the server using real coordinates from OpenStreetMap so delivery fees and taxes are always accurate.",
      },
    ],
  },
  {
    id: "02",
    slug: "insureai",
    title: "InsureAI (InsurePred)",
    repo: "srinvasreddyy/ai-health-insurance-manager",
    commit: "2991588d09e9d4c9833861e47e22ea20a89cd6ab",
    domain: "Health Insurance Cost Predictor & AI Advisor",
    year: "2026",
    role: "Full-Stack & ML Developer",
    stack: [
      "React 19",
      "Node.js / Express",
      "Python Flask",
      "Scikit-Learn",
      "Gemini 2.5 Flash",
      "MongoDB",
      "Postman",
    ],
    metrics: [
      { label: "TRAINING DATA", value: "1,338 Health Records" },
      { label: "BASE AVERAGE", value: "$13,270.42 / yr" },
      { label: "SMOKING IMPACT", value: "+$9,620.99 Weight" },
      { label: "AI ADVISOR", value: "Gemini 2.5 Flash" },
    ],
    telemetryPreview:
      "React Frontend + Node.js API + Python Flask ML Service • Instant insurance cost estimate & health tips",
    summary:
      "A 3-part web application that connects a React dashboard and Node.js backend to a Python Flask machine learning service. It predicts annual health insurance costs using a trained Scikit-Learn regression model and generates clear health & savings advice with Gemini 2.5 Flash.",
    architectureNodes: [
      {
        id: "react19",
        title: "React 19 Frontend Dashboard",
        sub: "Interactive Cost Breakdown UI",
        detail:
          "Lets users enter age, BMI, children, smoking status, and region to see how each factor changes their insurance premium.",
      },
      {
        id: "express5",
        title: "Node.js & MongoDB Backend",
        sub: "JWT + Google Login + 6-Digit Email OTP",
        detail:
          "Handles secure user accounts, validates request payloads, and saves past predictions in MongoDB for easy comparison.",
      },
      {
        id: "flaskml",
        title: "Python Flask ML Microservice",
        sub: "Scikit-Learn StandardScaler + Linear Regression",
        detail:
          "Runs the trained machine learning model on 8 health features to return fast, exact cost estimates.",
      },
      {
        id: "gemini",
        title: "Gemini 2.5 Flash Advisor",
        sub: "Personalized Actionable Recommendations",
        detail:
          "Explains the prediction in plain language and suggests practical lifestyle or plan changes to lower future premiums.",
      },
    ],
    decisions: [
      {
        title: "Real Trained Scikit-Learn Model Weights (n = 1,338)",
        code: `FEATURES  = ['age', 'bmi', 'children', 'sex', 'smoker', 'NW', 'SE', 'SW']
MEANS     = [39.207, 30.663, 1.095, 0.495, 0.205, 0.243, 0.272, 0.243]
SCALES    = [14.045,  6.096, 1.205, 0.500, 0.404, 0.429, 0.445, 0.429]
WEIGHTS   = [3607.47, 2067.69, 573.00, 92.96, 9620.99, -151.37, -460.76, -411.86]
INTERCEPT = 13270.42`,
        explanation:
          "The simulator uses the exact mathematical numbers learned by the Python Scikit-Learn model, so you can see how each health factor adds or subtracts dollars in real time.",
      },
    ],
  },
  {
    id: "03",
    slug: "resume-evaluator",
    title: "Stateful AI Resume Evaluator",
    repo: "srinvasreddyy/resume_evaluator",
    commit: "05a094f64dca9ac61c5ff4a5ee44faa7c6826adf",
    domain: "Smart LangGraph Agent for Resume Scoring & Interview Prep",
    year: "2026",
    role: "AI Agent Developer",
    stack: [
      "LangGraph",
      "Gemini 2.5 Flash",
      "Pydantic v2",
      "LangChain",
      "PyPDF",
      "Streamlit",
      "uv",
    ],
    metrics: [
      { label: "AGENT WORKFLOW", value: "LangGraph StateGraph" },
      { label: "SCORE CUTOFF", value: "70% ATS Threshold" },
      { label: "OUTPUT FORMAT", value: "Pydantic v2 JSON" },
      { label: "MODEL SETTING", value: "Temp 0.2 (Consistent)" },
    ],
    telemetryPreview:
      "Reads PDF Resume -> Scores against Job Description -> Below 70%: Action Plan | 70%+ : Custom Interview Questions",
    summary:
      "A multi-step AI agent built with LangGraph and Gemini 2.5 Flash. It reads a PDF resume, compares it to a job description, calculates an ATS match score, and automatically chooses the right next step: an improvement plan if the score is under 70%, or interview prep questions if it is 70% or higher.",
    architectureNodes: [
      {
        id: "ingest",
        title: "PDF Reader & State Setup",
        sub: "PyPDF + EvaluatorState",
        detail:
          "Extracts clean text from uploaded PDF resumes and prepares a structured memory state for the agent.",
      },
      {
        id: "analyze",
        title: "Step 1: Score & Skill Match",
        sub: "analyze_resume Node",
        detail:
          "Finds matching skills, missing skills, and assigns an ATS compatibility score from 0 to 100.",
      },
      {
        id: "router",
        title: "Smart Score Router",
        sub: "route_based_on_score (< 70 vs >= 70)",
        detail:
          "Checks the ATS score and directs the workflow down the most helpful path for the candidate.",
      },
      {
        id: "branch",
        title: "Step 2A / 2B: Action Plan or Interview Prep",
        sub: "Pydantic Structured Output",
        detail:
          "Creates 3–5 resume rewrite steps for scores under 70%, or tailored technical interview questions with hints for scores 70% and above.",
      },
    ],
    decisions: [
      {
        title: "Conditional Routing with LangGraph (`route_based_on_score`)",
        code: `def route_based_on_score(state: EvaluatorState):
    if state["ats_score"] < 70:
        return "generate_action_plan"
    return "generate_interview_prep"

workflow = StateGraph(EvaluatorState)
workflow.add_node("analyze_resume", analyze_resume_node)
workflow.add_node("generate_action_plan", action_plan_node)
workflow.add_node("generate_interview_prep", interview_prep_node)
workflow.add_conditional_edges("analyze_resume", route_based_on_score)`,
        explanation:
          "Instead of using one giant prompt, LangGraph splits the job into clear steps and guarantees clean, structured JSON output with Pydantic v2.",
      },
    ],
  },
  {
    id: "04",
    slug: "eventsync-ai",
    title: "EventSync AI",
    repo: "srinvasreddyy/eventsync-ai-voyagehack",
    commit: "tbo-voyagehack-3.0-release",
    domain: "Hotel Room Block Locking & Split-Billing Platform",
    year: "2025",
    role: "Backend Developer",
    stack: ["Redis", "Node.js", "Express", "React", "MongoDB", "Split-Billing"],
    metrics: [
      { label: "HACKATHON", value: "TBO VoyageHack 3.0" },
      { label: "LOCK SPEED", value: "< 2.1ms Redis Lock" },
      { label: "BILLING MODE", value: "Company + Guest Split" },
      { label: "ALERTS", value: "Unsold Room Warnings" },
    ],
    telemetryPreview:
      "Locks event room inventory in real time with Redis • Automatically splits bills between company sponsors and guests",
    summary:
      "Built for TBO VoyageHack 3.0 to manage large event hotel bookings. It uses Redis to lock room blocks in real time so travel agents never overbook, alerts organizers if rooms are going unused, and splits bills cleanly between corporate sponsors and individual guests.",
    architectureNodes: [
      {
        id: "redis",
        title: "Real-Time Room Lock (Redis)",
        sub: "Instant Inventory Protection",
        detail:
          "Holds room blocks in memory during checkout so two agents cannot grab the same rooms at once.",
      },
      {
        id: "attrition",
        title: "Contract Risk Alerts",
        sub: "Booking Pace Tracker",
        detail:
          "Warns event planners early if room bookings fall behind schedule so they avoid hotel penalty fees.",
      },
      {
        id: "split",
        title: "Automatic Split-Billing",
        sub: "Company Master Bill vs. Guest Bill",
        detail:
          "Routes room and tax charges to the company invoice while keeping room service and upgrades on the guest's personal bill.",
      },
    ],
    decisions: [
      {
        title: "Fast Redis Room Locking & Split Invoices",
        code: `const lockKey = \`inventory:block:\${eventId}:room:\${roomTypeId}\`;
const locked = await redis.set(lockKey, sessionId, "NX", "PX", 300000);
if (!locked) throw new Error("Room block is currently being booked by another agent.");`,
        explanation:
          "Redis handles high-traffic room holds in under 2 milliseconds while keeping corporate and personal expenses separated.",
      },
    ],
  },
  {
    id: "05",
    slug: "sentinai-deepfake",
    title: "SentinAI Deepfake Detection",
    repo: "srinvasreddyy/sentinai-cross-attentional-deepfake",
    commit: "research-publication-cv-vit",
    domain: "Deep Learning Research for Detecting Manipulated Videos",
    year: "2025",
    role: "Co-Author & ML Researcher",
    stack: [
      "PyTorch",
      "EfficientNet",
      "Vision Transformer (ViT)",
      "Frequency Analysis",
      "Cross-Attention",
    ],
    metrics: [
      { label: "SIGNAL 1", value: "Color Frequency (Cb/Cr)" },
      { label: "SIGNAL 2", value: "Face Lighting (Y-Channel)" },
      { label: "FUSION MODEL", value: "Cross-Attention ViT" },
      { label: "CO-AUTHORS", value: "S. Dhana Sri, V. Siri Chandana" },
    ],
    telemetryPreview:
      "Combines hidden color-frequency patterns with facial lighting details to spot AI-generated deepfake videos",
    summary:
      "Research paper ('A Cross-Attentional Fusion of Chrominance Frequency and Spatial Luminance for Deepfake Detection') that spots fake videos by looking at both visible facial details and hidden color-compression patterns using EfficientNet and Vision Transformers.",
    architectureNodes: [
      {
        id: "ycbcr",
        title: "Color & Lighting Separation",
        sub: "YCbCr Color Channels",
        detail:
          "Separates brightness (Y) from color channels (Cb, Cr) where AI video generators often leave subtle glitches.",
      },
      {
        id: "freq",
        title: "Frequency Pattern Scanner",
        sub: "2D-DCT Spectral Features",
        detail:
          "Detects unnatural grid patterns left behind when deepfake models generate faces.",
      },
      {
        id: "spatial",
        title: "Visual Feature Extractor",
        sub: "EfficientNet + Vision Transformer",
        detail:
          "Analyzes facial textures and geometry across frames.",
      },
      {
        id: "fusion",
        title: "Cross-Attention Fusion",
        sub: "Combining Both Signals",
        detail:
          "Connects frequency glitches with exact facial regions to make an accurate real-vs-fake decision.",
      },
    ],
    decisions: [
      {
        title: "Combining Color Frequency and Visual Features",
        code: `fused_features, attn_map = self.cross_attn(
    query=chrominance_frequency_features,
    key=spatial_luminance_features,
    value=spatial_luminance_features
)`,
        explanation:
          "Normal image classifiers miss deepfakes when videos are compressed for social media. Checking both color frequency and lighting keeps detection accurate.",
      },
    ],
  },
  {
    id: "06",
    slug: "enron-email-agent",
    title: "Enron AI Email Classifier",
    repo: "srinvasreddyy/enron-email-classification-agent",
    commit: "enron-1.43gb-imbalanced-nlp",
    domain: "Smart Email Sorting & Imbalanced Data ML Benchmark",
    year: "2025",
    role: "Machine Learning Engineer",
    stack: [
      "Python",
      "Scikit-Learn",
      "NLP",
      "Class Weighting",
      "Oversampling",
      "Gmail Automation",
    ],
    metrics: [
      { label: "RAW DATASET", value: "1.43 GB Enron Emails" },
      { label: "LABELED SAMPLE", value: "2,105 Emails (5 Categories)" },
      { label: "BEST ACCURACY", value: "88.9% (Oversampling)" },
      { label: "PERSONAL RECALL", value: "68.4% (Up from 10.5%)" },
    ],
    telemetryPreview:
      "Trained on 2,105 Enron emails across Work, Finance, Shopping, Promotions & Personal • Boosted rare-category detection by 6.5x",
    summary:
      "An email classification and inbox management system trained on the 1.43 GB Enron dataset. By applying class weighting and oversampling, it solved severe data imbalance—raising Personal email detection from 10.5% to 68.4% and reaching 88.9% overall accuracy.",
    architectureNodes: [
      {
        id: "corpus",
        title: "1.43 GB Dataset Preparation",
        sub: "2,105 Labeled Emails",
        detail:
          "Cleaned and grouped emails into Work (998), Finance (340), Shopping (326), Promotions (300), and Personal (141).",
      },
      {
        id: "imbalance",
        title: "Fixing Rare-Category Blindness",
        sub: "Baseline vs. Class Weighting vs. Oversampling",
        detail:
          "Tested three training methods to ensure rare Personal emails are not ignored by the model.",
      },
      {
        id: "agent",
        title: "Automated Inbox Organizer",
        sub: "Search, Filter & Auto-Archive",
        detail:
          "Uses the trained model to sort incoming mail and let users manage their inbox with simple commands.",
      },
    ],
    decisions: [
      {
        title: "Balancing Overall Accuracy vs. Rare-Category Detection",
        code: `BENCHMARK = {
  "Baseline":        { "accuracy": "87.3%", "macro_f1": 0.756, "personal_recall": "10.5%" },
  "Class Weighting": { "accuracy": "84.8%", "macro_f1": 0.816, "personal_recall": "68.4%" },
  "Oversampling":    { "accuracy": "88.9%", "macro_f1": 0.825, "personal_recall": "36.8%" }
}`,
        explanation:
          "Because 'Work' had 998 emails and 'Personal' had only 141, the baseline model missed 90% of Personal emails. Class weighting fixed Personal recall (68.4%), while oversampling delivered the best overall accuracy (88.9%).",
      },
    ],
  },
];

// ============================================================================
// CLEAR EDUCATION & EXPERIENCE TIMELINE DATA (FROM RESUMES)
// ============================================================================
const TIMELINE_ITEMS = [
  {
    period: "AUG 2025 – MAR 2026",
    type: "WORK EXPERIENCE",
    title: "Backend Developer Intern (Node.js / MERN)",
    organization: "KriBud Web Tech",
    badge: "35% Faster APIs",
    points: [
      "Built and maintained modular backend services for user login, multi-vendor order management, table reservations, and database operations using Node.js, Express.js, and MongoDB.",
      "Fixed slow database queries using MongoDB compound indexes and aggregation pipelines, cutting API response times and improving workflow efficiency by 35%.",
      "Integrated Stripe Connect and Razorpay webhooks with Postman test collections to handle concurrent user checkouts without duplicate orders.",
    ],
  },
  {
    period: "2023 – 2027 (EXPECTED)",
    type: "EDUCATION — B.TECH",
    title: "Bachelor of Technology in CSE (AI & Machine Learning)",
    organization: "R.V.R. & J.C. College of Engineering, Guntur",
    badge: "CGPA: 8.34 / 8.5",
    points: [
      "Core Coursework: Data Structures & Algorithms, Object-Oriented Programming (OOD), Operating Systems, Computer Networks, DBMS, and Complexity Analysis.",
      "1st Place Winner in the 'Deploy It' Mini-Hackathon at R.V.R. & J.C. College of Engineering and co-author on computer vision deepfake detection research.",
    ],
  },
  {
    period: "2021 – 2023",
    type: "EDUCATION — INTERMEDIATE",
    title: "Intermediate Education (MPC — Maths, Physics, Chemistry)",
    organization: "Sri Chaitanya Junior College, Narasaraopet",
    badge: "Score: 95.0%",
    points: [
      "Graduated with 95% distinction in Mathematics, Physics, and Chemistry, building a strong analytical foundation for algorithms and machine learning.",
    ],
  },
];

// ============================================================================
// CERTIFICATIONS LIST (EXACT NAMES FROM RESUMES)
// ============================================================================
const CERTIFICATIONS = [
  { name: "Cloud Engineering", issuer: "AWS Academy" },
  { name: "Node.js Complete Course", issuer: "GeeksforGeeks" },
  { name: "Certified React.JS Developer", issuer: "GeeksforGeeks" },
  { name: "Full-Stack Web Development", issuer: "Udemy" },
  { name: "Java Full Stack Training", issuer: "Wipro TalentNext" },
];

// ============================================================================
// INTERACTIVE WALKING PORTFOLIO MASCOT ("BYTE-BOT")
// ============================================================================
function WalkingMascot({ activeSection, onOpenProject }) {
  const [minimized, setMinimized] = useState(false);
  const { scrollYProgress } = useScroll();
  const [stepFrame, setStepFrame] = useState(0);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setStepFrame(Math.floor(v * 120) % 2);
    });
    return () => unsub();
  }, [scrollYProgress]);

  const sectionDialogues = {
    top: {
      title: "Hi! I'm Byte, Srinivasa's System Guide.",
      text: "Scroll down and I'll walk you through his projects, live calculators, timeline, and resume highlights!",
      cta: null,
    },
    work: {
      title: "01–06 Flagship Projects",
      text: "Click any project row to open its full case study, or hover to preview how the backend works.",
      cta: { label: "Open OrderDabba #01", action: () => onOpenProject(PROJECTS[0]) },
    },
    playground: {
      title: "Live Code Simulators!",
      text: "These aren't static screenshots—try clicking 'Fire 2x Simultaneous Bookings' or moving the sliders!",
      cta: null,
    },
    timeline: {
      title: "Education & Internship Timeline",
      text: "35% faster MongoDB queries at KriBud Web Tech, 8.34+ CGPA at RVR & JC, and 95% in Intermediate MPC!",
      cta: null,
    },
    credentials: {
      title: "Certifications, Research & Wins",
      text: "1st Place at VVIT Coding & RVR Deploy-It Hackathon, plus AWS & GeeksforGeeks certifications.",
      cta: null,
    },
  };

  const current = sectionDialogues[activeSection] || sectionDialogues.top;

  return (
    <div className="fixed bottom-5 right-5 z-[8500] flex items-end gap-3 select-none">
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        {!minimized && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-64 sm:w-72 bg-[#0E0E14]/95 backdrop-blur-md border border-vermilion/60 p-3.5 shadow-2xl text-xs space-y-2"
          >
            <div className="flex items-center justify-between border-b border-hairline pb-1.5">
              <span className="font-mono text-[10px] text-emerald font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-ping" />
                BYTE-BOT // TOUR GUIDE
              </span>
              <button
                onClick={() => setMinimized(true)}
                className="font-mono text-[10px] text-stone/40 hover:text-stone"
              >
                [HIDE]
              </button>
            </div>
            <div className="font-display font-bold text-stone text-sm">
              {current.title}
            </div>
            <p className="text-stone/75 leading-relaxed text-[11.5px]">
              {current.text}
            </p>
            {current.cta && (
              <button
                onClick={current.cta.action}
                className="w-full py-1.5 px-2.5 bg-vermilion text-obsidian font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-stone transition-colors"
              >
                {current.cta.label} &rarr;
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated SVG Walking Robot Mascot */}
      <button
        onClick={() => setMinimized((m) => !m)}
        title="Toggle Byte-Bot Guide"
        className="group relative w-16 h-16 rounded-full bg-[#0E0E14] border-2 border-vermilion flex items-center justify-center shadow-2xl hover:scale-105 transition-transform gpu-layer"
      >
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          {/* Antenna */}
          <line x1="32" y1="6" x2="32" y2="14" stroke="#FF3B1D" strokeWidth="2.5" />
          <circle cx="32" cy="5" r="3" fill="#10B981" />
          {/* Head */}
          <rect
            x="16"
            y="14"
            width="32"
            height="22"
            rx="5"
            fill="#08080A"
            stroke="#EFDED9"
            strokeWidth="2"
          />
          {/* Glowing Eyes */}
          <circle cx="25" cy="25" r="3" fill="#10B981" />
          <circle cx="39" cy="25" r="3" fill="#10B981" />
          {/* Smile / Telemetry bar */}
          <rect x="24" y="31" width="16" height="2" fill="#FF3B1D" />
          {/* Body */}
          <rect
            x="20"
            y="38"
            width="24"
            height="12"
            rx="3"
            fill="#1F1F24"
            stroke="#EFDED9"
            strokeWidth="1.5"
          />
          {/* Walking Legs (alternate with scroll) */}
          <line
            x1="26"
            y1="50"
            x2={stepFrame === 0 ? "23" : "28"}
            y2="60"
            stroke="#FF3B1D"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="38"
            y1="50"
            x2={stepFrame === 0 ? "41" : "36"}
            y2="60"
            stroke="#FF3B1D"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute -top-1 -left-1 bg-emerald text-obsidian font-mono text-[9px] font-bold px-1.5 py-0.2 rounded">
          GUIDE
        </span>
      </button>
    </div>
  );
}

// ============================================================================
// SIMULATOR 01: ORDERDABBA SLOTLOCK & DISTANCE BILL CALCULATOR
// ============================================================================
function OrderDabbaSimulator() {
  const [distanceKm, setDistanceKm] = useState(6.0);
  const [itemTotal, setItemTotal] = useState(650);
  const [promoDiscount, setPromoDiscount] = useState(100);
  const [lockState, setLockState] = useState("UNLOCKED");
  const [raceLogs, setRaceLogs] = useState([
    {
      ts: "READY",
      type: "info",
      msg: "Table TBL-04 is currently free. Click 'Test Simultaneous Booking' to see how the backend blocks double-booking.",
    },
  ]);

  const billing = useMemo(() => {
    const outOfRange = distanceKm > 20.0;
    const extraKm = Math.max(0, Math.ceil(distanceKm - 3));
    const deliveryFee = outOfRange ? 0 : distanceKm <= 3 ? 30 : 30 + extraKm * 10;
    const netItems = Math.max(0, itemTotal - promoDiscount);
    const gst = Math.round(netItems * 0.05 * 100) / 100;
    const platformFee = outOfRange ? 0 : 5;
    const grandTotal = outOfRange
      ? 0
      : Math.round((netItems + gst + deliveryFee + platformFee) * 100) / 100;

    return { outOfRange, deliveryFee, netItems, gst, platformFee, grandTotal };
  }, [distanceKm, itemTotal, promoDiscount]);

  const triggerRaceTest = () => {
    setLockState("LOCKED_TTL");
    setRaceLogs([
      {
        ts: "20:00:01.102",
        type: "info",
        msg: "User A & User B both click 'Book Table TBL-04 (8:00 PM)' at the exact same millisecond.",
      },
      {
        ts: "20:00:01.106",
        type: "win",
        msg: "User A succeeds! Table is locked for 10 minutes while User A completes payment.",
      },
      {
        ts: "20:00:01.107",
        type: "err",
        msg: "User B blocked by MongoDB Unique Index (Error 11000) -> Returns HTTP 409 Conflict (Zero double-booking!).",
      },
    ]);
  };

  const confirmPayment = () => {
    setLockState("CONFIRMED");
    setRaceLogs((prev) => [
      ...prev,
      {
        ts: "20:01:40.210",
        type: "win",
        msg: "Razorpay Webhook verified (HMAC-SHA256) -> Booking confirmed permanently (2099-01-01).",
      },
    ]);
  };

  const resetTable = () => {
    setLockState("UNLOCKED");
    setRaceLogs([
      {
        ts: "CRON_SWEEP",
        type: "info",
        msg: "5-minute cleanup job cleared expired holds. Table TBL-04 is open again.",
      },
    ]);
  };

  return (
    <div className="border border-hairline bg-[#0B0B0F] p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-vermilion block">
            // LIVE SIMULATOR 01 — ORDERDABBA BACKEND
          </span>
          <h4 className="font-display text-xl md:text-2xl font-bold text-stone mt-1">
            Double-Booking Blocker &amp; Delivery Bill Calculator
          </h4>
        </div>
        <span className="font-mono text-xs px-3 py-1 border border-emerald/40 bg-emerald/10 text-emerald">
          Node.js + MongoDB + Razorpay
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Table Lock Test */}
        <div className="border border-hairline p-5 bg-obsidian/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-stone/80 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-vermilion" />
              A. Table Reservation Race-Condition Test
            </span>
            <span
              className={`font-mono text-[11px] px-2 py-0.5 border ${
                lockState === "UNLOCKED"
                  ? "border-stone/30 text-stone/60"
                  : lockState === "LOCKED_TTL"
                  ? "border-vermilion text-vermilion bg-vermilion/10"
                  : "border-emerald text-emerald bg-emerald/10"
              }`}
            >
              {lockState === "UNLOCKED" && "TABLE FREE"}
              {lockState === "LOCKED_TTL" && "HELD FOR 10 MINS"}
              {lockState === "CONFIRMED" && "BOOKING CONFIRMED"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={triggerRaceTest}
              className="flex-1 bg-vermilion text-obsidian font-mono text-xs font-bold uppercase py-2.5 px-4 hover:bg-stone transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" /> Test Simultaneous Booking
            </button>
            <button
              onClick={confirmPayment}
              disabled={lockState === "UNLOCKED"}
              className="border border-emerald/50 text-emerald font-mono text-xs uppercase py-2.5 px-3 hover:bg-emerald/10 disabled:opacity-30"
            >
              Confirm Payment
            </button>
            <button
              onClick={resetTable}
              className="border border-hairline text-stone/70 font-mono text-xs py-2.5 px-3 hover:border-stone"
              title="Reset Table"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#050507] border border-hairline p-3.5 font-mono text-xs space-y-2 min-h-[135px]">
            {raceLogs.map((l, i) => (
              <div key={i} className="leading-relaxed">
                <span className="text-stone/35 mr-2">[{l.ts}]</span>
                <span
                  className={
                    l.type === "err"
                      ? "text-vermilion font-semibold"
                      : l.type === "win"
                      ? "text-emerald"
                      : "text-stone/80"
                  }
                >
                  {l.msg}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Distance & Bill Calculator */}
        <div className="border border-hairline p-5 bg-obsidian/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-stone/80 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald" />
              B. Delivery Distance &amp; GST Bill Calculator
            </span>
            <span
              className={`font-mono text-xs font-bold px-2 py-0.5 ${
                billing.outOfRange
                  ? "bg-vermilion/20 text-vermilion border border-vermilion"
                  : "bg-emerald/15 text-emerald border border-emerald/40"
              }`}
            >
              {billing.outOfRange ? "OUTSIDE 20 KM ZONE" : "DELIVERY AVAILABLE"}
            </span>
          </div>

          <div>
            <div className="flex justify-between font-mono text-xs mb-1.5">
              <span className="text-stone/60">CUSTOMER DISTANCE FROM RESTAURANT</span>
              <span className="text-stone font-bold">{distanceKm.toFixed(1)} km</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="25.0"
              step="0.5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between font-mono text-[10px] text-stone/40 mt-1">
              <span>1 km (₹30 Base &le;3km)</span>
              <span>10 km (+₹10/km)</span>
              <span className="text-vermilion">20 km Cutoff</span>
            </div>
          </div>

          <div className="border-t border-hairline pt-3 font-mono text-xs space-y-1.5">
            {billing.outOfRange ? (
              <div className="p-3 border border-vermilion/50 bg-vermilion/10 text-vermilion text-center">
                Order blocked: {distanceKm.toFixed(1)} km is beyond the 20 km delivery limit.
              </div>
            ) : (
              <>
                <div className="flex justify-between text-stone/70">
                  <span>Food Total (₹{itemTotal} - ₹{promoDiscount} Promo)</span>
                  <span>₹{billing.netItems.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone/70">
                  <span>Delivery Fee ({distanceKm <= 3 ? "First 3km Base" : `₹30 + ${Math.ceil(distanceKm - 3)}km × ₹10`})</span>
                  <span>₹{billing.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone/70">
                  <span>GST (5%) + Platform Fee (₹5)</span>
                  <span>₹{(billing.gst + billing.platformFee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-emerald border-t border-hairline pt-2 mt-1">
                  <span>FINAL PAYABLE AMOUNT</span>
                  <span>₹{billing.grandTotal.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SIMULATOR 02: INSUREAI HEALTH INSURANCE PREMIUM CALCULATOR
// ============================================================================
function InsureAISimulator() {
  const [age, setAge] = useState(32);
  const [bmi, setBmi] = useState(26.5);
  const [children, setChildren] = useState(1);
  const [sex, setSex] = useState(1);
  const [smoker, setSmoker] = useState(0);
  const [region, setRegion] = useState("northeast");

  const inference = useMemo(() => {
    const raw = {
      age,
      bmi,
      children,
      sex,
      smoker,
      region_northwest: region === "northwest" ? 1 : 0,
      region_southeast: region === "southeast" ? 1 : 0,
      region_southwest: region === "southwest" ? 1 : 0,
    };

    const specs = [
      { key: "age", label: "Age", mu: 39.207, sigma: 14.045, beta: 3607.47 },
      { key: "bmi", label: "BMI", mu: 30.663, sigma: 6.096, beta: 2067.69 },
      { key: "children", label: "Children", mu: 1.095, sigma: 1.205, beta: 573.0 },
      { key: "smoker", label: "Smoker Status", mu: 0.205, sigma: 0.404, beta: 9620.99 },
    ];

    const allSpecs = [
      ...specs,
      { key: "sex", label: "Sex", mu: 0.495, sigma: 0.5, beta: 92.96 },
      { key: "region_northwest", label: "NW Region", mu: 0.243, sigma: 0.429, beta: -151.37 },
      { key: "region_southeast", label: "SE Region", mu: 0.272, sigma: 0.445, beta: -460.76 },
      { key: "region_southwest", label: "SW Region", mu: 0.243, sigma: 0.429, beta: -411.86 },
    ];

    let total = 13270.42;
    const contributions = allSpecs.map((s) => {
      const z = (raw[s.key] - s.mu) / s.sigma;
      const usdImpact = s.beta * z;
      total += usdImpact;
      return { ...s, z, usdImpact };
    });

    return { rawTotal: total, contributions: contributions.slice(0, 4) };
  }, [age, bmi, children, sex, smoker, region]);

  return (
    <div className="border border-hairline bg-[#0B0B0F] p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-vermilion block">
            // LIVE SIMULATOR 02 — INSUREAI (MERN + PYTHON FLASK ML)
          </span>
          <h4 className="font-display text-xl md:text-2xl font-bold text-stone mt-1">
            Real-Time Health Insurance Premium Predictor
          </h4>
        </div>
        <span className="font-mono text-xs px-3 py-1 border border-emerald/40 bg-emerald/10 text-emerald">
          Trained on 1,338 Records
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 border border-hairline p-5 bg-obsidian/80 space-y-4">
          <div>
            <div className="flex justify-between font-mono text-xs mb-1">
              <span className="text-stone/60">AGE</span>
              <span className="text-stone font-bold">{age} Years</span>
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
              <span className="text-stone/60">BODY MASS INDEX (BMI)</span>
              <span className="text-stone font-bold">{bmi.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="16.0"
              max="48.0"
              step="0.5"
              value={bmi}
              onChange={(e) => setBmi(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="font-mono text-[10px] text-stone/50 block mb-1">
                SMOKER?
              </span>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                <button
                  onClick={() => setSmoker(0)}
                  className={`py-2 border ${
                    smoker === 0
                      ? "border-emerald bg-emerald/15 text-emerald font-bold"
                      : "border-hairline text-stone/60"
                  }`}
                >
                  No
                </button>
                <button
                  onClick={() => setSmoker(1)}
                  className={`py-2 border ${
                    smoker === 1
                      ? "border-vermilion bg-vermilion text-obsidian font-bold"
                      : "border-hairline text-stone/60"
                  }`}
                >
                  Yes
                </button>
              </div>
            </div>

            <div>
              <span className="font-mono text-[10px] text-stone/50 block mb-1">
                CHILDREN ({children})
              </span>
              <div className="grid grid-cols-4 gap-1 font-mono text-xs">
                {[0, 1, 2, 3].map((c) => (
                  <button
                    key={c}
                    onClick={() => setChildren(c)}
                    className={`py-2 border ${
                      children === c
                        ? "border-stone bg-stone text-obsidian font-bold"
                        : "border-hairline text-stone/60"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 border border-hairline p-5 bg-obsidian/80 flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-3">
            <div>
              <span className="font-mono text-[11px] text-stone/50 block">
                ESTIMATED ANNUAL INSURANCE COST
              </span>
              <div className="font-mono text-3xl md:text-4xl font-bold text-emerald mt-1">
                ${inference.rawTotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <span className="text-xs text-stone/50 font-normal ml-2">/ year</span>
              </div>
            </div>
            <span className="font-mono text-xs text-stone/50">
              Base Average: $13,270.42
            </span>
          </div>

          <div className="space-y-2.5">
            <span className="font-mono text-[10px] text-stone/40 uppercase block">
              HOW EACH FACTOR CHANGES YOUR PRICE:
            </span>
            {inference.contributions.map((c) => {
              const isPos = c.usdImpact >= 0;
              const pct = Math.min(100, (Math.abs(c.usdImpact) / 19000) * 100);
              return (
                <div key={c.key} className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone/80">{c.label}</span>
                    <span className={isPos ? "text-vermilion" : "text-emerald"}>
                      {isPos ? "+" : "-"}${Math.abs(c.usdImpact).toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-hairline">
                    <div
                      className={`h-full ${isPos ? "bg-vermilion" : "bg-emerald"}`}
                      style={{ width: `${Math.max(3, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border border-hairline bg-[#060609] p-3 font-mono text-xs text-stone/80">
            <span className="text-vermilion font-bold mr-2">AI HEALTH TIP:</span>
            {smoker === 1
              ? "Quitting smoking is the #1 way to lower your premium—saving over $23,000 per year."
              : bmi >= 30
              ? "Bringing BMI under 25.0 can reduce your estimated annual premium by ~$3,100."
              : "Great health profile! Being a non-smoker with a balanced BMI keeps your rate well below average."}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SIMULATOR 03: LANGGRAPH RESUME EVALUATOR ROUTER
// ============================================================================
function ResumeEvaluatorSimulator() {
  const [atsScore, setAtsScore] = useState(64);
  const isPassing = atsScore >= 70;

  return (
    <div className="border border-hairline bg-[#0B0B0F] p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-vermilion block">
            // LIVE SIMULATOR 03 — LANGGRAPH RESUME AGENT
          </span>
          <h4 className="font-display text-xl md:text-2xl font-bold text-stone mt-1">
            Smart Score Router (70% ATS Cutoff)
          </h4>
        </div>
        <span
          className={`font-mono text-xs px-3 py-1 border ${
            isPassing
              ? "border-emerald bg-emerald/10 text-emerald"
              : "border-vermilion bg-vermilion/10 text-vermilion"
          }`}
        >
          {isPassing ? "PATH: INTERVIEW PREP (>=70%)" : "PATH: RESUME IMPROVEMENT PLAN (<70%)"}
        </span>
      </div>

      <div className="border border-hairline p-5 bg-obsidian/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <span className="text-stone/70">
            SLIDE THE RESUME ATS SCORE TO SEE HOW THE AI AGENT SWITCHES PATHS:
          </span>
          <span
            className={`text-2xl font-bold ${
              isPassing ? "text-emerald" : "text-vermilion"
            }`}
          >
            {atsScore}% Match
          </span>
        </div>
        <input
          type="range"
          min="20"
          max="98"
          value={atsScore}
          onChange={(e) => setAtsScore(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`p-5 border transition-colors ${
            !isPassing
              ? "border-vermilion bg-vermilion/10"
              : "border-hairline bg-obsidian/40 opacity-50"
          }`}
        >
          <div className="font-mono text-xs text-vermilion font-bold">
            NODE 2A • IF SCORE &lt; 70% (generate_action_plan)
          </div>
          <h5 className="font-display text-lg font-bold text-stone mt-1">
            Step-by-Step Resume Improvement Plan
          </h5>
          <ul className="mt-3 space-y-2 text-xs text-stone/80 font-mono">
            <li>1. Highlight MongoDB compound indexing (35% faster queries).</li>
            <li>2. Add direct GitHub links for InsureAI and OrderNow APIs.</li>
            <li>3. Include missing keywords from the target job description.</li>
          </ul>
        </div>

        <div
          className={`p-5 border transition-colors ${
            isPassing
              ? "border-emerald bg-emerald/10"
              : "border-hairline bg-obsidian/40 opacity-50"
          }`}
        >
          <div className="font-mono text-xs text-emerald font-bold">
            NODE 2B • IF SCORE &ge; 70% (generate_interview_prep)
          </div>
          <h5 className="font-display text-lg font-bold text-stone mt-1">
            Custom Technical Interview Questions
          </h5>
          <ul className="mt-3 space-y-2 text-xs text-stone/80 font-mono">
            <li>Q1: How did you reduce MongoDB API latency by 35% at KriBud Web Tech?</li>
            <li>Q2: How does your Node.js gateway talk to the Python Flask ML service?</li>
            <li>Q3: How do you handle Stripe / Razorpay webhook retries safely?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PORTFOLIO APPLICATION (60FPS GPU-ACCELERATED)
// ============================================================================
export default function App() {
  const [preloaderCount, setPreloaderCount] = useState(0);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [isProjectHover, setIsProjectHover] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeSection, setActiveSection] = useState("top");

  // 60FPS+ Hardware-Accelerated Framer Motion Springs for Cursor (Zero React Re-renders on Move)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springConfig = { damping: 28, stiffness: 420, mass: 0.35 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  // Preloader 000 -> 100
  useEffect(() => {
    let cur = 0;
    const timer = setInterval(() => {
      cur += 16;
      if (cur >= 100) {
        setPreloaderCount(100);
        clearInterval(timer);
        setTimeout(() => setPreloaderDone(true), 300);
      } else {
        setPreloaderCount(cur);
      }
    }, 45);
    return () => clearInterval(timer);
  }, []);

  // Section Spy for Walking Mascot Guide
  useEffect(() => {
    const ids = ["top", "work", "playground", "timeline", "credentials"];
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
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setActiveProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const copyEmail = () => {
    navigator.clipboard?.writeText("sanikommusrinivasareddy2@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen bg-obsidian text-stone selection:bg-vermilion selection:text-obsidian relative">
      {/* =================================================================== */}
      {/* ULTRA-RESPONSIVE 60FPS GPU CUSTOM CURSOR                            */}
      {/* =================================================================== */}
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        className="fixed top-0 left-0 w-2.5 h-2.5 -ml-1.5 -mt-1.5 rounded-full bg-vermilion pointer-events-none z-[10000] hidden md:block gpu-layer"
      />
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center gpu-layer"
      >
        <div
          className={`rounded-full flex items-center justify-center transition-transform duration-200 ${
            isProjectHover
              ? "w-24 h-24 -ml-12 -mt-12 bg-vermilion text-obsidian scale-100"
              : "w-9 h-9 -ml-4.5 -mt-4.5 border border-stone/40 scale-100"
          }`}
        >
          {isProjectHover && (
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-center leading-tight px-2">
              OPEN
              <br />
              STUDY &nearr;
            </span>
          )}
        </div>
      </motion.div>

      {/* WALKING PORTFOLIO MASCOT ("BYTE-BOT") */}
      <WalkingMascot
        activeSection={activeSection}
        onOpenProject={(proj) => setActiveProject(proj)}
      />

      {/* =================================================================== */}
      {/* CINEMATIC PRELOADER                                                 */}
      {/* =================================================================== */}
      <AnimatePresence>
        {!preloaderDone && (
          <motion.div
            key="preloader"
            initial={{ y: 0 }}
            exit={{
              y: "-100%",
              transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
            }}
            className="fixed inset-0 z-[9500] bg-obsidian flex flex-col justify-between p-6 md:p-12 border-b border-vermilion gpu-layer"
          >
            <div className="flex justify-between items-center font-mono text-xs text-stone/50">
              <span>SRINIVASA REDDY SANIKOMMU // PORTFOLIO</span>
              <span className="text-emerald">LOADING PROJECTS &amp; SIMULATORS</span>
            </div>

            <div className="my-auto text-center space-y-3">
              <div className="font-mono text-xs md:text-sm tracking-[0.25em] text-vermilion uppercase">
                SRINIVASA REDDY // AI &amp; BACKEND DEVELOPER
              </div>
              <div className="font-display text-3xl md:text-6xl font-extrabold tracking-tight text-stone">
                SCALABLE BACKENDS &amp; PRACTICAL AI
              </div>
            </div>

            <div className="flex items-end justify-between border-t border-hairline pt-6">
              <div className="font-mono text-6xl md:text-8xl font-bold text-stone leading-none">
                {String(preloaderCount).padStart(3, "0")}
                <span className="text-vermilion text-3xl md:text-5xl">%</span>
              </div>
              <div className="font-mono text-xs text-stone/40 text-right">
                GUNTUR, ANDHRA PRADESH • B.TECH CSE (AI &amp; ML)
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================================================================== */}
      {/* TOP NAVIGATION BAR                                                  */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 bg-obsidian/90 backdrop-blur-md border-b border-hairline">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          <a
            href="#top"
            className="font-mono text-xs uppercase tracking-widest flex items-center gap-2.5 text-stone hover:text-vermilion transition-colors"
          >
            <span className="w-2 h-2 bg-vermilion inline-block" />
            <span className="font-bold">SRINIVASA REDDY</span>
          </a>

          <nav className="hidden md:flex items-center gap-7 font-mono text-xs uppercase tracking-wider text-stone/70">
            <a href="#work" className="hover:text-vermilion transition-colors">
              01. Projects
            </a>
            <a href="#playground" className="hover:text-vermilion transition-colors">
              02. Live Simulators
            </a>
            <a href="#timeline" className="hover:text-vermilion transition-colors">
              03. Experience &amp; Education
            </a>
            <a href="#credentials" className="hover:text-vermilion transition-colors">
              04. Certifications &amp; Wins
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 border border-emerald/40 bg-emerald/10 text-emerald">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              OPEN FOR SOFTWARE &amp; AI ROLES
            </span>
            <a
              href="mailto:sanikommusrinivasareddy2@gmail.com"
              className="font-mono text-xs uppercase bg-stone text-obsidian font-bold px-3.5 py-1.5 hover:bg-vermilion transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* HERO SECTION WITH USER PORTRAIT & CLEAN HEADLINE                    */}
      {/* =================================================================== */}
      <section id="top" className="border-b border-hairline relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 pt-12 pb-20 md:pt-20 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 8 Columns: Headline + Bio + CTAs */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-3 py-1 border border-hairline bg-[#0D0D12] text-vermilion">
                <Activity className="w-3.5 h-3.5 text-emerald" />
                AI &amp; Machine Learning Engineer • Node.js &amp; Python Backend Developer
              </div>

              <h1 className="display-hero font-extrabold uppercase text-stone">
                SRINIVASA
                <br />
                <span className="text-vermilion">REDDY</span> SANIKOMMU
              </h1>

              <p className="text-base md:text-lg text-stone/85 font-body leading-relaxed max-w-2xl">
                Computer Science &amp; Engineering (AI &amp; ML) undergraduate at{" "}
                <span className="text-stone font-semibold">
                  R.V.R. &amp; J.C. College of Engineering
                </span>{" "}
                with production internship experience at{" "}
                <span className="text-stone font-semibold">KriBud Web Tech</span>. I build fast, reliable{" "}
                <span className="text-emerald font-medium">
                  Node.js &amp; Python microservices
                </span>
                ,{" "}
                <span className="text-stone font-medium">
                  payment-integrated REST APIs
                </span>
                , and{" "}
                <span className="text-vermilion font-medium">
                  practical AI agents
                </span>{" "}
                that solve real-world problems.
              </p>

              {/* Key Resume Highlights Strip */}
              <div className="grid grid-cols-3 gap-3 max-w-xl pt-2 font-mono">
                <div className="p-3 border border-hairline bg-[#0B0B10]">
                  <span className="text-[10px] text-stone/40 block">API OPTIMIZATION</span>
                  <span className="text-lg md:text-xl font-bold text-emerald">35% Faster</span>
                </div>
                <div className="p-3 border border-hairline bg-[#0B0B10]">
                  <span className="text-[10px] text-stone/40 block">B.TECH CSE (AI &amp; ML)</span>
                  <span className="text-lg md:text-xl font-bold text-stone">8.34+ CGPA</span>
                </div>
                <div className="p-3 border border-hairline bg-[#0B0B10]">
                  <span className="text-[10px] text-stone/40 block">MPC INTERMEDIATE</span>
                  <span className="text-lg md:text-xl font-bold text-vermilion">95.0% Score</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#work"
                  className="bg-vermilion text-obsidian font-mono text-xs font-bold uppercase tracking-wider px-6 py-3.5 hover:bg-stone transition-colors flex items-center gap-2"
                >
                  View 01–06 Projects <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="#timeline"
                  className="border border-stone/40 text-stone font-mono text-xs uppercase tracking-wider px-5 py-3.5 hover:border-vermilion hover:text-vermilion transition-colors"
                >
                  Education &amp; Experience Timeline
                </a>
                <a
                  href="https://github.com/srinvasreddyy"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-hairline text-stone/80 font-mono text-xs uppercase px-4 py-3.5 hover:border-stone transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/srinivasreddysanikommu2/"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-hairline text-stone/80 font-mono text-xs uppercase px-4 py-3.5 hover:border-stone transition-colors flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>

            {/* Right 4 Columns: Personal Portrait Card */}
            <div className="lg:col-span-4">
              <div className="relative border-2 border-hairline bg-[#0C0C12] p-4 group hover:border-vermilion transition-colors">
                <div className="flex items-center justify-between font-mono text-[10px] text-stone/50 pb-3">
                  <span>DEVELOPER ID // @srinvasreddyy</span>
                  <span className="text-emerald">GUNTUR, INDIA</span>
                </div>

                <div className="relative aspect-[4/5] w-full overflow-hidden bg-obsidian border border-hairline">
                  <img
                    src={userPortrait}
                    onError={(e) => {
                      e.currentTarget.src = "/user.png";
                    }}
                    alt="Srinivasa Reddy Sanikommu"
                    className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-65" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-emerald block">CLASS OF 2027</span>
                      <span className="font-bold text-stone">Srinivasa Reddy</span>
                    </div>
                    <span className="px-2 py-0.5 bg-vermilion text-obsidian text-[10px] font-bold">
                      AI &amp; BACKEND
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 font-mono text-[11px]">
                  <div className="p-2 bg-obsidian border border-hairline">
                    <span className="text-stone/40 text-[9px] block">CORE STACK</span>
                    <span className="text-stone">MERN + Python Flask</span>
                  </div>
                  <div className="p-2 bg-obsidian border border-hairline">
                    <span className="text-stone/40 text-[9px] block">AI / ML</span>
                    <span className="text-emerald">Scikit-Learn &amp; LangGraph</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smooth 60fps Infinite Skills Ticker */}
        <div className="border-t border-hairline bg-[#060609] py-3 overflow-hidden">
          <div className="animate-marquee font-mono text-xs uppercase tracking-widest text-stone/50 flex items-center gap-10">
            {[...Array(2)].map((_, idx) => (
              <React.Fragment key={idx}>
                <span>NODE.JS &amp; EXPRESS.JS</span>
                <span className="text-vermilion">•</span>
                <span>PYTHON &amp; FLASK ML MICROSERVICES</span>
                <span className="text-emerald">•</span>
                <span>MONGODB COMPOUND INDEXING &amp; AGGREGATION</span>
                <span className="text-vermilion">•</span>
                <span>STRIPE CONNECT &amp; RAZORPAY WEBHOOKS</span>
                <span className="text-emerald">•</span>
                <span>LANGGRAPH STATEFUL AI AGENTS</span>
                <span className="text-vermilion">•</span>
                <span>REACT.JS &amp; TAILWIND CSS</span>
                <span className="text-emerald">•</span>
                <span>DATA STRUCTURES &amp; ALGORITHMS</span>
                <span className="text-vermilion">•</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 01. SELECTED PROJECTS INDEX (01 TO 06)                              */}
      {/* =================================================================== */}
      <section id="work" className="border-b border-hairline py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6 pb-12 border-b border-hairline">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-vermilion block mb-2">
                // 01 — SELECTED PROJECTS (CLICK ANY PROJECT FOR DEEP DIVE)
              </span>
              <h2 className="display-section font-extrabold uppercase text-stone">
                FEATURED WORK (01—06)
              </h2>
            </div>
            <p className="font-mono text-xs text-stone/60 max-w-md">
              Hover any row for a quick summary or click to open the interactive case study and code breakdown.
            </p>
          </div>

          <div className="divide-y divide-hairline">
            {PROJECTS.map((project) => {
              const isHovered = hoveredProject?.id === project.id;
              return (
                <div
                  key={project.id}
                  onMouseEnter={() => {
                    setHoveredProject(project);
                    setIsProjectHover(true);
                  }}
                  onMouseLeave={() => {
                    setHoveredProject(null);
                    setIsProjectHover(false);
                  }}
                  onClick={() => {
                    setIsProjectHover(false);
                    setActiveProject(project);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setActiveProject(project);
                  }}
                  className="group py-7 md:py-9 transition-colors hover:bg-[#0E0E14] px-3 -mx-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-1 font-mono text-sm md:text-base text-vermilion font-bold">
                      /{project.id}
                    </div>

                    <div className="md:col-span-4">
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-stone group-hover:text-vermilion transition-colors flex items-center gap-2.5">
                        {project.title}
                        <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-vermilion" />
                      </h3>
                      <span className="font-mono text-[11px] text-stone/45 block mt-1">
                        {project.repo}
                      </span>
                    </div>

                    <div className="md:col-span-4 font-body text-sm text-stone/80">
                      {project.domain}
                    </div>

                    <div className="md:col-span-2 flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[10px] px-2 py-0.5 border border-hairline bg-obsidian text-stone/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="md:col-span-1 md:text-right font-mono text-xs text-emerald">
                      {project.year}
                    </div>
                  </div>

                  {isHovered && (
                    <div className="mt-4 border border-hairline bg-obsidian px-4 py-3 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                      <span className="text-stone/80">
                        <strong className="text-emerald mr-2">HIGHLIGHT:</strong>
                        {project.telemetryPreview}
                      </span>
                      <span className="text-vermilion font-bold uppercase">
                        [Open Case Study &rarr;]
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 02. INTERACTIVE PROJECT SIMULATORS                                  */}
      {/* =================================================================== */}
      <section id="playground" className="border-b border-hairline py-20 md:py-28 bg-[#060608]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 space-y-14">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald block mb-2">
                // 02 — HANDS-ON INTERACTIVE DEMOS
              </span>
              <h2 className="display-section font-extrabold uppercase text-stone">
                TEST MY BACKEND &amp; AI LOGIC LIVE
              </h2>
            </div>
            <p className="font-mono text-xs text-stone/60 max-w-md">
              Try out the actual logic behind my top 3 projects right here in your browser.
            </p>
          </div>

          <OrderDabbaSimulator />
          <InsureAISimulator />
          <ResumeEvaluatorSimulator />
        </div>
      </section>

      {/* =================================================================== */}
      {/* 03. CLEAR VISUAL TIMELINE: INTERNSHIP & EDUCATION                   */}
      {/* =================================================================== */}
      <section
        id="timeline"
        className="bg-stone text-ink border-b border-ink/15 py-20 md:py-28"
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 space-y-14">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/20 pb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-vermilion font-bold block mb-2">
                // 03 — CHRONOLOGICAL JOURNEY (2021 — 2027)
              </span>
              <h2 className="display-section font-extrabold uppercase text-ink">
                EXPERIENCE &amp; EDUCATION TIMELINE
              </h2>
            </div>
            <p className="font-mono text-xs text-ink/70 max-w-md">
              A clear step-by-step timeline of my production backend internship, B.Tech degree in AI &amp; ML, and academic foundation.
            </p>
          </div>

          {/* Vertical Connected Timeline */}
          <div className="relative pl-6 md:pl-10 border-l-2 border-ink space-y-12">
            {TIMELINE_ITEMS.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Timeline Node Dot */}
                <div className="absolute -left-[33px] md:-left-[49px] top-1.5 w-4 h-4 bg-vermilion border-2 border-ink" />

                <div className="border-2 border-ink bg-[#F5E9E5] p-6 md:p-8 shadow-[6px_6px_0px_#111111] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-ink text-stone font-bold">
                        {item.period}
                      </span>
                      <span className="text-vermilion font-bold uppercase">
                        // {item.type}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-vermilion text-stone font-bold">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-extrabold text-ink">
                      {item.title}
                    </h3>
                    <div className="font-mono text-sm font-bold text-ink/75 mt-0.5">
                      {item.organization}
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm text-ink/85 leading-relaxed list-disc pl-5">
                    {item.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 04. CERTIFICATIONS (NAMES ONLY), RESEARCH & HACKATHON WINS          */}
      {/* =================================================================== */}
      <section id="credentials" className="border-b border-hairline py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 space-y-16">
          {/* Certifications Strip (Clean Names as Requested) */}
          <div className="space-y-6">
            <div className="border-b border-hairline pb-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-vermilion block mb-1">
                  // 04 — VERIFIED CREDENTIALS
                </span>
                <h2 className="display-section font-extrabold uppercase text-stone">
                  CERTIFICATIONS
                </h2>
              </div>
              <span className="font-mono text-xs text-emerald">
                AWS • GeeksforGeeks • Udemy • Wipro
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {CERTIFICATIONS.map((cert, i) => (
                <div
                  key={i}
                  className="border border-hairline bg-[#0B0B10] p-5 hover:border-vermilion transition-colors flex flex-col justify-between gap-3"
                >
                  <Award className="w-5 h-5 text-vermilion" />
                  <div>
                    <div className="font-display text-base font-bold text-stone leading-snug">
                      {cert.name}
                    </div>
                    <div className="font-mono text-xs text-stone/50 mt-1">
                      {cert.issuer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research & Hackathon Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 border border-hairline bg-[#0B0B10] p-7 space-y-4">
              <span className="font-mono text-xs text-vermilion uppercase tracking-widest block">
                // PUBLISHED RESEARCH WORK
              </span>
              <h3 className="font-display text-2xl font-bold text-stone leading-snug">
                &ldquo;A Cross-Attentional Fusion of Chrominance Frequency and Spatial Luminance for Deepfake Detection&rdquo;
              </h3>
              <p className="font-mono text-xs text-stone/55">
                Co-Authors: S. Dhana Sri, V. Siri Chandana, Srinivasa Reddy Sanikommu
              </p>
              <p className="text-sm text-stone/80 leading-relaxed">
                Combines color-frequency analysis with EfficientNet and Vision Transformers (ViT) to detect manipulated deepfake videos accurately even after video compression.
              </p>
            </div>

            <div className="lg:col-span-5 border border-hairline bg-[#0B0B10] p-7 space-y-4">
              <span className="font-mono text-xs text-emerald uppercase tracking-widest block">
                // AWARDS &amp; NATIONAL HACKATHONS
              </span>
              <div className="space-y-3 divide-y divide-hairline text-sm">
                <div className="pt-1">
                  <span className="font-mono text-xs text-vermilion font-bold block">
                    1ST PLACE WINNER
                  </span>
                  <span className="font-bold text-stone">
                    Competitive Coding Competition — VVIT
                  </span>
                </div>
                <div className="pt-3">
                  <span className="font-mono text-xs text-vermilion font-bold block">
                    1ST PLACE WINNER
                  </span>
                  <span className="font-bold text-stone">
                    Deploy It Mini-Hackathon — R.V.R. &amp; J.C. College of Engineering
                  </span>
                </div>
                <div className="pt-3">
                  <span className="font-mono text-xs text-emerald font-bold block">
                    NATIONAL COMPETITIONS
                  </span>
                  <span className="text-stone/80 text-xs font-mono">
                    Flipkart GRiD 8.0 (Round 2 Qualifier) • TBO VoyageHack 3.0 • Statathon 2025 • Smart India Hackathon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* FOOTER / CONTACT                                                    */}
      {/* =================================================================== */}
      <footer className="py-20 bg-obsidian">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 space-y-10">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-vermilion block mb-2">
              // GET IN TOUCH
            </span>
            <h2 className="display-section font-extrabold uppercase text-stone">
              LET&apos;S BUILD SOMETHING <span className="text-vermilion">GREAT</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-6 border border-hairline bg-[#0B0B0F] space-y-3">
              <span className="text-stone/40 block">EMAIL</span>
              <div className="text-sm text-stone font-bold break-all">
                sanikommusrinivasareddy2@gmail.com
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={copyEmail}
                  className="px-3 py-1.5 bg-stone text-obsidian font-bold uppercase flex items-center gap-1.5 hover:bg-vermilion transition-colors"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedEmail ? "Copied" : "Copy"}
                </button>
                <a
                  href="mailto:sanikommusrinivasareddy2@gmail.com"
                  className="px-3 py-1.5 border border-hairline text-stone hover:border-vermilion"
                >
                  Send Email &rarr;
                </a>
              </div>
            </div>

            <div className="p-6 border border-hairline bg-[#0B0B0F] space-y-2">
              <span className="text-stone/40 block">PHONE &amp; LOCATION</span>
              <div className="text-lg text-stone font-bold">+91 6304089289</div>
              <div className="text-emerald">Guntur, Andhra Pradesh, India</div>
            </div>

            <div className="p-6 border border-hairline bg-[#0B0B0F] space-y-2">
              <span className="text-stone/40 block">PROFILES</span>
              <a
                href="https://github.com/srinvasreddyy"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-stone hover:text-vermilion border-b border-hairline pb-2"
              >
                <span>github.com/srinvasreddyy</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/srinivasreddysanikommu2/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-stone hover:text-vermilion pt-1"
              >
                <span>linkedin.com/in/srinivasreddysanikommu2</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* FULL-SCREEN PROJECT CASE STUDY MODAL (B2 LAYOUT)                    */}
      {/* =================================================================== */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9200] bg-obsidian/95 backdrop-blur-xl overflow-y-auto"
          >
            <div className="sticky top-0 z-30 bg-obsidian border-b border-hairline px-5 md:px-10 h-16 flex items-center justify-between">
              <div className="font-mono text-xs flex items-center gap-3">
                <span className="text-vermilion font-bold">
                  PROJECT //{activeProject.id}
                </span>
                <span className="text-stone font-bold">{activeProject.title}</span>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="bg-vermilion text-obsidian font-mono text-xs font-bold uppercase px-4 py-1.5 flex items-center gap-1.5 hover:bg-stone"
              >
                <X className="w-4 h-4" /> Close [ESC]
              </button>
            </div>

            <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Sticky Info */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 border border-hairline bg-[#0B0B10] p-6 space-y-5">
                <div>
                  <span className="font-mono text-xs text-vermilion">
                    PROJECT {activeProject.id} • {activeProject.year}
                  </span>
                  <h2 className="font-display text-3xl font-extrabold text-stone mt-1">
                    {activeProject.title}
                  </h2>
                  <p className="font-mono text-xs text-emerald mt-1">
                    {activeProject.domain}
                  </p>
                </div>

                <p className="text-sm text-stone/80 leading-relaxed">
                  {activeProject.summary}
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  {activeProject.metrics.map((m, i) => (
                    <div key={i} className="p-3 bg-obsidian border border-hairline">
                      <span className="font-mono text-[9px] text-stone/40 block">
                        {m.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-stone">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {activeProject.stack.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[11px] px-2.5 py-1 border border-hairline bg-obsidian text-stone/80"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:col-span-8 space-y-10">
                {activeProject.id === "01" && <OrderDabbaSimulator />}
                {activeProject.id === "02" && <InsureAISimulator />}
                {activeProject.id === "03" && <ResumeEvaluatorSimulator />}

                <div className="space-y-4">
                  <div className="font-mono text-xs uppercase tracking-widest text-vermilion">
                    // SYSTEM WORKFLOW STEPS
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeProject.architectureNodes.map((n, i) => (
                      <div
                        key={n.id}
                        className="border border-hairline bg-[#0B0B10] p-5 space-y-1.5"
                      >
                        <span className="font-mono text-xs text-vermilion font-bold">
                          STEP 0{i + 1}
                        </span>
                        <h4 className="font-display text-lg font-bold text-stone">
                          {n.title}
                        </h4>
                        <div className="font-mono text-[11px] text-emerald">
                          {n.sub}
                        </div>
                        <p className="text-xs text-stone/75 leading-relaxed pt-1">
                          {n.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="font-mono text-xs uppercase tracking-widest text-vermilion">
                    // KEY CODE &amp; IMPLEMENTATION DETAILS
                  </div>
                  {activeProject.decisions.map((d, i) => (
                    <div
                      key={i}
                      className="border border-hairline bg-[#0B0B10] p-6 space-y-3"
                    >
                      <h4 className="font-display text-xl font-bold text-stone">
                        {d.title}
                      </h4>
                      <pre className="bg-[#050507] border border-hairline p-4 font-mono text-xs text-emerald overflow-x-auto">
                        {d.code}
                      </pre>
                      <p className="text-sm text-stone/80 leading-relaxed">
                        {d.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}