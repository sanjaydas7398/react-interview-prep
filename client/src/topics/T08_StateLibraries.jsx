import { C } from "../constants";
import { Block, CodeBlock, Alert, Tag, Grid } from "../shared";

export default function T08_StateLibraries() {
  return (
    <div>
      <Block title="Context API — When to use (and when NOT to)" color={C.orange}>
        <Grid cols={2} gap={10}>
          <div>
            <div style={{ color: C.green, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>✅ Use Context for:</div>
            {["Theme (dark/light)", "Current user / auth", "Language / locale", "Feature flags", "Data that rarely changes"].map(x => <div key={x} style={{ color: C.textSub, fontSize: 11, marginBottom: 3 }}>• {x}</div>)}
          </div>
          <div>
            <div style={{ color: C.red, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>❌ Don't use Context for:</div>
            {["High-frequency updates (animations)", "Complex async flows", "Large-scale app state", "Cache/server data (use React Query)", "Frequently changing values"].map(x => <div key={x} style={{ color: C.textSub, fontSize: 11, marginBottom: 3 }}>• {x}</div>)}
          </div>
        </Grid>
      </Block>
      <Grid cols={2} gap={12}>
        <Block title="Redux Toolkit (RTK) — Modern Redux" color={C.blue}>
          <CodeBlock code={[
            { t: "const projectSlice = createSlice({", c: C.blue },
            { t: "  name: 'projects',", c: C.textSub },
            { t: "  initialState: { items: [], status: 'idle' },", c: C.textSub },
            { t: "  reducers: {", c: C.textSub },
            { t: "    addProject(state, action) {", c: C.green },
            { t: "      state.items.push(action.payload); // Immer! ✅", c: C.textSub },
            { t: "    },", c: C.textSub },
            { t: "  },", c: C.textSub },
            { t: "});", c: C.blue },
            { t: "", c: "" },
            { t: "const store = configureStore({", c: C.blue },
            { t: "  reducer: { projects: projectSlice.reducer }", c: C.textSub },
            { t: "});", c: C.blue },
          ]} />
        </Block>
        <Block title="Redux vs Context vs Zustand" color={C.purple}>
          {[
            { name: "Redux Toolkit", color: C.blue, pros: ["DevTools time-travel", "Large team scaling", "RTK Query built-in"], cons: ["More boilerplate", "Learning curve"] },
            { name: "Context API", color: C.orange, pros: ["Built-in, no library", "Simple to use"], cons: ["Re-render issues", "Not for frequent updates"] },
            { name: "Zustand", color: C.green, pros: ["Minimal boilerplate", "No Provider needed", "Tiny bundle (1KB)"], cons: ["Less structure"] },
          ].map(x => (
            <div key={x.name} style={{ background: x.color + "10", border: `1px solid ${x.color}30`, borderRadius: 9, padding: 10, marginBottom: 8 }}>
              <div style={{ color: x.color, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{x.name}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>{x.pros.map(p => <div key={p} style={{ color: C.green, fontSize: 10, marginBottom: 2 }}>✅ {p}</div>)}</div>
                <div style={{ flex: 1 }}>{x.cons.map(c => <div key={c} style={{ color: C.red, fontSize: 10, marginBottom: 2 }}>⚠️ {c}</div>)}</div>
              </div>
            </div>
          ))}
        </Block>
      </Grid>

      <Grid cols={2} gap={12}>
        <Block title="Redux Middleware (Thunk / Saga)" color={C.yellow}>
          <Alert type="info">Middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer.</Alert>
          <CodeBlock title="Redux Thunk (Standard)" code={[
            { t: "const fetchUser = (id) => async (dispatch) => {", c: C.yellow },
            { t: "  dispatch(loading());", c: C.textSub },
            { t: "  const res = await api.getUser(id);", c: C.textSub },
            { t: "  dispatch(success(res.data));", c: C.green },
            { t: "};", c: C.yellow },
          ]} />
          <CodeBlock title="Redux Saga (Generators)" code={[
            { t: "function* fetchUserSaga(action) {", c: C.orange },
            { t: "  const user = yield call(api.getUser, action.id);", c: C.textSub },
            { t: "  yield put({ type: 'SUCCESS', user });", c: C.green },
            { t: "}", c: C.orange },
          ]} />
        </Block>
        <Block title="RTK Query — Powerful Fetching" color={C.cyan}>
          <Alert type="info">RTK Query is built into Redux Toolkit. It simplifies data fetching by handling caching and loading states automatically.</Alert>
          <CodeBlock code={[
            { t: "const api = createApi({", c: C.cyan },
            { t: "  endpoints: (builder) => ({", c: C.textSub },
            { t: "    getProjects: builder.query({ query: () => '/projects' }),", c: C.green },
            { t: "  }),", c: C.textSub },
            { t: "});", c: C.cyan },
            { t: "", c: "" },
            { t: "// Auto-generated hook", c: C.textMuted },
            { t: "const { data, isLoading } = useGetProjectsQuery();", c: C.green },
          ]} />
        </Block>
        <Block title="Selectors & Reselect" color={C.purple}>
          <Alert type="info">Selectors are functions that extract pieces of state. **Reselect** (createSelector) memoizes them for performance.</Alert>
          <CodeBlock code={[
            { t: "const selectTasks = state => state.tasks;", c: C.textSub },
            { t: "const selectFilter = state => state.filter;", c: C.textSub },
            { t: "", c: "" },
            { t: "const selectVisibleTasks = createSelector(", c: C.purple },
            { t: "  [selectTasks, selectFilter],", c: C.textSub },
            { t: "  (tasks, filter) => tasks.filter(t => t.status === filter)", c: C.green },
            { t: ");", c: C.purple },
          ]} />
        </Block>
        <Block title="Multiple Contexts Pattern" color={C.orange}>
          <Alert type="info">Don't put everything in one big context. Split by domain to prevent unnecessary re-renders of unrelated components.</Alert>
          <CodeBlock code={[
            { t: "function App() {", c: C.textSub },
            { t: "  return (", c: C.textSub },
            { t: "    <AuthCtx.Provider value={auth}>", c: C.orange },
            { t: "      <ThemeCtx.Provider value={theme}>", c: C.blue },
            { t: "        <ProjectCtx.Provider value={data}>", c: C.green },
            { t: "          <Content />", c: C.textSub },
            { t: "        </ProjectCtx.Provider>", c: C.green },
            { t: "      </ThemeCtx.Provider>", c: C.blue },
            { t: "    </AuthCtx.Provider>", c: C.orange },
            { t: "  );", c: C.textSub },
            { t: "}", c: C.textSub },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
