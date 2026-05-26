import { C } from "../constants";
import { useFetch } from "../hooks";
import { Block, CodeBlock, Alert, Tag, Grid } from "../shared";

export default function T10_DataFetching() {
  const { data, loading } = useFetch(["Ahmad", "Siti", "Lim"], 600);
  return (
    <div>
      <Grid cols={2} gap={12}>
        <Block title="Fetch API + Axios" color={C.cyan}>
          <CodeBlock code={[
            { t: "// Fetch API:", c: C.textMuted },
            { t: "const res = await fetch('/api/projects');", c: C.cyan },
            { t: "if (!res.ok) throw new Error(res.statusText);", c: C.red },
            { t: "const data = await res.json();", c: C.green },
            { t: "", c: "" },
            { t: "// Axios — with interceptors:", c: C.textMuted },
            { t: "api.interceptors.request.use(config => {", c: C.yellow },
            { t: "  config.headers.Authorization = `Bearer ${token}`;", c: C.textSub },
            { t: "  return config;", c: C.textSub },
            { t: "});", c: C.yellow },
          ]} />
        </Block>
        <Block title="React Query (TanStack Query)" color={C.purple}>
          <Alert type="info"><strong>React Query</strong> handles server state: caching, background refetching, loading/error states, pagination, optimistic updates.</Alert>
          <CodeBlock code={[
            { t: "const { data, isLoading } = useQuery({", c: C.purple },
            { t: "  queryKey: ['projects', filter],", c: C.textSub },
            { t: "  queryFn: () => api.getProjects(filter),", c: C.textSub },
            { t: "  staleTime: 60 * 1000,", c: C.textSub },
            { t: "});", c: C.purple },
            { t: "", c: "" },
            { t: "const { mutate } = useMutation({", c: C.cyan },
            { t: "  mutationFn: (data) => api.createProject(data),", c: C.textSub },
            { t: "  onSuccess: () => queryClient.invalidateQueries(['projects']),", c: C.green },
            { t: "});", c: C.cyan },
          ]} />
        </Block>
        <Block title="useFetch Custom Hook" color={C.green}>
          <div style={{ marginBottom: 10 }}>
            {loading
              ? <div style={{ color: C.textMuted, fontSize: 12 }}>⏳ Fetching...</div>
              : data?.map((d, i) => <div key={i} style={{ color: C.text, fontSize: 12, padding: "4px 0" }}>• {d}</div>)
            }
          </div>
          <CodeBlock code={[
            { t: "function useFetch(url) {", c: C.green },
            { t: "  const [state, setState] = useState({ data:null, loading:true });", c: C.textSub },
            { t: "  useEffect(() => {", c: C.textSub },
            { t: "    let cancelled = false;", c: C.yellow },
            { t: "    fetch(url).then(r => r.json()).then(data => {", c: C.textSub },
            { t: "      if (!cancelled) setState({ data, loading:false });", c: C.green },
            { t: "    });", c: C.textSub },
            { t: "    return () => { cancelled = true; }; // CLEANUP", c: C.yellow },
            { t: "  }, [url]);", c: C.textSub },
            { t: "  return state;", c: C.green },
            { t: "}", c: C.green },
          ]} />
        </Block>
        <Block title="Caching Strategies" color={C.orange}>
          {[
            { strategy: "Cache-First", desc: "Return cache, don't refetch. Use for: static data", color: C.blue },
            { strategy: "Network-First", desc: "Always fetch, cache as fallback. Use for: critical data", color: C.red },
            { strategy: "Stale-While-Revalidate", desc: "Show cache, revalidate in background. Best UX!", color: C.green },
          ].map(x => (
            <div key={x.strategy} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <Tag label={x.strategy} color={x.color} />
              <span style={{ color: C.textSub, fontSize: 11 }}>{x.desc}</span>
            </div>
          ))}
        </Block>
      </Grid>

      <Grid cols={2} gap={12}>
        <Block title="SWR (Stale-While-Revalidate)" color={C.green}>
          <Alert type="info">**SWR** is a React Hooks library for remote data fetching from Vercel. It prioritizes cache and then revalidates in the background.</Alert>
          <CodeBlock code={[
            { t: "import useSWR from 'swr';", c: C.green },
            { t: "", c: "" },
            { t: "function Profile() {", c: C.textSub },
            { t: "  const { data, error } = useSWR('/api/user', fetcher);", c: C.cyan },
            { t: "", c: "" },
            { t: "  if (error) return <div>Failed to load</div>;", c: C.red },
            { t: "  if (!data) return <div>Loading...</div>;", c: C.textSub },
            { t: "  return <div>Hello {data.name}!</div>;", c: C.green },
            { t: "}", c: C.textSub },
          ]} />
        </Block>
        <Block title="Error Handling Patterns" color={C.red}>
          <Alert type="info">Robust apps handle errors at multiple levels.</Alert>
          {[
            { level: "Try/Catch", desc: "Use in async functions for local error handling.", color: C.red },
            { level: "Global Interceptors", desc: "Catch 401/403 globally in Axios to handle auth refresh.", color: C.orange },
            { level: "Error Boundaries", desc: "Catch UI rendering errors in component trees.", color: C.pink },
            { level: "Retry Logic", desc: "React Query's `retry` option for flaky connections.", color: C.yellow },
          ].map(x => (
            <div key={x.level} style={{ display: "flex", gap: 10, padding: "6px 10px", background: x.color + "10", border: `1px solid ${x.color}22`, borderRadius: 7 }}>
              <span style={{ color: x.color, fontWeight: 700, fontSize: 11, minWidth: 120 }}>{x.level}</span>
              <span style={{ color: C.textSub, fontSize: 10 }}>{x.desc}</span>
            </div>
          ))}
        </Block>
        <Block title="WebSockets (Real-time)" color={C.blue}>
          <Alert type="info">Use **WebSockets** for two-way communication (chat, live notifications).</Alert>
          <CodeBlock code={[
            { t: "useEffect(() => {", c: C.textSub },
            { t: "  const socket = new WebSocket('ws://api.example.com');", c: C.blue },
            { t: "", c: "" },
            { t: "  socket.onmessage = (event) => {", c: C.textSub },
            { t: "    const msg = JSON.parse(event.data);", c: C.green },
            { t: "    dispatch(addMessage(msg));", c: C.textSub },
            { t: "  };", c: C.textSub },
            { t: "", c: "" },
            { t: "  return () => socket.close(); // CLEANUP", c: C.orange },
            { t: "}, []);", c: C.textSub },
          ]} />
        </Block>
        <Block title="Polling (Interval Fetching)" color={C.yellow}>
          <Alert type="info">Regularly refetch data every X ms. Good for live scores or stock prices.</Alert>
          <CodeBlock title="Using React Query" code={[
            { t: "const { data } = useQuery({", c: C.textSub },
            { t: "  queryKey: ['live_stats'],", c: C.textSub },
            { t: "  queryFn: api.getStats,", c: C.textSub },
            { t: "  refetchInterval: 5000, // Poll every 5s", c: C.yellow },
            { t: "});", c: C.textSub },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
