import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag } from "../../shared";

export default function JS13_Browser_APIs() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Fetch API — Modern Networking" color={C.blue}>
        <Alert type="info">The **Fetch API** provides a modern interface for fetching resources asynchronously. It uses Promises.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock title="Basic GET" code={[
              { t: "const res = await fetch(url);", c: C.blue },
              { t: "if (!res.ok) throw Error('Fail');", c: C.red },
              { t: "const data = await res.json();", c: C.textSub },
            ]} />
          </div>
          <div>
            <CodeBlock title="POST Request" code={[
              { t: "fetch(url, {", c: C.blue },
              { t: "  method: 'POST',", c: C.cyan },
              { t: "  headers: { 'Content-Type': 'application/json' },", c: C.textSub },
              { t: "  body: JSON.stringify(data)", c: C.textSub },
              { t: "});", c: C.blue },
            ]} />
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Web Storage (Local vs Session)" color={C.green}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ color: C.green, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>LocalStorage</div>
              <div style={{ color: C.textSub, fontSize: 9 }}>Persists until manually cleared. Survives tab/browser close.</div>
              <CodeBlock style={{ marginTop: 6 }} code={[{ t: "localStorage.setItem('k', 'v')", c: C.textSub }]} />
            </div>
            <div>
              <div style={{ color: C.orange, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>SessionStorage</div>
              <div style={{ color: C.textSub, fontSize: 9 }}>Cleared when the tab is closed. Scope is per-page session.</div>
              <CodeBlock style={{ marginTop: 6 }} code={[{ t: "sessionStorage.getItem('k')", c: C.textSub }]} />
            </div>
          </div>
          <Alert type="warn" style={{ marginTop: 10 }}>Stored data must be **Strings**. Use <Code>JSON.stringify</Code> for objects.</Alert>
        </Block>
        <Block title="Web Workers (Multithreading)" color={C.purple}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Run scripts in the background without blocking the UI thread. Use for heavy computation.</div>
          <CodeBlock code={[
            { t: "const worker = new Worker('worker.js');", c: C.purple },
            { t: "worker.postMessage({ data: 500 });", c: C.textSub },
            { t: "worker.onmessage = (e) => console.log(e.data);", c: C.green },
          ]} />
        </Block>
        <Block title="Intersection Observer" color={C.cyan}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Detect when an element enters or leaves the viewport. Perfect for **Lazy Loading** or **Infinite Scroll**.</div>
          <CodeBlock code={[
            { t: "const obs = new IntersectionObserver(([entry]) => {", c: C.cyan },
            { t: "  if (entry.isIntersecting) loadMore();", c: C.green },
            { t: "});", c: C.cyan },
            { t: "obs.observe(targetEl);", c: C.textSub },
          ]} />
        </Block>
        <Block title="History API" color={C.yellow}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Manipulate the browser session history. Core of most JS routers.</div>
          <CodeBlock code={[
            { t: "history.pushState({ id: 1 }, '', '/new-url');", c: C.yellow },
            { t: "window.onpopstate = () => { ... };", c: C.textSub },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
