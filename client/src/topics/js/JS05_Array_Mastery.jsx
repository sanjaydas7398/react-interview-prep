import { useState } from "react";
import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Btn, Tag, Spacer } from "../../shared";

export default function JS05_Array_Mastery() {
  const [items] = useState([10, 20, 30, 40]);

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Iteration Methods (Map, Filter, Reduce) ⭐" color={C.green}>
        <Alert type="info">These methods are **Declarative**, meaning they don't mutate the original array and return a NEW array/value.</Alert>
        <Grid cols={3} gap={12}>
          <div style={{ background: C.green + "10", border: `1px solid ${C.green}33`, padding: 12, borderRadius: 10 }}>
            <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>1. map()</div>
            <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Transforms every item in the array.</div>
            <Code color={C.green}>[a, b] → [A, B]</Code>
          </div>
          <div style={{ background: C.blue + "10", border: `1px solid ${C.blue}33`, padding: 12, borderRadius: 10 }}>
            <div style={{ color: C.blue, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>2. filter()</div>
            <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Removes items based on a condition.</div>
            <Code color={C.blue}>[1, 2] → [2]</Code>
          </div>
          <div style={{ background: C.yellow + "10", border: `1px solid ${C.yellow}33`, padding: 12, borderRadius: 10 }}>
            <div style={{ color: C.yellow, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>3. reduce()</div>
            <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Accumulates items into a single result.</div>
            <Code color={C.yellow}>[1, 2] → 3</Code>
          </div>
        </Grid>
        <Spacer h={14} />
        <CodeBlock code={[
          { t: "const doubled = items.map(n => n * 2);      // [20, 40, 60, 80]", c: C.green },
          { t: "const high    = items.filter(n => n > 25);  // [30, 40]", c: C.blue },
          { t: "const total   = items.reduce((sum, n) => sum + n, 0); // 100", c: C.yellow },
        ]} />
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Polyfill Workshop: map()" color={C.cyan}>
          <div style={{ marginBottom: 10, color: C.textSub, fontSize: 11 }}>Interviewer: "Can you implement <Code>.map()</Code> from scratch?"</div>
          <CodeBlock code={[
            { t: "Array.prototype.myMap = function(callback) {", c: C.cyan },
            { t: "  const result = [];", c: C.textSub },
            { t: "  for (let i = 0; i < this.length; i++) {", c: C.textSub },
            { t: "    result.push(callback(this[i], i, this));", c: C.green },
            { t: "  }", c: C.textSub },
            { t: "  return result;", c: C.textSub },
            { t: "};", c: C.cyan },
          ]} />
        </Block>
        <Block title="Modification (Mutating vs Non-Mutating)" color={C.orange}>
          <Grid cols={2} gap={8}>
            <div style={{ background: C.red + "10", padding: 8, borderRadius: 8 }}>
              <div style={{ color: C.red, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Mutating (Avoid)</div>
              {["push / pop", "shift / unshift", "splice", "sort", "reverse"].map(m => <div key={m} style={{ fontSize: 9, color: C.textSub }}>• {m}</div>)}
            </div>
            <div style={{ background: C.green + "10", padding: 8, borderRadius: 8 }}>
              <div style={{ color: C.green, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Immutable (Prefer)</div>
              {["concat", "slice", "[...spread]", "filter", "map"].map(m => <div key={m} style={{ fontSize: 9, color: C.textSub }}>• {m}</div>)}
            </div>
          </Grid>
          <Spacer h={10} />
          <Alert type="warn">Always create a copy before using mutating methods (like sort) in React!</Alert>
        </Block>
        <Block title="Essential Methods Checklist" color={C.purple}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {[
              { m: "find()", d: "First matching item" },
              { m: "findIndex()", d: "First matching index" },
              { m: "some()", d: "At least one matches?" },
              { m: "every()", d: "All items match?" },
              { m: "flat()", d: "Flatten nested arrays" },
              { m: "includes()", d: "Check for existence" },
            ].map(x => (
              <div key={x.m} style={{ background: C.bgCode, padding: "5px 10px", borderRadius: 6 }}>
                <div style={{ color: C.purple, fontSize: 10, fontWeight: 700 }}>{x.m}</div>
                <div style={{ color: C.textMuted, fontSize: 9 }}>{x.d}</div>
              </div>
            ))}
          </div>
        </Block>
        <Block title="Array.from() & spread" color={C.blue}>
          <CodeBlock code={[
            { t: "// 1. Convert Set/Map to Array", c: C.textMuted },
            { t: "Array.from(new Set([1, 1, 2])); // [1, 2]", c: C.blue },
            { t: "", c: "" },
            { t: "// 2. Create range", c: C.textMuted },
            { t: "Array.from({ length: 5 }, (_, i) => i); // [0..4]", c: C.cyan },
            { t: "", c: "" },
            { t: "// 3. Clone with spread", c: C.textMuted },
            { t: "const copy = [...original];", c: C.green },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
