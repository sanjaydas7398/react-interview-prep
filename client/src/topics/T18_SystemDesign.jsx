import { C_BASE } from "../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../shared";

export default function T18_SystemDesign() {
  const C = C_BASE;
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Frontend System Design: The Big Picture 🏗️" color={C.purple}>
        <Alert type="info">Senior interviews focus on scaling, resilience, and architectural decisions.</Alert>
        <Grid cols={3} gap={12}>
          {[
            { title: "Microfrontends", desc: "Breaking a monolith into independent deployable apps.", color: C.blue },
            { title: "Monorepos", desc: "Managing multiple projects in one repo (Turborepo/Nx).", color: C.cyan },
            { title: "CSR vs SSR vs SSG", desc: "Choosing the right rendering strategy for performance.", color: C.pink },
          ].map(x => (
            <div key={x.title} style={{ background: x.color + "10", border: `1px solid ${x.color}30`, padding: 12, borderRadius: 10 }}>
              <div style={{ color: x.color, fontWeight: 800, fontSize: 12 }}>{x.title}</div>
              <div style={{ fontSize: 10, marginTop: 4 }}>{x.desc}</div>
            </div>
          ))}
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Web Vitals: Metrics that Matter" color={C.orange}>
          <div style={{ fontSize: 10, marginBottom: 10 }}>Improving these metrics often correlates with better business outcomes.</div>
          {[
            { m: "LCP", n: "Largest Contentful Paint", d: "Loading speed (< 2.5s)", c: C.green },
            { m: "FID", n: "First Input Delay", d: "Interactivity (< 100ms)", c: C.blue },
            { m: "CLS", n: "Cumulative Layout Shift", d: "Visual Stability (< 0.1)", c: C.red },
          ].map(x => (
            <div key={x.m} style={{ display: "flex", gap: 8, marginBottom: 6, background: x.c + "08", padding: 8, borderRadius: 8 }}>
              <Code color={x.c}>{x.m}</Code>
              <div style={{ fontSize: 10 }}><strong>{x.n}</strong>: {x.d}</div>
            </div>
          ))}
        </Block>
        <Block title="Scalable State Architecture" color={C.green}>
          <div style={{ fontSize: 10, marginBottom: 8 }}>How to organize state in large applications.</div>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: 10, borderRadius: 8, fontSize: 10, lineHeight: 1.6 }}>
            1. <strong>Server State:</strong> use React Query (TanStack Query). <br/>
            2. <strong>Global UI State:</strong> Zustand or Redux Toolkit. <br/>
            3. <strong>Local State:</strong> useState/useReducer. <br/>
            4. <strong>Form State:</strong> React Hook Form or Formik.
          </div>
        </Block>
        <Block title="Design Patterns for Scale" color={C.cyan}>
          <div style={{ fontSize: 10, marginBottom: 8 }}>Common patterns for building reusable UI.</div>
          <CodeBlock code={[
            { t: "// Compound Components Pattern", c: C.cyan },
            { t: "<Select>", c: C.textSub },
            { t: "  <Select.Option value='1'>One</Select.Option>", c: C.textSub },
            { t: "</Select>", c: C.textSub },
            { t: "", c: "" },
            { t: "// Render Props Pattern", c: C.cyan },
            { t: "<Mouse render={pos => <Box pos={pos}/>} />", c: C.textSub },
          ]} />
        </Block>
        <Block title="Security Best Practices" color={C.red}>
          <div style={{ fontSize: 10, marginBottom: 8 }}>Protecting your users and your data.</div>
          <Tag label="XSS Prevention" color={C.red} />
          <Tag label="CSRF Tokens" color={C.orange} />
          <Tag label="Content Security Policy" color={C.blue} />
          <div style={{ fontSize: 9, marginTop: 10, color: "inherit" }}>
            • Sanitize all user-generated content. <br/>
            • Use HttpOnly cookies for session tokens. <br/>
            • Avoid `dangerouslySetInnerHTML` when possible.
          </div>
        </Block>
      </Grid>
    </div>
  );
}
