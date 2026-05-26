// Premium UI Tokens
export const THEMES = {
  dark: {
    bg: "#0B0E14",
    bgSidebar: "#0F1219",
    bgCard: "#161B22",
    bgPanel: "#0D1117",
    bgHover: "#1F2937",
    bgCode: "#010409",
    border: "#21262D",
    borderHi: "#30363D",
    text: "#F0F6FF",
    textSub: "#8B9FC4",
    textMuted: "#484F58",
    accent: "#3B82F6",
    accentDk: "#2563EB",
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  light: {
    type: "light",
    bg: "#F0F4F8", // Blueish white
    bgSidebar: "#E1E8F0",
    bgCard: "#FFFFFF",
    bgPanel: "#F8FAFC",
    bgHover: "#E2E8F0",
    bgCode: "#F1F5F9",
    border: "#D1D5DB",
    borderHi: "#9CA3AF",
    text: "#0F172A", // Deep Navy for high contrast
    textSub: "#334155",
    textMuted: "#64748B",
    accent: "#2563EB",
    accentDk: "#1D4ED8",
    shadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
  }
};

export const C_BASE = {
  blue: "#3B82F6",
  cyan: "#06B6D4",
  green: "#10B981",
  yellow: "#F59E0B",
  red: "#EF4444",
  purple: "#8B5CF6",
  pink: "#EC4899",
  orange: "#F97316",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  sans: "'Inter', 'DM Sans', system-ui, sans-serif",
  sidebarW: "280px",
  headerH: "64px",
};

// Default dynamic colors
export let C = { ...THEMES.dark, ...C_BASE };

export const TOPICS = [
  { id: "lifecycle",      num: "01", title: "Lifecycle Methods",      icon: "🔄", color: C_BASE.green },
  { id: "fundamentals",   num: "02", title: "React Fundamentals",     icon: "⚛️",  color: C_BASE.blue },
  { id: "hooks",          num: "03", title: "React Hooks",            icon: "🪝", color: C_BASE.cyan },
  { id: "components",     num: "04", title: "Components",             icon: "🧩", color: C_BASE.purple },
  { id: "state",          num: "05", title: "State Management",       icon: "📦", color: C_BASE.yellow },
  { id: "vdom",           num: "06", title: "Virtual DOM",            icon: "🌐", color: C_BASE.pink },
  { id: "performance",    num: "07", title: "Performance",            icon: "⚡", color: C_BASE.orange },
  { id: "statemgmt",      num: "08", title: "State Libraries",        icon: "🏪", color: C_BASE.red },
  { id: "routing",        num: "09", title: "Routing",                icon: "🛣️",  color: C_BASE.blue },
  { id: "datafetching",   num: "10", title: "Data Fetching",          icon: "📡", color: C_BASE.cyan },
  { id: "forms",          num: "11", title: "Forms & Validation",     icon: "📝", color: C_BASE.green },
  { id: "auth",           num: "12", title: "Auth & Authorization",   icon: "🔐", color: C_BASE.purple },
  { id: "testing",        num: "13", title: "Testing",                icon: "🧪", color: C_BASE.yellow },
  { id: "nextjs",         num: "14", title: "Next.js & Server",       icon: "🌑", color: "#64748b" },
  { id: "concurrent",     num: "15", title: "Concurrent React",       icon: "🔀", color: C_BASE.pink },
  { id: "architecture",   num: "16", title: "Architecture & Debug",   icon: "🏗️",  color: C_BASE.orange },
  { id: "react19",        num: "17", title: "React 19 (Advanced)",    icon: "🚀", color: C_BASE.cyan },
  { id: "sys_design",     num: "18", title: "System Design (FE)",     icon: "📐", color: C_BASE.purple },
  { id: "qa_theory",      num: "QA", title: "Theory Q&A Bank",      icon: "📚", color: C_BASE.purple },
];

export const JS_TOPICS = [
  { id: "js_fundamentals",  num: "01", title: "JS Fundamentals",        icon: "📜", color: C_BASE.yellow },
  { id: "js_functions_b",   num: "02", title: "Functions Basic",        icon: "🔧", color: C_BASE.blue },
  { id: "js_functions_a",   num: "03", title: "Functions Advanced",     icon: "🔮", color: C_BASE.purple },
  { id: "js_objects_class", num: "04", title: "Objects & Classes",      icon: "🏗️",  color: C_BASE.cyan },
  { id: "js_array_mastery", num: "05", title: "Array Mastery",          icon: "📊", color: C_BASE.green },
  { id: "js_async_core",    num: "06", title: "Async Core",             icon: "⏳", color: C_BASE.orange },
  { id: "js_async_modern",  num: "07", title: "Async Modern",           icon: "🚀", color: C_BASE.pink },
  { id: "js_modern_es6",    num: "08", title: "Modern Features",        icon: "🌟", color: C_BASE.blue },
  { id: "js_collections",   num: "09", title: "Collections",            icon: "🗃️",  color: C_BASE.purple },
  { id: "js_advanced_fp",   num: "10", title: "Functional Patterns",    icon: "🧩", color: C_BASE.cyan },
  { id: "js_optimization",  num: "11", title: "Performance Ops",        icon: "⚡", color: C_BASE.orange },
  { id: "js_dom_events",    num: "12", title: "DOM & Events",           icon: "🖱️",  color: C_BASE.green },
  { id: "js_browser_api",   num: "13", title: "Browser APIs",           icon: "🌐", color: C_BASE.blue },
  { id: "js_security",      num: "14", title: "Security & Errors",      icon: "🛡️",  color: C_BASE.red },
  { id: "js_tooling_ts",    num: "15", title: "Tooling & TS",           icon: "🛠️",  color: C_BASE.purple },
  { id: "js_interview",     num: "16", title: "Interview Challenges",   icon: "🏆", color: C_BASE.yellow },
  { id: "js_design_pats",   num: "17", title: "Design Patterns",        icon: "🎨", color: C_BASE.green },
  { id: "js_dsa",           num: "18", title: "Data Structures",        icon: "📊", color: C_BASE.blue },
  { id: "js_testing",       num: "19", title: "Testing & Clean Code",   icon: "🧪", color: C_BASE.cyan },
  { id: "js_sys_design",    num: "20", title: "Advanced Sys Design",    icon: "🏗️",  color: C_BASE.orange },
  { id: "js_resilience",    num: "21", title: "Resilience & Internals", icon: "🛡️",  color: C_BASE.pink },
  { id: "js_output_lab",    num: "22", title: "Mastery Output Lab",     icon: "🧠", color: C_BASE.green },
  { id: "js_prototypes",    num: "23", title: "Prototypes (3+ Years)",  icon: "⛓️", color: C_BASE.purple },
  { id: "js_internals",     num: "24", title: "V8 & Internals",         icon: "⚙️", color: C_BASE.orange },
  { id: "qa_theory",      num: "QA", title: "Theory Q&A Bank",      icon: "📚", color: C_BASE.purple },
];

export const INTERVIEW_TOPICS = [
  { id: "int_js", title: "JavaScript Coding", icon: "💻", color: C_BASE.yellow },
  { id: "int_react", title: "React Coding", icon: "⚛️", color: C_BASE.blue },
  { id: "int_sys", title: "System Design", icon: "📐", color: C_BASE.purple },
];

export const OTHER_ROUNDS_TOPICS = [
  { id: "int_manager", title: "Manager Round", icon: "👔", color: C_BASE.green },
  { id: "int_hr", title: "HR Round", icon: "🤝", color: C_BASE.pink },
  { id: "int_project", title: "Project Explanation", icon: "🚀", color: C_BASE.orange },
];

