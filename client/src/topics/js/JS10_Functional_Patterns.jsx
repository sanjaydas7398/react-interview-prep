import { useState } from "react";
import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Btn, Tag, Spacer } from "../../shared";

export default function JS10_Functional_Patterns() {
  const [memoVal, setMemoVal] = useState(0);

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Currying ⭐" color={C.cyan}>
        <Alert type="info">**Currying** is a technique that transforms a function with multiple arguments into a sequence of functions, each taking a single argument.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock title="Curried Function" code={[
              { t: "const sum = a => b => c => a + b + c;", c: C.cyan },
              { t: "sum(1)(2)(3); // 6", c: C.green },
            ]} />
          </div>
          <div style={{ color: C.textSub, fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: C.cyan, fontWeight: 700, marginBottom: 4 }}>Why use Currying?</div>
            • <strong>Partial Application:</strong> Reuse functions with fixed arguments.<br/>
            • <strong>Functional Composition:</strong> Easier to combine small functions.<br/>
            • <strong>Clean Code:</strong> Simplifies complex data processing pipelines.
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Function Composition" color={C.purple}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Combining multiple functions into one (Pipe vs Compose).</div>
          <CodeBlock code={[
            { t: "const add1 = x => x + 1;", c: C.textSub },
            { t: "const double = x => x * 2;", c: C.textSub },
            { t: "", c: "" },
            { t: "// compose(f, g)(x) = f(g(x))", c: C.textMuted },
            { t: "const addThenDouble = x => double(add1(x));", c: C.purple },
          ]} />
        </Block>
        <Block title="Memoization" color={C.green}>
          <Alert type="info">Caching the results of expensive function calls based on inputs.</Alert>
          <CodeBlock code={[
            { t: "function memoize(fn) {", c: C.green },
            { t: "  const cache = {};", c: C.textSub },
            { t: "  return (...args) => {", c: C.textSub },
            { t: "    const key = JSON.stringify(args);", c: C.textSub },
            { t: "    return cache[key] || (cache[key] = fn(...args));", c: C.textSub },
            { t: "  };", c: C.textSub },
            { t: "}", c: C.green },
          ]} />
        </Block>
        <Block title="Recursion" color={C.orange}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>A function calling itself until a base case is reached.</div>
          <CodeBlock code={[
            { t: "function factorial(n) {", c: C.orange },
            { t: "  if (n === 1) return 1; // Base case", c: C.textSub },
            { t: "  return n * factorial(n - 1);", c: C.textSub },
            { t: "}", c: C.orange },
          ]} />
        </Block>
        <Block title="Proxy & Reflect" color={C.pink}>
          <Alert type="warn">**Proxy** allows you to "wrap" an object and intercept/redefine operations (set, get, etc.).</Alert>
          <CodeBlock code={[
            { t: "const p = new Proxy(obj, {", c: C.pink },
            { t: "  get: (target, key) => {", c: C.textSub },
            { t: "    console.log(`Getting ${key}`);", c: C.green },
            { t: "    return target[key];", c: C.textSub },
            { t: "  }", c: C.textSub },
            { t: "});", c: C.pink },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
