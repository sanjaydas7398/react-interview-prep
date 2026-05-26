import { C } from "../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../shared";

export default function T16_Architecture() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="React 18 Architecture: Render vs Commit" color={C.orange}>
        <Alert type="info">React divides rendering into two distinct phases to optimize performance.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <div style={{ color: C.orange, fontWeight: 700, fontSize: 11, marginBottom: 4 }}>1. Render Phase (Pure)</div>
            <div style={{ color: C.textSub, fontSize: 10, marginBottom: 10 }}>React calls your components and determines what changed (Reconciliation). Can be paused/restarted.</div>
            <div style={{ color: C.blue, fontWeight: 700, fontSize: 11, marginBottom: 4 }}>2. Commit Phase (Side Effects)</div>
            <div style={{ color: C.textSub, fontSize: 10 }}>React applies changes to the DOM and runs effects (useEffect). Cannot be interrupted.</div>
          </div>
          <div style={{ background: C.bgCode, padding: 12, borderRadius: 10 }}>
            <div style={{ color: C.yellow, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Common Interview: "What triggers a render?"</div>
            <div style={{ fontSize: 10, color: C.textSub, lineHeight: 1.6 }}>
               • State change (`useState` setter) <br/>
               • Context value update <br/>
               • Parent re-renders (unless `memo` is used) <br/>
               • Force update (via `useReducer` or custom hook)
            </div>
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Debugging Stale Closures 🚫" color={C.red}>
          <Alert type="warning">Interviewer: "Why does my counter stay at 0 inside this timeout?"</Alert>
          <CodeBlock code={[
            { t: "useEffect(() => {", c: C.cyan },
            { t: "  const id = setInterval(() => {", c: C.textSub },
            { t: "    setCount(count + 1); // ❌ Wrong: uses stale count", c: C.red },
            { t: "    setCount(c => c + 1); // ✅ Fix: functional update", c: C.green },
            { t: "  }, 1000);", c: C.textSub },
            { t: "  return () => clearInterval(id);", c: C.purple },
            { t: "}, []);", c: C.cyan },
          ]} />
        </Block>
        <Block title="Memory Leak Protection" color={C.green}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Prevent "Can't perform state update on unmounted component" errors.</div>
          <CodeBlock code={[
            { t: "useEffect(() => {", c: C.green },
            { t: "  const controller = new AbortController();", c: C.textSub },
            { t: "  fetch(url, { signal: controller.signal })", c: C.textSub },
            { t: "    .then(r => setData(r));", c: C.textSub },
            { t: "  return () => controller.abort();", c: C.green },
            { t: "}, [url]);", c: C.green },
          ]} />
        </Block>
        <Block title="Advanced Pattern: Context Splitting" color={C.purple}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Avoid "Re-render Storms" by splitting large contexts.</div>
          <CodeBlock code={[
            { t: "// ❌ Don't put everything in one object", c: C.textMuted },
            { t: "<AuthContext.Provider value={{ user, theme, locale }}>", c: C.red },
            { t: "", c: "" },
            { t: "// ✅ Split them", c: C.textMuted },
            { t: "<ThemeContext.Provider value={theme}>", c: C.green },
            { t: "  <UserContext.Provider value={user}>", c: C.green },
            { t: "    <App />", c: C.textSub },
          ]} />
        </Block>
        <Block title="Portals: Breaking the Container" color={C.yellow}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Render children into a DOM node that exists outside the hierarchy.</div>
          <CodeBlock code={[
            { t: "return createPortal(", c: C.yellow },
            { t: "  <Modal>{children}</Modal>,", c: C.textSub },
            { t: "  document.getElementById('modal-root')", c: C.textSub },
            { t: ");", c: C.yellow },
          ]} />
          <div style={{ color: C.textMuted, fontSize: 9, marginTop: 4 }}>Essential for: Modals, Tooltips, Global Notifications.</div>
        </Block>
      </Grid>
    </div>
  );
}
