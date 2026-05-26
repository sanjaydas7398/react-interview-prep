import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../../shared";

export default function JS08_Modern_Features() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Destructuring (Array & Object)" color={C.blue}>
        <Alert type="info">Destructuring allows extracting values from arrays or properties from objects into distinct variables.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <div style={{ color: C.blue, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Object Destructuring</div>
            <CodeBlock code={[
              { t: "const user = { id: 1, name: 'Ava' };", c: C.textSub },
              { t: "const { name, id: userId } = user;", c: C.blue },
              { t: "// userId = 1, name = 'Ava'", c: C.green },
            ]} />
          </div>
          <div>
            <div style={{ color: C.cyan, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Array Destructuring</div>
            <CodeBlock code={[
              { t: "const dims = [1024, 768];", c: C.textSub },
              { t: "const [w, h] = dims;", c: C.cyan },
              { t: "// w = 1024, h = 768", c: C.green },
            ]} />
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Spread & Rest Operators (...)" color={C.green}>
          <div style={{ background: x => C.bgCode, padding: 12, borderRadius: 10 }}>
            <div style={{ color: C.green, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Spread (Expand)</div>
            <CodeBlock code={[
              { t: "const arr = [1, 2];", c: C.textSub },
              { t: "const newArr = [...arr, 3]; // [1, 2, 3]", c: C.green },
            ]} />
            <div style={{ color: C.orange, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Rest (Condense)</div>
            <CodeBlock code={[
              { t: "const [first, ...rest] = [1, 2, 3];", c: C.textSub },
              { t: "// first=1, rest=[2, 3]", c: C.orange },
            ]} />
          </div>
        </Block>
        <Block title="Template Literals" color={C.yellow}>
          <CodeBlock code={[
            { t: "const name = 'Ahmad';", c: C.textSub },
            { t: "const msg = `Hello ${name}!`;", c: C.yellow },
            { t: "", c: "" },
            { t: "// Multi-line", c: C.textMuted },
            { t: "const html = `", c: C.yellow },
            { t: "  <div>${name}</div>", c: C.textSub },
            { t: "`;", c: C.yellow },
          ]} />
          <Alert type="info">**Tagged Templates** allow parsing template literals with a function (used in styled-components).</Alert>
        </Block>
        <Block title="Generators (function*)" color={C.purple}>
          <div style={{ color: C.textSub, fontSize: 11, marginBottom: 8 }}>Functions that can be paused and resumed using <Code>yield</Code>.</div>
          <CodeBlock code={[
            { t: "function* gen() {", c: C.purple },
            { t: "  yield 1;", c: C.textSub },
            { t: "  yield 2;", c: C.textSub },
            { t: "}", c: C.purple },
            { t: "const it = gen();", c: C.textSub },
            { t: "it.next(); // { value: 1, done: false }", c: C.green },
          ]} />
        </Block>
        <Block title="ES modules" color={C.cyan}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: C.bgCode, padding: 8, borderRadius: 7 }}>
              <div style={{ color: C.cyan, fontSize: 10, fontWeight: 700 }}>Named Export</div>
              <CodeBlock code={[{ t: "export const X = 1;", c: C.textSub }]} />
              <CodeBlock style={{ marginTop: 4 }} code={[{ t: "import { X } from '...';", c: C.textSub }]} />
            </div>
            <div style={{ background: C.bgCode, padding: 8, borderRadius: 7 }}>
              <div style={{ color: C.blue, fontSize: 10, fontWeight: 700 }}>Default Export</div>
              <CodeBlock code={[{ t: "export default X;", c: C.textSub }]} />
              <CodeBlock style={{ marginTop: 4 }} code={[{ t: "import Y from '...';", c: C.textSub }]} />
            </div>
          </div>
        </Block>
      </Grid>
    </div>
  );
}
