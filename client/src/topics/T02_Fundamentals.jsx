import { useState, useRef } from "react";
import { C } from "../constants";
import { Block, CodeBlock, Btn, Alert, Code, Grid, Row, Spacer } from "../shared";

export default function T02_Fundamentals() {
  const [role, setRole] = useState("ADMIN");
  const [items] = useState(["Task A", "Task B", "Task C"]);
  const [controlled, setControlled] = useState("I am controlled");
  const uncontrolledRef = useRef();
  return (
    <div>
      <Block title="What is React & Why it Exists" color={C.blue}>
        <Alert type="info"><strong>React</strong> is a JavaScript library (not a framework) for building user interfaces — created by Facebook (2013). It solves the problem of efficiently updating complex UIs by using a component-based architecture and Virtual DOM.</Alert>
        <Grid cols={3} gap={8}>
          {[
            { label: "Component-Based", desc: "Build encapsulated pieces of UI that manage their own state", color: C.blue },
            { label: "Declarative", desc: "Describe WHAT the UI should look like, React handles HOW to update the DOM", color: C.green },
            { label: "Learn Once, Write Anywhere", desc: "Web (ReactDOM), Mobile (React Native), Desktop (Electron)", color: C.purple },
          ].map(x => (
            <div key={x.label} style={{ background: x.color + "12", border: `1px solid ${x.color}33`, borderRadius: 9, padding: 10 }}>
              <div style={{ color: x.color, fontWeight: 700, fontSize: 11, marginBottom: 4 }}>{x.label}</div>
              <div style={{ color: C.textSub, fontSize: 10, lineHeight: 1.6 }}>{x.desc}</div>
            </div>
          ))}
        </Grid>
      </Block>

      <Block title="JSX — How it works behind the scenes" color={C.blue}>
        <Grid cols={2} gap={10}>
          <div>
            <div style={{ color: C.textSub, fontSize: 11, marginBottom: 6 }}>You write JSX:</div>
            <CodeBlock code={[
              { t: "// JSX →", c: C.textMuted },
              { t: "<Button color='blue' onClick={fn}>", c: C.cyan },
              { t: "  Click Me", c: C.green },
              { t: "</Button>", c: C.cyan },
            ]} />
          </div>
          <div>
            <div style={{ color: C.textSub, fontSize: 11, marginBottom: 6 }}>Babel compiles to:</div>
            <CodeBlock code={[
              { t: "// Compiled by Babel →", c: C.textMuted },
              { t: "React.createElement(", c: C.yellow },
              { t: "  Button,           // type", c: C.textSub },
              { t: "  { color:'blue', onClick:fn }, // props", c: C.textSub },
              { t: "  'Click Me'        // children", c: C.green },
              { t: ")", c: C.yellow },
            ]} />
          </div>
        </Grid>
        <Alert type="info">JSX is <strong>syntactic sugar</strong>. It's not HTML — it's JavaScript. Babel transforms it to React.createElement() calls which return plain JS objects (React elements).</Alert>
      </Block>
      <Grid cols={2} gap={12}>
        <Block title="Props vs State" color={C.blue}>
          <Grid cols={2} gap={8}>
            {[
              { name: "PROPS", color: C.blue, points: ["Passed from parent", "Read-only in child", "External data input", "Triggers re-render if changed", "Like function parameters"] },
              { name: "STATE", color: C.green, points: ["Internal to component", "Can change over time", "useState / useReducer", "Triggers re-render", "Like private variables"] },
            ].map(x => (
              <div key={x.name} style={{ background: x.color + "12", border: `1px solid ${x.color}33`, borderRadius: 9, padding: 12 }}>
                <div style={{ color: x.color, fontWeight: 700, fontSize: 12, marginBottom: 8, fontFamily: C.mono }}>{x.name}</div>
                {x.points.map(p => <div key={p} style={{ color: C.textSub, fontSize: 11, marginBottom: 3 }}>• {p}</div>)}
              </div>
            ))}
          </Grid>
        </Block>
        <Block title="One-Way Data Flow" color={C.cyan}>
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            {[
              { label: "Parent Component", sub: "holds state", color: C.blue },
              { label: "↓ passes props down", color: C.textMuted, isArrow: true },
              { label: "Child Component", sub: "reads props, cannot modify", color: C.green },
              { label: "↑ calls callback to update", color: C.textMuted, isArrow: true },
              { label: "Parent updates state", sub: "triggers re-render", color: C.yellow },
            ].map((item, i) => (
              <div key={i} style={item.isArrow ? { color: C.textMuted, fontSize: 11, margin: "4px 0" } : {
                background: item.color + "15", border: `1px solid ${item.color}33`, borderRadius: 8, padding: "8px 14px", margin: "4px auto", maxWidth: 220
              }}>
                {item.isArrow ? item.label : <>
                  <div style={{ color: item.color, fontWeight: 700, fontSize: 12 }}>{item.label}</div>
                  <div style={{ color: C.textMuted, fontSize: 10 }}>{item.sub}</div>
                </>}
              </div>
            ))}
          </div>
        </Block>
        <Block title="Conditional Rendering — 3 Patterns" color={C.purple}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {["ADMIN", "USER", "GUEST"].map(r => <Btn key={r} variant={role === r ? "purple" : "outline"} size="xs" onClick={() => setRole(r)}>{r}</Btn>)}
          </div>
          <CodeBlock code={[
            { t: "// 1. Ternary operator (inline)", c: C.textMuted },
            { t: `{role === 'ADMIN' ? <AdminPanel/> : <UserPanel/>}`, c: C.cyan },
            { t: "", c: "" },
            { t: "// 2. && operator (show/hide)", c: C.textMuted },
            { t: `{role === 'ADMIN' && <DeleteButton/>}`, c: C.green },
            { t: "", c: "" },
            { t: "// 3. if-else (return early)", c: C.textMuted },
            { t: `if (!user) return <LoginPage/>;`, c: C.yellow },
          ]} />
          <div style={{ background: C.bgCode, borderRadius: 8, padding: 10, fontSize: 12, textAlign: "center" }}>
            {role === "ADMIN" && <span style={{ color: C.red }}>🔴 ADMIN: sees delete button (&&)</span>}
            {role === "USER" && <span style={{ color: C.blue }}>🔵 USER: limited access (ternary)</span>}
            {role === "GUEST" && <span style={{ color: C.textSub }}>⚪ GUEST: redirected (if-else early return)</span>}
          </div>
        </Block>
        <Block title="Lists & Keys — Why keys matter" color={C.yellow}>
          <Alert type="warn"><strong>Keys help React identify which items changed, were added, or removed.</strong> Without proper keys, React may re-render the wrong items or lose component state.</Alert>
          <CodeBlock code={[
            { t: "// ❌ BAD — index as key (avoid if list can reorder)", c: C.red },
            { t: "items.map((item, index) => (", c: C.textSub },
            { t: "  <li key={index}>{item}</li> // BUG if reordered!", c: C.red },
            { t: "))", c: C.textSub },
            { t: "", c: "" },
            { t: "// ✅ GOOD — stable unique ID as key", c: C.green },
            { t: "items.map(item => (", c: C.textSub },
            { t: "  <li key={item.id}>{item.name}</li>", c: C.green },
            { t: "))", c: C.textSub },
          ]} />
          <div>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 10px", background: C.bgCode, borderRadius: 6, marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: C.text }}>{item}</span>
                <span style={{ color: C.textMuted, fontFamily: C.mono, fontSize: 10 }}>key="{i}" (index - bad!)</span>
              </div>
            ))}
          </div>
        </Block>
      </Grid>

      <Grid cols={2} gap={12}>
        <Block title="React Rendering Process" color={C.orange}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { step: "1. Trigger", desc: "State change (setState) or parent re-render", color: C.blue },
              { step: "2. Render Phase", desc: "React calls your component function → returns JSX → creates new VDOM", color: C.cyan },
              { step: "3. Reconciliation", desc: "Diff old VDOM vs new VDOM → find minimum changes", color: C.purple },
              { step: "4. Commit Phase", desc: "Apply changes to real DOM → run useEffect/useLayoutEffect", color: C.green },
              { step: "5. Paint", desc: "Browser paints updated pixels on screen", color: C.orange },
            ].map(x => (
              <div key={x.step} style={{ display: "flex", gap: 10, padding: "6px 10px", background: x.color + "10", border: `1px solid ${x.color}22`, borderRadius: 7 }}>
                <span style={{ color: x.color, fontWeight: 700, fontSize: 11, minWidth: 80 }}>{x.step}</span>
                <span style={{ color: C.textSub, fontSize: 11 }}>{x.desc}</span>
              </div>
            ))}
          </div>
        </Block>
        <Block title="Controlled vs Uncontrolled Components" color={C.green}>
          <Grid cols={2} gap={8}>
            <div style={{ background: C.green + "12", border: `1px solid ${C.green}33`, borderRadius: 9, padding: 10 }}>
              <div style={{ color: C.green, fontWeight: 700, fontSize: 11, marginBottom: 6 }}>CONTROLLED</div>
              <div style={{ color: C.textSub, fontSize: 10, marginBottom: 4 }}>React controls the value via state</div>
              <input value={controlled} onChange={e => setControlled(e.target.value)} style={{ width: "100%", background: C.bgCode, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", color: C.text, fontSize: 11, outline: "none", boxSizing: "border-box" }} />
              <div style={{ color: C.textMuted, fontSize: 9, marginTop: 4 }}>Value: <Code color={C.green}>{controlled}</Code></div>
            </div>
            <div style={{ background: C.yellow + "12", border: `1px solid ${C.yellow}33`, borderRadius: 9, padding: 10 }}>
              <div style={{ color: C.yellow, fontWeight: 700, fontSize: 11, marginBottom: 6 }}>UNCONTROLLED</div>
              <div style={{ color: C.textSub, fontSize: 10, marginBottom: 4 }}>DOM holds the value, read with ref</div>
              <input ref={uncontrolledRef} defaultValue="I am uncontrolled" style={{ width: "100%", background: C.bgCode, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", color: C.text, fontSize: 11, outline: "none", boxSizing: "border-box" }} />
              <Btn size="xs" style={{ marginTop: 4 }} variant="ghost" onClick={() => alert(uncontrolledRef.current?.value)}>Read ref</Btn>
            </div>
          </Grid>
        </Block>
        <Block title="Fragments — <> vs <React.Fragment>" color={C.purple}>
          <CodeBlock code={[
            { t: "// ❌ Extra DOM wrapper div (bad for layout/semantics)", c: C.red },
            { t: "<div>", c: C.red },
            { t: "  <Header/> <Content/>", c: C.textSub },
            { t: "</div>", c: C.red },
            { t: "", c: "" },
            { t: "// ✅ Fragment — no extra DOM node!", c: C.green },
            { t: "<React.Fragment>", c: C.green },
            { t: "  <Header/> <Content/>", c: C.textSub },
            { t: "</React.Fragment>", c: C.green },
            { t: "", c: "" },
            { t: "// ✅ Shorthand (but can't pass key prop)", c: C.cyan },
            { t: "<> <Header/> <Content/> </>", c: C.cyan },
            { t: "", c: "" },
            { t: "// ✅ With key (must use full form)", c: C.yellow },
            { t: "items.map(i => <React.Fragment key={i.id}>...</React.Fragment>)", c: C.yellow },
          ]} />
        </Block>
        <Block title="Children Prop — Composition Pattern" color={C.cyan}>
          <CodeBlock code={[
            { t: "// Card component using children prop", c: C.textMuted },
            { t: "function Card({ title, children }) {", c: C.cyan },
            { t: "  return (", c: C.textSub },
            { t: "    <div className='card'>", c: C.textSub },
            { t: "      <h3>{title}</h3>", c: C.textSub },
            { t: "      {children} {/* Renders whatever is inside <Card>...</Card> */}", c: C.green },
            { t: "    </div>", c: C.textSub },
            { t: "  );", c: C.textSub },
            { t: "}", c: C.cyan },
            { t: "", c: "" },
            { t: "// Usage — flexible composition!", c: C.textMuted },
            { t: "<Card title='Stats'> <Chart/> </Card>", c: C.green },
            { t: "<Card title='Form'> <LoginForm/> </Card>", c: C.green },
          ]} />
          <Alert type="info"><strong>children</strong> is a special prop that lets you compose components like HTML. Any JSX between opening and closing tags is passed as <Code color={C.cyan}>props.children</Code>.</Alert>
        </Block>
        <Block title="StrictMode" color={C.red}>
          <CodeBlock code={[
            { t: "// Wrap your app in StrictMode", c: C.textMuted },
            { t: "<React.StrictMode>", c: C.red },
            { t: "  <App />", c: C.textSub },
            { t: "</React.StrictMode>", c: C.red },
          ]} />
          <Alert type="warn"><strong>StrictMode (dev only):</strong> Double-invokes render, useState initializer, useMemo to catch side effects. Does NOT affect production. Helps find: impure renders, missing cleanup in effects, deprecated APIs.</Alert>
          {[
            "Double-invokes component functions → catches impure renders",
            "Double-invokes effect setup + cleanup → catches missing cleanup",
            "Warns about deprecated APIs like findDOMNode",
            "Does NOT render extra DOM nodes",
            "Only active in development mode",
          ].map((r, i) => (
            <div key={i} style={{ padding: "5px 10px", background: C.red + "10", borderRadius: 6, marginBottom: 4, fontSize: 11, color: C.textSub }}>• {r}</div>
          ))}
        </Block>
      </Grid>
    </div>
  );
}
