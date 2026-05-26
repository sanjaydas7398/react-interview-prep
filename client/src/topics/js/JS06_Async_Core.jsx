import { useState, useEffect } from "react";
import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Btn, Tag, Spacer } from "../../shared";

export default function JS06_Async_Core() {
  const [logs, setLogs] = useState([]);
  const addLog = (m, c) => setLogs(p => [...p, { m, c, t: new Date().toLocaleTimeString() }]);

  const runEventLoopDemo = () => {
    setLogs([]);
    addLog("1. Start script", C.text);
    
    setTimeout(() => addLog("4. Macrotask (setTimeout 0)", C.orange), 0);
    
    Promise.resolve().then(() => addLog("3. Microtask (Promise)", C.pink));
    
    addLog("2. End script", C.text);
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="The event Loop Flow ⭐⭐⭐" color={C.orange}>
        <Alert type="info">JS is **single-threaded**, but the **Event Loop** allows it to perform non-blocking I/O by offloading tasks to the browser APIs.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <div style={{ background: C.bgCode, padding: 16, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
                <Btn size="xs" variant="orange" onClick={runEventLoopDemo}>Run Execution Demo</Btn>
                <Btn size="xs" variant="ghost" onClick={() => setLogs([])}>Clear</Btn>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {logs.length === 0 && <div style={{ color: C.textMuted, fontSize: 11, textAlign: "center", padding: 20 }}>Click "Run" to see call order...</div>}
                {logs.map((log, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 11, animation: "fadeIn 0.3s" }}>
                    <span style={{ color: C.textMuted, fontSize: 9 }}>[{log.t}]</span>
                    <span style={{ color: log.c, fontWeight: 700 }}>{log.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ color: C.textSub, fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: C.orange, fontWeight: 700, marginBottom: 4 }}>Order of execution:</div>
            1. **Call Stack:** Executes synchronous code first.<br/>
            2. **Microtasks:** Executes all pending Microtasks (<Code color={C.pink}>Promises</Code>, <Code>queueMicrotask</Code>).<br/>
            3. **Macrotasks:** Executes one task from Macrotask queue (<Code color={C.orange}>setTimeout</Code>, <Code>setInterval</Code>).<br/>
            4. **Repeat:** The loop continues!
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Promises — States & Basics" color={C.pink}>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {["PENDING", "FULFILLED", "REJECTED"].map(s => (
              <div key={s} style={{ flex: 1, background: s === "PENDING" ? C.textSub + "15" : s === "FULFILLED" ? C.green + "15" : C.red + "15", border: `1px solid ${s === "PENDING" ? C.textSub : s === "FULFILLED" ? C.green : C.red}33`, borderRadius: 6, padding: "6px 0", textAlign: "center", fontSize: 9, fontWeight: 800, color: s === "PENDING" ? C.textSub : s === "FULFILLED" ? C.green : C.red }}>{s}</div>
            ))}
          </div>
          <CodeBlock code={[
            { t: "const p = new Promise((resolve, reject) => {", c: C.pink },
            { t: "  if (success) resolve('Data!');", c: C.green },
            { t: "  else reject('Error');", c: C.red },
            { t: "});", c: C.pink },
            { t: "", c: "" },
            { t: "p.then(res => console.log(res))", c: C.textSub },
            { t: " .catch(err => console.error(err))", c: C.textSub },
            { t: " .finally(() => stopLoading());", c: C.textSub },
          ]} />
        </Block>
        <Block title="Promise.all vs race vs allSettled" color={C.blue}>
          <Grid cols={2} gap={8}>
            {[
              { t: ".all()", d: "Wait for ALL. Rejects if ANY fail.", c: C.green },
              { t: ".race()", d: "First to finish wins (pass OR fail).", c: C.yellow },
              { t: ".allSettled()", d: "Wait for all results (pass OR fail).", c: C.blue },
              { t: ".any()", d: "Wait for FIRST success.", c: C.orange },
            ].map(x => (
              <div key={x.t} style={{ background: x.c + "10", border: `1px solid ${x.c}33`, borderRadius: 8, padding: 8 }}>
                <div style={{ color: x.c, fontSize: 11, fontWeight: 700 }}>{x.t}</div>
                <div style={{ color: C.textSub, fontSize: 9, marginTop: 2 }}>{x.d}</div>
              </div>
            ))}
          </Grid>
        </Block>
        <Block title="Callback Hell & The Fix" color={C.red}>
          <CodeBlock title="Pyramid of Doom" code={[
            { t: "login(u => {", c: C.red },
            { t: "  fetch(u => {", c: C.textSub },
            { t: "    render(u => {", c: C.textSub },
            { t: "       // Reached hell...", c: C.textMuted },
            { t: "    })", c: C.textSub },
            { t: "  })", c: C.textSub },
            { t: "})", c: C.red },
          ]} />
          <div style={{ color: C.green, fontSize: 11, fontWeight: 700 }}>✅ Solution: Promise Chaining</div>
          <CodeBlock code={[{ t: "login().then(fetch).then(render).catch(err);", c: C.green }]} />
        </Block>
        <Block title="Stack vs Queue" color={C.cyan}>
          <div style={{ background: C.bgCode, padding: 12, borderRadius: 8 }}>
            <div style={{ color: C.cyan, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Call Stack (LIFO)</div>
            <div style={{ color: C.textSub, fontSize: 10, marginBottom: 10 }}>Last In, First Out. Where your functions live while executing.</div>
            <div style={{ color: C.blue, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Task Queue (FIFO)</div>
            <div style={{ color: C.textSub, fontSize: 10 }}>First In, First Out. Where async results wait for the stack to be empty.</div>
          </div>
        </Block>
      </Grid>
    </div>
  );
}
