import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag } from "../../shared";

export default function JS02_Functions_Basic() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Function Declarations vs Expressions" color={C.blue}>
        <Grid cols={2} gap={10}>
          <div>
            <div style={{ color: C.blue, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Declaration (Hoisted)</div>
            <CodeBlock code={[{ t: "function greet() { return 'Hi'; }", c: C.blue }]} />
            <div style={{ color: C.textSub, fontSize: 10 }}>Can be called BEFORE defined.</div>
          </div>
          <div>
            <div style={{ color: C.cyan, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Expression (Not Hoisted)</div>
            <CodeBlock code={[{ t: "const greet = function() { return 'Hi'; };", c: C.cyan }]} />
            <div style={{ color: C.textSub, fontSize: 10 }}>Throws error if called before definition.</div>
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Arrow Functions (ES6)" color={C.cyan}>
          <Alert type="info">Arrow functions have **lexical this** (no own this) and are not hoisted.</Alert>
          <CodeBlock code={[
            { t: "const add = (a, b) => a + b;", c: C.cyan },
            { t: "const square = n => n * n; // implicit return", c: C.green },
            { t: "", c: "" },
            { t: "const obj = {", c: C.textSub },
            { t: "  val: 10,", c: C.textSub },
            { t: "  fn: () => console.log(this.val) // undefined", c: C.red },
            { t: "};", c: C.textSub },
          ]} />
        </Block>
        <Block title="IIFE — Immediately Invoked" color={C.purple}>
          <CodeBlock code={[
            { t: "(function() {", c: C.purple },
            { t: "  const secret = '123';", c: C.textSub },
            { t: "  console.log('Running!');", c: C.textSub },
            { t: "})();", c: C.purple },
            { t: "", c: "" },
            { t: "// Module pattern usage (legacy)", c: C.textMuted },
          ]} />
          <div style={{ color: C.textSub, fontSize: 10 }}>Used to create private scope and avoid polluting global namespace. Less common now due to ES Modules.</div>
        </Block>
        <Block title="Parameters (Default & Rest)" color={C.green}>
          <CodeBlock code={[
            { t: "// Default params", c: C.textMuted },
            { t: "function greet(name = 'Guest') { ... }", c: C.green },
            { t: "", c: "" },
            { t: "// Rest parameters (...args)", c: C.textMuted },
            { t: "function sum(...nums) {", c: C.yellow },
            { t: "  return nums.reduce((a, b) => a + b, 0);", c: C.textSub },
            { t: "}", c: C.yellow },
          ]} />
        </Block>
        <Block title="Higher-Order Functions (HOF)" color={C.orange}>
          <Alert type="info">A function that takes another function as an argument OR returns a function.</Alert>
          <CodeBlock code={[
            { t: "function multiplier(x) {", c: C.orange },
            { t: "  return function(y) { return x * y; };", c: C.textSub },
            { t: "}", c: C.orange },
            { t: "const double = multiplier(2);", c: C.green },
            { t: "double(5); // 10", c: C.textSub },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
