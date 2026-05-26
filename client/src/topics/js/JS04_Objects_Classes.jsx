import { useState } from "react";
import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Btn, Tag, Row } from "../../shared";

export default function JS04_Objects_Classes() {
  const [person, setPerson] = useState({ name: "Ahmad", details: { age: 25 } });

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Prototypes & Inheritance ⭐" color={C.cyan}>
        <Alert type="info">In JS, almost everything is an object. Objects have a **Prototype** chain they search for properties.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock title="Prototypal Chain" code={[
              { t: "const animal = { eats: true };", c: C.cyan },
              { t: "const rabbit = { jumps: true };", c: C.textSub },
              { t: "Object.setPrototypeOf(rabbit, animal);", c: C.green },
              { t: "", c: "" },
              { t: "console.log(rabbit.eats); // true", c: C.green },
              { t: "console.log(rabbit.hasOwnProperty('eats')); // false", c: C.red },
            ]} />
          </div>
          <div style={{ color: C.textSub, fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: C.cyan, fontWeight: 700, marginBottom: 4 }}>How it works:</div>
            • `rabbit` has property `jumps`? **Yes**. <br/>
            • `rabbit` has property `eats`? **No**. <br/>
            • Check `rabbit.[[Prototype]]` (animal). <br/>
            • `animal` has `eats`? **Yes**. Returned! <br/>
            • If not found, check `Object.prototype`, then `null` (end of chain).
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="ES6 Classes (Syntactic Sugar)" color={C.purple}>
          <Alert type="info">Classes make syntax cleaner but use **prototypes** under the hood.</Alert>
          <CodeBlock code={[
            { t: "class User {", c: C.purple },
            { t: "  #token = '123'; // Private field", c: C.yellow },
            { t: "  constructor(name) { this.name = name; }", c: C.textSub },
            { t: "  static greet() { return 'Hi'; }", c: C.cyan },
            { t: "  sayHi() { return `I am ${this.name}`; }", c: C.textSub },
            { t: "}", c: C.purple },
            { t: "class Admin extends User { ... }", c: C.blue },
          ]} />
        </Block>
        <Block title="Object Methods (VIMP)" color={C.green}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[
              { m: "keys()", d: "Array of keys" },
              { m: "values()", d: "Array of values" },
              { m: "entries()", d: "[key, val] pairs" },
              { m: "assign()", d: "Copy properties" },
              { m: "freeze()", d: "Deeply un-editable" },
              { m: "seal()", d: "No add/delete, yes edit" },
            ].map(x => (
              <div key={x.m} style={{ background: C.bgCode, padding: 8, borderRadius: 7 }}>
                <div style={{ color: C.green, fontSize: 10, fontWeight: 700 }}>.{x.m}</div>
                <div style={{ color: C.textMuted, fontSize: 9 }}>{x.d}</div>
              </div>
            ))}
          </div>
        </Block>
        <Block title="Shallow vs Deep Copy" color={C.orange}>
          <div style={{ background: C.bgCode, borderRadius: 8, padding: 12, marginBottom: 10 }}>
            <div style={{ color: C.textSub, fontSize: 11, marginBottom: 4 }}>Original: <Code>{JSON.stringify(person)}</Code></div>
          </div>
          <Grid cols={2} gap={8}>
            <div>
              <Btn size="xs" variant="outline" onClick={() => {
                const shallow = { ...person };
                shallow.details.age = 99; // ⚠️ Changes original too!
                setPerson({ ...person });
              }}>Shallow Copy</Btn>
              <div style={{ fontSize: 9, color: C.red, marginTop: 4 }}>Fails on nested objects.</div>
            </div>
            <div>
              <Btn size="xs" variant="green" onClick={() => {
                const deep = JSON.parse(JSON.stringify(person));
                deep.details.age = 30; // ✅ Original safe!
                alert("Original age is still " + person.details.age);
              }}>Deep Copy</Btn>
              <div style={{ fontSize: 9, color: C.green, marginTop: 4 }}>Total isolation.</div>
            </div>
          </Grid>
        </Block>
        <Block title="The 'new' Keyword" color={C.blue}>
          <div style={{ color: C.textSub, fontSize: 11, marginBottom: 8 }}>Internal process:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {["1. Creates a new empty object {}", "2. Links it to prototype", "3. Sets 'this' to new object", "4. Returns the object"].map((s, i) => (
              <div key={i} style={{ color: C.blue, fontSize: 11 }}>{i+1}. {s}</div>
            ))}
          </div>
        </Block>
      </Grid>
    </div>
  );
}
