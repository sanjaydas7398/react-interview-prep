import { useState, useRef, memo } from "react";
import { C } from "../constants";
import { Block, CodeBlock, Btn, Alert, Code, SBadge, Grid, Row, Spacer, withLogger } from "../shared";

export default function T04_Components() {
  const [clicks, setClicks] = useState(0);

  const PureChild = memo(function PureChild({ label }) {
    const renders = useRef(0);
    renders.current++;
    return (
      <div style={{ background: C.green + "12", border: `1px solid ${C.green}33`, borderRadius: 8, padding: 10 }}>
        <div style={{ color: C.green, fontSize: 11, fontFamily: C.mono }}>React.memo — {label}</div>
        <div style={{ color: C.textSub, fontSize: 11 }}>Renders: <Code color={C.yellow}>{renders.current}</Code></div>
      </div>
    );
  });

  function DataFetcher({ render }) {
    const [data] = useState(["Project A", "Project B", "Project C"]);
    return <>{data.map((d, i) => render(d, i))}</>;
  }

  function SimpleBox({ label }) {
    return <div style={{ color: C.text, fontSize: 12 }}>{label}</div>;
  }
  const LoggedBox = withLogger(SimpleBox, "SimpleBox");

  function TaskContainer() {
    const [tasks] = useState([
      { id: 1, title: "Design UI", status: "DONE" },
      { id: 2, title: "Build API", status: "IN_PROGRESS" },
    ]);
    return (
      <div>
        {tasks.map(t => (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: C.bgCode, borderRadius: 7, marginBottom: 4, fontSize: 12 }}>
            <span style={{ color: C.text }}>{t.title}</span>
            <SBadge s={t.status} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <Grid cols={2} gap={12}>
        <Block title="Pure Component — React.memo" color={C.green}>
          <Alert type="info"><strong>React.memo</strong> wraps a component. If props haven't changed (shallow compare), React skips re-rendering the component entirely.</Alert>
          <div style={{ marginBottom: 10 }}>
            <Btn size="xs" onClick={() => setClicks(c => c + 1)} style={{ marginBottom: 8 }}>Re-render parent ({clicks})</Btn>
            <PureChild label="static prop" />
            <Spacer h={6} />
            <PureChild label={`changing: ${clicks}`} />
          </div>
        </Block>
        <Block title="HOC — Higher-Order Component" color={C.purple}>
          <Alert type="info">HOC is a function that takes a component and returns a new enhanced component. Used for: logging, auth, theming, data fetching.</Alert>
          <LoggedBox label="I am wrapped by withLogger HOC" />
          <CodeBlock code={[
            { t: "function withAuth(WrappedComponent) {", c: C.purple },
            { t: "  return function AuthComponent(props) {", c: C.textSub },
            { t: "    const { user } = useContext(AuthCtx);", c: C.textSub },
            { t: "    if (!user) return <Redirect to='/login'/>;", c: C.red },
            { t: "    return <WrappedComponent {...props}/>;", c: C.green },
            { t: "  };", c: C.textSub },
            { t: "}", c: C.purple },
          ]} />
        </Block>
        <Block title="Render Props Pattern" color={C.cyan}>
          <Alert type="info">Pass a function as a prop that returns JSX. The component calls it and passes its internal data.</Alert>
          <div style={{ marginBottom: 10 }}>
            <DataFetcher render={(item, i) => (
              <div key={i} style={{ padding: "5px 10px", background: C.bgCode, borderRadius: 6, marginBottom: 3, fontSize: 12, color: C.text }}>📁 {item}</div>
            )} />
          </div>
        </Block>
        <Block title="Container / Presentational Pattern" color={C.yellow}>
          <Alert type="info"><strong>Container:</strong> handles data, state, logic. <strong>Presentational:</strong> only renders UI from props.</Alert>
          <TaskContainer />
        </Block>
        <Block title="Synthetic Events" color={C.pink}>
          <Alert type="info"><strong>Synthetic Events</strong> are React's cross-browser wrapper around native DOM events. They normalize event behavior across all browsers.</Alert>
          <CodeBlock code={[
            { t: "function handleClick(e) { // e = SyntheticEvent", c: C.pink },
            { t: "  e.preventDefault();  // same as native", c: C.textSub },
            { t: "  e.stopPropagation(); // same as native", c: C.textSub },
            { t: "  e.target.value;      // works same way", c: C.green },
            { t: "}", c: C.pink },
            { t: "", c: "" },
            { t: "// camelCase in JSX:", c: C.textMuted },
            { t: "// HTML: onclick → React: onClick", c: C.textSub },
            { t: "// HTML: onchange → React: onChange", c: C.textSub },
          ]} />
        </Block>
        <Block title="Functional vs Class Components" color={C.blue}>
          <Grid cols={2} gap={8}>
            <div style={{ background: C.blue + "12", border: `1px solid ${C.blue}33`, borderRadius: 9, padding: 10 }}>
              <div style={{ color: C.blue, fontWeight: 700, fontSize: 11, marginBottom: 6 }}>FUNCTIONAL (Modern ✅)</div>
              {["Plain JS functions", "Use hooks for state/effects", "Simpler, less boilerplate", "No 'this' keyword", "Easier to test & reuse"].map(p => <div key={p} style={{ color: C.textSub, fontSize: 10, marginBottom: 2 }}>• {p}</div>)}
            </div>
            <div style={{ background: C.yellow + "12", border: `1px solid ${C.yellow}33`, borderRadius: 9, padding: 10 }}>
              <div style={{ color: C.yellow, fontWeight: 700, fontSize: 11, marginBottom: 6 }}>CLASS (Legacy ⚠️)</div>
              {["Extend React.Component", "this.state + this.setState", "Lifecycle methods", "Need 'this' binding", "ErrorBoundary requires class"].map(p => <div key={p} style={{ color: C.textSub, fontSize: 10, marginBottom: 2 }}>• {p}</div>)}
            </div>
          </Grid>
          <CodeBlock title="Functional" code={[
            { t: "function Greeting({ name }) {", c: C.blue },
            { t: "  const [count, setCount] = useState(0);", c: C.textSub },
            { t: "  return <h1>Hello {name} ({count})</h1>;", c: C.green },
            { t: "}", c: C.blue },
          ]} />
          <CodeBlock title="Class equivalent" code={[
            { t: "class Greeting extends React.Component {", c: C.yellow },
            { t: "  state = { count: 0 };", c: C.textSub },
            { t: "  render() { return <h1>Hello {this.props.name}</h1>; }", c: C.textSub },
            { t: "}", c: C.yellow },
          ]} />
        </Block>
        <Block title="Component Composition" color={C.cyan}>
          <Alert type="info"><strong>Composition</strong> is React's primary pattern for reuse. Instead of inheritance, compose components by nesting them.</Alert>
          <CodeBlock code={[
            { t: "// ✅ Composition — flexible, reusable", c: C.green },
            { t: "function Page() {", c: C.cyan },
            { t: "  return (", c: C.textSub },
            { t: "    <Layout sidebar={<Sidebar/>}>", c: C.textSub },
            { t: "      <Card> <UserProfile/> </Card>", c: C.green },
            { t: "      <Card> <ActivityFeed/> </Card>", c: C.green },
            { t: "    </Layout>", c: C.textSub },
            { t: "  );", c: C.textSub },
            { t: "}", c: C.cyan },
            { t: "", c: "" },
            { t: "// ❌ Inheritance — avoid in React!", c: C.red },
            { t: "class AdminPage extends Page { } // Don't do this!", c: C.red },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
