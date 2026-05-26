import { useState } from "react";
import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Btn, Tag, Spacer, Row } from "../../shared";

export default function JS07_Async_Modern() {
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Async / Await ⭐" color={C.pink}>
        <Alert type="info">**Async/Await** is syntactic sugar for Promises, making asynchronous code look and behave more like synchronous code.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock title="Clean Async Request" code={[
              { t: "async function fetchData() {", c: C.pink },
              { t: "  try {", c: C.purple },
              { t: "    const res = await api.get('/user');", c: C.textSub },
              { t: "    console.log(res.data);", c: C.green },
              { t: "  } catch (err) {", c: C.red },
              { t: "    console.error(err);", c: C.textSub },
              { t: "  } finally {", c: C.blue },
              { t: "    setLoading(false);", c: C.textSub },
              { t: "  }", c: C.purple },
              { t: "}", c: C.pink },
            ]} />
          </div>
          <div style={{ color: C.textSub, fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: C.pink, fontWeight: 700, marginBottom: 4 }}>Key Advantages:</div>
            • <strong>Better Error Handling:</strong> Standard `try/catch`.<br/>
            • <strong>Readability:</strong> No more `.then()` chaining.<br/>
            • <strong>Debugging:</strong> Stack traces are cleaner.<br/>
            • <strong>Conditionals:</strong> Much easier than with nested Promises.
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Parallel vs Sequential" color={C.blue}>
          <div style={{ background: C.bgCode, padding: 12, borderRadius: 10, marginBottom: 10 }}>
            <div style={{ color: C.red, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Sequential (Slow 🐢)</div>
            <CodeBlock code={[
              { t: "const a = await fetchA();", c: C.textSub },
              { t: "const b = await fetchB(); // Waits for A", c: C.textSub },
            ]} />
            <div style={{ color: C.green, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Parallel (Fast 🚀)</div>
            <CodeBlock code={[
              { t: "const [a, b] = await Promise.all([", c: C.green },
              { t: "  fetchA(), fetchB()", c: C.textSub },
              { t: "]);", c: C.green },
            ]} />
          </div>
        </Block>
        <Block title="Timers (Accuracy & 0ms)" color={C.orange}>
          <Alert type="warn">`setTimeout(cb, 0)` does NOT run immediately. It is scheduled in the Macrotask queue for the next loop cycle.</Alert>
          <CodeBlock code={[
            { t: "console.log('1');", c: C.textSub },
            { t: "setTimeout(() => console.log('2'), 0);", c: C.orange },
            { t: "Promise.resolve().then(() => console.log('3'));", c: C.pink },
            { t: "console.log('4');", c: C.textSub },
            { t: "", c: "" },
            { t: "// Output: 1, 4, 3, 2", c: C.green },
          ]} />
          <div style={{ color: C.textMuted, fontSize: 9 }}>Note: Timers are throttled by the browser (min ~4ms) if nested or tab is in background.</div>
        </Block>
        <Block title="AbortController" color={C.red}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Used to cancel ongoing fetch requests (e.g., component unmount).</div>
          <CodeBlock code={[
            { t: "const ctrl = new AbortController();", c: C.red },
            { t: "fetch('/api', { signal: ctrl.signal });", c: C.textSub },
            { t: "", c: "" },
            { t: "// Later...", c: C.textMuted },
            { t: "ctrl.abort(); // Request cancelled!", c: C.red },
          ]} />
        </Block>
        <Block title="Top-Level Await" color={C.cyan}>
          <Alert type="info">In ES Modules, you can use `await` outside of `async` functions at the top level.</Alert>
          <CodeBlock code={[
            { t: "// my-module.js", c: C.textMuted },
            { t: "const data = await fetchConfig();", c: C.cyan },
            { t: "export { data };", c: C.textSub },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
