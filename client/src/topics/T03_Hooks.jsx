import { useState, useEffect, useReducer, useContext, useMemo, useCallback, useRef } from "react";
import { C } from "../constants";
import { useDebounce, usePrevious, useThrottle, useFetch } from "../hooks";
import { Block, CodeBlock, Btn, Alert, Code, Tag, Grid, Row, Spacer, ToastCtx, taskReducer } from "../shared";

export default function T03_Hooks() {
  const toast = useContext(ToastCtx);
  const [count, setCount] = useState(0);
  const [obj, setObj] = useState({ name: "Ahmad", role: "ADMIN" });
  const [bA, setBA] = useState(0);
  const [bB, setBB] = useState(0);
  const bRenders = useRef(0);
  useEffect(() => { bRenders.current++; }, [bA, bB]);

  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [{ id: 1, title: "Analisis Keperluan", status: "DONE", priority: "HIGH" }, { id: 2, title: "Reka Bentuk UI", status: "IN_PROGRESS", priority: "MEDIUM" }],
    filter: "ALL",
  });
  const [newTask, setNewTask] = useState("");
  const inputRef = useRef(null);
  const renders = useRef(0);
  renders.current++;
  const [filt, setFilt] = useState("ALL");
  const filtered = useMemo(() => {
    if (filt === "ALL") return state.tasks;
    return state.tasks.filter(t => t.status === filt);
  }, [state.tasks, filt]);

  const handleToggle = useCallback(id => {
    dispatch({ type: "TOGGLE", id });
    toast && toast("Task toggled!", "info");
  }, [toast]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const prev = usePrevious(count);
  const [slider, setSlider] = useState(50);
  const throttled = useThrottle(slider, 400);
  const { data, loading } = useFetch(["Project A", "Project B", "Project C"]);

  return (
    <div>
      <Grid cols={2} gap={12}>
        <Block title="useState — Most used hook" color={C.blue}>
          <CodeBlock code={[
            { t: "// Basic usage", c: C.textMuted },
            { t: "const [count, setCount] = useState(0);", c: C.blue },
            { t: "", c: "" },
            { t: "// ✅ Functional update (safe, uses latest state)", c: C.textMuted },
            { t: "setCount(prev => prev + 1); // NOT setCount(count+1)", c: C.green },
            { t: "", c: "" },
            { t: "// ✅ Lazy initialization (expensive calc once)", c: C.textMuted },
            { t: "const [data] = useState(() => heavyCalc());", c: C.yellow },
            { t: "", c: "" },
            { t: "// Object state — spread to preserve other fields", c: C.textMuted },
            { t: "setObj(p => ({ ...p, name: 'Siti' }));", c: C.cyan },
          ]} />
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <Btn variant="outline" size="xs" onClick={() => setCount(c => c - 1)}>−</Btn>
            <span style={{ color: C.text, fontWeight: 700, fontSize: 18, minWidth: 30, textAlign: "center" }}>{count}</span>
            <Btn size="xs" onClick={() => setCount(c => c + 1)}>+</Btn>
            <Tag label="functional update" color={C.green} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>Object state demo:</div>
            <Row gap={6}>
              <Btn size="xs" variant="outline" onClick={() => setObj(p => ({ ...p, name: "Ahmad" }))}>Ahmad</Btn>
              <Btn size="xs" variant="outline" onClick={() => setObj(p => ({ ...p, name: "Siti" }))}>Siti</Btn>
            </Row>
            <Code color={C.cyan}>{JSON.stringify(obj)}</Code>
          </div>
          <Alert type="info"><strong>Batching:</strong> React batches multiple setState calls in event handlers → only 1 re-render.
            <div style={{ marginTop: 4 }}>
              <Btn size="xs" onClick={() => { setBA(a => a + 1); setBB(b => b + 1); }}>Batch update A+B</Btn>
              <span style={{ color: C.textSub, marginLeft: 8, fontSize: 11 }}>A:{bA} B:{bB} Renders:{bRenders.current}</span>
            </div>
          </Alert>
        </Block>

        <Block title="useEffect — Side effects" color={C.cyan}>
          <CodeBlock code={[
            { t: "// 1. Run ONCE on mount (componentDidMount)", c: C.textMuted },
            { t: "useEffect(() => { fetchData(); }, []); // empty []", c: C.cyan },
            { t: "", c: "" },
            { t: "// 2. Run on dependency change", c: C.textMuted },
            { t: "useEffect(() => { doSomething(); }, [userId]);", c: C.blue },
            { t: "", c: "" },
            { t: "// 3. With CLEANUP (prevent memory leaks)", c: C.textMuted },
            { t: "useEffect(() => {", c: C.yellow },
            { t: "  const sub = subscribe(userId);", c: C.textSub },
            { t: "  return () => sub.unsubscribe(); // CLEANUP", c: C.yellow },
            { t: "}, [userId]);", c: C.yellow },
            { t: "", c: "" },
            { t: "// ❌ INFINITE LOOP — object/array in deps", c: C.red },
            { t: "useEffect(() => {}, [{ id: 1 }]); // new ref each render!", c: C.red },
          ]} />
          <Alert type="warn">Common infinite loop: putting an object/array directly in dependency array. Each render creates a new reference → effect runs again → re-render → loop!</Alert>
        </Block>

        <Block title="useReducer — Complex state logic" color={C.purple}>
          <CodeBlock code={[
            { t: "function reducer(state, action) {", c: C.purple },
            { t: "  switch(action.type) {", c: C.textSub },
            { t: "    case 'ADD': return { ...state, items: [...state.items, action.payload] };", c: C.green },
            { t: "    default: return state;", c: C.yellow },
            { t: "  }", c: C.textSub },
            { t: "}", c: C.purple },
          ]} />
          <div style={{ marginBottom: 8 }}>
            <Row gap={6}>
              <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="New task..."
                style={{ flex: 1, background: C.bgCode, border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 10px", color: C.text, fontSize: 12, outline: "none" }}
                onKeyDown={e => { if (e.key === "Enter" && newTask.trim()) { dispatch({ type: "ADD", payload: newTask.trim() }); setNewTask(""); } }}
              />
              <Btn size="xs" variant="purple" onClick={() => { if (newTask.trim()) { dispatch({ type: "ADD", payload: newTask.trim() }); setNewTask(""); } }}>Add</Btn>
            </Row>
            <Row gap={4} style={{ marginTop: 6 }}>
              {["ALL", "TODO", "IN_PROGRESS", "DONE"].map(f => <Btn key={f} size="xs" variant={filt === f ? "purple" : "outline"} onClick={() => setFilt(f)}>{f}</Btn>)}
            </Row>
          </div>
          {filtered.map(t => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: C.bgCode, borderRadius: 7, marginBottom: 4 }}>
              <span style={{ color: t.status === "DONE" ? C.textMuted : C.text, textDecoration: t.status === "DONE" ? "line-through" : "none", fontSize: 12 }}>{t.title}</span>
              <Row gap={5}>
                <Btn size="xs" variant={t.status === "DONE" ? "outline" : "green"} onClick={() => handleToggle(t.id)}>✓</Btn>
                <Btn size="xs" variant="ghost" onClick={() => dispatch({ type: "DELETE", id: t.id })}>✕</Btn>
              </Row>
            </div>
          ))}
        </Block>

        <Block title="useRef — Persist without re-render" color={C.yellow}>
          <CodeBlock code={[
            { t: "const inputRef = useRef(null);", c: C.yellow },
            { t: "<input ref={inputRef}/> → inputRef.current = DOM node", c: C.textSub },
            { t: "inputRef.current.focus();", c: C.green },
            { t: "", c: "" },
            { t: "// Persist value WITHOUT re-render", c: C.textMuted },
            { t: "const renders = useRef(0);", c: C.yellow },
            { t: "renders.current++; // mutation, no re-render!", c: C.textSub },
          ]} />
          <Row gap={8} style={{ marginBottom: 8 }}>
            <input ref={inputRef} placeholder="useRef DOM target" style={{ flex: 1, background: C.bgCode, border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 10px", color: C.text, fontSize: 12, outline: "none" }} />
            <Btn size="xs" onClick={() => inputRef.current?.focus()}>Focus via ref</Btn>
          </Row>
          <div style={{ fontSize: 11, color: C.textSub }}>
            Render count: <Code color={C.yellow}>{renders.current}</Code> &nbsp;|&nbsp;
            usePrevious: was <Code color={C.orange}>{prev ?? "—"}</Code>, now <Code color={C.green}>{count}</Code>
          </div>
        </Block>

        <Block title="Custom Hooks — useDebounce, useThrottle, useFetch" color={C.pink}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: C.textSub, fontSize: 11, marginBottom: 4 }}>useDebounce(500ms):</div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Type fast..." style={{ width: "100%", background: C.bgCode, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 10px", color: C.text, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
            <div style={{ fontSize: 11, marginTop: 4 }}>Raw: <Code color={C.yellow}>"{search}"</Code> Debounced: <Code color={C.green}>"{debouncedSearch}"</Code></div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: C.textSub, fontSize: 11, marginBottom: 4 }}>useThrottle(400ms):</div>
            <input type="range" min={0} max={100} value={slider} onChange={e => setSlider(+e.target.value)} style={{ width: "100%" }} />
            <div style={{ fontSize: 11 }}>Raw: <Code color={C.yellow}>{slider}</Code> Throttled: <Code color={C.green}>{throttled}</Code></div>
          </div>
          <div>
            <div style={{ color: C.textSub, fontSize: 11, marginBottom: 4 }}>useFetch — with loading state:</div>
            {loading ? <div style={{ color: C.textMuted, fontSize: 12 }}>⏳ Loading...</div> : data?.map((d, i) => <div key={i} style={{ color: C.text, fontSize: 12 }}>• {d}</div>)}
          </div>
        </Block>

        <Block title="useContext — Avoid Prop Drilling" color={C.orange}>
          <CodeBlock code={[
            { t: "// 1. Create context", c: C.textMuted },
            { t: "const ThemeCtx = createContext('light');", c: C.orange },
            { t: "", c: "" },
            { t: "// 2. Provide value at top level", c: C.textMuted },
            { t: "<ThemeCtx.Provider value={theme}>", c: C.green },
            { t: "  <App />", c: C.textSub },
            { t: "</ThemeCtx.Provider>", c: C.green },
            { t: "", c: "" },
            { t: "// 3. Consume anywhere (no prop drilling!)", c: C.textMuted },
            { t: "function DeepChild() {", c: C.cyan },
            { t: "  const theme = useContext(ThemeCtx);", c: C.cyan },
            { t: "  return <div className={theme}>...</div>;", c: C.textSub },
            { t: "}", c: C.cyan },
          ]} />
          <Alert type="warn"><strong>Performance:</strong> When Provider value changes, ALL consumers re-render. Split contexts by concern (ThemeCtx, AuthCtx, LocaleCtx) to minimize unnecessary re-renders.</Alert>
        </Block>

        <Block title="useMemo — Memoize Expensive Calculations" color={C.green}>
          <CodeBlock code={[
            { t: "// ✅ Only recalculates when dependencies change", c: C.textMuted },
            { t: "const sorted = useMemo(() => {", c: C.green },
            { t: "  return items.sort((a,b) => a.name.localeCompare(b.name));", c: C.textSub },
            { t: "}, [items]); // only re-sort when items change", c: C.green },
            { t: "", c: "" },
            { t: "// ❌ DON'T use for cheap operations", c: C.red },
            { t: "const doubled = useMemo(() => count * 2, [count]); // overkill!", c: C.red },
            { t: "", c: "" },
            { t: "// ✅ Use for: filtering, sorting, complex transforms", c: C.textMuted },
            { t: "// ❌ Don't use for: simple math, string concat", c: C.textMuted },
          ]} />
          <Alert type="info"><strong>useMemo</strong> caches a <em>value</em>. Returns the memoized result. Only recalculates when deps change.</Alert>
        </Block>

        <Block title="useCallback — Memoize Functions" color={C.purple}>
          <CodeBlock code={[
            { t: "// Without useCallback: new function every render", c: C.textMuted },
            { t: "const handleClick = () => doSomething(id); // ❌ new ref!", c: C.red },
            { t: "", c: "" },
            { t: "// With useCallback: same function reference", c: C.textMuted },
            { t: "const handleClick = useCallback(() => {", c: C.purple },
            { t: "  doSomething(id);", c: C.textSub },
            { t: "}, [id]); // ✅ stable ref, only changes when id changes", c: C.purple },
            { t: "", c: "" },
            { t: "// useCallback vs useMemo:", c: C.yellow },
            { t: "useCallback(fn, deps) ≡ useMemo(() => fn, deps)", c: C.yellow },
            { t: "// useCallback → memoizes the FUNCTION itself", c: C.textSub },
            { t: "// useMemo    → memoizes the RETURN VALUE", c: C.textSub },
          ]} />
          <Alert type="info"><strong>When to use:</strong> Pass stable callbacks to React.memo children, or when function is a useEffect dependency. Don't wrap every function — only when preventing re-renders matters.</Alert>
        </Block>

        <Block title="Rules of Hooks" color={C.red}>
          {[
            "✅ Only call hooks at the TOP LEVEL — not inside loops, conditions, or nested functions",
            "✅ Only call hooks inside REACT FUNCTIONS — components or custom hooks",
            "✅ Custom hook names MUST start with 'use' — useMyHook()",
            "❌ Never call hooks conditionally: if(x) useState()",
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "7px 10px", background: r.startsWith("❌") ? C.red + "12" : C.green + "12", border: `1px solid ${r.startsWith("❌") ? C.red : C.green}30`, borderRadius: 7, marginBottom: 6, fontSize: 12, color: r.startsWith("❌") ? C.red : C.green }}>{r}</div>
          ))}
        </Block>
      </Grid>
    </div>
  );
}

