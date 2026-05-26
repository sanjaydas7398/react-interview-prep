import { useState, useEffect } from "react";
import { C } from "../constants";
import { Block, CodeBlock, Alert, Btn, Tag, Grid, Row } from "../shared";

export default function T13_Testing() {
  const tests = [
    { name: "renders Login form with email+password inputs", status: "PASS", type: "unit" },
    { name: "shows error when invalid email submitted", status: "PASS", type: "unit" },
    { name: "calls onSubmit with correct values", status: "PASS", type: "unit" },
    { name: "useDebounce waits before firing", status: "PASS", type: "hook" },
    { name: "ProjectList renders all projects from API", status: "PASS", type: "integration" },
    { name: "clicking Delete removes item from list", status: "PASS", type: "integration" },
    { name: "protected route redirects unauthenticated user", status: "FAIL", type: "integration" },
    { name: "async data loads and displays correctly", status: "PASS", type: "integration" },
  ];
  const [running, setRunning] = useState(false);
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (running) {
      setVisible(0);
      const interval = setInterval(() => {
        setVisible(v => { if (v >= tests.length - 1) { setRunning(false); clearInterval(interval); } return v + 1; });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [running]);

  return (
    <div>
      <Block title="Testing Pyramid" color={C.yellow}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { type: "Unit Tests", color: C.green, count: "70%", desc: "Test individual components, hooks, utils in isolation. Fast, many tests.", tools: ["Jest", "React Testing Library"] },
            { type: "Integration Tests", color: C.yellow, count: "20%", desc: "Test how components work together. Routing, context, form submission.", tools: ["RTL", "MSW (mock API)"] },
            { type: "E2E Tests", color: C.red, count: "10%", desc: "Full user flows in real browser. Slow but high confidence.", tools: ["Cypress", "Playwright"] },
          ].map(x => (
            <div key={x.type} style={{ background: x.color + "12", border: `1px solid ${x.color}33`, borderRadius: 9, padding: 12 }}>
              <div style={{ color: x.color, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{x.type}</div>
              <div style={{ color: C.yellow, fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{x.count}</div>
              <div style={{ color: C.textSub, fontSize: 10, lineHeight: 1.6, marginBottom: 8 }}>{x.desc}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{x.tools.map(t => <Tag key={t} label={t} color={x.color} />)}</div>
            </div>
          ))}
        </div>
      </Block>
      <Grid cols={2} gap={12}>
        <Block title="React Testing Library — Key APIs" color={C.cyan}>
          <CodeBlock code={[
            { t: "import { render, screen, fireEvent, waitFor } from '@testing-library/react';", c: C.textMuted },
            { t: "", c: "" },
            { t: "test('shows project name', () => {", c: C.cyan },
            { t: "  render(<ProjectCard project={mockProject}/>);", c: C.textSub },
            { t: "  expect(screen.getByText('PROJ-001')).toBeInTheDocument();", c: C.green },
            { t: "  expect(screen.getByRole('button', { name: /delete/i })).toBeVisible();", c: C.green },
            { t: "});", c: C.cyan },
            { t: "", c: "" },
            { t: "test('deletes project on click', () => {", c: C.cyan },
            { t: "  const onDelete = jest.fn();", c: C.purple },
            { t: "  render(<ProjectCard onDelete={onDelete}/>);", c: C.textSub },
            { t: "  fireEvent.click(screen.getByText('Delete'));", c: C.yellow },
            { t: "  expect(onDelete).toHaveBeenCalledTimes(1);", c: C.green },
            { t: "});", c: C.cyan },
          ]} />
        </Block>
        <Block title="Live Test Runner Simulation" color={C.green}>
          <Row gap={8} style={{ marginBottom: 12 }}>
            <Btn variant="green" size="xs" onClick={() => setRunning(true)} disabled={running}>▶ Run Tests</Btn>
            <span style={{ color: C.textMuted, fontSize: 11 }}>
              {tests.filter((_, i) => i <= visible).filter(t => t.status === "PASS").length} passed, {tests.filter((_, i) => i <= visible).filter(t => t.status === "FAIL").length} failed
            </span>
          </Row>
          {tests.slice(0, visible + 1).map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "5px 10px", background: t.status === "PASS" ? C.green + "10" : C.red + "10", borderRadius: 7, marginBottom: 4, alignItems: "center" }}>
              <span style={{ fontSize: 12 }}>{t.status === "PASS" ? "✅" : "❌"}</span>
              <Tag label={t.type} color={t.type === "unit" ? C.cyan : C.yellow} />
              <span style={{ color: C.text, fontSize: 11, flex: 1 }}>{t.name}</span>
            </div>
          ))}
        </Block>
      </Grid>

      <Grid cols={2} gap={12}>
        <Block title="Testing Hooks — renderHook" color={C.purple}>
          <Alert type="info">Use **renderHook** from `@testing-library/react` to test custom hooks without creating a component.</Alert>
          <CodeBlock code={[
            { t: "import { renderHook, act } from '@testing-library/react';", c: C.textMuted },
            { t: "", c: "" },
            { t: "test('should increment counter', () => {", c: C.purple },
            { t: "  const { result } = renderHook(() => useCounter());", c: C.textSub },
            { t: "  expect(result.current.count).toBe(0);", c: C.green },
            { t: "", c: "" },
            { t: "  act(() => {", c: C.yellow },
            { t: "    result.current.increment();", c: C.textSub },
            { t: "  });", c: C.yellow },
            { t: "", c: "" },
            { t: "  expect(result.current.count).toBe(1);", c: C.green },
            { t: "});", c: C.purple },
          ]} />
        </Block>
        <Block title="Mocking API Calls — MSW" color={C.orange}>
          <Alert type="info">**Mock Service Worker (MSW)** is the recommended way to mock APIs by intercepting network requests at the browser/node level.</Alert>
          <CodeBlock code={[
            { t: "// rest.get handlers", c: C.textMuted },
            { t: "const handlers = [", c: C.orange },
            { t: "  rest.get('/api/user', (req, res, ctx) => {", c: C.textSub },
            { t: "    return res(ctx.json({ name: 'Ahmad' }));", c: C.green },
            { t: "  }),", c: C.textSub },
            { t: "];", c: C.orange },
            { t: "", c: "" },
            { t: "// In test setup", c: C.textMuted },
            { t: "beforeAll(() => server.listen());", c: C.textSub },
            { t: "afterEach(() => server.resetHandlers());", c: C.textSub },
            { t: "afterAll(() => server.close());", c: C.textSub },
          ]} />
        </Block>
        <Block title="E2E Testing — Cypress / Playwright" color={C.red}>
          <Alert type="info">End-to-End tests verify the entire application flow in a real browser environment.</Alert>
          <CodeBlock title="Cypress Example" code={[
            { t: "it('should login and view dashboard', () => {", c: C.red },
            { t: "  cy.visit('/login');", c: C.textSub },
            { t: "  cy.get('input[name=email]').type('user@test.com');", c: C.textSub },
            { t: "  cy.get('button').click();", c: C.textSub },
            { t: "  cy.url().should('include', '/dashboard');", c: C.green },
            { t: "  cy.contains('Welcome back!').should('be.visible');", c: C.green },
            { t: "});", c: C.red },
          ]} />
          <Alert type="info">**Playwright** is a modern alternative from Microsoft that supports cross-browser testing with high performance and better auto-waiting.</Alert>
        </Block>
      </Grid>
    </div>
  );
}
