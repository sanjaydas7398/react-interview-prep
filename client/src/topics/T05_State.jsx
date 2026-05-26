import { useState } from "react";
import { C } from "../constants";
import { Block, CodeBlock, Btn, Alert, Code, Grid, Row } from "../shared";

export default function T05_State() {
  const [lifted, setLifted] = useState("");
  return (
    <div>
      <Grid cols={2} gap={12}>
        <Block title="Why NOT to mutate state directly" color={C.red}>
          <Alert type="error"><strong>NEVER mutate state directly!</strong> React uses referential equality to detect changes.</Alert>
          <CodeBlock code={[
            { t: "// ❌ WRONG — direct mutation", c: C.red },
            { t: "state.count = 5;      // React won't re-render!", c: C.red },
            { t: "state.items.push(x);  // same reference = no re-render", c: C.red },
            { t: "", c: "" },
            { t: "// ✅ CORRECT — new reference", c: C.green },
            { t: "setState(5);                          // new value", c: C.green },
            { t: "setState(p => [...p.items, x]);       // new array", c: C.green },
            { t: "setState(p => ({...p, user: {...p.user, name:'x'}}));", c: C.green },
          ]} />
        </Block>
        <Block title="Immutability — Why and How" color={C.yellow}>
          <CodeBlock code={[
            { t: "// ADD → spread", c: C.yellow },
            { t: "const newArr = [...old, newItem];", c: C.green },
            { t: "// REMOVE → filter", c: C.yellow },
            { t: "const newArr = old.filter(i => i.id !== id);", c: C.green },
            { t: "// UPDATE → map", c: C.yellow },
            { t: "const newArr = old.map(i => i.id === id ? {...i, ...changes} : i);", c: C.green },
            { t: "", c: "" },
            { t: "// Objects:", c: C.textMuted },
            { t: "const newObj = { ...old, name: 'new' };", c: C.green },
          ]} />
        </Block>
        <Block title="Lifting State Up" color={C.cyan}>
          <Alert type="info">When two sibling components need to share state, move the state up to their common parent and pass it down as props.</Alert>
          <div style={{ background: C.bgCode, borderRadius: 9, padding: 14 }}>
            <div style={{ color: C.cyan, fontSize: 11, fontFamily: C.mono, textAlign: "center", marginBottom: 10 }}>Parent (owns state)</div>
            <input value={lifted} onChange={e => setLifted(e.target.value)} placeholder="Type here (state lives in parent)..."
              style={{ width: "100%", background: C.bgPanel, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 10px", color: C.text, fontSize: 12, outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
            <Grid cols={2} gap={8}>
              <div style={{ background: C.blue + "15", border: `1px solid ${C.blue}33`, borderRadius: 8, padding: 10 }}>
                <div style={{ color: C.blue, fontSize: 10, fontFamily: C.mono, marginBottom: 4 }}>ChildA (input)</div>
                <div style={{ color: C.textSub, fontSize: 11 }}>receives: onChange callback</div>
              </div>
              <div style={{ background: C.green + "15", border: `1px solid ${C.green}33`, borderRadius: 8, padding: 10 }}>
                <div style={{ color: C.green, fontSize: 10, fontFamily: C.mono, marginBottom: 4 }}>ChildB (display)</div>
                <div style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>{lifted || "(empty)"}</div>
              </div>
            </Grid>
          </div>
        </Block>
        <Block title="Prop Drilling — Problem & Solution" color={C.purple}>
          <div style={{ background: C.bgCode, borderRadius: 9, padding: 14, textAlign: "center" }}>
            {[
              { l: "App (user state)", c: C.purple },
              { l: "↓ user as prop", c: C.textMuted, a: true },
              { l: "Dashboard (passes user)", c: C.textSub },
              { l: "↓ user as prop", c: C.textMuted, a: true },
              { l: "Sidebar (passes user)", c: C.textSub },
              { l: "↓ user as prop", c: C.textMuted, a: true },
              { l: "UserProfile (uses user!) ← needs it", c: C.red },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 3 }}>
                {item.a
                  ? <div style={{ color: C.textMuted, fontSize: 10 }}>{item.l}</div>
                  : <div style={{ background: item.c + "18", border: `1px solid ${item.c}33`, borderRadius: 6, padding: "4px 10px", display: "inline-block", color: item.c, fontSize: 11 }}>{item.l}</div>
                }
              </div>
            ))}
          </div>
          <Alert type="info"><strong>Solutions:</strong> (1) Context API for global state, (2) Component composition, (3) State management library (Redux/Zustand)</Alert>
        </Block>
        <Block title="Derived State" color={C.orange}>
          <Alert type="info"><strong>Derived state</strong> is computed from existing state/props — do NOT store it in separate useState. Compute it during render!</Alert>
          <CodeBlock code={[
            { t: "// ❌ BAD — redundant state", c: C.red },
            { t: "const [items, setItems] = useState([...]);", c: C.textSub },
            { t: "const [filteredItems, setFiltered] = useState([]);", c: C.red },
            { t: "useEffect(() => setFiltered(items.filter(...)), [items]);", c: C.red },
            { t: "", c: "" },
            { t: "// ✅ GOOD — derive during render (or useMemo)", c: C.green },
            { t: "const [items, setItems] = useState([...]);", c: C.textSub },
            { t: "const filteredItems = items.filter(i => i.active);", c: C.green },
            { t: "// or: const filteredItems = useMemo(() => ..., [items]);", c: C.green },
          ]} />
        </Block>
        <Block title="Refs vs Controlled Inputs" color={C.pink}>
          <CodeBlock code={[
            { t: "// CONTROLLED — React manages value", c: C.green },
            { t: "const [val, setVal] = useState('');", c: C.textSub },
            { t: "<input value={val} onChange={e => setVal(e.target.value)}/>", c: C.green },
            { t: "// Re-renders on every keystroke", c: C.textMuted },
            { t: "", c: "" },
            { t: "// UNCONTROLLED — DOM manages value (via ref)", c: C.yellow },
            { t: "const ref = useRef();", c: C.textSub },
            { t: "<input ref={ref} defaultValue='initial'/>", c: C.yellow },
            { t: "// Read on submit: ref.current.value", c: C.textMuted },
            { t: "// No re-renders on keystroke! ⚡", c: C.textMuted },
          ]} />
          <Alert type="info"><strong>Use controlled</strong> when you need real-time validation or derived UI. <strong>Use uncontrolled</strong> (refs) for simple forms or performance-critical inputs (React Hook Form uses this!).</Alert>
        </Block>
      </Grid>
    </div>
  );
}
