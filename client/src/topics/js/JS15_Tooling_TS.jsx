import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../../shared";

export default function JS15_Tooling_TS() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="TypeScript Basics — Interfaces & Types" color={C.blue}>
        <Alert type="info">**TypeScript** adds static typing to JavaScript, catching errors at compile-time instead of runtime.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock title="Interface vs Type" code={[
              { t: "interface User {", c: C.blue },
              { t: "  id: number;", c: C.textSub },
              { t: "  name: string;", c: C.textSub },
              { t: "  role?: 'ADMIN' | 'USER';", c: C.yellow },
              { t: "}", c: C.blue },
              { t: "", c: "" },
              { t: "type ID = string | number;", c: C.cyan },
            ]} />
          </div>
          <div style={{ color: C.textSub, fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: C.blue, fontWeight: 700, marginBottom: 4 }}>Key Features:</div>
            • <strong>Interfaces:</strong> Best for object structures, extendable.<br/>
            • <strong>Types:</strong> Better for unions, intersections, and aliases.<br/>
            • <strong>Generics:</strong> Create reusable, type-safe components.<br/>
            • <strong>Enums:</strong> Define a set of named constants.
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Generics — Reusable Types" color={C.cyan}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Write code that works with multiple types while maintaining type safety.</div>
          <CodeBlock code={[
            { t: "function identity<T>(arg: T): T {", c: C.cyan },
            { t: "  return arg;", c: C.textSub },
            { t: "}", c: C.cyan },
            { t: "", c: "" },
            { t: "const n = identity<number>(10);", c: C.textSub },
            { t: "const s = identity<string>('hi');", c: C.textSub },
          ]} />
        </Block>
        <Block title="Tooling: Bundlers & Linters" color={C.purple}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: C.bgCode, padding: 10, borderRadius: 8 }}>
              <div style={{ color: C.purple, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Bundlers (Vite, Webpack)</div>
              <div style={{ color: C.textSub, fontSize: 9 }}>Combine your files, optimize assets, and handle hot-reloading.</div>
            </div>
            <div style={{ background: C.pink + "10", padding: 10, borderRadius: 8 }}>
              <div style={{ color: C.pink, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Linters (ESLint, Prettier)</div>
              <div style={{ color: C.textSub, fontSize: 9 }}>Enforce code style and catch potential bugs automatically.</div>
            </div>
          </div>
        </Block>
        <Block title="Transpilation (Babel)" color={C.orange}>
          <Alert type="info">**Babel** converts modern JS (ES6+) into older versions that older browsers can understand.</Alert>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
            <Tag label="ESNext" color={C.orange} />
            <span style={{ color: C.textMuted }}>→ Babel →</span>
            <Tag label="ES5" color={C.yellow} />
          </div>
        </Block>
        <Block title="NPM & Package.json" color={C.red}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Managing dependencies and project configurations.</div>
          <CodeBlock code={[
            { t: "// package.json", c: C.textMuted },
            { t: "\"dependencies\": { ... },", c: C.red },
            { t: "\"devDependencies\": { ... },", c: C.textSub },
            { t: "\"scripts\": { \"dev\": \"vite\" }", c: C.green },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
