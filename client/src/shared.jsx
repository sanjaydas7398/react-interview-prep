import { useState, useCallback, useMemo, memo, Component, createContext, useContext } from "react";
import { C as DYNAMIC_C, C_BASE } from "./constants";

export const ThemeCtx = createContext({ theme: "dark" });
export const UserCtx = createContext(null);
export const ToastCtx = createContext(null);

// The local 'C' in components will be merged from the current theme anyway,
// but for standard tokens we use dynamic logic if possible or static base.

export const Tag = memo(({ label, color = C_BASE.blue }) => {
  const themeC = useContext(ThemeCtx);
  return (
    <span style={{ 
      background: color + "15", 
      color, 
      border: `1px solid ${color}40`, 
      borderRadius: 6, 
      padding: "2px 10px", 
      fontSize: 10, 
      fontWeight: 600, 
      letterSpacing: 0.2, 
      whiteSpace: "nowrap", 
      fontFamily: C_BASE.sans 
    }}>{label}</span>
  );
});

export const Code = ({ children, color = C_BASE.cyan, themeC }) => (
  <code style={{ 
    background: (themeC?.bgCode || "#000"), 
    color, 
    border: `1px solid ${themeC?.border || "#333"}`, 
    borderRadius: 6, 
    padding: "2px 6px", 
    fontSize: 11, 
    fontFamily: C_BASE.mono 
  }}>{children}</code>
);

export const Block = ({ children, title, color = C_BASE.blue, themeC: propsTheme }) => {
  const ctxTheme = useContext(ThemeCtx);
  const themeC = propsTheme || ctxTheme || DYNAMIC_C;
  return (
    <div style={{ 
      background: themeC.bgCard,
      border: `1px solid ${themeC.border}`, 
      borderRadius: 16, 
      overflow: "hidden", 
      marginBottom: 16,
      boxShadow: themeC.shadow
    }}>
      {title && <div style={{ 
        background: color + "08", 
        padding: "10px 16px", 
        borderBottom: `1px solid ${themeC.border}`, 
        display: "flex", 
        alignItems: "center", 
        gap: 10 
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <span style={{ color, fontSize: 11, fontWeight: 700, fontFamily: C_BASE.sans, letterSpacing: 0.3 }}>{title}</span>
      </div>}
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
};

export const CodeBlock = ({ code, title, color = "#8B9FC4", themeC: propsTheme }) => {
  const ctxTheme = useContext(ThemeCtx);
  const themeC = propsTheme || ctxTheme || DYNAMIC_C;
  return (
    <div style={{ 
      background: themeC.bgCode || "#010409", 
      border: `1px solid ${themeC.border || "#21262D"}`, 
      borderRadius: 16, 
      overflow: "hidden", 
      marginBottom: 16 
    }}>
      {title && <div style={{ 
        background: "rgba(255,255,255,0.03)", 
        padding: "8px 16px", 
        borderBottom: `1px solid ${themeC.border || "#21262D"}`, 
        color: themeC.textSub || "#8B9FC4", 
        fontSize: 10, 
        fontFamily: C_BASE.mono 
      }}>{title}</div>}
      <pre style={{ margin: 0, padding: "16px 20px", fontFamily: C_BASE.mono, fontSize: 11, lineHeight: 1.8, overflowX: "auto", color: themeC.textSub || color }}>
        {code.map((line, i) => <div key={i} style={{ color: line.c || color }}>{line.t}</div>)}
      </pre>
    </div>
  );
};

export function Btn({ children, onClick, variant = "primary", size = "sm", style = {}, disabled, themeC }) {
  const [h, sh] = useState(false);
  const C = themeC || DYNAMIC_C;
  
  const vs = { 
    primary: { bg: h ? C_BASE.blue : C_BASE.accent, c: "#fff" }, 
    outline: { bg: h ? C.bgHover : "transparent", c: C.text, b: `1px solid ${C.border}` }, 
    green: { bg: h ? C_BASE.greenDk : C_BASE.green, c: (themeC?.type === 'light' ? '#fff' : '#000') }, 
    red: { bg: h ? "#dc2626" : C_BASE.red, c: "#fff" }, 
    ghost: { bg: h ? C.bgHover : "transparent", c: C.textSub }, 
    purple: { bg: h ? "#7c3aed" : C_BASE.purple, c: "#fff" } 
  }[variant];

  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)}
      style={{ 
        background: vs.bg, 
        color: vs.c, 
        border: vs.b || "none", 
        borderRadius: 12, 
        padding: size === "xs" ? "4px 12px" : size === "sm" ? "8px 18px" : "12px 24px", 
        fontSize: size === "xs" ? 10 : size === "sm" ? 12 : 14, 
        fontWeight: 600, 
        cursor: disabled ? "not-allowed" : "pointer", 
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)", 
        opacity: disabled ? 0.5 : 1, 
        fontFamily: C_BASE.sans,
        boxShadow: variant === 'primary' && h ? "0 4px 12px rgba(59, 130, 246, 0.4)" : "none",
        ...style 
      }}>
      {children}
    </button>
  );
}

export function Alert({ type = "info", children, themeC: propsTheme }) {
  const ctxTheme = useContext(ThemeCtx);
  const themeC = propsTheme || ctxTheme || DYNAMIC_C;
  const m = { info: C_BASE.blue, warn: C_BASE.yellow, error: C_BASE.red, success: C_BASE.green };
  const icons = { info: "✨", warn: "⚠️", error: "🚨", success: "✅" };
  const c = m[type];
  return (
    <div style={{ 
      background: c + "10", 
      border: `1px solid ${c}30`, 
      borderRadius: 16, 
      padding: "16px", 
      fontSize: 13, 
      color: themeC.text, 
      display: "flex", 
      gap: 12, 
      marginBottom: 16, 
      lineHeight: 1.6 
    }}>
      <span style={{ fontSize: 16 }}>{icons[type]}</span>
      <div>{children}</div>
    </div>
  );
}


export function Grid({ children, cols = 2, gap = 16 }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>{children}</div>;
}
export function Row({ children, gap = 12 }) {
  return <div style={{ display: "flex", gap, flexWrap: "wrap", alignItems: "flex-start" }}>{children}</div>;
}
export function SBadge({ s }) {
  const m = { ACTIVE: C_BASE.green, DRAFT: C_BASE.textMuted, ON_HOLD: C_BASE.yellow, COMPLETED: C_BASE.blue, DONE: C_BASE.green, IN_PROGRESS: C_BASE.blue, TODO: "#484F58", HIGH: C_BASE.red, MEDIUM: C_BASE.yellow, LOW: C_BASE.green, PENDING: C_BASE.yellow, APPROVED: C_BASE.green, REJECTED: C_BASE.red };
  const c = m[s] || "#484F58";
  return <span style={{ background: c + "15", color: c, border: `1px solid ${c}40`, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{s}</span>;
}
export function Spacer({ h = 16 }) { return <div style={{ height: h }} />; }

export const ToastProvider = ({ children, themeC }) => {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return (
    <ToastCtx.Provider value={add}>
      <div style={{ height: "100%" }}>
        {children}
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
          {toasts.map(t => {
            const c = { success: C_BASE.green, error: C_BASE.red, warn: C_BASE.yellow, info: C_BASE.blue }[t.type];
              return <div key={t.id} style={{ 
                background: themeC?.type === 'light' ? '#FFFFFF' : '#161B22', 
                border: `1px solid ${c}${themeC?.type === 'light' ? '80' : ''}`, 
                borderRadius: 12, 
                padding: "12px 20px", 
                color: themeC?.type === 'light' ? '#0F172A' : '#fff', 
                fontSize: 13, 
                fontWeight: 600, 
                boxShadow: themeC?.shadow || "0 10px 30px rgba(0,0,0,0.3)", 
                minWidth: 260, 
                animation: "fadeIn 0.3s ease" 
              }}>
              <span style={{ color: c }}>● </span>{t.msg}
            </div>;
          })}
        </div>
      </div>
    </ToastCtx.Provider>
  );
};

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: 24, textAlign: "center", background: "rgba(239, 68, 68, 0.05)", border: "1px dashed #EF4444", borderRadius: 16 }}>
        <div style={{ fontSize: 32 }}>🧪</div>
        <div style={{ color: "#EF4444", fontWeight: 700, margin: "8px 0" }}>Component Crashed</div>
        <div style={{ color: "#8B9FC4", fontSize: 12, marginBottom: 16 }}>{this.state.error?.message}</div>
        <Btn onClick={() => this.setState({ hasError: false })} variant="red" size="sm">Try Again</Btn>
      </div>
    );
    return this.props.children;
  }
}

// --- HOC ---
export function withLogger(Wrapped, name) {
  return function Logged(props) {
    const renderCount = useState(0)[0];
    return (
      <div style={{ border: "1px solid #8B5CF633", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ background: "#8B5CF615", padding: "4px 10px", fontSize: 9, color: "#8B5CF6" }}>HOC({name})</div>
        <div style={{ padding: 10 }}><Wrapped {...props} /></div>
      </div>
    );
  };
}

// --- Reducer ---
export const taskReducer = (state, action) => {
  switch (action.type) {
    case "ADD": return { ...state, tasks: [...state.tasks, { id: Date.now(), title: action.payload || action.task?.title, status: "TODO" }] };
    case "TOGGLE": return { ...state, tasks: state.tasks.map(t => t.id === action.id ? { ...t, status: t.status === "DONE" ? "TODO" : "DONE" } : t) };
    case "DELETE": return { ...state, tasks: state.tasks.filter(t => t.id !== action.id) };
    case "SET_FILTER": return { ...state, filter: action.payload || action.filter };
    default: return state;
  }
};
