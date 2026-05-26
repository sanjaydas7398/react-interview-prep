import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../../shared";

export default function JS14_Security_BestPractices() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Common Web Security Vulnerabilities" color={C.red}>
        <Grid cols={2} gap={15}>
          <div style={{ background: C.red + "10", border: `1px solid ${C.red}33`, padding: 14, borderRadius: 12 }}>
            <div style={{ color: C.red, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>XSS (Cross-Site Scripting)</div>
            <div style={{ color: C.textSub, fontSize: 10, marginBottom: 10 }}>Injecting malicious scripts into web pages viewed by others.</div>
            <div style={{ color: C.green, fontSize: 10 }}>✅ Fix: Sanitize user input, use <Code>textContent</Code> instead of <Code>innerHTML</Code>.</div>
          </div>
          <div style={{ background: C.orange + "10", border: `1px solid ${C.orange}33`, padding: 14, borderRadius: 12 }}>
            <div style={{ color: C.orange, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>CSRF (Request Forgery)</div>
            <div style={{ color: C.textSub, fontSize: 10, marginBottom: 10 }}>Tricking a logged-in user into performing unwanted actions.</div>
            <div style={{ color: C.green, fontSize: 10 }}>✅ Fix: Use anti-CSRF tokens, SameSite cookies.</div>
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Error Handling — try...catch" color={C.orange}>
          <Alert type="info">Always wrap risky operations (API calls, JSON parsing) in try/catch to prevent app crashes.</Alert>
          <CodeBlock code={[
            { t: "try {", c: C.orange },
            { t: "  const data = JSON.parse(userInput);", c: C.textSub },
            { t: "} catch (err) {", c: C.red },
            { t: "  console.error('Parsing failed:', err.message);", c: C.textSub },
            { t: "} finally {", c: C.blue },
            { t: "  stopLoading();", c: C.textSub },
            { t: "}", c: C.orange },
          ]} />
        </Block>
        <Block title="Error Types in JS" color={C.red}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[
              { t: "SyntaxError", d: "Malformed code" },
              { t: "ReferenceError", d: "Variable doesn't exist" },
              { t: "TypeError", d: "Wrong type for operation" },
              { t: "RangeError", d: "Value out of range" },
            ].map(x => (
              <div key={x.t} style={{ background: C.bgCode, padding: 8, borderRadius: 8 }}>
                <div style={{ color: C.red, fontSize: 10, fontWeight: 700 }}>{x.t}</div>
                <div style={{ color: C.textSub, fontSize: 9 }}>{x.d}</div>
              </div>
            ))}
          </div>
        </Block>
        <Block title="Clean Code: DRY & KISS" color={C.green}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ background: C.green + "12", padding: 10, borderRadius: 8 }}>
              <div style={{ color: C.green, fontSize: 11, fontWeight: 700 }}>DRY (Don't Repeat Yourself)</div>
              <div style={{ color: C.textSub, fontSize: 9 }}>Extract repeated logic into reusable functions/components.</div>
            </div>
            <div style={{ background: C.blue + "12", padding: 10, borderRadius: 8 }}>
              <div style={{ color: C.blue, fontSize: 11, fontWeight: 700 }}>KISS (Keep It Simple, Stupid)</div>
              <div style={{ color: C.textSub, fontSize: 9 }}>Avoid complex abstractions when simple solutions suffice.</div>
            </div>
          </div>
        </Block>
        <Block title="Environment Variables" color={C.blue}>
          <Alert type="warn">NEVER hardcode API keys or secrets in your frontend code. Use `.env` files.</Alert>
          <CodeBlock code={[
            { t: "// .env (NOT committed to Git!)", c: C.textMuted },
            { t: "VITE_API_KEY=shhh_secret_123", c: C.textSub },
            { t: "", c: "" },
            { t: "// Accessing in code", c: C.textMuted },
            { t: "const key = import.meta.env.VITE_API_KEY;", c: C.blue },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
