import { useState, useContext, useEffect } from "react";
import { X, Plus, Trash2, Star } from "lucide-react";
import { ThemeCtx, Btn } from "../shared";
import { C_BASE } from "../constants";

const API = "http://localhost:5000/api";

const BANKS = [
  { key: "linkedin",  label: "LinkedIn Questions",     icon: "💼", color: "#0077b5" },
  { key: "coding",    label: "JS Coding Questions",    icon: "💻", color: C_BASE.yellow },
  { key: "output",    label: "Output Based Questions", icon: "🖥️",  color: C_BASE.purple },
];

const CODING_CATEGORIES  = ["Basic Coding", "JavaScript functions", "DSA Coding"];
const OUTPUT_CATEGORIES  = ["Type Coercion", "Closures", "Event Loop", "Hoisting", "this & Scope", "Promises / Async-Await", "Execution Context", "Arrays & Objects behavior", "Prototype & Inheritance", "Modern JS (ES6+)"];

function Toggle({ value, onChange }) {
  const C = useContext(ThemeCtx);
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
        padding: "8px 14px", borderRadius: 10,
        border: `1.5px solid ${value ? "#f59e0b" : C.border}`,
        background: value ? "#fef9c310" : C.bgPanel,
        transition: "all 0.2s", userSelect: "none"
      }}
    >
      <Star size={15} fill={value ? "#f59e0b" : "none"} color={value ? "#f59e0b" : C.textMuted} />
      <span style={{ fontSize: 13, fontWeight: 700, color: value ? "#f59e0b" : C.textMuted }}>
        {value ? "Most Asked" : "Normal"}
      </span>
    </div>
  );
}

function Field({ label, children }) {
  const C = useContext(ThemeCtx);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, multiline, rows = 4 }) {
  const C = useContext(ThemeCtx);
  const base = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: `1.5px solid ${C.border}`, background: C.bgPanel,
    color: C.text, fontSize: 14, outline: "none",
    fontFamily: C_BASE.sans, resize: "vertical",
    transition: "border-color 0.2s"
  };
  return multiline
    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={base} onFocus={e => e.target.style.borderColor = C_BASE.blue} onBlur={e => e.target.style.borderColor = C.border} />
    : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} onFocus={e => e.target.style.borderColor = C_BASE.blue} onBlur={e => e.target.style.borderColor = C.border} />;
}

function Select({ value, onChange, options }) {
  const C = useContext(ThemeCtx);
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bgPanel, color: C.text, fontSize: 14, outline: "none" }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ── LinkedIn Form ─────────────────────────────────────────────────────────────
function LinkedInForm({ onSaved }) {
  const C = useContext(ThemeCtx);
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent]       = useState("");
  const [isMostAsked, setIsMostAsked] = useState(false);
  const [saving, setSaving]         = useState(false);

  const save = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    await fetch(`${API}/linkedin-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, content, isMostAsked, category: "LinkedIn" })
    });
    setSaving(false);
    setTitle(""); setDescription(""); setContent(""); setIsMostAsked(false);
    onSaved();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Field label="Title"><Input value={title} onChange={setTitle} placeholder="e.g. Promises vs Async/Await" /></Field>
      <Field label="Short Description"><Input value={description} onChange={setDescription} placeholder="One line summary shown in the list" /></Field>
      <Field label="Full Content (Post Body)"><Input value={content} onChange={setContent} placeholder="Paste the full LinkedIn post content here..." multiline rows={8} /></Field>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Toggle value={isMostAsked} onChange={setIsMostAsked} />
        <Btn themeC={C} onClick={save} style={{ padding: "10px 28px", fontWeight: 700 }}>
          {saving ? "Saving..." : <><Plus size={15} /> Add Question</>}
        </Btn>
      </div>
    </div>
  );
}

// ── Output Form ───────────────────────────────────────────────────────────────
function OutputForm({ onSaved }) {
  const C = useContext(ThemeCtx);
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode]             = useState("");
  const [options, setOptions]       = useState(["", "", "", ""]);
  const [correct, setCorrect]       = useState(0);
  const [explanation, setExplanation] = useState("");
  const [category, setCategory]     = useState(OUTPUT_CATEGORIES[0]);
  const [isMostAsked, setIsMostAsked] = useState(false);
  const [saving, setSaving]         = useState(false);

  const save = async () => {
    if (!title.trim() || !code.trim() || options.some(o => !o.trim())) return;
    setSaving(true);
    await fetch(`${API}/output-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, code, options, correct: Number(correct), explanation, category, isMostAsked })
    });
    setSaving(false);
    setTitle(""); setDescription(""); setCode(""); setOptions(["","","",""]); setCorrect(0); setExplanation(""); setIsMostAsked(false);
    onSaved();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Field label="Title"><Input value={title} onChange={setTitle} placeholder="e.g. Array + Array Coercion" /></Field>
      <Field label="Description"><Input value={description} onChange={setDescription} placeholder="What will be the output?" /></Field>
      <Field label="Category"><Select value={category} onChange={setCategory} options={OUTPUT_CATEGORIES} /></Field>
      <Field label="Code Snippet"><Input value={code} onChange={setCode} placeholder="console.log([] + []);" multiline rows={4} /></Field>
      <Field label="Options (4 choices)">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {options.map((o, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="radio" name="correct" checked={correct === i} onChange={() => setCorrect(i)} style={{ accentColor: C_BASE.green, width: 16, height: 16, cursor: "pointer" }} />
              <Input value={o} onChange={v => { const n = [...options]; n[i] = v; setOptions(n); }} placeholder={`Option ${i + 1}`} />
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>🟢 Select the radio button next to the correct answer</div>
      </Field>
      <Field label="Explanation"><Input value={explanation} onChange={setExplanation} placeholder="Why does this output occur?" multiline rows={4} /></Field>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Toggle value={isMostAsked} onChange={setIsMostAsked} />
        <Btn themeC={C} onClick={save} style={{ padding: "10px 28px", fontWeight: 700 }}>
          {saving ? "Saving..." : <><Plus size={15} /> Add Question</>}
        </Btn>
      </div>
    </div>
  );
}

// ── Coding Form ───────────────────────────────────────────────────────────────
function CodingForm({ onSaved }) {
  const C = useContext(ThemeCtx);
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory]     = useState(CODING_CATEGORIES[0]);
  const [templateCode, setTemplateCode] = useState("");
  const [solutionCode, setSolutionCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [testCases, setTestCases]   = useState("");
  const [isMostAsked, setIsMostAsked] = useState(false);
  const [saving, setSaving]         = useState(false);

  const save = async () => {
    if (!title.trim() || !templateCode.trim()) return;
    setSaving(true);
    await fetch(`${API}/coding-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category, templateCode, solutionCode, explanation, testCases, isMostAsked })
    });
    setSaving(false);
    setTitle(""); setDescription(""); setTemplateCode(""); setSolutionCode(""); setExplanation(""); setTestCases(""); setIsMostAsked(false);
    onSaved();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Field label="Title"><Input value={title} onChange={setTitle} placeholder="e.g. Debounce Function" /></Field>
      <Field label="Description"><Input value={description} onChange={setDescription} placeholder="Problem statement..." multiline rows={3} /></Field>
      <Field label="Category"><Select value={category} onChange={setCategory} options={CODING_CATEGORIES} /></Field>
      <Field label="Template Code (starter)"><Input value={templateCode} onChange={setTemplateCode} placeholder="function debounce(fn, delay) {\n  // write here\n}" multiline rows={5} /></Field>
      <Field label="Solution Code"><Input value={solutionCode} onChange={setSolutionCode} placeholder="Complete solution..." multiline rows={5} /></Field>
      <Field label="Explanation"><Input value={explanation} onChange={setExplanation} placeholder="How the solution works..." multiline rows={3} /></Field>
      <Field label="Test Cases (JS code)"><Input value={testCases} onChange={setTestCases} placeholder="console.log(debounce(...));" multiline rows={3} /></Field>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Toggle value={isMostAsked} onChange={setIsMostAsked} />
        <Btn themeC={C} onClick={save} style={{ padding: "10px 28px", fontWeight: 700 }}>
          {saving ? "Saving..." : <><Plus size={15} /> Add Question</>}
        </Btn>
      </div>
    </div>
  );
}

// ── Question List ─────────────────────────────────────────────────────────────
function QuestionList({ bankKey, refresh }) {
  const C = useContext(ThemeCtx);
  const [items, setItems] = useState([]);

  const endpointMap = {
    linkedin: "linkedin-questions",
    coding:   "coding-questions",
    output:   "output-questions",
  };

  useEffect(() => {
    fetch(`${API}/${endpointMap[bankKey]}`)
      .then(r => r.json())
      .then(setItems)
      .catch(() => {});
  }, [bankKey, refresh]);

  const del = async (id) => {
    if (!confirm("Delete this question?")) return;
    await fetch(`${API}/${endpointMap[bankKey]}/${id}`, { method: "DELETE" });
    setItems(prev => prev.filter(q => q.id !== id));
  };

  if (!items.length) return <div style={{ padding: 24, color: C.textMuted, fontSize: 14 }}>No questions yet.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {items.map((q, i) => (
        <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i === items.length - 1 ? "none" : `1px solid ${C.border}` }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.title}</span>
              {q.isMostAsked && (
                <span style={{ fontSize: 10, fontWeight: 700, background: "#fef9c3", color: "#92400e", padding: "2px 7px", borderRadius: 20, border: "1px solid #fde68a", whiteSpace: "nowrap" }}>⭐ Most Asked</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{q.category}</div>
          </div>
          <button onClick={() => del(q.id)} style={{ background: "#fee2e210", border: "1px solid #fca5a520", color: "#ef4444", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ManageBank() {
  const C = useContext(ThemeCtx);
  const [activeBank, setActiveBank] = useState("linkedin");
  const [activeTab, setActiveTab]   = useState("add");
  const [refresh, setRefresh]       = useState(0);

  const onSaved = () => {
    setRefresh(r => r + 1);
    setActiveTab("list");
  };

  const bank = BANKS.find(b => b.key === activeBank);

  return (
    <div style={{ animation: "fadeIn 0.4s ease", maxWidth: 860, margin: "0 auto", paddingBottom: 60 }}>

      {/* PAGE HEADER */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 6 }}>🗃️ Manage Bank</h1>
        <p style={{ fontSize: 15, color: C.textMuted }}>Add, view and delete questions across all question banks.</p>
      </div>

      {/* BANK SELECTOR */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
        {BANKS.map(b => (
          <button
            key={b.key}
            onClick={() => { setActiveBank(b.key); setActiveTab("add"); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700,
              cursor: "pointer", transition: "all 0.2s",
              border: `2px solid ${activeBank === b.key ? b.color : C.border}`,
              background: activeBank === b.key ? `${b.color}15` : C.bgCard,
              color: activeBank === b.key ? b.color : C.text,
            }}
          >
            {b.icon} {b.label}
          </button>
        ))}
      </div>

      {/* CARD */}
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden", boxShadow: C.shadow }}>

        {/* CARD TABS */}
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, background: C.bgPanel }}>
          {["add", "list"].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: "14px 24px", background: "transparent", border: "none",
                borderBottom: activeTab === t ? `2px solid ${bank.color}` : "2px solid transparent",
                color: activeTab === t ? C.text : C.textMuted,
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6
              }}
            >
              {t === "add" ? <><Plus size={15} /> Add New</> : <>📋 View All</>}
            </button>
          ))}
        </div>

        {/* CARD BODY */}
        <div style={{ padding: 28 }}>
          {activeTab === "add" ? (
            <>
              {activeBank === "linkedin" && <LinkedInForm onSaved={onSaved} />}
              {activeBank === "output"   && <OutputForm   onSaved={onSaved} />}
              {activeBank === "coding"   && <CodingForm   onSaved={onSaved} />}
            </>
          ) : (
            <QuestionList bankKey={activeBank} refresh={refresh} />
          )}
        </div>
      </div>
    </div>
  );
}
