import { useState } from "react";
import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag } from "../../shared";

export default function JS01_Fundamentals() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Variables & TDZ" color={C.yellow}>
        <Alert type="info">In modern JS, use <Code color={C.green}>const</Code> by default, <Code color={C.blue}>let</Code> if value changes. Avoid <Code color={C.red}>var</Code>.</Alert>
        <Grid cols={2} gap={10}>
          <div style={{ background: C.bgCode, padding: 12, borderRadius: 8 }}>
            <div style={{ color: C.yellow, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>var (Function Scoped)</div>
            {["Hoisted with undefined", "Can be re-declared", "Leaks out of blocks { }"].map(x => <div key={x} style={{ color: C.textSub, fontSize: 10, marginBottom: 3 }}>• {x}</div>)}
          </div>
          <div style={{ background: C.blue + "12", border: `1px solid ${C.blue}33`, padding: 12, borderRadius: 8 }}>
            <div style={{ color: C.blue, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>let/const (Block Scoped)</div>
            {["Hoisted but in TDZ", "Cannot be re-declared", "Stay inside blocks { }"].map(x => <div key={x} style={{ color: C.textSub, fontSize: 10, marginBottom: 3 }}>• {x}</div>)}
          </div>
        </Grid>
        <div style={{ marginTop: 12 }}>
          <Tag label="Temporal Dead Zone (TDZ)" color={C.red} />
          <div style={{ color: C.textSub, fontSize: 11, marginTop: 6 }}>The region of a block where a variable is unavailable until it is initialized. Accessing it throws <Code color={C.red}>ReferenceError</Code>.</div>
        </div>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Data Types (7 Primitive + 1 Reference)" color={C.blue}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["String", "Number", "Boolean", "Null", "Undefined", "Symbol", "BigInt"].map(t => (
              <div key={t} style={{ background: C.blue + "15", color: C.blue, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{t}</div>
            ))}
            <div style={{ background: C.purple + "15", color: C.purple, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Object (Array, Date, Fn...)</div>
          </div>
          <CodeBlock code={[
            { t: "typeof 42          // 'number'", c: C.green },
            { t: "typeof 'hello'     // 'string'", c: C.green },
            { t: "typeof null        // 'object' (⚠️ JS Bug)", c: C.red },
            { t: "typeof undefined   // 'undefined'", c: C.textSub },
          ]} />
        </Block>
        <Block title="Type Coercion (VIMP)" color={C.orange}>
          <Alert type="warn">Always use <Code color={C.green}>===</Code> (Strict Equality) to avoid unexpected coercion.</Alert>
          <CodeBlock code={[
            { t: "1 + '2'     // '12' (String conversion)", c: C.orange },
            { t: "1 - '2'     // -1   (Number conversion)", c: C.orange },
            { t: "[] == ![]   // true (Extreme edge case!)", c: C.red },
            { t: "null == undefined // true", c: C.yellow },
            { t: "null === undefined // false", c: C.green },
          ]} />
        </Block>
        <Block title="Truthy & Falsy" color={C.purple}>
          <div style={{ marginBottom: 8, color: C.textSub, fontSize: 11 }}>Common **Falsy** values:</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["false", "0", "'' (empty str)", "null", "undefined", "NaN"].map(f => <Tag key={f} label={f} color={C.red} />)}
          </div>
          <Alert type="info" style={{ marginTop: 10 }}>Everything else is **Truthy**, including empty objects <Code>{`{}`}</Code> and arrays <Code>{`[]`}</Code>.</Alert>
        </Block>
        <Block title="Strict Equality vs Loose" color={C.cyan}>
          <div style={{ background: C.bgCode, padding: 12, borderRadius: 8 }}>
            <div style={{ color: C.cyan, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>== (Abstract Equality)</div>
            <div style={{ color: C.textSub, fontSize: 10, marginBottom: 10 }}>Attempts to convert types before comparing. Causes bugs.</div>
            <div style={{ color: C.green, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>=== (Strict Equality)</div>
            <div style={{ color: C.textSub, fontSize: 10 }}>Compares both VALUE and TYPE. No coercion. Use this!</div>
          </div>
        </Block>
      </Grid>
    </div>
  );
}
