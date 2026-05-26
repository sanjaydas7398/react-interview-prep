import { useState } from "react";
import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Btn, Tag, Spacer } from "../../shared";

export default function JS03_Functions_Adv() {
  const [count, setCount] = useState(0);

  // Closure Demo
  const createCounter = () => {
    let internal = 0;
    return () => { internal++; return internal; };
  };
  const [counterFn] = useState(() => createCounter());
  const [internalVal, setInternalVal] = useState(0);

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Closures ⭐ (Most Asked!)" color={C.purple}>
        <Alert type="info">A **Closure** is the combination of a function bundled together with references to its surrounding state (lexical environment).</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock title="Counting with Closure" code={[
              { t: "function outer() {", c: C.purple },
              { t: "  let count = 0;", c: C.textSub },
              { t: "  return function inner() {", c: C.cyan },
              { t: "    count++;", c: C.textSub },
              { t: "    return count;", c: C.textSub },
              { t: "  };", c: C.cyan },
              { t: "}", c: C.purple },
              { t: "const myCounter = outer();", c: C.green },
            ]} />
            <div style={{ background: C.bgCode, padding: 12, borderRadius: 8 }}>
              <div style={{ color: C.textSub, fontSize: 11, marginBottom: 8 }}>Live Demo: <Code color={C.green}>{internalVal}</Code></div>
              <Btn size="xs" onClick={() => setInternalVal(counterFn())}>Execute Closure</Btn>
            </div>
          </div>
          <div style={{ color: C.textSub, fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: C.purple, fontWeight: 700, marginBottom: 4 }}>Key Use Cases:</div>
            • <strong>Data Privacy:</strong> Creating private variables.<br/>
            • <strong>Function Factories:</strong> Generating functions with preset values.<br/>
            • <strong>Memoization:</strong> Caching results across calls.<br/>
            • <strong>Event Handlers:</strong> Preserving state when events fire.
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="this Keyword" color={C.pink}>
          <Alert type="info">The value of <Code color={C.pink}>this</Code> depends on **HOW** a function is called, not where it is defined.</Alert>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { type: "Global Stage", val: "window / undefined (strict)", color: C.blue },
              { type: "Object Method", val: "The object itself", color: C.green },
              { type: "Arrow Fn", val: "Lexical (from parent context)", color: C.cyan },
              { type: "Constructor", val: "The new instance", color: C.yellow },
              { type: "Manual Bind", val: "call(), apply(), bind()", color: C.purple },
            ].map(x => (
              <div key={x.type} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: x.color + "10", border: `1px solid ${x.color}33`, borderRadius: 7 }}>
                <span style={{ color: x.color, fontWeight: 700, fontSize: 11 }}>{x.type}</span>
                <span style={{ color: C.textSub, fontSize: 10 }}>{x.val}</span>
              </div>
            ))}
          </div>
        </Block>
        <Block title="call(), apply(), bind()" color={C.yellow}>
          <CodeBlock code={[
            { t: "// 1. call — immediate, comma separated", c: C.textMuted },
            { t: "greet.call(obj, 'Hi', 'Dev');", c: C.yellow },
            { t: "", c: "" },
            { t: "// 2. apply — immediate, array of args", c: C.textMuted },
            { t: "greet.apply(obj, ['Hi', 'Dev']);", c: C.orange },
            { t: "", c: "" },
            { t: "// 3. bind — returns NEW function", c: C.textMuted },
            { t: "const boundG = greet.bind(obj);", c: C.cyan },
            { t: "boundG('Hi', 'Dev');", c: C.textSub },
          ]} />
        </Block>
        <Block title="Hoisting" color={C.orange}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: C.orange + "12", border: `1px solid ${C.orange}33`, borderRadius: 8, padding: 10 }}>
              <div style={{ color: C.orange, fontWeight: 700, fontSize: 11, marginBottom: 6 }}>FUNCTION HOISTING</div>
              <div style={{ color: C.textSub, fontSize: 10 }}>Full function is moved to top. Call it before definition? ✅ OK!</div>
            </div>
            <div style={{ background: C.red + "12", border: `1px solid ${C.red}33`, borderRadius: 8, padding: 10 }}>
              <div style={{ color: C.red, fontWeight: 700, fontSize: 11, marginBottom: 6 }}>VAR HOISTING</div>
              <div style={{ color: C.textSub, fontSize: 10 }}>Only declaration is moved. Initialized with `undefined`.</div>
            </div>
          </div>
          <Spacer h={8} />
          <Alert type="warn">Classes, <Code>let</Code>, and <Code>const</Code> are also hoisted but stay in the **Temporal Dead Zone (TDZ)** until initialization.</Alert>
        </Block>
        <Block title="Pure Functions" color={C.green}>
          <div style={{ color: C.textSub, fontSize: 11, marginBottom: 8 }}>A function that:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {["Returns same output for same input", "Has NO side effects (no DOM / API / Global changes)"].map(x => <div key={x} style={{ color: C.green, fontSize: 11 }}>✅ {x}</div>)}
          </div>
          <CodeBlock style={{ marginTop: 10 }} code={[
            { t: "// PURE", c: C.green },
            { t: "const add = (a, b) => a + b;", c: C.textSub },
            { t: "", c: "" },
            { t: "// IMPURE", c: C.red },
            { t: "let x = 0; const inc = () => x++;", c: C.textSub },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
