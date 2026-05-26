import { useState, useEffect, useLayoutEffect, useCallback, useRef, Component } from "react";
import { C } from "../constants";
import { usePrevious } from "../hooks";
import { Block, CodeBlock, Btn, Alert, Code, Grid, Row, Spacer, ErrorBoundary } from "../shared";

class LifecycleClass extends Component {
  componentDidMount()  { this.props.onLog?.("🟢 [CLASS MOUNT] componentDidMount()"); }
  componentDidUpdate(prevProps) {
    if (prevProps.count !== this.props.count) {
      this.props.onLog?.("🔵 [CLASS UPDATE] componentDidUpdate()");
    }
  }
  componentWillUnmount(){ this.props.onLog?.("🔴 [CLASS UNMOUNT] componentWillUnmount()"); }
  render() { return <div style={{ color: C.textSub, fontSize: 11 }}>Class component — count: <strong style={{ color: C.text }}>{this.props.count}</strong></div>; }
}

export default function T01_Lifecycle() {
  const [count, setCount] = useState(0);
  const [showChild, setShowChild] = useState(true);
  const [logs, setLogs] = useState(["⏳ Waiting... click buttons below"]);
  const log = useCallback(msg => setLogs(p => [...p.slice(-6), msg]), []);

  useEffect(() => {
    log("🟢 [MOUNT] useEffect(fn,[]) → componentDidMount");
    return () => log("🔴 [UNMOUNT] cleanup → componentWillUnmount");
  }, []);

  useEffect(() => {
    if (count > 0) log(`🔵 [UPDATE] useEffect([count]) → count = ${count}`);
  }, [count]);

  useLayoutEffect(() => {}, [count]);
  const prev = usePrevious(count);

  function BombComp() {
    const [boom, setBoom] = useState(false);
    if (boom) throw new Error("Intentional crash to test ErrorBoundary!");
    return <Btn variant="red" size="xs" onClick={() => setBoom(true)}>💣 Crash → ErrorBoundary catches</Btn>;
  }

  return (
    <div>
      <Block title="THREE LIFECYCLE PHASES" color={C.green}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[
            { phase: "MOUNTING", color: C.green, func: ["constructor()", "render()", "componentDidMount()", "≡ useEffect(fn, [])"] },
            { phase: "UPDATING", color: C.blue, func: ["setState() / new props", "render()", "componentDidUpdate()", "≡ useEffect(fn, [dep])"] },
            { phase: "UNMOUNTING", color: C.red, func: ["componentWillUnmount()", "≡ useEffect cleanup", "return () => cleanup"] },
          ].map(p => (
            <div key={p.phase} style={{ background: p.color + "12", border: `1px solid ${p.color}33`, borderRadius: 9, padding: 12 }}>
              <div style={{ color: p.color, fontWeight: 700, fontSize: 11, marginBottom: 8, fontFamily: C.mono }}>{p.phase}</div>
              {p.func.map(f => <div key={f} style={{ color: f.startsWith("≡") ? C.cyan : C.textSub, fontSize: 10, marginBottom: 3, fontFamily: C.mono }}>{f}</div>)}
            </div>
          ))}
        </div>
        <Grid cols={2} gap={12}>
          <div>
            <div style={{ color: C.textSub, fontSize: 11, marginBottom: 8 }}>Interactive lifecycle logger:</div>
            <Row gap={8}>
              <Btn onClick={() => setCount(c => c + 1)}>count++ ({count})</Btn>
              <Btn variant="outline" onClick={() => setShowChild(s => !s)}>{showChild ? "Unmount" : "Mount"} Class</Btn>
              <Btn variant="ghost" size="xs" onClick={() => setLogs([])}>Clear</Btn>
            </Row>
            <Spacer h={8} />
            <div style={{ fontSize: 11, color: C.textSub }}>
              usePrevious: was <Code color={C.yellow}>{prev ?? "—"}</Code> → now <Code color={C.green}>{count}</Code>
            </div>
          </div>
          <div style={{ background: C.bgCode, borderRadius: 9, padding: 10, minHeight: 80 }}>
            {logs.map((l, i) => (
              <div key={i} style={{ fontSize: 10, fontFamily: C.mono, color: l.includes("MOUNT]") ? C.green : l.includes("UPDATE]") ? C.blue : l.includes("UNMOUNT]") ? C.red : C.textSub, marginBottom: 2 }}>{l}</div>
            ))}
          </div>
        </Grid>
        {showChild && <ErrorBoundary><div style={{ marginTop: 10 }}><LifecycleClass count={count} onLog={log} /></div></ErrorBoundary>}
      </Block>
      <Grid cols={2} gap={12}>
        <Block title="useEffect vs useLayoutEffect" color={C.cyan}>
          <CodeBlock title="useEffect — ASYNC, after paint" code={[
            { t: "useEffect(() => {", c: C.cyan },
            { t: "  // ✅ API calls, subscriptions, logging", c: C.textSub },
            { t: "  fetchData(); // doesn't block paint", c: C.green },
            { t: "  return () => cleanup(); // CLEANUP", c: C.yellow },
            { t: "}, [dep]); // re-run when dep changes", c: C.cyan },
          ]} />
          <CodeBlock title="useLayoutEffect — SYNC, before paint" code={[
            { t: "useLayoutEffect(() => {", c: C.orange },
            { t: "  // ✅ DOM measurements, prevent flicker", c: C.textSub },
            { t: "  const h = ref.current.offsetHeight;", c: C.green },
            { t: "  return () => cleanup();", c: C.yellow },
            { t: "}, [dep]);", c: C.orange },
          ]} />
          <Alert type="warn">useLayoutEffect blocks browser paint. Use useEffect by default. Use useLayoutEffect only for DOM measurements or to prevent visual flicker.</Alert>
        </Block>
        <Block title="ErrorBoundary + StrictMode" color={C.red}>
          <ErrorBoundary><BombComp /></ErrorBoundary>
          <Spacer h={10} />
          <CodeBlock title="ErrorBoundary — Class Component ONLY" code={[
            { t: "class ErrorBoundary extends Component {", c: C.red },
            { t: "  state = { hasError: false };", c: C.textSub },
            { t: "  static getDerivedStateFromError(err) {", c: C.yellow },
            { t: "    return { hasError: true };", c: C.green },
            { t: "  }", c: C.yellow },
            { t: "  componentDidCatch(err, info) { log(err); }", c: C.textSub },
            { t: "  render() {", c: C.red },
            { t: "    if (this.state.hasError) return <Fallback/>;", c: C.cyan },
            { t: "    return this.props.children;", c: C.green },
            { t: "  }", c: C.red },
            { t: "}", c: C.red },
          ]} />
          <Alert type="info"><strong style={{ color: C.blue }}>StrictMode:</strong> In dev only — double-invokes render, useState init, useMemo to find bugs. Does NOT affect prod.</Alert>
        </Block>
      </Grid>
    </div>
  );
}
