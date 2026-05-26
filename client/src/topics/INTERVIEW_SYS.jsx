import { useState, useEffect, useContext } from "react";
import { Search, ChevronRight, X, Plus, Pencil, Trash2, Save } from "lucide-react";
import { C_BASE } from "../constants";
import { ThemeCtx, Btn } from "../shared";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  fetchSystemDesignQuestions, addSystemDesignQuestion, updateSystemDesignQuestion, deleteSystemDesignQuestion
} from "../api";

export default function INTERVIEW_SYS() {
  const C = useContext(ThemeCtx);
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState(getEmptyForm());
  const [formSaving, setFormSaving] = useState(false);
  
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [revealAnswer, setRevealAnswer] = useState(false);

  function getEmptyForm() {
    return { title: "", description: "", explanation: "", category: "System Design", isMostAsked: false };
  }

  useEffect(() => {
    fetchSystemDesignQuestions().then(setQuestions).catch(err => console.error(err));
  }, []);

  const openAddModal = () => {
    setFormData(getEmptyForm());
    setEditingQuestion(null);
    setShowFormModal(true);
  };

  const openEditModal = (q) => {
    setFormData(q);
    setEditingQuestion(q);
    setShowFormModal(true);
  };

  const handleDeleteQuestion = async (q) => {
    if (window.confirm(`Delete question: ${q.title || q.description?.substring(0, 20)}?`)) {
      try {
        await deleteSystemDesignQuestion(q.id);
        setQuestions(prev => prev.filter(x => x.id !== q.id));
      } catch (err) { alert(err.message); }
    }
  };

  const handleSaveQuestion = async () => {
    if (!formData.description?.trim()) return alert("Question Description required.");
    setFormSaving(true);
    try {
      if (editingQuestion) {
        const updated = await updateSystemDesignQuestion(editingQuestion.id, formData);
        setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? updated : q));
      } else {
        const created = await addSystemDesignQuestion(formData);
        setQuestions(prev => [...prev, created]);
      }
      setShowFormModal(false); setEditingQuestion(null);
    } catch (err) { alert(err.message); } finally { setFormSaving(false); }
  };

  const filtered = questions.filter(q => 
    (q.title || "").toLowerCase().includes(search.toLowerCase()) || 
    (q.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ animation: "fadeIn 0.5s ease", maxWidth: 900, margin: "0 auto", paddingBottom: 40, fontFamily: C.sans }}>
      <div style={{ display: "flex", gap: 32, marginBottom: 32, borderBottom: `1px solid ${C.border}` }}>
        <button style={{ padding: "0 4px 16px 4px", background: "transparent", border: "none", borderBottom: "2px solid #007a55", color: C.text, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
          📐 System Design
        </button>
      </div>
      
      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={18} style={{ position: "absolute", left: 16, color: C.textMuted }} />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "12px 16px 12px 48px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.bgCard, color: C.text, fontSize: 14, outline: "none" }} />
        </div>
        <button onClick={openAddModal} style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #007a55, #00c9a7)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          <Plus size={18} /> Add Question
        </button>
      </div>

      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>No questions found.</div>}
        {filtered.map((q, i) => (
          <div key={q.id} style={{ padding: "24px", borderBottom: i === filtered.length - 1 ? "none" : `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", gap: 20, cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = C.bgHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 60, display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => { setSelectedQuestion(q); setRevealAnswer(false); }}>
              <div style={{ background: "#007a5510", border: "1px solid #007a5544", borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 2, minWidth: 44, justifyContent: "center", marginTop: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#007a55" }}>Q</span><span style={{ fontSize: 12, fontWeight: 800, color: "#b8860b" }}>{i + 1}</span>
              </div>
            </div>
            <div style={{ flex: 1 }} onClick={() => { setSelectedQuestion(q); setRevealAnswer(false); }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                {q.title || q.description?.split("\n")[0]} {q.isMostAsked && <span style={{ fontSize: 11, fontWeight: 700, background: "#fef9c3", color: "#92400e", padding: "2px 8px", borderRadius: 20, border: "1px solid #fde68a" }}>⭐ Most Asked</span>}
              </div>
              {q.title && <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 16 }}>{q.description?.split("\n")[0]}</div>}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textMuted }}>
                <span style={{ padding: "2px 6px", background: C.bgPanel, borderRadius: 4, fontWeight: 600 }}>SYSTEM</span> {q.category || "System Design"}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <button onClick={(e) => { e.stopPropagation(); openEditModal(q); }} style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Pencil size={14} /></button>
              <button onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(q); }} style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Trash2 size={14} /></button>
              <ChevronRight size={20} color={C.textMuted} style={{ marginLeft: 4 }} />
            </div>
          </div>
        ))}
      </div>

      {selectedQuestion && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10, 10, 15, 0.85)", backdropFilter: "blur(12px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ width: "100%", maxWidth: 800, maxHeight: "85vh", background: C.bgCard, borderRadius: 24, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "24px 32px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: 0 }}>🤔 {selectedQuestion.title || "System Design Question"}</h3>
              <button onClick={() => { setSelectedQuestion(null); setRevealAnswer(false); }} style={{ background: C.bgHover, border: "none", color: C.text, width: 36, height: 36, borderRadius: 10, cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
              <h4 style={{ fontSize: 13, textTransform: "uppercase", color: C.textMuted, marginBottom: 12 }}>Question</h4>
              <div style={{ fontSize: 16, color: C.text, lineHeight: 1.6, marginBottom: 32, whiteSpace: "pre-line" }}>{selectedQuestion.description}</div>
              {!revealAnswer ? (
                 <div style={{ textAlign: "center", padding: "32px", background: C.bgPanel, borderRadius: 16, border: `1px dashed ${C.border}` }}>
                   <Btn themeC={C} onClick={() => setRevealAnswer(true)}>👁 Show Answer</Btn>
                 </div>
              ) : (
                <div>
                  <h4 style={{ fontSize: 13, textTransform: "uppercase", color: "#00c9a7", marginBottom: 12 }}>Answer</h4>
                  <div className="quill-content" style={{ fontSize: 15, color: C.text, lineHeight: 1.7, background: "#007a5510", padding: 24, borderRadius: 16, border: "1px solid #007a5533" }} dangerouslySetInnerHTML={{ __html: selectedQuestion.explanation }}></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showFormModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10, 10, 15, 0.85)", backdropFilter: "blur(12px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ width: "100%", maxWidth: 720, maxHeight: "85vh", background: C.bgCard, borderRadius: 24, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "20px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #007a55, #00c9a7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {editingQuestion ? <Pencil size={18} color="#fff" /> : <Plus size={18} color="#fff" />}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>{editingQuestion ? "Edit Question" : "Add Question"}</h3>
                </div>
              </div>
              <button onClick={() => setShowFormModal(false)} style={{ background: C.bgHover, border: "none", color: C.text, width: 36, height: 36, borderRadius: 10, cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Question Description *</label>
                <textarea value={formData.description || ""} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.bgPanel, color: C.text, outline: "none" }} />
              </div>
              
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                  <span>COMPREHENSIVE ANSWER</span>
                  <span style={{ color: "#00c9a7", cursor: "pointer" }}>↗ Fullscreen Editor</span>
                </label>
                <div style={{ background: "#fff", color: "#000", borderRadius: 8, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <ReactQuill theme="snow" value={formData.explanation || ""} onChange={val => setFormData(p => ({ ...p, explanation: val }))} style={{ borderBottom: "1px solid #e2e8f0" }} />
                  <div style={{ padding: "8px 12px", display: "flex", gap: 8, background: "#f8fafc", flexWrap: "wrap" }}>
                    {["✅", "❌", "🚀", "⚠️", "💡", "🔥", "⭐", "📌", "🎯", "🛠️", "📈", "🔒", "⏳"].map(emoji => (
                      <button key={emoji} type="button" onClick={() => setFormData(p => ({ ...p, explanation: (p.explanation || "") + emoji }))} style={{ background: "#fff", border: "1px solid #cbd5e1", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 16, transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>{emoji}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button onClick={() => setShowFormModal(false)} style={{ padding: "10px 24px", borderRadius: 12, border: `1px solid ${C.border}`, background: "transparent", color: C.text, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSaveQuestion} disabled={formSaving} style={{ padding: "10px 28px", borderRadius: 12, border: "none", background: formSaving ? "#555" : "#007a55", color: "#fff", cursor: formSaving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}><Save size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
