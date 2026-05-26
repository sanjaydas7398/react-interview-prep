import { C } from "../constants";
import { Block, CodeBlock, Alert, Grid } from "../shared";

export default function T06_VirtualDOM() {
  return (
    <div>
      <Block title="Virtual DOM — How React updates the DOM efficiently" color={C.pink}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 10, alignItems: "center", marginBottom: 14 }}>
          {[
            { title: "1. setState()", sub: "State change triggered", color: C.blue },
            null,
            { title: "2. Re-render (VDOM)", sub: "New Virtual DOM tree created in memory", color: C.cyan },
            null,
            { title: "3. Diffing", sub: "Compare old vs new VDOM (reconciliation)", color: C.purple },
          ].map((item, i) => item === null
            ? <div key={i} style={{ color: C.textMuted, fontSize: 18, textAlign: "center" }}>→</div>
            : <div key={i} style={{ background: item.color + "15", border: `1px solid ${item.color}33`, borderRadius: 9, padding: 12, textAlign: "center" }}>
              <div style={{ color: item.color, fontWeight: 700, fontSize: 12 }}>{item.title}</div>
              <div style={{ color: C.textSub, fontSize: 10, marginTop: 4 }}>{item.sub}</div>
            </div>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center" }}>
          {[
            { title: "4. Minimal DOM ops", sub: "Only changed nodes are updated in real DOM", color: C.green },
            null,
            { title: "5. Commit Phase", sub: "React applies changes, runs useEffect", color: C.orange },
          ].map((item, i) => item === null
            ? <div key={i} style={{ color: C.textMuted, fontSize: 18, textAlign: "center" }}>→</div>
            : <div key={i} style={{ background: item.color + "15", border: `1px solid ${item.color}33`, borderRadius: 9, padding: 12, textAlign: "center" }}>
              <div style={{ color: item.color, fontWeight: 700, fontSize: 12 }}>{item.title}</div>
              <div style={{ color: C.textSub, fontSize: 10, marginTop: 4 }}>{item.sub}</div>
            </div>
          )}
        </div>
      </Block>
      <Grid cols={2} gap={12}>
        <Block title="Reconciliation + Diffing Algorithm" color={C.purple}>
          <Alert type="info"><strong>Reconciliation</strong> is React's algorithm for determining what changed. It uses O(n) heuristics instead of O(n³) brute force.</Alert>
          <CodeBlock code={[
            { t: "// Rule 1: Different type → destroy + recreate", c: C.yellow },
            { t: "<div/> → <span/>  // destroy div, create span", c: C.textSub },
            { t: "", c: "" },
            { t: "// Rule 2: Same type → update attributes only", c: C.yellow },
            { t: "<div className='a'/> → <div className='b'/>", c: C.textSub },
            { t: "// Only className changes, div stays", c: C.green },
            { t: "", c: "" },
            { t: "// Rule 3: Lists → use key prop for identity", c: C.yellow },
            { t: "// key helps React reuse DOM nodes efficiently", c: C.textSub },
          ]} />
        </Block>
        <Block title="What causes re-renders?" color={C.red}>
          <Alert type="warn">Understanding re-renders is key to performance optimization!</Alert>
          {[
            { cause: "1. State change", detail: "useState / useReducer value changes", color: C.red },
            { cause: "2. Props change", detail: "Parent passes a new prop value", color: C.yellow },
            { cause: "3. Context change", detail: "Context Provider value changes → all consumers re-render", color: C.orange },
            { cause: "4. Parent re-render", detail: "Child re-renders unless wrapped in React.memo", color: C.pink },
          ].map(x => (
            <div key={x.cause} style={{ display: "flex", gap: 10, padding: "7px 10px", background: x.color + "10", border: `1px solid ${x.color}22`, borderRadius: 7, marginBottom: 5 }}>
              <span style={{ color: x.color, fontWeight: 700, fontSize: 11, minWidth: 100 }}>{x.cause}</span>
              <span style={{ color: C.textSub, fontSize: 11 }}>{x.detail}</span>
            </div>
          ))}
        </Block>
      </Grid>

      <Grid cols={2} gap={12}>
        <Block title="Fiber Architecture" color={C.green}>
          <Alert type="info"><strong>React Fiber</strong> (React 16+) is the internal reconciliation engine that replaced the old "stack reconciler". It enables interruptible rendering.</Alert>
          {[
            { label: "Incremental rendering", desc: "Split rendering work into chunks, yield to browser between frames", color: C.green },
            { label: "Priority-based updates", desc: "User input (high priority) processed before background updates (low priority)", color: C.blue },
            { label: "Concurrent Mode", desc: "React can prepare multiple versions of UI simultaneously", color: C.purple },
            { label: "Pause & Resume", desc: "Can pause work in progress and come back to it later", color: C.yellow },
          ].map(x => (
            <div key={x.label} style={{ display: "flex", gap: 10, padding: "6px 10px", background: x.color + "10", border: `1px solid ${x.color}22`, borderRadius: 7, marginBottom: 5 }}>
              <span style={{ color: x.color, fontWeight: 700, fontSize: 11, minWidth: 120 }}>{x.label}</span>
              <span style={{ color: C.textSub, fontSize: 11 }}>{x.desc}</span>
            </div>
          ))}
        </Block>
        <Block title="Render Phase vs Commit Phase" color={C.cyan}>
          <Grid cols={2} gap={8}>
            <div style={{ background: C.cyan + "12", border: `1px solid ${C.cyan}33`, borderRadius: 9, padding: 10 }}>
              <div style={{ color: C.cyan, fontWeight: 700, fontSize: 11, marginBottom: 6 }}>RENDER PHASE (Pure)</div>
              {["Call component functions", "Create new VDOM tree", "Diff old vs new (reconciliation)", "Can be paused/aborted", "No DOM mutations!", "No side effects!"].map(p => <div key={p} style={{ color: C.textSub, fontSize: 10, marginBottom: 2 }}>• {p}</div>)}
            </div>
            <div style={{ background: C.orange + "12", border: `1px solid ${C.orange}33`, borderRadius: 9, padding: 10 }}>
              <div style={{ color: C.orange, fontWeight: 700, fontSize: 11, marginBottom: 6 }}>COMMIT PHASE (Side effects)</div>
              {["Apply DOM mutations", "Run useLayoutEffect (sync)", "Run useEffect (async)", "Cannot be interrupted", "Update refs", "Call lifecycle methods"].map(p => <div key={p} style={{ color: C.textSub, fontSize: 10, marginBottom: 2 }}>• {p}</div>)}
            </div>
          </Grid>
        </Block>
        <Block title="Batching Updates (VIMP)" color={C.yellow}>
          <CodeBlock code={[
            { t: "// React 18+ — AUTOMATIC batching everywhere!", c: C.yellow },
            { t: "function handleClick() {", c: C.textSub },
            { t: "  setCount(c => c + 1);  // ┐", c: C.green },
            { t: "  setName('Ahmad');       // ├ Batched → 1 re-render!", c: C.green },
            { t: "  setActive(true);        // ┘", c: C.green },
            { t: "}", c: C.textSub },
            { t: "", c: "" },
            { t: "// Also batched in React 18 (NOT in React 17!):", c: C.textMuted },
            { t: "setTimeout(() => {", c: C.cyan },
            { t: "  setCount(c => c + 1); // batched in 18!", c: C.textSub },
            { t: "  setName('Siti');       // batched in 18!", c: C.textSub },
            { t: "}, 1000);", c: C.cyan },
            { t: "", c: "" },
            { t: "// Force synchronous update (opt-out of batching):", c: C.textMuted },
            { t: "import { flushSync } from 'react-dom';", c: C.red },
            { t: "flushSync(() => setCount(c => c + 1)); // immediate", c: C.red },
          ]} />
        </Block>
        <Block title="State Colocation & Optimization" color={C.purple}>
          <Alert type="info"><strong>State colocation:</strong> Keep state as close as possible to where it's used. Don't lift state higher than necessary.</Alert>
          {[
            { strategy: "State Colocation", desc: "Move state down to the component that uses it → fewer re-renders in parent", color: C.green },
            { strategy: "Component Splitting", desc: "Extract frequently-updating parts into separate components", color: C.blue },
            { strategy: "Bailout Optimization", desc: "React skips re-rendering if setState receives same value (Object.is comparison)", color: C.purple },
            { strategy: "Context Splitting", desc: "Split large context into multiple smaller ones (ThemeCtx, AuthCtx, DataCtx)", color: C.orange },
          ].map(x => (
            <div key={x.strategy} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <span style={{ color: x.color, fontWeight: 700, fontSize: 10, minWidth: 120, fontFamily: C.mono }}>{x.strategy}</span>
              <span style={{ color: C.textSub, fontSize: 11 }}>{x.desc}</span>
            </div>
          ))}
        </Block>
      </Grid>
    </div>
  );
}
