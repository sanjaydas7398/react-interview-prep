import { C } from "../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../shared";

export default function T14_NextJS() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="RSC vs Client Components" color={C.text}>
        <Alert type="info">In Next.js 13+ (App Router), components are **Server Components** by default.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <div style={{ color: C.green, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Server Components</div>
            <div style={{ color: C.textSub, fontSize: 10, marginBottom: 10 }}>Zero bundle size. Fetches data directly on the server. No hooks allowed.</div>
            <CodeBlock code={[
              { t: "export default async function Page() {", c: C.purple },
              { t: "  const data = await db.query();", c: C.textSub },
              { t: "  return <List items={data} />;", c: C.textSub },
              { t: "}", c: C.purple },
            ]} />
          </div>
          <div>
            <div style={{ color: C.blue, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Client Components ("use client")</div>
            <div style={{ color: C.textSub, fontSize: 10, marginBottom: 10 }}>Hydrated on client. Can use hooks (useState, useEffect) and event listeners.</div>
            <CodeBlock code={[
              { t: "'use client';", c: C.orange },
              { t: "export default function Button() {", c: C.blue },
              { t: "  const [s, setS] = useState();", c: C.textSub },
              { t: "  return <button onClick={...} />;", c: C.textSub },
              { t: "}", c: C.blue },
            ]} />
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Streaming & Suspense" color={C.pink}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Progressively render parts of the UI to avoid waiting for slow data.</div>
          <CodeBlock code={[
            { t: "<Suspense fallback={<Skeleton />}>", c: C.pink },
            { t: "  <SlowComponent />", c: C.textSub },
            { t: "</Suspense>", c: C.pink },
          ]} />
          <div style={{ color: C.textMuted, fontSize: 9, marginTop: 8 }}>Enables faster **Time to First Byte (TTFB)**.</div>
        </Block>
        <Block title="Data Rendering: ISR & SSG" color={C.cyan}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            <Tag label="SSG" color={C.blue} />
            <Tag label="ISR" color={C.green} />
            <Tag label="SSR" color={C.orange} />
          </div>
          <div style={{ color: C.textSub, fontSize: 10 }}>ISR (Incremental Static Regeneration) allows you to update static pages *after* the build.</div>
          <CodeBlock code={[
            { t: "export const revalidate = 60;", c: C.green },
            { t: "// Re-renders every 60 seconds", c: C.textMuted },
          ]} />
        </Block>
        <Block title="Middleware & Auth" color={C.purple}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Run code before a request is completed (edge functions).</div>
          <CodeBlock code={[
            { t: "export function middleware(req) {", c: C.purple },
            { t: "  if (!auth) return redirect('/login');", c: C.red },
            { t: "}", c: C.purple },
          ]} />
        </Block>
        <Block title="Hydration Explained" color={C.yellow}>
          <Alert type="warning">Hydration Mismatch: When server HTML differs from client JS initial render.</Alert>
          <div style={{ color: C.textMuted, fontSize: 9 }}>Reason: Using `window` or `Date.now()` without suppression.</div>
          <div style={{ color: C.textMuted, fontSize: 9 }}>Fix: `suppressHydrationWarning` or `useEffect` for client-only logic.</div>
        </Block>
      </Grid>
    </div>
  );
}
