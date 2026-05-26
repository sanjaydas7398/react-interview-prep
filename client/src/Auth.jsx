import { useState } from "react";
import { loginUser, registerUser } from "./api";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await loginUser(email, password);
      } else {
        data = await registerUser(name, email, password);
      }
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: 400, background: 'white', padding: 40, borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📍</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#333' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ color: '#666', fontSize: 14 }}>Sign in to access Trace Dashboard</p>
        </div>

        {error && <div style={{ background: '#fee', color: '#c00', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 20 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 4, display: 'block' }}>NAME</label>
              <input required value={name} onChange={e=>setName(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, outline: 'none' }} placeholder="John Doe" />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 4, display: 'block' }}>EMAIL</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, outline: 'none' }} placeholder="john@example.com" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 4, display: 'block' }}>PASSWORD</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, outline: 'none' }} placeholder="••••••••" />
          </div>
          <button disabled={loading} type="submit" style={{ background: '#007a55', color: 'white', border: 'none', padding: 14, borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 10 }}>
            {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#666' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#007a55', fontWeight: 700, cursor: 'pointer' }}>
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </div>
      </div>
    </div>
  );
}
