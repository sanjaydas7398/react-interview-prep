import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag } from "../../shared";

export default function JS09_Collections() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Map vs Object" color={C.purple}>
        <Alert type="info">**Map** is a collection of keyed data items, similar to an Object. But Map allows keys of **ANY type**.</Alert>
        <Grid cols={2} gap={15}>
          <div style={{ background: C.bgCode, padding: 12, borderRadius: 10 }}>
            <div style={{ color: C.purple, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Map Benefits</div>
            {["Keys can be anything (Object, Fn, etc)", "Preserves insertion order", "Better performance for frequent add/remove", "Size property available"].map(x => <div key={x} style={{ color: C.textSub, fontSize: 10, marginBottom: 4 }}>✅ {x}</div>)}
          </div>
          <div>
            <CodeBlock code={[
              { t: "const m = new Map();", c: C.purple },
              { t: "m.set(obj, 'metadata');", c: C.textSub },
              { t: "m.get(obj); // 'metadata'", c: C.green },
              { t: "m.size; // 1", c: C.textSub },
            ]} />
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Set — Unique Values" color={C.green}>
          <Alert type="info">A collection of **unique** values. No duplicates allowed.</Alert>
          <CodeBlock code={[
            { t: "const s = new Set([1, 2, 2, 3]);", c: C.green },
            { t: "console.log(s); // Set {1, 2, 3}", c: C.textSub },
            { t: "", c: "" },
            { t: "// Quick array de-duplication", c: C.textMuted },
            { t: "const unique = [...new Set(arr)];", c: C.green },
          ]} />
        </Block>
        <Block title="WeakMap & WeakSet" color={C.pink}>
          <Alert type="warn">Keys must be **Objects**. If the object is garbage collected, the entry is automatically removed.</Alert>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Used for memory-efficient metadata storage.</div>
          <CodeBlock code={[
            { t: "const wm = new WeakMap();", c: C.pink },
            { t: "let user = { id: 1 };", c: C.textSub },
            { t: "wm.set(user, 'some data');", c: C.textSub },
            { t: "user = null; // Entry in wm is gone!", c: C.red },
          ]} />
        </Block>
        <Block title="When to use what?" color={C.cyan}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { type: "Object", use: "Simple data, JSON, fixed keys.", color: C.blue },
              { type: "Map", use: "Dynamic keys, high frequency edits.", color: C.purple },
              { type: "Set", use: "Unique lists, membership checking.", color: C.green },
              { type: "WeakMap", use: "Private data, preventing memory leaks.", color: C.pink },
            ].map(x => (
              <div key={x.type} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", background: x.color + "10", border: `1px solid ${x.color}33`, borderRadius: 8 }}>
                <span style={{ color: x.color, fontWeight: 700, fontSize: 11 }}>{x.type}</span>
                <span style={{ color: C.textSub, fontSize: 10 }}>{x.use}</span>
              </div>
            ))}
          </div>
        </Block>
        <Block title="Iteration" color={C.orange}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Maps and Sets are **Iterables**.</div>
          <CodeBlock code={[
            { t: "for (let [key, val] of myMap) { ... }", c: C.orange },
            { t: "myMap.forEach((v, k) => { ... });", c: C.textSub },
            { t: "for (let val of mySet) { ... }", c: C.green },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
