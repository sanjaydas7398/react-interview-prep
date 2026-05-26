import { useState, useCallback, useRef } from "react";
import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Btn, Tag, Spacer } from "../../shared";

export default function JS11_Optimization() {
  const [debouncelog, setDebouncelog] = useState([]);
  const [throttlelog, setThrottlelog] = useState([]);
  const debounceTimer = useRef(null);
  const throttleLastCall = useRef(0);

  const debounceRun = () => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncelog(p => [...p, { t: new Date().toLocaleTimeString(), m: "Execution Fired!" }].slice(-3));
    }, 500);
  };

  const throttleRun = () => {
    const now = Date.now();
    if (now - throttleLastCall.current >= 800) {
      throttleLastCall.current = now;
      setThrottlelog(p => [...p, { t: new Date().toLocaleTimeString(), m: "Execution Fired!" }].slice(-3));
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Debouncing & Throttling ⭐" color={C.orange}>
        <Alert type="info">Techniques to limit the frequency of function calls (e.g., scroll, resize, search input).</Alert>
        <Grid cols={2} gap={15}>
          <div style={{ background: C.bgCode, padding: 14, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ color: C.orange, fontSize: 11, fontWeight: 700, marginBottom: 10 }}>Debounce (Delayed)</div>
            <div style={{ color: C.textSub, fontSize: 9, marginBottom: 8 }}>Executes after <Code>X ms</Code> of inactivity.</div>
            <Btn size="xs" onClick={debounceRun}>Type Fast (Search)</Btn>
            <div style={{ marginTop: 10, minHeight: 60 }}>
              {debouncelog.map((l, i) => <div key={i} style={{ color: C.green, fontSize: 9 }}>✅ {l.m} at {l.t}</div>)}
            </div>
          </div>
          <div style={{ background: C.bgCode, padding: 14, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ color: C.blue, fontSize: 11, fontWeight: 700, marginBottom: 10 }}>Throttle (Fixed Rate)</div>
            <div style={{ color: C.textSub, fontSize: 9, marginBottom: 8 }}>Executes at most once every <Code>X ms</Code>.</div>
            <Btn size="xs" variant="outline" onClick={throttleRun}>Spam Click (Scroll)</Btn>
            <div style={{ marginTop: 10, minHeight: 60 }}>
              {throttlelog.map((l, i) => <div key={i} style={{ color: C.blue, fontSize: 9 }}>✅ {l.m} at {l.t}</div>)}
            </div>
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Reflow & Repaint" color={C.red}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: C.red + "10", padding: 10, borderRadius: 8 }}>
              <div style={{ color: C.red, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Reflow (Layout)</div>
              <div style={{ color: C.textSub, fontSize: 9 }}>Calculating element positions. Triggered by <Code>width</Code>, <Code>margin</Code>, <Code>font-size</Code>. VERY EXPENSIVE.</div>
            </div>
            <div style={{ background: C.orange + "10", padding: 10, borderRadius: 8 }}>
              <div style={{ color: C.orange, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Repaint (Paint)</div>
              <div style={{ color: C.textSub, fontSize: 9 }}>Drawing pixels. Triggered by <Code>color</Code>, <Code>visibility</Code>. Cheaper than reflow.</div>
            </div>
          </div>
        </Block>
        <Block title="Memory Management" color={C.pink}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>JS uses **Garbage Collection (GC)** based on reachability. Common causes of memory leaks:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {["Accidental Global variables", "Forgotten timers / callbacks", "Closures holding big data", "Detached DOM nodes"].map(x => (
              <div key={x} style={{ color: C.pink, fontSize: 10 }}>⚠️ {x}</div>
            ))}
          </div>
        </Block>
        <Block title="RequestAnimationFrame (rAF)" color={C.green}>
          <Alert type="info">Optimized for animations. Runs before the next browser repaint (~60fps).</Alert>
          <CodeBlock code={[
            { t: "function animate() {", c: C.green },
            { t: "  updatePos();", c: C.textSub },
            { t: "  requestAnimationFrame(animate);", c: C.green },
            { t: "}", c: C.green },
            { t: "animate();", c: C.textSub },
          ]} />
        </Block>
        <Block title="Lazy Loading / Code Splitting" color={C.blue}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Reduce initial bundle size by loading code only when needed.</div>
          <CodeBlock code={[
            { t: "// Dynamic import", c: C.textMuted },
            { t: "btn.onclick = async () => {", c: C.textSub },
            { t: "  const mod = await import('./math.js');", c: C.blue },
            { t: "  console.log(mod.add(1, 2));", c: C.textSub },
            { t: "};", c: C.textSub },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
