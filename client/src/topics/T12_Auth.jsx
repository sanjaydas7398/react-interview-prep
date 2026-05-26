import { useState } from "react";
import { C } from "../constants";
import { Block, CodeBlock, Alert, Btn, Code, Tag, Grid, Row } from "../shared";

export default function T12_Auth() {
  const [role, setRole] = useState("ADMIN");
  const perms = {
    ADMIN: ["create:project", "delete:project", "manage:users", "read:audit", "approve:request"],
    APPROVER: ["read:project", "approve:request", "read:report"],
    PROJECT_OWNER: ["create:project", "update:project", "create:task"],
    CONSULTANT: ["read:project", "read:task", "create:document"],
  };
  const can = (r, p) => perms[r]?.includes(p);

  return (
    <div>
      <Block title="JWT Authentication Flow" color={C.purple}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, alignItems: "center" }}>
          {[
            { t: "1. Login", d: "POST email+password", c: C.blue },
            "→",
            { t: "2. Verify", d: "Server validates creds", c: C.yellow },
            "→",
            { t: "3. JWT issued", d: "accessToken + refreshToken", c: C.green },
            "→",
          ].map((item, i) => typeof item === "string"
            ? <div key={i} style={{ color: C.textMuted, textAlign: "center" }}>{item}</div>
            : <div key={i} style={{ background: item.c + "15", border: `1px solid ${item.c}33`, borderRadius: 8, padding: 10, textAlign: "center" }}>
              <div style={{ color: item.c, fontWeight: 700, fontSize: 11 }}>{item.t}</div>
              <div style={{ color: C.textMuted, fontSize: 9, marginTop: 3 }}>{item.d}</div>
            </div>
          )}
          {[
            { t: "4. Store Token", d: "httpOnly cookie (safe!)", c: C.cyan },
            "→",
            { t: "5. API Request", d: "Authorization: Bearer <token>", c: C.purple },
            "→",
            { t: "6. Middleware", d: "Verify JWT → extract role", c: C.orange },
            "✅",
          ].map((item, i) => typeof item === "string"
            ? <div key={`b${i}`} style={{ color: item === "✅" ? C.green : C.textMuted, textAlign: "center", fontSize: item === "✅" ? 18 : 14 }}>{item}</div>
            : <div key={`b${i}`} style={{ background: item.c + "15", border: `1px solid ${item.c}33`, borderRadius: 8, padding: 10, textAlign: "center" }}>
              <div style={{ color: item.c, fontWeight: 700, fontSize: 11 }}>{item.t}</div>
              <div style={{ color: C.textMuted, fontSize: 9, marginTop: 3 }}>{item.d}</div>
            </div>
          )}
        </div>
      </Block>
      <Grid cols={2} gap={12}>
        <Block title="Secure Token Storage" color={C.red}>
          {[
            { method: "httpOnly Cookie", safe: true, desc: "Cannot be accessed by JavaScript. Safe from XSS attacks. RECOMMENDED." },
            { method: "localStorage", safe: false, desc: "Accessible by JS. Vulnerable to XSS attacks. Token can be stolen." },
            { method: "Memory (useState)", safe: true, desc: "Safe but lost on refresh. Good for access token." },
          ].map(x => (
            <div key={x.method} style={{ display: "flex", gap: 10, padding: "8px 12px", background: x.safe ? C.green + "10" : C.red + "10", border: `1px solid ${x.safe ? C.green : C.red}30`, borderRadius: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>{x.safe ? "✅" : "❌"}</span>
              <div><div style={{ color: x.safe ? C.green : C.red, fontWeight: 700, fontSize: 12 }}>{x.method}</div><div style={{ color: C.textSub, fontSize: 10, lineHeight: 1.6 }}>{x.desc}</div></div>
            </div>
          ))}
        </Block>
        <Block title="RBAC — Role-Based Access Control" color={C.cyan}>
          <Row gap={6} style={{ marginBottom: 10 }}>
            {Object.keys(perms).map(r => <Btn key={r} size="xs" variant={role === r ? "primary" : "outline"} onClick={() => setRole(r)}>{r}</Btn>)}
          </Row>
          <div style={{ marginBottom: 10 }}>
            <div style={{ color: C.textSub, fontSize: 11, marginBottom: 6 }}>Permissions for <Code color={C.cyan}>{role}</Code>:</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {perms[role].map(p => <Tag key={p} label={p} color={C.green} />)}
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            {[
              ["create:project", "➕ Create Project"],
              ["delete:project", "🗑 Delete Project"],
              ["manage:users", "👥 Manage Users"],
              ["approve:request", "✓ Approve Request"],
            ].map(([perm, label]) => (
              <div key={perm} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 10px", background: can(role, perm) ? C.green + "10" : C.bgCode, borderRadius: 7, marginBottom: 4 }}>
                <span style={{ color: C.text, fontSize: 12 }}>{label}</span>
                <span style={{ color: can(role, perm) ? C.green : C.red, fontSize: 11 }}>{can(role, perm) ? "✅ Allowed" : "❌ Denied"}</span>
              </div>
            ))}
          </div>
        </Block>
      </Grid>

      <Grid cols={2} gap={12}>
        <Block title="Refresh Token Flow" color={C.green}>
          <Alert type="info">**Refresh Tokens** allow users to stay logged in without re-entering credentials when the access token expires.</Alert>
          <CodeBlock code={[
            { t: "// Axios Interceptor for token refresh", c: C.cyan },
            { t: "api.interceptors.response.use(", c: C.textSub },
            { t: "  res => res,", c: C.textSub },
            { t: "  async error => {", c: C.purple },
            { t: "    const originalRequest = error.config;", c: C.textSub },
            { t: "    if (error.response.status === 401 && !originalRequest._retry) {", c: C.red },
            { t: "      originalRequest._retry = true;", c: C.textSub },
            { t: "      const newToken = await refreshToken();", c: C.green },
            { t: "      originalRequest.headers.Authorization = `Bearer ${newToken}`;", c: C.green },
            { t: "      return api(originalRequest); // Retry original request", c: C.green },
            { t: "    }", c: C.textSub },
            { t: "    return Promise.reject(error);", c: C.textSub },
            { t: "  }", c: C.purple },
            { t: ");", c: C.textSub },
          ]} />
        </Block>
        <Block title="OAuth 2.0 Basics" color={C.blue}>
          <Alert type="info">**OAuth 2.0** is an industry-standard protocol for authorization (e.g., Login with Google).</Alert>
          {[
            { term: "Client", desc: "The application (e.g., your dashboard).", color: C.blue },
            { term: "Resource Owner", desc: "The user who owns the data.", color: C.green },
            { term: "Authorization Server", desc: "Server that issues tokens (e.g., Google's auth server).", color: C.purple },
            { term: "Resource Server", desc: "Server that hosts the data (e.g., Google Photos API).", color: C.orange },
            { term: "Grant Type", desc: "The method used to get a token (e.g., Authorization Code).", color: C.yellow },
          ].map(x => (
            <div key={x.term} style={{ display: "flex", gap: 8, padding: "5px 10px", background: x.color + "10", border: `1px solid ${x.color}22`, borderRadius: 7, marginBottom: 4 }}>
              <span style={{ color: x.color, fontWeight: 700, fontSize: 11, minWidth: 140 }}>{x.term}</span>
              <span style={{ color: C.textSub, fontSize: 10 }}>{x.desc}</span>
            </div>
          ))}
        </Block>
      </Grid>
    </div>
  );
}
