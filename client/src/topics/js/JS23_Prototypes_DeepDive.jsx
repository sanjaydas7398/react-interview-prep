import { C_BASE } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../../shared";

export default function JS23_Prototypes_DeepDive() {
  const C = C_BASE;
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="The Prototype Chain: Deep Dive ⛓️" color={C.purple}>
        <Alert type="info">In JavaScript, every object has a private property which holds a link to another object called its prototype.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock code={[
              { t: "function Person(name) { this.name = name; }", c: C.purple },
              { t: "Person.prototype.sayHi = function() { ", c: C.textSub },
              { t: "  console.log('Hi ' + this.name);", c: C.green },
              { t: "};", c: C.textSub },
              { t: "", c: "" },
              { t: "const dev = new Person('John');", c: C.purple },
              { t: "dev.sayHi(); // Found on prototype", c: C.textSub },
              { t: "dev.__proto__ === Person.prototype; // true", c: C.cyan },
            ]} />
          </div>
          <div style={{ fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: C.purple, fontWeight: 700, marginBottom: 4 }}>How it works:</div>
            1. Check object for property. <br/>
            2. If not found, check its `__proto__`. <br/>
            3. Repeat until found or link is `null`. <br/>
            <div style={{ marginTop: 10, color: C.red, fontWeight: 700 }}>Interviewer: "What is __proto__ vs prototype?"</div>
            • <strong>prototype:</strong> Property of constructor functions (to be inherited). <br/>
            • <strong>__proto__:</strong> Property of all objects (the actual link).
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Object.create() vs new" color={C.cyan}>
          <div style={{ fontSize: 10, marginBottom: 8 }}>Creating objects with a specific prototype.</div>
          <CodeBlock code={[
            { t: "const parent = { greet: () => 'hi' };", c: C.textSub },
            { t: "const child = Object.create(parent);", c: C.cyan },
            { t: "child.greet(); // 'hi'", c: C.green },
            { t: "", c: "" },
            { t: "// vs new keyword", c: C.textMuted },
            { t: "const obj = new MyClass();", c: C.textSub },
          ]} />
        </Block>
        <Block title="The 'this' Keyword Mastery" color={C.orange}>
          <div style={{ fontSize: 10, marginBottom: 8 }}>Determined by HOW a function is called.</div>
          <div style={{ fontSize: 10, background: "rgba(0,0,0,0.1)", padding: 8, borderRadius: 8 }}>
            1. <strong>Object Method:</strong> `this` refers to the object. <br/>
            2. <strong>Simple Call:</strong> `this` is `window` (or `undefined` in strict). <br/>
            3. <strong>Arrow Function:</strong> inherits `this` from context. <br/>
            4. <strong>Explicit:</strong> bind, call, apply.
          </div>
          <CodeBlock code={[
            { t: "fn.call(obj, arg1, arg2);", c: C.orange },
            { t: "fn.apply(obj, [arg1, arg2]);", c: C.orange },
            { t: "const bound = fn.bind(obj);", c: C.orange },
          ]} />
        </Block>
        <Block title="Inheritance: ES6 Classes" color={C.blue}>
          <div style={{ fontSize: 10, marginBottom: 8 }}>Classes are just syntactical sugar over prototypes!</div>
          <CodeBlock code={[
            { t: "class Developer extends Person {", c: C.blue },
            { t: "  constructor(name, lang) {", c: C.textSub },
            { t: "    super(name);", c: C.green },
            { t: "    this.lang = lang;", c: C.textSub },
            { t: "  }", c: C.textSub },
            { t: "}", c: C.blue },
          ]} />
        </Block>
        <Block title="Prototype Shadowing" color={C.red}>
          <div style={{ fontSize: 10, marginBottom: 8 }}>What happens when object and prototype have same property?</div>
          <CodeBlock code={[
            { t: "child.name = 'New Name';", c: C.textSub },
            { t: "// 'New Name' shadows parent's name", c: C.red },
          ]} />
          <Alert type="info" style={{ marginTop: 8 }}>The property lookup stops at the first instance found in the chain.</Alert>
        </Block>
      </Grid>
    </div>
  );
}
