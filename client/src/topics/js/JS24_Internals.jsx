import { C_BASE } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../../shared";

export default function JS24_Internals() {
  const C = C_BASE;
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Browser Internals: How it works ⚙️" color={C.orange}>
        <Alert type="info">Understanding how the engine parses and renders your code is key to senior-level performance optimization.</Alert>
        <Grid cols={3} gap={10}>
          {[
            { t: "DOM Tree", d: "Parsing HTML into nodes.", c: C.blue },
            { t: "CSSOM Tree", d: "Parsing CSS into styles.", c: C.cyan },
            { t: "Render Tree", d: "Combining both for display.", c: C.green },
          ].map(x => (
            <div key={x.t} style={{ background: x.c + "10", border: `1px solid ${x.c}30`, padding: 10, borderRadius: 10 }}>
              <div style={{ color: x.c, fontWeight: 800, fontSize: 11 }}>{x.t}</div>
              <div style={{ fontSize: 9, marginTop: 4 }}>{x.d}</div>
            </div>
          ))}
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Reflow vs Repaint" color={C.red}>
          <div style={{ fontSize: 10, marginBottom: 8 }}>The two most expensive operations in the browser.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, background: C.red + "10", padding: 8, borderRadius: 8 }}>
              <Code color={C.red}>Reflow (Layout)</Code>
              <div style={{ fontSize: 9, marginTop: 4 }}>Recalculating geometry (width, height, top). Triggered by: window resize, DOM change.</div>
            </div>
            <div style={{ flex: 1, background: C.orange + "10", padding: 8, borderRadius: 8 }}>
              <Code color={C.orange}>Repaint (Paint)</Code>
              <div style={{ fontSize: 9, marginTop: 4 }}>Redrawing pixels. Triggered by: color, visibility, background change.</div>
            </div>
          </div>
          <Alert type="tip" style={{ marginTop: 8 }}><strong>Reflow causes Repaint!</strong> Minimize reflows by batching DOM updates or using `requestAnimationFrame`.</Alert>
        </Block>

        <Block title="V8 Engine: JIT Compilation" color={C.yellow}>
          <div style={{ fontSize: 10, marginBottom: 8 }}>How JavaScript runs at near-native speeds.</div>
          <div style={{ background: "rgba(0,0,0,0.1)", padding: 10, borderRadius: 8, fontSize: 10, lineHeight: 1.6 }}>
            1. <strong>Parser:</strong> Creates AST. <br/>
            2. <strong>Ignition (Interpreter):</strong> Bytecode generation. <br/>
            3. <strong>TurboFan (Compiler):</strong> Optimizes "hot" code. <br/>
            4. <strong>Garbage Collector (Orinoco):</strong> Reclaims memory.
          </div>
        </Block>

        <Block title="Memory Management: GC" color={C.green}>
          <div style={{ fontSize: 10, marginBottom: 8 }}>JavaScript uses a <strong>Mark-and-Sweep</strong> algorithm.</div>
          <CodeBlock code={[
            { t: "// ❌ Memory Leak Example", c: C.red },
            { t: "const leaked = [];", c: C.textSub },
            { t: "setInterval(() => { ", c: C.textSub },
            { t: "  leaked.push(new Array(1000000)); ", c: C.textSub },
            { t: "}, 100);", c: C.textSub },
          ]} />
          <div style={{ fontSize: 9, color: C.textSub, marginTop: 4 }}>Leaks usually happen in: Global variables, forgotten timers, closures.</div>
        </Block>

        <Block title="Microtasks vs Macrotasks" color={C.cyan}>
          <div style={{ fontSize: 10, marginBottom: 8 }}>The order of execution in the Event Loop.</div>
          <CodeBlock code={[
            { t: "console.log('1');", c: C.textSub },
            { t: "setTimeout(() => console.log('2'), 0);", c: C.yellow },
            { t: "Promise.resolve().then(() => console.log('3'));", c: C.cyan },
            { t: "console.log('4');", c: C.textSub },
            { t: "// Output: 1, 4, 3, 2", c: C.green },
          ]} />
          <Alert type="info" style={{ marginTop: 8 }}>Microtasks (Promises) ALWAYS run before Macrotasks (setTimeout).</Alert>
        </Block>
      </Grid>
    </div>
  );
}
