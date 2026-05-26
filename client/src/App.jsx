import { useState, useCallback, useMemo, useEffect } from "react";
import { 
  LayoutDashboard, Atom, FileJson, Library, 
  Activity, Code2, Workflow, Boxes, Database, Layers, Zap, Share2, GitMerge, Globe,
  AppWindow, Shield, FileCheck, Server, Combine, Cpu, Rocket, GitCompare,
  Terminal, Variable, Braces, Gauge, Fingerprint, Binary,
  ChevronDown, ChevronRight
} from "lucide-react";
import { THEMES, C_BASE, TOPICS, JS_TOPICS, INTERVIEW_TOPICS, OTHER_ROUNDS_TOPICS } from "./constants";
import { Btn, ToastProvider, ErrorBoundary, ThemeCtx } from "./shared";
import { fetchProgress, toggleProgress } from "./api";
import Auth from "./Auth";

// React Topics
import T01_Lifecycle from "./topics/T01_Lifecycle";
import T02_Fundamentals from "./topics/T02_Fundamentals";
import T03_Hooks from "./topics/T03_Hooks";
import T04_Components from "./topics/T04_Components";
import T05_State from "./topics/T05_State";
import T06_VirtualDOM from "./topics/T06_VirtualDOM";
import T07_Performance from "./topics/T07_Performance";
import T08_StateLibraries from "./topics/T08_StateLibraries";
import T09_Routing from "./topics/T09_Routing";
import T10_DataFetching from "./topics/T10_DataFetching";
import T11_Forms from "./topics/T11_Forms";
import T12_Auth from "./topics/T12_Auth";
import T13_Testing from "./topics/T13_Testing";
import T14_NextJS from "./topics/T14_NextJS";
import T15_ConcurrentReact from "./topics/T15_ConcurrentReact";
import T16_Architecture from "./topics/T16_Architecture";
import T17_React19 from "./topics/T17_React19";
import T18_SystemDesign from "./topics/T18_SystemDesign";
import QA_Theory from "./topics/QA_Theory";

// Interview Topics
import INTERVIEW_JS from "./topics/INTERVIEW_JS";
import INTERVIEW_REACT from "./topics/INTERVIEW_REACT";
import INTERVIEW_SYS from "./topics/INTERVIEW_SYS";
import INTERVIEW_MANAGER from "./topics/INTERVIEW_MANAGER";
import INTERVIEW_HR from "./topics/INTERVIEW_HR";
import INTERVIEW_PROJECT from "./topics/INTERVIEW_PROJECT";


// JavaScript Topics
import JS01_Fundamentals from "./topics/js/JS01_Fundamentals";
import JS02_Functions_Basic from "./topics/js/JS02_Functions_Basic";
import JS03_Functions_Adv from "./topics/js/JS03_Functions_Adv";
import JS04_Objects_Classes from "./topics/js/JS04_Objects_Classes";
import JS05_Array_Mastery from "./topics/js/JS05_Array_Mastery";
import JS06_Async_Core from "./topics/js/JS06_Async_Core";
import JS07_Async_Modern from "./topics/js/JS07_Async_Modern";
import JS08_Modern_Features from "./topics/js/JS08_Modern_Features";
import JS09_Collections from "./topics/js/JS09_Collections";
import JS10_Functional_Patterns from "./topics/js/JS10_Functional_Patterns";
import JS11_Optimization from "./topics/js/JS11_Optimization";
import JS12_DOM_Events from "./topics/js/JS12_DOM_Events";
import JS13_Browser_APIs from "./topics/js/JS13_Browser_APIs";
import JS14_Security_BestPractices from "./topics/js/JS14_Security_BestPractices";
import JS15_Tooling_TS from "./topics/js/JS15_Tooling_TS";
import JS16_Interview_Coding from "./topics/js/JS16_Interview_Coding";
import JS17_Design_Patterns from "./topics/js/JS17_Design_Patterns";
import JS18_DSA_Logic from "./topics/js/JS18_DSA_Logic";
import JS19_Testing_CleanCode from "./topics/js/JS19_Testing_CleanCode";
import JS20_System_Design from "./topics/js/JS20_System_Design";
import JS21_Resilience from "./topics/js/JS21_Resilience";
import JS22_Output_Lab from "./topics/js/JS22_Output_Lab";
import JS23_Prototypes_DeepDive from "./topics/js/JS23_Prototypes_DeepDive";
import JS24_Internals from "./topics/js/JS24_Internals";

const PAGE_MAP = {
  home: null,
  lifecycle: T01_Lifecycle, fundamentals: T02_Fundamentals, hooks: T03_Hooks,
  components: T04_Components, state: T05_State, vdom: T06_VirtualDOM, performance: T07_Performance,
  statemgmt: T08_StateLibraries, routing: T09_Routing, datafetching: T10_DataFetching,
  forms: T11_Forms, auth: T12_Auth, testing: T13_Testing,
  nextjs: T14_NextJS, concurrent: T15_ConcurrentReact, architecture: T16_Architecture,
  react19: T17_React19, sys_design: T18_SystemDesign,
  js_fundamentals: JS01_Fundamentals, js_functions_b: JS02_Functions_Basic,
  js_functions_a: JS03_Functions_Adv, js_objects_class: JS04_Objects_Classes,
  js_array_mastery: JS05_Array_Mastery, js_async_core: JS06_Async_Core,
  js_async_modern: JS07_Async_Modern, js_modern_es6: JS08_Modern_Features,
  js_collections: JS09_Collections, js_advanced_fp: JS10_Functional_Patterns,
  js_optimization: JS11_Optimization, js_dom_events: JS12_DOM_Events,
  js_browser_api: JS13_Browser_APIs, js_security: JS14_Security_BestPractices,
  js_tooling_ts: JS15_Tooling_TS, js_interview: JS16_Interview_Coding,
  js_design_pats: JS17_Design_Patterns, js_dsa: JS18_DSA_Logic,
  js_testing: JS19_Testing_CleanCode, js_sys_design: JS20_System_Design,
  js_resilience: JS21_Resilience, js_output_lab: JS22_Output_Lab,
  js_prototypes: JS23_Prototypes_DeepDive, js_internals: JS24_Internals,
  qa_theory: QA_Theory,
  int_js: INTERVIEW_JS, int_react: INTERVIEW_REACT, int_sys: INTERVIEW_SYS,
  int_manager: INTERVIEW_MANAGER, int_hr: INTERVIEW_HR, int_project: INTERVIEW_PROJECT,
};


// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trace_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('trace_user', JSON.stringify(user));
    else localStorage.removeItem('trace_user');
  }, [user]);

  const [page, setPage] = useState("home");
  const [theme, setTheme] = useState("light");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [completed, setCompleted] = useState({ REACT: [], JS: [] });
  const [progressLoaded, setProgressLoaded] = useState(false);

  // Expanded state for accordion menus - Initially CLOSED
  const [expandedSections, setExpandedSections] = useState({
    react: false,
    js: false,
    coding: false,
    rounds: false
  });


  const toggleSection = (sec) => {
    setExpandedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const C = useMemo(() => ({ ...THEMES[theme], ...C_BASE }), [theme]);

  // Load saved progress from MongoDB on mount
  useEffect(() => {
    if (user) {
      fetchProgress().then(data => {
        setCompleted({ REACT: data.REACT || [], JS: data.JS || [] });
        setProgressLoaded(true);
      });
    }
  }, [user]);

  // (Early return moved below hooks to satisfy React Rules of Hooks)

  const allReactTopics = TOPICS.filter(t => t.id !== "qa_theory");
  const allJsTopics = JS_TOPICS.filter(t => t.id !== "qa_theory");
  const qaTopic = TOPICS.find(t => t.id === "qa_theory");
  const allInterviewTopics = INTERVIEW_TOPICS;

  const totalTopics = allReactTopics.length + allJsTopics.length + allInterviewTopics.length + 1;
  const completedCount = new Set([...completed.REACT, ...completed.JS, ...(completed.CODING || [])]).size;


  const percentReact = Math.round((completed.REACT.length / allReactTopics.length) * 100) || 0;
  const percentJS = Math.round((completed.JS.length / allJsTopics.length) * 100) || 0;
  const percentTotal = Math.round((completedCount / totalTopics) * 100) || 0;

  // markDone calls backend toggle API and updates local state from response
  const markDone = useCallback(async id => {
    const isReact = TOPICS.some(t => t.id === id);
    const isJS = JS_TOPICS.some(t => t.id === id);
    const module = isReact ? "REACT" : isJS ? "JS" : "CODING";


    // Optimistic local update
    setCompleted(p => ({
      ...p,
      [module]: (p[module] || []).includes(id) ? p[module].filter(x => x !== id) : [...(p[module] || []), id]
    }));
    // Persist to MongoDB (Assuming toggleProgress handles other modules or we just use local for new ones)
    const updated = await toggleProgress(module, id);
    if (updated) setCompleted({ REACT: updated.REACT, JS: updated.JS, CODING: updated.CODING || [] });
  }, []);


  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const PageComp = PAGE_MAP[page];
  const currentTopic = [...TOPICS, ...JS_TOPICS, ...INTERVIEW_TOPICS].find(t => t.id === page);

  const getSubTopicIcon = (id, color, isActive) => {
    return <ChevronRight size={14} strokeWidth={3} color={isActive ? "#007a55" : color} style={{ marginRight: 6, opacity: 0.8 }} />;
  };

  return (
    <ThemeCtx.Provider value={C}>
      <ToastProvider themeC={C}>
        <div style={{ display: "flex", height: "100vh", width: "100vw", background: C.bg, color: C.text, fontFamily: C.sans, overflow: "hidden" }}>
          <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: ${C.borderHi}; border-radius: 10px; }
          .sh-hover:hover { background: ${C.bgHover}; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideInLeftBar {
            0% { height: 0%; top: 50%; }
            100% { height: 100%; top: 0%; }
          }
          @keyframes activeIconPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); }
          }
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.3; }
            100% { opacity: 0.6; }
          }
          
          /* Rich Text Constraints */
          .rich-text-content img, .ql-editor img, .qa-answer img { 
            max-width: 100% !important; 
            max-height: 450px !important; 
            width: auto !important;
            height: auto !important;
            border-radius: 8px; 
            object-fit: contain; 
            object-position: left;
            margin: 16px 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }
          .rich-text-content, .ql-editor, .qa-answer {
            word-wrap: break-word;
            overflow-wrap: anywhere;
          }
        `}</style>

          {/* SIDEBAR */}
          <div style={{
            width: sidebarOpen ? C.sidebarW : 0,
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background: C.bgSidebar,
            borderRight: `1px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 100,
            overflow: "hidden",
          }}>
            <div style={{ height: C.headerH, padding: "0 20px", display: "flex", alignItems: "center", minWidth: C.sidebarW }}>
              {/* Logo row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 24 }}>🦨</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>Trace</div>
              </div>
            </div>

            {/* Topic list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", minWidth: C.sidebarW }}>

              {/* DASHBOARD Link */}
              <div onClick={() => setPage("home")} className={page === "home" ? "" : "sh-hover"} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px",
                borderRadius: 10, cursor: "pointer", marginBottom: 12, position: "relative",
                background: "transparent"
              }}>
                {page === "home" && <div style={{ position: "absolute", left: -12, top: 0, bottom: 0, width: 4, background: "#007a55", borderRadius: "0 4px 4px 0", animation: "slideInLeftBar 0.3s ease forwards" }} />}
                <LayoutDashboard size={18} color={page === "home" ? "#007a55" : C.text} style={{ animation: page === "home" ? "activeIconPulse 0.5s ease" : "none" }} />
                <span style={{ flex: 1, fontSize: 10, fontWeight: 600, color: page === "home" ? "#007a55" : C.text, textTransform: "uppercase", letterSpacing: 1 }}>Dashboard</span>
              </div>

              {/* REACT Section Dropdown */}
              <div onClick={() => toggleSection('react')} className={expandedSections.react ? "" : "sh-hover"} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px",
                borderRadius: 10, cursor: "pointer", marginTop: 8, position: "relative",
                background: "transparent"
              }}>
                {expandedSections.react && <div style={{ position: "absolute", left: -12, top: 0, bottom: 0, width: 4, background: C.blue, borderRadius: "0 4px 4px 0", animation: "slideInLeftBar 0.3s ease forwards" }} />}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Atom size={18} color={expandedSections.react ? C.blue : C.text} style={{ animation: expandedSections.react ? "activeIconPulse 0.5s ease" : "none" }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: expandedSections.react ? C.blue : C.text, textTransform: "uppercase", letterSpacing: 1 }}>React</span>
                </div>
                <ChevronDown size={14} strokeWidth={3} color={C.textMuted} style={{ transform: expandedSections.react ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
              </div>

              {expandedSections.react && (
                <div style={{ paddingLeft: 12, borderLeft: `2px solid ${C.border}`, marginLeft: 18, marginTop: 8, marginBottom: 16, display: "flex", flexDirection: "column", gap: 2 }}>
                  {allReactTopics.map(t => {
                    const isActive = page === t.id;
                    const isDone = completed.REACT.includes(t.id);
                    return (
                      <div key={t.id} onClick={() => setPage(t.id)} className={isActive ? "" : "sh-hover"}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                          borderRadius: 10, cursor: "pointer",
                          background: "transparent",
                          color: isActive ? "#007a55" : C.text,
                          transition: "all 0.15s",
                        }}>
                        {getSubTopicIcon(t.id, t.color, isActive)}
                        <div style={{ flex: 1, fontSize: 12, fontWeight: isActive ? 600 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                        {isDone && <span style={{ color: C.green, fontSize: 12 }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* JS Section Dropdown */}
              <div onClick={() => toggleSection('js')} className={expandedSections.js ? "" : "sh-hover"} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px",
                borderRadius: 10, cursor: "pointer", marginTop: 8, position: "relative",
                background: "transparent"
              }}>
                {expandedSections.js && <div style={{ position: "absolute", left: -12, top: 0, bottom: 0, width: 4, background: C.yellow, borderRadius: "0 4px 4px 0", animation: "slideInLeftBar 0.3s ease forwards" }} />}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FileJson size={18} color={expandedSections.js ? C.yellow : C.text} style={{ animation: expandedSections.js ? "activeIconPulse 0.5s ease" : "none" }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: expandedSections.js ? C.yellow : C.text, textTransform: "uppercase", letterSpacing: 1 }}>JS Code</span>
                </div>
                <ChevronDown size={14} strokeWidth={3} color={C.textMuted} style={{ transform: expandedSections.js ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
              </div>

              {expandedSections.js && (
                <div style={{ paddingLeft: 12, borderLeft: `2px solid ${C.border}`, marginLeft: 18, marginTop: 8, marginBottom: 16, display: "flex", flexDirection: "column", gap: 2 }}>
                  {allJsTopics.map(t => {
                    const isActive = page === t.id;
                    const isDone = completed.JS.includes(t.id);
                    return (
                      <div key={t.id} onClick={() => setPage(t.id)} className={isActive ? "" : "sh-hover"}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                          borderRadius: 10, cursor: "pointer",
                          background: "transparent",
                          color: isActive ? "#007a55" : C.text,
                          transition: "all 0.15s",
                        }}>
                        {getSubTopicIcon(t.id, t.color, isActive)}
                        <div style={{ flex: 1, fontSize: 12, fontWeight: isActive ? 600 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                        {isDone && <span style={{ color: C.green, fontSize: 12 }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CODING INTERVIEWS Section Dropdown */}
              <div onClick={() => toggleSection('coding')} className={expandedSections.coding ? "" : "sh-hover"} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px",
                borderRadius: 10, cursor: "pointer", marginTop: 8, position: "relative",
                background: "transparent"
              }}>
                {expandedSections.coding && <div style={{ position: "absolute", left: -12, top: 0, bottom: 0, width: 4, background: C.purple, borderRadius: "0 4px 4px 0", animation: "slideInLeftBar 0.3s ease forwards" }} />}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Code2 size={18} color={expandedSections.coding ? C.purple : C.text} style={{ animation: expandedSections.coding ? "activeIconPulse 0.5s ease" : "none" }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: expandedSections.coding ? C.purple : C.text, textTransform: "uppercase", letterSpacing: 1 }}>Coding Interviews</span>
                </div>
                <ChevronDown size={14} strokeWidth={3} color={C.textMuted} style={{ transform: expandedSections.coding ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
              </div>

              {expandedSections.coding && (
                <div style={{ paddingLeft: 12, borderLeft: `2px solid ${C.border}`, marginLeft: 18, marginTop: 8, marginBottom: 16, display: "flex", flexDirection: "column", gap: 2 }}>
                  {allInterviewTopics.map(t => {
                    const isActive = page === t.id;
                    const isDone = (completed.CODING || []).includes(t.id);
                    return (
                      <div key={t.id} onClick={() => setPage(t.id)} className={isActive ? "" : "sh-hover"}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                          borderRadius: 10, cursor: "pointer",
                          background: "transparent",
                          color: isActive ? "#007a55" : C.text,
                          transition: "all 0.15s",
                        }}>
                        {getSubTopicIcon(t.id, t.color, isActive)}
                        <div style={{ flex: 1, fontSize: 12, fontWeight: isActive ? 600 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                        {isDone && <span style={{ color: C.green, fontSize: 12 }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              )}
{/* INTERVIEW ROUNDS Section Dropdown */}
<div onClick={() => toggleSection('rounds')} className={expandedSections.rounds ? "" : "sh-hover"} style={{
  display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px",
  borderRadius: 10, cursor: "pointer", marginTop: 8, position: "relative",
  background: "transparent"
}}>
  {expandedSections.rounds && <div style={{ position: "absolute", left: -12, top: 0, bottom: 0, width: 4, background: C.orange, borderRadius: "0 4px 4px 0", animation: "slideInLeftBar 0.3s ease forwards" }} />}
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <Zap size={18} color={expandedSections.rounds ? C.orange : C.text} style={{ animation: expandedSections.rounds ? "activeIconPulse 0.5s ease" : "none" }} />
    <span style={{ fontSize: 10, fontWeight: 600, color: expandedSections.rounds ? C.orange : C.text, textTransform: "uppercase", letterSpacing: 1 }}>Interview Rounds</span>
  </div>
  <ChevronDown size={14} strokeWidth={3} color={C.textMuted} style={{ transform: expandedSections.rounds ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
</div>

{expandedSections.rounds && (
  <div style={{ paddingLeft: 12, borderLeft: `2px solid ${C.border}`, marginLeft: 18, marginTop: 8, marginBottom: 16, display: "flex", flexDirection: "column", gap: 2 }}>
    {OTHER_ROUNDS_TOPICS.map(t => {
      const isActive = page === t.id;
      const isDone = (completed.CODING || []).includes(t.id);
      return (
        <div key={t.id} onClick={() => setPage(t.id)} className={isActive ? "" : "sh-hover"} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
          borderRadius: 10, cursor: "pointer",
          background: "transparent",
          color: isActive ? "#007a55" : C.text,
          transition: "all 0.15s",
        }}>
          {getSubTopicIcon(t.id, t.color, isActive)}
          <div style={{ flex: 1, fontSize: 12, fontWeight: isActive ? 600 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
          {isDone && <span style={{ color: C.green, fontSize: 12 }}>✓</span>}
        </div>
      );
    })}
  </div>
)}

              {/* QA Section (Direct Link) */}
              <div onClick={() => setPage(qaTopic.id)} className={page === qaTopic.id ? "" : "sh-hover"} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px",
                borderRadius: 10, cursor: "pointer", marginTop: 8, position: "relative",
                background: "transparent"
              }}>
                {page === qaTopic.id && <div style={{ position: "absolute", left: -12, top: 0, bottom: 0, width: 4, background: "#007a55", borderRadius: "0 4px 4px 0", animation: "slideInLeftBar 0.3s ease forwards" }} />}
                <Library size={18} color={page === qaTopic.id ? "#007a55" : C.text} style={{ animation: page === qaTopic.id ? "activeIconPulse 0.5s ease" : "none" }} />
                <span style={{ flex: 1, fontSize: 10, fontWeight: 600, color: page === qaTopic.id ? "#007a55" : C.text, textTransform: "uppercase", letterSpacing: 1 }}>Theory Q & A Bank</span>
                {(completed.REACT.includes(qaTopic.id) || completed.JS.includes(qaTopic.id)) && <span style={{ color: C.green, fontSize: 12 }}>✓</span>}
              </div>

            </div>


          </div>

          {/* MAIN CONTENT */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            {/* HEADER */}
            <header id="main-header" style={{
              height: C.headerH,
              display: "flex", alignItems: "center", padding: "0 24px",
              background: "#007a55",
              color: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              zIndex: 10,
              gap: 16,
            }}>
              {/* Hamburger Icon */}
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ☰
              </button>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, opacity: 0.7, fontWeight: 600, letterSpacing: 1 }}>DASHBOARD</span>
                <span style={{ fontSize: 11, opacity: 0.7 }}>/</span>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>{page.toUpperCase()}</span>
              </div>

              <Btn variant="outline" size="xs" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} style={{ borderRadius: 10, color: "white", borderColor: "rgba(255,255,255,0.3)" }}>
                {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
              </Btn>

              {/* Profile Logo & Logout */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, marginLeft: 16, paddingLeft: 16, borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                <div 
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} 
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{user.name}</span>
                    <span style={{ fontSize: 10, opacity: 0.7 }}>Student</span>
                  </div>
                  <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 4, transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                </div>

                {profileOpen && (
                  <div style={{ 
                    position: 'absolute', top: '100%', right: 0, marginTop: 12, 
                    background: C.bgCard, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.15)', 
                    border: `1px solid ${C.border}`, overflow: 'hidden', minWidth: 160, zIndex: 100 
                  }}>
                    <button 
                      onClick={() => { setUser(null); setProfileOpen(false); }} 
                      style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', color: '#cc0000', textAlign: 'left', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                      className="sh-hover"
                    >
                      <span style={{ fontSize: 16 }}>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            </header>

            <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "32px", position: "relative" }}>
              <div style={{ maxWidth: 1000, margin: "0 auto", animation: "fadeIn 0.4s ease-out" }}>
                {page === "home" ? (
                  // ── DASHBOARD VIEW ──
                  !progressLoaded ? (
                    <div>
                      <div style={{ marginBottom: 40 }}>
                        <div style={{ height: 40, width: 300, background: C.border, borderRadius: 8, animation: "pulse 1.5s infinite ease-in-out", marginBottom: 12 }}></div>
                        <div style={{ height: 20, width: 400, background: C.border, borderRadius: 8, animation: "pulse 1.5s infinite ease-in-out" }}></div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
                         <div style={{ background: C.bgCard, height: 160, borderRadius: 20, border: `1px solid ${C.border}`, animation: "pulse 1.5s infinite ease-in-out" }}></div>
                         <div style={{ background: C.bgCard, height: 160, borderRadius: 20, border: `1px solid ${C.border}`, animation: "pulse 1.5s infinite ease-in-out", animationDelay: "0.1s" }}></div>
                         <div style={{ background: C.bgCard, height: 160, borderRadius: 20, border: `1px solid ${C.border}`, animation: "pulse 1.5s infinite ease-in-out", animationDelay: "0.2s" }}></div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                         <div style={{ background: C.bgCard, height: 200, borderRadius: 20, border: `1px solid ${C.border}`, animation: "pulse 1.5s infinite ease-in-out" }}></div>
                         <div style={{ background: C.bgCard, height: 200, borderRadius: 20, border: `1px solid ${C.border}`, animation: "pulse 1.5s infinite ease-in-out", animationDelay: "0.1s" }}></div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: 40 }}>
                        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, color: C.text, marginBottom: 8 }}>Overview Dashboard</h1>
                        <p style={{ fontSize: 16, color: C.textSub }}>Track your learning progress across all technical modules.</p>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
                        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32, textAlign: "center", boxShadow: C.shadow }}>
                          <div style={{ fontSize: 13, color: C.textMuted, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Total Topics</div>
                          <div style={{ fontSize: 48, fontWeight: 800, color: C.text }}>{totalTopics}</div>
                        </div>
                        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32, textAlign: "center", boxShadow: C.shadow, borderTop: `4px solid ${C.green}` }}>
                          <div style={{ fontSize: 13, color: C.textMuted, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Completed</div>
                          <div style={{ fontSize: 48, fontWeight: 800, color: C.green }}>{completedCount}</div>
                        </div>
                        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32, textAlign: "center", boxShadow: C.shadow, borderTop: `4px solid ${C.purple}` }}>
                          <div style={{ fontSize: 13, color: C.textMuted, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Remaining</div>
                          <div style={{ fontSize: 48, fontWeight: 800, color: C.purple }}>{totalTopics - completedCount}</div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                        {/* React Graph */}
                        <div style={{ background: C.bgCard, padding: 32, borderRadius: 20, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, display: 'flex', alignItems: 'center', gap: 8 }}>⚛️ React Mastery</h3>
                            <span style={{ fontSize: 24, fontWeight: 800, color: C.blue }}>{percentReact}%</span>
                          </div>
                          <div style={{ height: 16, background: C.border, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                            <div style={{ height: '100%', width: `${percentReact}%`, background: `linear-gradient(90deg, ${C.blue}, #00c6ff)`, borderRadius: 8, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                          </div>
                          <div style={{ fontSize: 14, color: C.textMuted, fontWeight: 600 }}>{completed.REACT.length} out of {allReactTopics.length} modules completed</div>
                        </div>

                        {/* JS Graph */}
                        <div style={{ background: C.bgCard, padding: 32, borderRadius: 20, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, display: 'flex', alignItems: 'center', gap: 8 }}>📜 JS Core Mastery</h3>
                            <span style={{ fontSize: 24, fontWeight: 800, color: C.yellow }}>{percentJS}%</span>
                          </div>
                          <div style={{ height: 16, background: C.border, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                            <div style={{ height: '100%', width: `${percentJS}%`, background: `linear-gradient(90deg, ${C.yellow}, #f2c94c)`, borderRadius: 8, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                          </div>
                          <div style={{ fontSize: 14, color: C.textMuted, fontWeight: 600 }}>{completed.JS.length} out of {allJsTopics.length} modules completed</div>
                        </div>
                      </div>

                    </div>
                  )
                ) : (
                  <>
                    {page !== "qa_theory" && (
                      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                          <div style={{ color: currentTopic?.color, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                            MODULE {currentTopic?.num}
                          </div>
                          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>
                            {currentTopic?.icon} {currentTopic?.title}
                          </h2>
                        </div>
                        <Btn themeC={C} variant={([...completed.REACT, ...completed.JS]).includes(page) ? "green" : "outline"} onClick={() => markDone(page)}>
                          {([...completed.REACT, ...completed.JS]).includes(page) ? "✓ Completed" : "Mark as Done"}
                        </Btn>
                      </div>
                    )}

                    <ErrorBoundary>
                      {PageComp && <PageComp themeC={C} />}
                    </ErrorBoundary>


                  </>
                )}
              </div>
            </main>
          </div>
        </div>
      </ToastProvider>
    </ThemeCtx.Provider>
  );
}
