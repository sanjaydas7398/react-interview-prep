import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../../shared";

export default function JS19_Testing_CleanCode() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Unit Testing with Jest ⭐" color={C.cyan}>
        <Alert type="info">**Jest** is the most popular testing framework for JavaScript. It works out-of-the-box with Vite/React.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock title="AAA Testing Pattern" code={[
              { t: "test('sums two numbers', () => {", c: C.cyan },
              { t: "  // 1. Arrange", c: C.textSub },
              { t: "  const add = (a, b) => a + b;", c: C.textSub },
              { t: "  // 2. Act", c: C.textSub },
              { t: "  const res = add(1, 2);", c: C.textSub },
              { t: "  // 3. Assert", c: C.textSub },
              { t: "  expect(res).toBe(3);", c: C.green },
              { t: "});", c: C.cyan },
            ]} />
          </div>
          <div style={{ color: C.textSub, fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: C.cyan, fontWeight: 700, marginBottom: 4 }}>The AAA Pattern:</div>
            • <strong>Arrange:</strong> Set up the conditions for your test.<br/>
            • <strong>Act:</strong> Execute the function or logic under test.<br/>
            • <strong>Assert:</strong> Verify that the actual result matches expected.
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Mocking & Spies" color={C.purple}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Used to isolate the unit under test by replacing dependencies with controlled doubles.</div>
          <CodeBlock code={[
            { t: "// Mock a function", c: C.textMuted },
            { t: "const fn = jest.fn();", c: C.purple },
            { t: "fn.mockReturnValue('data');", c: C.textSub },
            { t: "", c: "" },
            { t: "// Expect calls", c: C.textMuted },
            { t: "expect(fn).toHaveBeenCalledTimes(1);", c: C.green },
          ]} />
        </Block>
        <Block title="Clean Code Basics (SOLID)" color={C.green}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { l: "SRP", d: "Single Responsibility Principle" },
              { l: "OCP", d: "Open/Closed Principle" },
              { l: "LSP", d: "Liskov Substitution Principle" },
              { l: "ISP", d: "Interface Segregation" },
              { l: "DIP", d: "Dependency Inversion" },
            ].map(x => (
              <div key={x.l} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Tag label={x.l} color={C.green} />
                <span style={{ fontSize: 10, color: C.textSub }}>{x.d}</span>
              </div>
            ))}
          </div>
          <Spacer h={10} />
          <Alert type="info">Clean code is code that is easy to understand and easy to change.</Alert>
        </Block>
        <Block title="TDD (Test-Driven Development)" color={C.blue}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ background: C.red + "20", color: C.red, padding: "4px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>RED</div>
            <span style={{ color: C.textMuted }}>→</span>
            <div style={{ background: C.green + "20", color: C.green, padding: "4px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>GREEN</div>
            <span style={{ color: C.textMuted }}>→</span>
            <div style={{ background: C.blue + "20", color: C.blue, padding: "4px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>REFACTOR</div>
          </div>
          <div style={{ fontSize: 9, color: C.textSub, marginTop: 8 }}>Write a failing test first, then minimal code to pass, then clean up.</div>
        </Block>
        <Block title="Naming: Boolean & Collections" color={C.yellow}>
          <div style={{ background: C.bgCode, padding: 10, borderRadius: 8 }}>
            <div style={{ color: C.yellow, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>Booleans</div>
            <div style={{ color: C.textSub, fontSize: 9 }}>isActive, hasData, canEdit (is/has/can prefixes)</div>
            <div style={{ color: C.yellow, fontSize: 10, fontWeight: 700, marginTop: 8, marginBottom: 4 }}>Collections</div>
            <div style={{ color: C.textSub, fontSize: 9 }}>users, idList, filteredItems (plural or suffix)</div>
          </div>
        </Block>
      </Grid>
    </div>
  );
}
