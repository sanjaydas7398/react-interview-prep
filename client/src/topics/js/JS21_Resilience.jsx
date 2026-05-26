import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../../shared";

export default function JS21_Resilience() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Exponential Backoff Retry Strategy 🛡️" color={C.pink}>
        <Alert type="info">A production-standard algorithm to retry failed operations with increasing delays.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock code={[
              { t: "async function fetchWithRetry(url, retries = 3) {", c: C.pink },
              { t: "  try {", c: C.textSub },
              { t: "    return await fetch(url).then(r => r.json());", c: C.textSub },
              { t: "  } catch (err) {", c: C.textSub },
              { t: "    if (retries === 0) throw err;", c: C.red },
              { t: "    const delay = 500 * (4 - retries); // Backoff", c: C.green },
              { t: "    await new Promise(r => setTimeout(r, delay));", c: C.textSub },
              { t: "    return fetchWithRetry(url, retries - 1);", c: C.textSub },
              { t: "  }", c: C.pink },
              { t: "}", c: C.pink },
            ]} />
          </div>
          <div style={{ color: C.textSub, fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: C.pink, fontWeight: 700, marginBottom: 4 }}>Why it's better:</div>
            • <strong>Fixed Retry:</strong> Floods the server immediately. <br/>
            • <strong>Backoff:</strong> Gives the server/network time to recover. <br/>
            • **Jitter:** (Optional) Adds randomness to avoid "Thundering Herd" problem.
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Web Workers: Off-Thread Logic" color={C.blue}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Run heavy CPU work (encryption, image processing) without freezing the UI.</div>
          <CodeBlock code={[
            { t: "// worker.js", c: C.textMuted },
            { t: "self.onmessage = (e) => {", c: C.blue },
            { t: "  const res = heavyTask(e.data);", c: C.textSub },
            { t: "  postMessage(res);", c: C.textSub },
            { t: "};", c: C.blue },
          ]} />
          <div style={{ color: C.textMuted, fontSize: 9, marginTop: 4 }}>Note: Web Workers have NO access to the DOM or window.</div>
        </Block>
        <Block title="Memory Management: GC" color={C.green}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>How V8 (JS Engine) cleans up memory: **Mark and Sweep**.</div>
          <div style={{ background: C.bgCode, padding: 10, borderRadius: 8, fontSize: 9, lineHeight: 1.5 }}>
            1. **Roots:** Starts at the Global object. <br/>
            2. **Mark:** Traverses all references and "marks" them as reachable. <br/>
            3. **Sweep:** Removes all "unmarked" objects from memory.
          </div>
          <Spacer h={8} />
          <Alert type="warning" style={{ fontSize: 9 }}>Detached DOM nodes are a common source of memory leaks!</Alert>
        </Block>
        <Block title="Tree Shaking: Optimization" color={C.cyan}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>The process of removing unused code from the final bundle.</div>
          <CodeBlock code={[
            { t: "// ❌ CJS: Entire module loaded", c: C.red },
            { t: "const _ = require('lodash');", c: C.textSub },
            { t: "", c: "" },
            { t: "// ✅ ESM: Tree-shakeable", c: C.green },
            { t: "import { debounce } from 'lodash-es';", c: C.textSub },
          ]} />
        </Block>
        <Block title="Logic: AbortController" color={C.orange}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Standard way to cancel fetch requests or events.</div>
          <CodeBlock code={[
            { t: "const c = new AbortController();", c: C.orange },
            { t: "fetch(url, { signal: c.signal });", c: C.textSub },
            { t: "", c: "" },
            { t: "c.abort(); // Cancel immediately", c: C.red },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
