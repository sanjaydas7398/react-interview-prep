import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../../shared";

export default function JS22_Output_Lab() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Brain Teaser 1: Event Loop Mashup 🌪️" color={C.yellow}>
        <Alert type="warning">Interviewer: "What is the log order?"</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock code={[
              { t: "console.log('1');", c: C.textSub },
              { t: "setTimeout(() => console.log('2'), 0);", c: C.orange },
              { t: "Promise.resolve().then(() => console.log('3'));", c: C.cyan },
              { t: "requestAnimationFrame(() => console.log('4'));", c: C.pink },
              { t: "console.log('5');", c: C.textSub },
            ]} />
          </div>
          <div style={{ background: C.bgCode, padding: 12, borderRadius: 10 }}>
            <div style={{ color: C.green, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Answer: 1, 5, 3, 4, 2</div>
            <div style={{ fontSize: 9, color: C.textSub, lineHeight: 1.6 }}>
               1. <strong>Sync:</strong> 1 and 5 log immediately. <br/>
               2. <strong>Microtask:</strong> Promise (3) runs before next task. <br/>
               3. <strong>RAF:</strong> (4) runs before repaint. <br/>
               4. <strong>Macrotask:</strong> Timeout (2) runs in the next loop.
            </div>
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="The 'this' Trap" color={C.blue}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Output challenge: Objects and Arrow Functions</div>
          <CodeBlock code={[
            { t: "const obj = {", c: C.blue },
            { t: "  val: 10,", c: C.textSub },
            { t: "  getVal: () => this.val,", c: C.red },
            { t: "  getRegular() { return this.val; }", c: C.green },
            { t: "};", c: C.blue },
            { t: "", c: "" },
            { t: "console.log(obj.getVal()); // undefined", c: C.textMuted },
            { t: "console.log(obj.getRegular()); // 10", c: C.textMuted },
          ]} />
          <Alert type="info" style={{ fontSize: 9, marginTop: 10 }}>Arrow functions do not have their own `this`. They inherit from the scope where they were defined (Global/Window here).</Alert>
        </Block>
        <Block title="Closure Loophole: var vs let" color={C.purple}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Classic JS Interview Trick</div>
          <CodeBlock code={[
            { t: "for (var i = 0; i < 3; i++) {", c: C.purple },
            { t: "  setTimeout(() => console.log(i), 1);", c: C.textSub },
            { t: "}", c: C.purple },
            { t: "// Output: 3, 3, 3", c: C.red },
            { t: "", c: "" },
            { t: "for (let j = 0; j < 3; j++) {", c: C.purple },
            { t: "  setTimeout(() => console.log(j), 1);", c: C.textSub },
            { t: "}", c: C.purple },
            { t: "// Output: 0, 1, 2", c: C.green },
          ]} />
          <div style={{ color: C.textMuted, fontSize: 9, marginTop: 4 }}>Why? `var` is function-scoped (one binding), `let` is block-scoped (new binding tiap iteration).</div>
        </Block>
        <Block title="Hoisting Madness" color={C.cyan}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Variable vs Function Hoisting</div>
          <CodeBlock code={[
            { t: "console.log(a); // undefined", c: C.textMuted },
            { t: "var a = 5;", c: C.textSub },
            { t: "", c: "" },
            { t: "console.log(b); // ReferenceError (TDZ)", c: C.red },
            { t: "let b = 10;", c: C.textSub },
            { t: "", c: "" },
            { t: "foo(); // Works!", c: C.green },
            { t: "function foo() { ... }", c: C.textSub },
          ]} />
        </Block>
        <Block title="Coercion Corner" color={C.orange}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Implicit Type Conversion</div>
          <CodeBlock code={[
            { t: "console.log(1 + '2'); // '12'", c: C.textSub },
            { t: "console.log(1 - '2'); // -1", c: C.textSub },
            { t: "console.log([] == ![]); // true", c: C.orange },
            { t: "console.log(false == '0'); // true", c: C.orange },
          ]} />
          <div style={{ color: C.textMuted, fontSize: 9, marginTop: 4 }}>Rule: Double equals uses "ToNumber" conversion on both sides.</div>
        </Block>
      </Grid>
    </div>
  );
}
