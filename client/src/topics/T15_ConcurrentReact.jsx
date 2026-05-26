import { C } from "../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../shared";

export default function T15_ConcurrentReact() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="React 18: Transitions (useTransition) 🔀" color={C.pink}>
        <Alert type="info">Mark state updates as "transitions" to keep the UI responsive while heavy rendering happens.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock code={[
              { t: "const [isPending, startTransition] = useTransition();", c: C.pink },
              { t: "", c: "" },
              { t: "const handleChange = (e) => {", c: C.textSub },
              { t: "  setQuery(e.target.value); // High priority", c: C.green },
              { t: "  startTransition(() => {", c: C.pink },
              { t: "    setList(filter(e.target.value)); // Low priority", c: C.textSub },
              { t: "  });", c: C.pink },
              { t: "};", c: C.textSub },
            ]} />
          </div>
          <div style={{ color: C.textSub, fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: C.pink, fontWeight: 700, marginBottom: 4 }}>Key Benefit:</div>
            • Typing remains fluid (no lag). <br/>
            • React can interrupt the search filter render. <br/>
            • Transition updates don't block user input.
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="useDeferredValue" color={C.cyan}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Defer re-rendering a *value* until more urgent work is done.</div>
          <CodeBlock code={[
            { t: "const deferredVal = useDeferredValue(query);", c: C.cyan },
            { t: "// Use deferredVal for heavy filtering", c: C.textMuted },
            { t: "<List items={filter(deferredVal)} />", c: C.textSub },
          ]} />
          <Alert type="info" style={{ marginTop: 10 }}>Similar to debouncing, but React handles the timing optimally!</Alert>
        </Block>
        <Block title="useEffectEvent (Experimental/New) ⭐" color={C.orange}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Get the latest values inside an effect WITHOUT adding them to dependencies.</div>
          <CodeBlock code={[
            { t: "const onLog = useEffectEvent(() => {", c: C.orange },
            { t: "  console.log(count); // Latest count", c: C.textSub },
            { t: "});", c: C.orange },
            { t: "", c: "" },
            { t: "useEffect(() => {", c: C.textSub },
            { t: "  onLog();", c: C.textSub },
            { t: "}, [url]); // Only re-runs when URL changes", c: C.green },
          ]} />
        </Block>
        <Block title="Batching 3.0" color={C.purple}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>React 18 automatically batches updates inside timeouts, promises, and native events.</div>
          <CodeBlock code={[
            { t: "fetch().then(() => {", c: C.textSub },
            { t: "  setA(1); setB(2);", c: C.purple },
            { t: "  // ONLY 1 RENDER", c: C.green },
            { t: "});", c: C.textSub },
          ]} />
        </Block>
        <Block title="Strict Mode: Double Render" color={C.red}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>In Dev mode, React intentionally renders twice to catch side-effect bugs.</div>
          <div style={{ background: C.bgCode, padding: 10, borderRadius: 8, fontSize: 9 }}>
            • Mount → Unmount → Mount <br/>
            • Verifies effect cleanups are working correctly. <br/>
            • Does NOT happen in Production.
          </div>
        </Block>
      </Grid>
    </div>
  );
}
