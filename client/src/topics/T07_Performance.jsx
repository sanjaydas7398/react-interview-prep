import { useState, useRef, useMemo, memo } from "react";
import { C } from "../constants";
import { useDebounce } from "../hooks";
import { Block, CodeBlock, Btn, Alert, Code, Grid, Spacer } from "../shared";

const HeavyChild = memo(function HeavyChild({ value, label }) {
  const renders = useRef(0);
  renders.current++;
  const result = useMemo(() => {
    let n = 0; for (let i = 0; i < 500000; i++) n += i;
    return n + value;
  }, [value]);
  return (
    <div style={{ background: C.orange + "12", border: `1px solid ${C.orange}33`, borderRadius: 8, padding: 10 }}>
      <div style={{ color: C.orange, fontSize: 10, fontFamily: C.mono }}>HeavyChild ({label})</div>
      <div style={{ color: C.textSub, fontSize: 11 }}>Renders: <Code color={C.yellow}>{renders.current}</Code> | Result: {(result / 1e6).toFixed(2)}M</div>
    </div>
  );
});

export default function T07_Performance() {
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const debSearch = useDebounce(search, 400);
  const parentRenders = useRef(0);
  parentRenders.current++;

  const ROWS = 50000;
  const ROW_H = 36;
  const VISIBLE = 8;
  const [scrollTop, setScrollTop] = useState(0);
  const startIdx = Math.floor(scrollTop / ROW_H);
  const endIdx = Math.min(startIdx + VISIBLE + 2, ROWS);

  return (
    <div>
      <Grid cols={2} gap={12}>
        <Block title="React.memo — Prevent unnecessary child re-renders" color={C.orange}>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 8 }}>
            Parent renders: <Code color={C.yellow}>{parentRenders.current}</Code>
          </div>
          <Grid cols={2} gap={8}>
            <HeavyChild value={count} label="depends on count" />
            <HeavyChild value={42} label="static — never re-renders!" />
          </Grid>
          <Spacer h={8} />
          <Btn size="xs" onClick={() => setCount(c => c + 1)}>Re-render parent (count++={count})</Btn>
          <Alert type="info" style={{ marginTop: 8 }}>The <strong>static</strong> HeavyChild (value=42) NEVER re-renders even when parent does.</Alert>
        </Block>

        <Block title="Virtualization — Only render visible items" color={C.cyan}>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 8 }}>
            Total rows: <Code color={C.red}>50,000</Code> → Actually rendered: <Code color={C.green}>{endIdx - startIdx}</Code>
          </div>
          <div style={{ height: VISIBLE * ROW_H, overflowY: "auto", background: C.bgCode, borderRadius: 9, position: "relative", border: `1px solid ${C.border}` }}
            onScroll={e => setScrollTop(e.currentTarget.scrollTop)}>
            <div style={{ height: ROWS * ROW_H, position: "relative" }}>
              {Array.from({ length: endIdx - startIdx }, (_, i) => {
                const idx = startIdx + i;
                return (
                  <div key={idx} style={{ position: "absolute", top: idx * ROW_H, left: 0, right: 0, height: ROW_H, display: "flex", alignItems: "center", padding: "0 12px", borderBottom: `1px solid ${C.border}22` }}>
                    <span style={{ color: C.textMuted, fontFamily: C.mono, fontSize: 10, width: 50 }}>#{idx + 1}</span>
                    <span style={{ color: C.text, fontSize: 12 }}>Project item {idx + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ color: C.textMuted, fontSize: 10, marginTop: 6 }}>In production: use react-window or react-virtualized</div>
        </Block>

        <Block title="Code Splitting — React.lazy + Suspense" color={C.purple}>
          <Alert type="info"><strong>Code splitting</strong> breaks your bundle into smaller chunks loaded on demand. Reduces initial bundle size → faster page load.</Alert>
          <CodeBlock code={[
            { t: "const Dashboard = lazy(() => import('./Dashboard'));", c: C.purple },
            { t: "", c: "" },
            { t: "<Suspense fallback={<Spinner/>}>", c: C.cyan },
            { t: "  <Routes>", c: C.textSub },
            { t: "    <Route path='/dash' element={<Dashboard/>}/>", c: C.green },
            { t: "  </Routes>", c: C.textSub },
            { t: "</Suspense>", c: C.cyan },
          ]} />
        </Block>

        <Block title="Debounce vs Throttle" color={C.green}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ color: C.textSub, fontSize: 11, marginBottom: 5 }}>Search debounce (400ms):</div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Type fast..."
              style={{ width: "100%", background: C.bgCode, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 10px", color: C.text, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
            <div style={{ fontSize: 11, marginTop: 4 }}>
              Raw: <Code color={C.yellow}>"{search}"</Code> → API call: <Code color={C.green}>"{debSearch}"</Code>
            </div>
          </div>
          <Grid cols={2} gap={8}>
            {[
              { name: "Debounce", color: C.green, desc: "Delay execution until N ms AFTER last call. Use for: search inputs, resize, auto-save" },
              { name: "Throttle", color: C.cyan, desc: "Execute at most once every N ms. Use for: scroll events, drag, window resize" },
            ].map(x => (
              <div key={x.name} style={{ background: x.color + "12", border: `1px solid ${x.color}33`, borderRadius: 9, padding: 10 }}>
                <Code color={x.color}>{x.name}</Code>
                <div style={{ color: C.textSub, fontSize: 10, marginTop: 6, lineHeight: 1.7 }}>{x.desc}</div>
              </div>
            ))}
          </Grid>
        </Block>
      </Grid>

      <Grid cols={2} gap={12}>
        <Block title="useMemo vs useCallback — When to use" color={C.purple}>
          <CodeBlock code={[
            { t: "// useMemo → caches a VALUE", c: C.purple },
            { t: "const sorted = useMemo(() => sort(items), [items]);", c: C.green },
            { t: "", c: "" },
            { t: "// useCallback → caches a FUNCTION", c: C.purple },
            { t: "const handleClick = useCallback(() => {", c: C.cyan },
            { t: "  doSomething(id);", c: C.textSub },
            { t: "}, [id]);", c: C.cyan },
            { t: "", c: "" },
            { t: "// They are equivalent:", c: C.yellow },
            { t: "useCallback(fn, deps) === useMemo(() => fn, deps)", c: C.yellow },
          ]} />
          <Alert type="warn"><strong>Don't memoize everything!</strong> Memoization has a cost (memory + comparison). Only use when: expensive calculations, passing to React.memo children, or deps of other hooks.</Alert>
        </Block>
        <Block title="Profiling & Debugging" color={C.red}>
          {[
            { tool: "React DevTools Profiler", desc: "Record renders, see which components re-rendered and why", color: C.blue },
            { tool: "React.memo + why-did-you-render", desc: "Detect unnecessary re-renders in development", color: C.green },
            { tool: "Chrome Performance Tab", desc: "Flame chart, identify JS bottlenecks, long tasks", color: C.yellow },
            { tool: "React DevTools → Highlight Updates", desc: "Visual flash when components re-render", color: C.orange },
            { tool: "webpack-bundle-analyzer", desc: "Visualize bundle size, find large dependencies", color: C.red },
          ].map(x => (
            <div key={x.tool} style={{ display: "flex", gap: 8, padding: "6px 10px", background: x.color + "10", border: `1px solid ${x.color}22`, borderRadius: 7, marginBottom: 5 }}>
              <span style={{ color: x.color, fontWeight: 700, fontSize: 10, minWidth: 160 }}>{x.tool}</span>
              <span style={{ color: C.textSub, fontSize: 10 }}>{x.desc}</span>
            </div>
          ))}
        </Block>
        <Block title="Bundle Size Optimization" color={C.yellow}>
          <CodeBlock code={[
            { t: "// 1. Tree Shaking — import only what you use", c: C.yellow },
            { t: "import { debounce } from 'lodash-es'; // ✅ tree-shakeable", c: C.green },
            { t: "import _ from 'lodash'; // ❌ imports entire library!", c: C.red },
            { t: "", c: "" },
            { t: "// 2. Dynamic imports (code splitting)", c: C.yellow },
            { t: "const Chart = lazy(() => import('./Chart'));", c: C.cyan },
            { t: "", c: "" },
            { t: "// 3. Analyze your bundle", c: C.yellow },
            { t: "npx webpack-bundle-analyzer stats.json", c: C.textSub },
            { t: "", c: "" },
            { t: "// 4. Lazy load images", c: C.yellow },
            { t: "<img loading='lazy' src='hero.jpg'/>", c: C.green },
          ]} />
        </Block>
        <Block title="Pagination & Infinite Scroll" color={C.cyan}>
          <CodeBlock code={[
            { t: "// Pagination — load fixed page", c: C.cyan },
            { t: "const { data } = useQuery({", c: C.textSub },
            { t: "  queryKey: ['projects', page],", c: C.textSub },
            { t: "  queryFn: () => api.getProjects({ page, limit: 20 }),", c: C.textSub },
            { t: "});", c: C.textSub },
            { t: "", c: "" },
            { t: "// Infinite Scroll — IntersectionObserver", c: C.cyan },
            { t: "const observer = new IntersectionObserver(entries => {", c: C.green },
            { t: "  if (entries[0].isIntersecting) fetchNextPage();", c: C.textSub },
            { t: "});", c: C.green },
            { t: "observer.observe(sentinelRef.current);", c: C.textSub },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
