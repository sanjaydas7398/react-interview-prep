import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../../shared";

export default function JS20_System_Design() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Global Event Bus (Observer Pattern) 🏗️" color={C.orange}>
        <Alert type="info">Sync multiple distant components without prop drilling or state libraries.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock code={[
              { t: "const EventBus = {", c: C.orange },
              { t: "  events: {},", c: C.textSub },
              { t: "  on(evt, fn) {", c: C.textSub },
              { t: "    (this.events[evt] ||= []).push(fn);", c: C.textSub },
              { t: "    return () => this.off(evt, fn);", c: C.green },
              { t: "  },", c: C.textSub },
              { t: "  emit(evt, data) {", c: C.textSub },
              { t: "    this.events[evt]?.forEach(f => f(data));", c: C.green },
              { t: "  },", c: C.textSub },
              { t: "  off(evt, fn) { ... }", c: C.textMuted },
              { t: "};", c: C.orange },
            ]} />
          </div>
          <div style={{ color: C.textSub, fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: C.orange, fontWeight: 700, marginBottom: 4 }}>Usage in React:</div>
            • <strong>Mount:</strong> `const unsub = EventBus.on('msg', setMsg);` <br/>
            • <strong>Unmount:</strong> `unsub();` <br/>
            • <strong>Trigger:</strong> `EventBus.emit('msg', 'Hello!');`
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="LRU (Least Recently Used) Cache" color={C.purple}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>A cache that discards the least recently used items first when it reaches capacity.</div>
          <CodeBlock code={[
            { t: "class LRUCache {", c: C.purple },
            { t: "  constructor(limit) {", c: C.textSub },
            { t: "    this.limit = limit;", c: C.textSub },
            { t: "    this.cache = new Map();", c: C.green },
            { t: "  }", c: C.textSub },
            { t: "  get(key) {", c: C.textSub },
            { t: "    if (!this.cache.has(key)) return -1;", c: C.textSub },
            { t: "    const val = this.cache.get(key);", c: C.textSub },
            { t: "    this.cache.delete(key);", c: C.textSub },
            { t: "    this.cache.set(key, val); // Move to end", c: C.green },
            { t: "    return val;", c: C.textSub },
            { t: "  }", c: C.textSub },
            { t: "}", c: C.purple },
          ]} />
        </Block>
        <Block title="Rate Limiting: Throttling" color={C.blue}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Ensure a function runs at most once in a given duration.</div>
          <CodeBlock code={[
            { t: "function throttle(fn, delay) {", c: C.blue },
            { t: "  let last = 0;", c: C.textSub },
            { t: "  return (...args) => {", c: C.textSub },
            { t: "    const now = Date.now();", c: C.textSub },
            { t: "    if (now - last >= delay) {", c: C.green },
            { t: "      last = now; fn(...args);", c: C.textSub },
            { t: "    }", c: C.textSub },
            { t: "  };", c: C.textSub },
            { t: "}", c: C.blue },
          ]} />
        </Block>
        <Block title="Currying: Function Factory" color={C.cyan}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Translate a function from `f(a,b,c)` to `f(a)(b)(c)`.</div>
          <CodeBlock code={[
            { t: "function curry(fn) {", c: C.cyan },
            { t: "  return function curried(...args) {", c: C.textSub },
            { t: "    if (args.length >= fn.length) {", c: C.green },
            { t: "      return fn.apply(this, args);", c: C.textSub },
            { t: "    }", c: C.textSub },
            { t: "    return (...nxt) => curried(...args, ...nxt);", c: C.textSub },
            { t: "  };", c: C.textSub },
            { t: "}", c: C.cyan },
          ]} />
        </Block>
        <Block title="Virtualized Component Logic" color={C.pink}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Design for 10,000 items: "Windowing"</div>
          <div style={{ background: C.bgCode, padding: 10, borderRadius: 8, fontSize: 9, lineHeight: 1.5 }}>
            1. Listen for scroll events. <br/>
            2. Calculate current scroll index. <br/>
            3. Render ONLY: `(windowStart, windowEnd)` <br/>
            4. Use an absolute-positioned container for correct height.
          </div>
          <Spacer h={8} />
          <Tag label="Performance" color={C.pink} />
          <Tag label="Memory" color={C.blue} />
        </Block>
      </Grid>
    </div>
  );
}
