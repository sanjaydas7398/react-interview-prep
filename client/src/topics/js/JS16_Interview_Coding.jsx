import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../../shared";

export default function JS16_Interview_Coding() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Polyfill Challenge: Promise.all() ⭐" color={C.yellow}>
        <Alert type="info">Interviewer: "Implement **Promise.all** from scratch without using the built-in method."</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock title="My Implementation" code={[
              { t: "Promise.myAll = function(promises) {", c: C.yellow },
              { t: "  return new Promise((res, rej) => {", c: C.textSub },
              { t: "    const results = []; let done = 0;", c: C.textSub },
              { t: "    promises.forEach((p, i) => {", c: C.textSub },
              { t: "      Promise.resolve(p).then(val => {", c: C.green },
              { t: "        results[i] = val; done++;", c: C.textSub },
              { t: "        if (done === promises.length) res(results);", c: C.textSub },
              { t: "      }).catch(rej);", c: C.red },
              { t: "    });", c: C.textSub },
              { t: "  });", c: C.yellow },
              { t: "};", c: C.yellow },
            ]} />
          </div>
          <div style={{ color: C.textSub, fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: C.yellow, fontWeight: 700, marginBottom: 4 }}>Key Considerations:</div>
            • Does it handle non-promise values? (Use `Promise.resolve`) <br/>
            • Does it preserve order? (Use index `i`) <br/>
            • Does it reject immediately if ANY fail? (Call `rej` in `.catch`) <br/>
            • Does it resolve only when ALL are done? (Use counter `done`)
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Implementing Deep Clone 🧬" color={C.cyan}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Copy objects/arrays without keeping references (handles nested levels).</div>
          <CodeBlock code={[
            { t: "function deepClone(obj) {", c: C.cyan },
            { t: "  if (obj === null || typeof obj !== 'object') return obj;", c: C.textMuted },
            { t: "  let copy = Array.isArray(obj) ? [] : {};", c: C.textSub },
            { t: "  for (let key in obj) {", c: C.textSub },
            { t: "    copy[key] = deepClone(obj[key]); // Recursion", c: C.green },
            { t: "  }", c: C.textSub },
            { t: "  return copy;", c: C.textSub },
            { t: "}", c: C.cyan },
          ]} />
          <div style={{ color: C.textMuted, fontSize: 9, marginTop: 4 }}>Note: This simple version doesn't handle Date, RegExp, or Circular refs (use structuredClone in modern JS).</div>
        </Block>
        <Block title="Memoization (Cache Results)" color={C.purple}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Store results of expensive function calls.</div>
          <CodeBlock code={[
            { t: "function memoize(fn) {", c: C.purple },
            { t: "  const cache = {};", c: C.textSub },
            { t: "  return function(...args) {", c: C.textSub },
            { t: "    const key = JSON.stringify(args);", c: C.textSub },
            { t: "    if (key in cache) return cache[key];", c: C.green },
            { t: "    const res = fn.apply(this, args);", c: C.textSub },
            { t: "    cache[key] = res;", c: C.textSub },
            { t: "    return res;", c: C.textSub },
            { t: "  };", c: C.purple },
            { t: "}", c: C.purple },
          ]} />
        </Block>
        <Block title="Polyfill: Array.prototype.flat()" color={C.green}>
          <CodeBlock code={[
            { t: "function myFlat(arr, depth = 1) {", c: C.green },
            { t: "  return depth > 0 ", c: C.textSub },
            { t: "    ? arr.reduce((acc, val) => ", c: C.textSub },
            { t: "        acc.concat(Array.isArray(val) ? myFlat(val, depth - 1) : val), [])", c: C.textSub },
            { t: "    : arr.slice();", c: C.textSub },
            { t: "}", c: C.green },
          ]} />
        </Block>
        <Block title="Polyfill: Function.prototype.bind()" color={C.pink}>
          <CodeBlock code={[
            { t: "Function.prototype.myBind = function(ctx, ...args) {", c: C.pink },
            { t: "  const fn = this;", c: C.textSub },
            { t: "  return function(...newArgs) {", c: C.textSub },
            { t: "    return fn.apply(ctx, [...args, ...newArgs]);", c: C.textSub },
            { t: "  };", c: C.textSub },
            { t: "};", c: C.pink },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
