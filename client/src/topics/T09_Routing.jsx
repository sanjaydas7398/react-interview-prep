import { C } from "../constants";
import { Block, CodeBlock, Alert, Grid } from "../shared";

export default function T09_Routing() {
  return (
    <div>
      <Block title="React Router — Complete Setup" color={C.blue}>
        <CodeBlock title="Router setup with all concepts" code={[
          { t: "<BrowserRouter>  {/* uses HTML5 history API */}", c: C.blue },
          { t: "  <App/>", c: C.textSub },
          { t: "</BrowserRouter>", c: C.blue },
          { t: "", c: "" },
          { t: "<Routes>", c: C.blue },
          { t: "  <Route path='/' element={<Home/>}/>", c: C.green },
          { t: "  <Route path='/dashboard' element={<Dashboard/>}/>", c: C.cyan },
          { t: "", c: "" },
          { t: "  {/* Protected route */}", c: C.textMuted },
          { t: "  <Route element={<ProtectedRoute roles={['ADMIN']}/>}>", c: C.yellow },
          { t: "    <Route path='/admin' element={<AdminPanel/>}/>", c: C.textSub },
          { t: "  </Route>", c: C.yellow },
          { t: "", c: "" },
          { t: "  {/* Nested routes */}", c: C.textMuted },
          { t: "  <Route path='/projects' element={<ProjectLayout/>}>", c: C.purple },
          { t: "    <Route index element={<ProjectList/>}/>", c: C.textSub },
          { t: "    <Route path=':id' element={<ProjectDetail/>}/>", c: C.textSub },
          { t: "  </Route>", c: C.purple },
          { t: "", c: "" },
          { t: "  <Route path='*' element={<NotFound/>}/>", c: C.red },
          { t: "</Routes>", c: C.blue },
        ]} />
      </Block>
      <Grid cols={2} gap={12}>
        <Block title="Router Hooks" color={C.cyan}>
          <CodeBlock code={[
            { t: "// 1. useNavigate — programmatic navigation", c: C.textMuted },
            { t: "const navigate = useNavigate();", c: C.cyan },
            { t: "navigate('/dashboard');          // push", c: C.textSub },
            { t: "navigate(-1);                    // back", c: C.textSub },
            { t: "", c: "" },
            { t: "// 2. useParams — URL parameters", c: C.textMuted },
            { t: "const { id } = useParams(); // id from :id", c: C.green },
            { t: "", c: "" },
            { t: "// 3. useLocation — current location", c: C.textMuted },
            { t: "const loc = useLocation();", c: C.yellow },
            { t: "loc.pathname // '/projects/p1'", c: C.textSub },
            { t: "", c: "" },
            { t: "// 4. useSearchParams — query string", c: C.textMuted },
            { t: "const [params, setParams] = useSearchParams();", c: C.pink },
            { t: "params.get('filter') // ?filter=ACTIVE", c: C.textSub },
          ]} />
        </Block>
        <Block title="Protected Routes" color={C.purple}>
          <CodeBlock title="Protected Route + Route Guard" code={[
            { t: "function ProtectedRoute({ roles }) {", c: C.purple },
            { t: "  const { user } = useContext(AuthCtx);", c: C.textSub },
            { t: "  if (!user) return <Navigate to='/login' replace/>;", c: C.red },
            { t: "  if (roles && !roles.includes(user.role))", c: C.textSub },
            { t: "    return <Navigate to='/403' replace/>;", c: C.red },
            { t: "  return <Outlet/>; // renders nested route", c: C.green },
            { t: "}", c: C.purple },
          ]} />
        </Block>
      </Grid>

      <Grid cols={2} gap={12}>
        <Block title="BrowserRouter vs HashRouter" color={C.blue}>
          <Grid cols={2} gap={8}>
            <div style={{ background: C.blue + "12", border: `1px solid ${C.blue}33`, borderRadius: 9, padding: 10 }}>
              <div style={{ color: C.blue, fontWeight: 700, fontSize: 11, marginBottom: 6 }}>BrowserRouter</div>
              <div style={{ color: C.textSub, fontSize: 10, lineHeight: 1.6 }}>Uses HTML5 History API (pushState). Standard for modern apps. Requires server config for catch-all.</div>
              <div style={{ color: C.green, fontSize: 9, marginTop: 4 }}>example.com/dashboard</div>
            </div>
            <div style={{ background: C.yellow + "12", border: `1px solid ${C.yellow}33`, borderRadius: 9, padding: 10 }}>
              <div style={{ color: C.yellow, fontWeight: 700, fontSize: 11, marginBottom: 6 }}>HashRouter</div>
              <div style={{ color: C.textSub, fontSize: 10, lineHeight: 1.6 }}>Uses the hash part of URL (#). Good for legacy servers or static file servers. No server config needed.</div>
              <div style={{ color: C.orange, fontSize: 9, marginTop: 4 }}>example.com/#/dashboard</div>
            </div>
          </Grid>
        </Block>
        <Block title="Navigation — Link & NavLink" color={C.green}>
          <Alert type="info">**Link** and **NavLink** are used for client-side navigation without refreshing the page.</Alert>
          <CodeBlock code={[
            { t: "// Standard link", c: C.textSub },
            { t: "<Link to='/about'>About</Link>", c: C.green },
            { t: "", c: "" },
            { t: "// NavLink — with active state styles", c: C.textSub },
            { t: "<NavLink ", c: C.cyan },
            { t: "  to='/tasks'", c: C.textSub },
            { t: "  style={({ isActive }) => ({ color: isActive ? 'blue' : 'gray' })}", c: C.green },
            { t: ">", c: C.cyan },
            { t: "  Tasks", c: C.textSub },
            { t: "</NavLink>", c: C.cyan },
          ]} />
        </Block>
        <Block title="Route-based Code Splitting" color={C.purple}>
          <Alert type="info">Combine **lazy()** and **Suspense** with routes to load page components only when needed.</Alert>
          <CodeBlock code={[
            { t: "const LazyAdmin = lazy(() => import('./Admin'));", c: C.purple },
            { t: "", c: "" },
            { t: "<Suspense fallback={<Loading />}>", c: C.cyan },
            { t: "  <Routes>", c: C.textSub },
            { t: "    <Route path='/admin' element={<LazyAdmin />} />", c: C.green },
            { t: "  </Routes>", c: C.textSub },
            { t: "</Suspense>", c: C.cyan },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
