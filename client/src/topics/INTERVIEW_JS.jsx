import { useState, useContext, useEffect, useRef } from "react";
import { 
  Search, ChevronDown, CheckCircle, Clock, Flame, ChevronRight, 
  Terminal, Monitor, BarChart3, X, Filter, Boxes, Zap, Workflow,
  Fingerprint, Cpu, Binary, Database, GitMerge, Rocket, BookOpen,
  Plus, Pencil, Trash2, Save
} from "lucide-react";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

import { C_BASE } from "../constants";
import { ThemeCtx, Btn, Tag, ToastCtx } from "../shared";
import {
  addCodingQuestion, updateCodingQuestion, deleteCodingQuestion,
  addOutputQuestion, updateOutputQuestion, deleteOutputQuestion,
  addLinkedInQuestion, updateLinkedInQuestion, deleteLinkedInQuestion
} from "../api";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";

function CodeEditor({ value, onChange }) {
  const ref = useRef(null);
  const myTheme = EditorView.theme({
    ".cm-content": {
      color: "#f5f5f5",
      background: "rgba(255,255,255,0.05)",
      fontFamily: "'Fira Code', monospace",
      fontSize: "14px"
    },
    ".cm-gutters": {
      background: "rgba(255,255,255,0.05)",
      color: "#888"
    },
    ".cm-activeLine": {
      background: "rgba(255,255,255,0.08)"
    }
  }, { dark: true });

  const myHighlightStyle = HighlightStyle.define([
    { tag: tags.keyword, color: "#ff79c6" },
    { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName], color: "#8be9fd" },
    { tag: [tags.function(tags.variableName), tags.labelName], color: "#50fa7b" },
    { tag: [tags.constant(tags.name), tags.standard(tags.name)], color: "#ffb86c" },
    { tag: [tags.string, tags.meta, tags.regexp], color: "#f1fa8c" },
    { tag: [tags.comment], color: "#6272a4", fontStyle: "italic" },
    { tag: [tags.variableName], color: "#bd93f9" }
  ]);

  useEffect(() => {
    if (!ref.current) return;
    const startState = EditorState.create({
      doc: value,
      extensions: [
        javascript(),
        myTheme,
        syntaxHighlighting(myHighlightStyle),
        EditorView.updateListener.of(update => {
          if (update.changes) onChange(update.state.doc.toString());
        })
      ]
    });
    const view = new EditorView({ state: startState, parent: ref.current });
    return () => view.destroy();
  }, [value]);

  return <div ref={ref} style={{ borderRadius: 8, overflow: "hidden" }} />;
}

export default function INTERVIEW_JS() {
  const C = useContext(ThemeCtx);
  const toast = useContext(ToastCtx);
  const [activeTab, setActiveTab] = useState("Coding");
  const [activeFilter, setActiveFilter] = useState("Basic Coding");
  const [search, setSearch] = useState("");

  // Coding Playground States
  const [selectedCoding, setSelectedCoding] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [editorTab, setEditorTab] = useState("description"); // 'description' or 'solution'
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const [codingQuestions, setCodingQuestions] = useState([]);
  const [outputQuestions, setOutputQuestions] = useState([]);
  const [linkedInQuestions, setLinkedInQuestions] = useState([]);

  // ── Add/Edit Modal State ──────────────────────────────────────────────────
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // null = adding, object = editing
  const [formData, setFormData] = useState({});
  const [formSaving, setFormSaving] = useState(false);

  const getEmptyForm = (tab) => {
    if (tab === "Coding") return { title: "", description: "", category: "Basic Coding", templateCode: "", solutionCode: "", explanation: "", testCases: "", isMostAsked: false };
    if (tab === "Output Based Question") return { title: "", description: "", code: "", options: ["", "", "", ""], correct: 0, category: "All topics", explanation: "", isMostAsked: false };
    return { title: "", description: "", content: "", category: "LinkedIn", isMostAsked: false };
  };

  const openAddModal = () => {
    setEditingQuestion(null);
    setFormData(getEmptyForm(activeTab));
    setShowFormModal(true);
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    const data = { ...q };
    // For output questions, ensure options is always an array of 4
    if (activeTab === "Output Based Question" && data.options) {
      while (data.options.length < 4) data.options.push("");
    }
    setFormData(data);
    setShowFormModal(true);
  };

  const handleDeleteQuestion = async (q) => {
    if (!confirm(`Delete "${q.title}"? This action cannot be undone.`)) return;
    try {
      if (activeTab === "Coding") {
        await deleteCodingQuestion(q.id);
        setCodingQuestions(prev => prev.filter(x => x.id !== q.id));
      } else if (activeTab === "Output Based Question") {
        await deleteOutputQuestion(q.id);
        setOutputQuestions(prev => prev.filter(x => x.id !== q.id));
      } else {
        await deleteLinkedInQuestion(q.id);
        setLinkedInQuestions(prev => prev.filter(x => x.id !== q.id));
      }
    } catch (err) {
      toast("Failed to delete: " + err.message, "error");
    }
  };

  const handleSaveQuestion = async () => {
    if (!formData.title?.trim() || !formData.description?.trim()) {
      toast("Title and Description are required.", "warn");
      return;
    }
    setFormSaving(true);
    try {
      if (activeTab === "Coding") {
        if (editingQuestion) {
          const updated = await updateCodingQuestion(editingQuestion.id, formData);
          setCodingQuestions(prev => prev.map(q => q.id === editingQuestion.id ? updated : q));
        } else {
          const created = await addCodingQuestion(formData);
          setCodingQuestions(prev => [...prev, created]);
        }
      } else if (activeTab === "Output Based Question") {
        const payload = { ...formData, options: formData.options?.filter(o => o.trim()) || [] };
        if (editingQuestion) {
          const updated = await updateOutputQuestion(editingQuestion.id, payload);
          setOutputQuestions(prev => prev.map(q => q.id === editingQuestion.id ? updated : q));
        } else {
          const created = await addOutputQuestion(payload);
          setOutputQuestions(prev => [...prev, created]);
        }
      } else {
        if (editingQuestion) {
          const updated = await updateLinkedInQuestion(editingQuestion.id, formData);
          setLinkedInQuestions(prev => prev.map(q => q.id === editingQuestion.id ? updated : q));
        } else {
          const created = await addLinkedInQuestion(formData);
          setLinkedInQuestions(prev => [...prev, created]);
        }
      }
      toast(editingQuestion ? "Question updated!" : "Question added!", "success");
      setShowFormModal(false);
      setEditingQuestion(null);
    } catch (err) {
      toast("Failed to save: " + err.message, "error");
    } finally {
      setFormSaving(false);
    }
  };

  const reloadQuestions = () => {
    fetch('/api/coding-questions')
      .then(res => res.json())
      .then(data => setCodingQuestions(data))
      .catch(err => console.error("Error fetching coding questions:", err));

    fetch('/api/output-questions')
      .then(res => res.json())
      .then(data => setOutputQuestions(data))
      .catch(err => console.error("Error fetching output questions:", err));

    fetch('/api/linkedin-questions')
      .then(res => res.json())
      .then(data => setLinkedInQuestions(data))
      .catch(err => console.error("Error fetching LinkedIn questions:", err));
  };

  useEffect(() => {
    reloadQuestions();
  }, []);

  const handleRunCode = () => {
    setIsRunning(true);
    const logs = [];
    const customConsole = {
      log: (...args) => {
        logs.push({ type: 'log', text: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ') });
      },
      error: (...args) => {
        logs.push({ type: 'error', text: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ') });
      },
      warn: (...args) => {
        logs.push({ type: 'warn', text: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ') });
      }
    };

    const fullCode = `
      ${userCode}
      
      // Test cases
      ${selectedCoding ? selectedCoding.testCases : ''}
    `;

    setTimeout(() => {
      try {
        const execute = new Function('console', 'setTimeout', 'setInterval', fullCode);
        execute(
          customConsole,
          (fn, delay) => setTimeout(() => fn(), delay),
          (fn, delay) => setInterval(() => fn(), delay)
        );
      } catch (err) {
        customConsole.error(err.message || err);
      }
      setConsoleLogs(logs);
      setIsRunning(false);
    }, 300);
  };




  const questions = activeTab === "Coding" ? codingQuestions : activeTab === "Output Based Question" ? outputQuestions : activeTab === "LinkedIn Questions" ? linkedInQuestions : [];

  const tabs = ["Coding", "Output Based Question", "LinkedIn Questions"];

  const codingFilters = [
    { label: "Basic Coding", icon: <Monitor size={14} /> },
    { label: "JavaScript functions", icon: <Terminal size={14} /> },
    { label: "DSA Coding", icon: <BarChart3 size={14} /> },
    { label: "⭐ Most Asked", icon: null },
  ];

  const outputFilters = [
    { label: "All topics", icon: <Boxes size={14} /> },
    { label: "⭐ Most Asked", icon: null },
    { label: "Event Loop", icon: <Clock size={14} /> },
    { label: "Closures", icon: <Workflow size={14} /> },
    { label: "this & Scope", icon: <Fingerprint size={14} /> },
    { label: "Hoisting", icon: <Zap size={14} /> },
    { label: "Promises / Async-Await", icon: <Rocket size={14} /> },
    { label: "Execution Context", icon: <Cpu size={14} /> },
    { label: "Type Coercion", icon: <Binary size={14} /> },
    { label: "Arrays & Objects behavior", icon: <Database size={14} /> },
    { label: "Prototype & Inheritance", icon: <GitMerge size={14} /> },
    { label: "Modern JS (ES6+)", icon: <Terminal size={14} /> },
  ];


  const linkedInFilters = [
    { label: "All", icon: null },
    { label: "⭐ Most Asked", icon: null },
  ];

  const currentFilters = activeTab === "Coding" ? codingFilters : activeTab === "Output Based Question" ? outputFilters : linkedInFilters;

  // Reset filter when switching tabs
  useEffect(() => {
    if (activeTab === "Coding") setActiveFilter("Basic Coding");
    else if (activeTab === "Output Based Question") setActiveFilter("All topics");
    else setActiveFilter("All");
  }, [activeTab]);



  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [userExpl, setUserExpl] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [selectedLinkedIn, setSelectedLinkedIn] = useState(null);

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    setShowResult(true);
  };

  const nextQuiz = () => {
    const pool = outputQuestions;
    const currentIndex = pool.findIndex(q => q.id === selectedQuiz.id);
    if (currentIndex < pool.length - 1) {
      setSelectedQuiz(pool[currentIndex + 1]);
      setUserAnswer("");
      setUserExpl("");
      setShowResult(false);
    } else {
      setSelectedQuiz(null);
      setUserAnswer("");
      setUserExpl("");
      setShowResult(false);
    }
  };






  const filteredQuestions = questions.filter(q => {
    const matchesMostAsked = activeFilter === "⭐ Most Asked" ? q.isMostAsked === true : true;
    const matchesAll = activeFilter === "All topics" || activeFilter === "All";
    const matchesCategory = matchesAll || activeFilter === "⭐ Most Asked" || q.category === activeFilter;
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase());
    return matchesMostAsked && matchesCategory && matchesSearch;
  });

  const isCorrect = selectedQuiz && userAnswer.replace(/\s+/g, '').toLowerCase() === selectedQuiz.options[selectedQuiz.correct].replace(/\s+/g, '').toLowerCase();

  return (
    <div style={{ 
      animation: "fadeIn 0.5s ease", 
      maxWidth: 900, 
      margin: "0 auto",
      paddingBottom: 40,
      fontFamily: C_BASE.sans 
    }}>

      {/* LINKEDIN DETAIL PAGE */}
      {selectedLinkedIn && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <button
            onClick={() => setSelectedLinkedIn(null)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "transparent", border: `1px solid ${C.border}`,
              color: C.text, borderRadius: 10, padding: "8px 16px",
              fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 24
            }}
          >
            ← Back to Questions
          </button>
          <div style={{
            background: C.bgCard, border: `1px solid ${C.border}`,
            borderRadius: 20, padding: 40, boxShadow: C.shadow
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "#0077b5", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 22
              }}>💼</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{selectedLinkedIn.title}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>LinkedIn Post</div>
              </div>
            </div>
            <div style={{
              whiteSpace: "pre-wrap", fontSize: 15, lineHeight: 1.9,
              color: C.text, fontFamily: C_BASE.sans
            }}>
              {selectedLinkedIn.content}
            </div>
          </div>
        </div>
      )}

      {!selectedLinkedIn && (<>

      {/* QUIZ MODE MODAL */}
      {selectedQuiz && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10, 10, 15, 0.9)",
          backdropFilter: "blur(8px)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}>
          <div style={{
            width: "100%",
            maxWidth: 1000,
            height: "75vh",
            background: C.bgCard,
            borderRadius: 24,
            display: "flex",
            overflow: "hidden",
            border: `1px solid ${C.border}`,
            boxShadow: "0 40px 100px -20px rgba(0,0,0,0.7)",
            position: "relative",
            animation: "fadeIn 0.3s ease"
          }}>
            {/* LEFT SIDE: CODE PANEL */}
            <div style={{ 
              width: "48%", 
              background: "#0d0d0d", 
              borderRight: `1px solid ${C.border}`,
              display: "flex",
              flexDirection: "column"
            }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
                <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>challenge.js</span>
              </div>
              {/* Question description */}
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #1a1a1a" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C_BASE.yellow, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>❓ Question</div>
                <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.6 }}>{selectedQuiz.description}</div>
              </div>
              {/* Code block */}
              <div style={{ flex: 1, padding: "20px 24px", overflow: "auto" }}>
                <pre style={{
                  margin: 0,
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "#f1fa8c",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word"
                }}>{selectedQuiz.code}</pre>
              </div>
            </div>

            {/* RIGHT SIDE: INTERACTION PANEL */}
            <div style={{ 
              flex: 1, 
              display: "flex", 
              flexDirection: "column",
              background: C.bgCard
            }}>
              <div style={{ padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: C_BASE.blue, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>JS Challenge</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>{selectedQuiz.title}</h3>
                </div>
                <button 
                  onClick={() => { setSelectedQuiz(null); setShowResult(false); }}
                  style={{ background: C.bgHover, border: "none", color: C.text, width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ flex: 1, padding: 32, overflowY: "auto" }} className="custom-scroll">
                {!showResult ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: C.text, marginBottom: 8, display: "block", textTransform: "uppercase" }}>Output</label>
                      <input 
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Predict the result..."
                        style={{
                          width: "100%",
                          padding: "14px 18px",
                          borderRadius: 12,
                          border: `1.5px solid ${C.border}`,
                          background: C.bgPanel,
                          color: C.text,
                          fontSize: 15,
                          fontWeight: 600,
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: C.text, marginBottom: 8, display: "block", textTransform: "uppercase" }}>Explanation</label>
                      <textarea 
                        value={userExpl}
                        onChange={(e) => setUserExpl(e.target.value)}
                        placeholder="Why does this happen?"
                        style={{
                          width: "100%",
                          height: 120,
                          padding: "14px 18px",
                          borderRadius: 12,
                          border: `1.5px solid ${C.border}`,
                          background: C.bgPanel,
                          color: C.text,
                          fontSize: 14,
                          outline: "none",
                          resize: "none",
                          lineHeight: 1.6
                        }}
                      />
                    </div>

                    <Btn themeC={C} onClick={handleSubmit} style={{ height: 50, fontSize: 15, fontWeight: 800, borderRadius: 12 }}>
                      Check Answer
                    </Btn>
                  </div>
                ) : (
                  <div style={{ animation: "fadeIn 0.5s ease" }}>
                  {/* CONFETTI ANIMATION */}
                  {isCorrect && (
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}>
                      {[...Array(20)].map((_, i) => (
                        <div 
                          key={i}
                          style={{
                            position: "absolute",
                            top: -20,
                            left: `${Math.random() * 100}%`,
                            width: 10,
                            height: 10,
                            background: [C_BASE.blue, C_BASE.purple, C_BASE.green, C_BASE.orange][i % 4],
                            borderRadius: "50%",
                            animation: `confettiFall ${2 + Math.random() * 3}s linear forwards`,
                            animationDelay: `${Math.random() * 2}s`
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div style={{ 
                      padding: 24, 
                      borderRadius: 16, 
                      background: isCorrect ? "rgba(39, 201, 63, 0.08)" : "rgba(255, 95, 86, 0.08)",
                      border: `1px solid ${isCorrect ? C_BASE.green : C_BASE.red}`,
                      marginBottom: 24,
                      display: "flex",
                      flexDirection: "column",
                      gap: 16
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: "50%", 
                          background: isCorrect ? C_BASE.green : C_BASE.red,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff"
                        }}>
                          {isCorrect ? <CheckCircle size={20} /> : <X size={20} />}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: isCorrect ? C_BASE.green : C_BASE.red }}>
                          {isCorrect ? "Perfect!" : "Not quite right"}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Your Answer</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: isCorrect ? C_BASE.green : C_BASE.red }}>{userAnswer || "(empty)"}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Correct Answer</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: C_BASE.green }}>{selectedQuiz.options[selectedQuiz.correct]}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 32 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: C.text, marginBottom: 12, textTransform: "uppercase" }}>Explanation</div>
                      <div style={{ 
                        fontSize: 14, 
                        lineHeight: 1.7, 
                        color: C.text, 
                        background: C.bgPanel, 
                        padding: 20, 
                        borderRadius: 16,
                        border: `1px solid ${C.border}`
                      }}>
                        {selectedQuiz.explanation}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                      <Btn themeC={C} variant="outline" onClick={() => setShowResult(false)} style={{ flex: 1, height: 44, borderRadius: 10 }}>Review</Btn>
                      <Btn themeC={C} onClick={nextQuiz} style={{ flex: 2, height: 44, borderRadius: 10 }}>Next</Btn>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ADD/EDIT QUESTION MODAL */}
      {showFormModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10, 10, 15, 0.85)",
          backdropFilter: "blur(12px)",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          animation: "fadeIn 0.25s ease"
        }}>
          <div style={{
            width: "100%",
            maxWidth: 720,
            maxHeight: "85vh",
            background: C.bgCard,
            borderRadius: 24,
            border: `1px solid ${C.border}`,
            boxShadow: "0 40px 100px -20px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "20px 28px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "linear-gradient(135deg, #007a55, #00c9a7)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {editingQuestion ? <Pencil size={18} color="#fff" /> : <Plus size={18} color="#fff" />}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>
                    {editingQuestion ? "Edit Question" : "Add New Question"}
                  </h3>
                  <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>
                    {activeTab === "Coding" ? "Coding Question" : activeTab === "Output Based Question" ? "Output Based Question" : "LinkedIn Question"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setShowFormModal(false); setEditingQuestion(null); }}
                style={{ background: C.bgHover, border: "none", color: C.text, width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Title */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Title *</label>
                <input
                  value={formData.title || ""}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Reverse a string"
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12,
                    border: `1.5px solid ${C.border}`, background: C.bgPanel,
                    color: C.text, fontSize: 14, fontWeight: 600, outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#007a55"}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Description *</label>
                <textarea
                  value={formData.description || ""}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the question..."
                  rows={3}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12,
                    border: `1.5px solid ${C.border}`, background: C.bgPanel,
                    color: C.text, fontSize: 14, outline: "none", resize: "vertical",
                    lineHeight: 1.6, transition: "border-color 0.2s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#007a55"}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>

              {/* Category */}
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Category</label>
                  <input
                    value={formData.category || ""}
                    onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                    placeholder="e.g. Basic Coding"
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12,
                      border: `1.5px solid ${C.border}`, background: C.bgPanel,
                      color: C.text, fontSize: 14, outline: "none", transition: "border-color 0.2s"
                    }}
                    onFocus={e => e.target.style.borderColor = "#007a55"}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.text }}>
                    <input
                      type="checkbox"
                      checked={formData.isMostAsked || false}
                      onChange={e => setFormData(p => ({ ...p, isMostAsked: e.target.checked }))}
                      style={{ width: 18, height: 18, accentColor: "#007a55" }}
                    />
                    ⭐ Most Asked
                  </label>
                </div>
              </div>

              {/* CODING-SPECIFIC FIELDS */}
              {activeTab === "Coding" && (
                <>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Template Code (starter code for user)</label>
                    <textarea
                      value={formData.templateCode || ""}
                      onChange={e => setFormData(p => ({ ...p, templateCode: e.target.value }))}
                      placeholder="function reverse(str) {\n  // write your code here\n}"
                      rows={5}
                      style={{
                        width: "100%", padding: "12px 16px", borderRadius: 12,
                        border: `1.5px solid ${C.border}`, background: "#0d0d0d",
                        color: "#a9b1d6", fontSize: 13, outline: "none", resize: "vertical",
                        fontFamily: "'Fira Code', monospace", lineHeight: 1.6
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Solution Code</label>
                    <textarea
                      value={formData.solutionCode || ""}
                      onChange={e => setFormData(p => ({ ...p, solutionCode: e.target.value }))}
                      placeholder="function reverse(str) {\n  return str.split('').reverse().join('');\n}"
                      rows={5}
                      style={{
                        width: "100%", padding: "12px 16px", borderRadius: 12,
                        border: `1.5px solid ${C.border}`, background: "#0d0d0d",
                        color: "#89ca78", fontSize: 13, outline: "none", resize: "vertical",
                        fontFamily: "'Fira Code', monospace", lineHeight: 1.6
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Test Cases (JS code)</label>
                    <textarea
                      value={formData.testCases || ""}
                      onChange={e => setFormData(p => ({ ...p, testCases: e.target.value }))}
                      placeholder='console.log(reverse("hello")); // "olleh"'
                      rows={3}
                      style={{
                        width: "100%", padding: "12px 16px", borderRadius: 12,
                        border: `1.5px solid ${C.border}`, background: "#0d0d0d",
                        color: "#d19a66", fontSize: 13, outline: "none", resize: "vertical",
                        fontFamily: "'Fira Code', monospace", lineHeight: 1.6
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Explanation</label>
                    <textarea
                      value={formData.explanation || ""}
                      onChange={e => setFormData(p => ({ ...p, explanation: e.target.value }))}
                      placeholder="Explain how the solution works..."
                      rows={3}
                      style={{
                        width: "100%", padding: "12px 16px", borderRadius: 12,
                        border: `1.5px solid ${C.border}`, background: C.bgPanel,
                        color: C.text, fontSize: 14, outline: "none", resize: "vertical", lineHeight: 1.6
                      }}
                    />
                  </div>
                </>
              )}

              {/* OUTPUT-BASED SPECIFIC FIELDS */}
              {activeTab === "Output Based Question" && (
                <>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Code Snippet</label>
                    <textarea
                      value={formData.code || ""}
                      onChange={e => setFormData(p => ({ ...p, code: e.target.value }))}
                      placeholder='const x = 1;\nconsole.log(x);'
                      rows={5}
                      style={{
                        width: "100%", padding: "12px 16px", borderRadius: 12,
                        border: `1.5px solid ${C.border}`, background: "#0d0d0d",
                        color: "#f1fa8c", fontSize: 13, outline: "none", resize: "vertical",
                        fontFamily: "'Fira Code', monospace", lineHeight: 1.6
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Options (answer choices)</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {(formData.options || ["", "", "", ""]).map((opt, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            onClick={() => setFormData(p => ({ ...p, correct: idx }))}
                            style={{
                              width: 28, height: 28, borderRadius: "50%",
                              border: `2px solid ${formData.correct === idx ? "#007a55" : C.border}`,
                              background: formData.correct === idx ? "#007a5520" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", fontSize: 12, fontWeight: 800,
                              color: formData.correct === idx ? "#007a55" : C.textMuted,
                              transition: "all 0.2s", flexShrink: 0
                            }}
                          >
                            {formData.correct === idx ? "✓" : String.fromCharCode(65 + idx)}
                          </div>
                          <input
                            value={opt}
                            onChange={e => {
                              const newOpts = [...(formData.options || ["", "", "", ""])];
                              newOpts[idx] = e.target.value;
                              setFormData(p => ({ ...p, options: newOpts }));
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                            style={{
                              flex: 1, padding: "10px 14px", borderRadius: 10,
                              border: `1.5px solid ${formData.correct === idx ? "#007a55" : C.border}`,
                              background: C.bgPanel, color: C.text, fontSize: 13,
                              fontWeight: 600, outline: "none"
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: C.textMuted, marginTop: 6, display: "block" }}>Click the circle to mark the correct answer</span>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Explanation</label>
                    <textarea
                      value={formData.explanation || ""}
                      onChange={e => setFormData(p => ({ ...p, explanation: e.target.value }))}
                      placeholder="Why does the output behave this way?"
                      rows={3}
                      style={{
                        width: "100%", padding: "12px 16px", borderRadius: 12,
                        border: `1.5px solid ${C.border}`, background: C.bgPanel,
                        color: C.text, fontSize: 14, outline: "none", resize: "vertical", lineHeight: 1.6
                      }}
                    />
                  </div>
                </>
              )}

              {/* LINKEDIN-SPECIFIC FIELDS */}
              {activeTab === "LinkedIn Questions" && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Content (full LinkedIn post text)</label>
                  <textarea
                    value={formData.content || ""}
                    onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                    placeholder="Paste or type the full LinkedIn post content here..."
                    rows={8}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12,
                      border: `1.5px solid ${C.border}`, background: C.bgPanel,
                      color: C.text, fontSize: 14, outline: "none", resize: "vertical", lineHeight: 1.6
                    }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "16px 28px",
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "flex-end",
              gap: 12
            }}>
              <button
                onClick={() => { setShowFormModal(false); setEditingQuestion(null); }}
                style={{
                  padding: "10px 24px", borderRadius: 12,
                  border: `1px solid ${C.border}`, background: "transparent",
                  color: C.text, fontSize: 14, fontWeight: 600, cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuestion}
                disabled={formSaving}
                style={{
                  padding: "10px 28px", borderRadius: 12, border: "none",
                  background: formSaving ? "#555" : "linear-gradient(135deg, #007a55, #00c9a7)",
                  color: "#fff", fontSize: 14, fontWeight: 700, cursor: formSaving ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 4px 14px rgba(0, 122, 85, 0.3)"
                }}
              >
                <Save size={16} />
                {formSaving ? "Saving..." : editingQuestion ? "Update Question" : "Add Question"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH BAR + ADD BUTTON */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <div style={{ 
          flex: 1, 
          position: "relative",
          display: "flex",
          alignItems: "center"
        }}>
          <Search size={18} style={{ position: "absolute", left: 16, color: C.textMuted }} />
          <input 
            type="text" 
            placeholder="Search within this list of questions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 48px",
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              background: C.bgCard,
              color: C.text,
              fontSize: 14,
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = C_BASE.blue}
            onBlur={(e) => e.target.style.borderColor = C.border}
          />
        </div>
        <button 
          onClick={openAddModal}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 20px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #007a55, #00c9a7)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0, 122, 85, 0.25)",
            transition: "transform 0.2s, box-shadow 0.2s",
            whiteSpace: "nowrap"
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 122, 85, 0.35)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 122, 85, 0.25)"; }}
        >
          <Plus size={18} /> Add Question
        </button>
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 20px",
          borderRadius: 12,
          border: `1px solid ${C.border}`,
          background: C.bgCard,
          color: C.text,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer"
        }}>
          <Filter size={16} /> Sort by <ChevronDown size={14} />
        </button>
      </div>

      {/* PRIMARY TABS */}
      <div style={{ 
        display: "flex", 
        gap: 24, 
        borderBottom: `1px solid ${C.border}`, 
        marginBottom: 24,
        paddingBottom: 2
      }}>
        {tabs.map(t => (
          <div 
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "8px 4px",
              fontSize: 15,
              fontWeight: 600,
              color: activeTab === t ? C.text : C.textMuted,
              cursor: "pointer",
              position: "relative",
              transition: "color 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {t}
            {activeTab === t && (
              <div style={{ 
                position: "absolute", 
                bottom: -2, 
                left: 0, 
                right: 0, 
                height: 2, 
                background: C.text,
                borderRadius: "2px 2px 0 0"
              }} />
            )}
          </div>
        ))}
      </div>

      {/* FILTER PILLS */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes confettiFall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          25% { transform: translateY(150px) translateX(20px) rotate(180deg); }
          50% { transform: translateY(300px) translateX(-20px) rotate(360deg); }
          75% { transform: translateY(450px) translateX(20px) rotate(540deg); }
          100% { transform: translateY(600px) translateX(0) rotate(720deg); opacity: 0; }
        }
      `}</style>
      <div 
        className="no-scrollbar"
        style={{ 
          display: "flex", 
          gap: 12, 
          marginBottom: 32, 
          overflowX: "auto", 
          paddingBottom: 4,
          WebkitOverflowScrolling: "touch"
        }}
      >
        {currentFilters.map(f => (
          <button 
            key={f.label}
            onClick={() => setActiveFilter(f.label)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 20,
              border: `1px solid ${activeFilter === f.label ? (C.type === 'light' ? '#000' : '#fff') : C.border}`,
              background: activeFilter === f.label ? (C.type === 'light' ? '#000' : '#fff') : C.bgCard,
              color: activeFilter === f.label ? (C.type === 'light' ? '#fff' : '#000') : C.text,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap"
            }}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>


      {/* QUESTION LIST */}
      <div style={{ 
        background: C.bgCard, 
        border: `1px solid ${C.border}`, 
        borderRadius: 16,
        overflow: "hidden"
      }}>
        {filteredQuestions.map((q, i) => (
          <div 
            key={q.id}
            style={{
              padding: "24px",
              borderBottom: i === filteredQuestions.length - 1 ? "none" : `1px solid ${C.border}`,
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = C.bgHover}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            {/* QUESTION NUMBER BADGE */}
            <div 
              style={{ width: 60, display: "flex", justifyContent: "center", alignItems: "center" }}
              onClick={() => {
                if (activeTab === "LinkedIn Questions") setSelectedLinkedIn(q);
                else if (activeTab === "Output Based Question") setSelectedQuiz(q);
                else if (activeTab === "Coding") {
                  setSelectedCoding(q); setUserCode(q.templateCode);
                  setConsoleLogs([]); setRevealAnswer(false); setEditorTab("description");
                }
              }}
            >
              <div style={{ 
                background: "#007a5510", 
                border: "1px solid #007a5544", 
                borderRadius: 20, 
                padding: "4px 10px",
                display: "flex",
                alignItems: "center",
                gap: 2,
                minWidth: 44,
                justifyContent: "center",
                marginTop: 4
              }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#007a55" }}>Q</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#b8860b" }}>{i + 1}</span>
              </div>
            </div>

            {/* CONTENT */}
            <div 
              style={{ flex: 1 }}
              onClick={() => {
                if (activeTab === "LinkedIn Questions") setSelectedLinkedIn(q);
                else if (activeTab === "Output Based Question") setSelectedQuiz(q);
                else if (activeTab === "Coding") {
                  setSelectedCoding(q); setUserCode(q.templateCode);
                  setConsoleLogs([]); setRevealAnswer(false); setEditorTab("description");
                }
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                {q.title}
                {q.isMostAsked && (
                  <span style={{ fontSize: 11, fontWeight: 700, background: "#fef9c3", color: "#92400e", padding: "2px 8px", borderRadius: 20, border: "1px solid #fde68a", whiteSpace: "nowrap" }}>
                    ⭐ Most Asked
                  </span>
                )}
              </div>
              <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 16, lineHeight: 1.5 }}>{q.description}</div>
              
              {/* META INFO */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textMuted }}>
                  <span style={{ padding: "2px 6px", background: C.bgPanel, borderRadius: 4, fontWeight: 600 }}>JS</span> {q.category}
                </div>
              </div>
            </div>

            {/* EDIT / DELETE / ARROW ACTIONS */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <button
                onClick={(e) => { e.stopPropagation(); openEditModal(q); }}
                title="Edit Question"
                style={{
                  width: 34, height: 34, borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  background: "transparent",
                  color: C.textMuted,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C_BASE.blue; e.currentTarget.style.color = C_BASE.blue; e.currentTarget.style.background = C_BASE.blue + "15"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = "transparent"; }}
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(q); }}
                title="Delete Question"
                style={{
                  width: 34, height: 34, borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  background: "transparent",
                  color: C.textMuted,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C_BASE.red; e.currentTarget.style.color = C_BASE.red; e.currentTarget.style.background = C_BASE.red + "15"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = "transparent"; }}
              >
                <Trash2 size={14} />
              </button>
              <ChevronRight 
                size={20} color={C.textMuted} style={{ marginLeft: 4 }} 
                onClick={() => {
                  if (activeTab === "LinkedIn Questions") setSelectedLinkedIn(q);
                  else if (activeTab === "Output Based Question") setSelectedQuiz(q);
                  else if (activeTab === "Coding") {
                    setSelectedCoding(q); setUserCode(q.templateCode);
                    setConsoleLogs([]); setRevealAnswer(false); setEditorTab("description");
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* CODE EDITOR WORKSPACE OVERLAY */}
      {selectedCoding && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(6, 8, 12, 0.96)",
          backdropFilter: "blur(12px)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          animation: "fadeIn 0.25s ease-out"
        }}>
          {/* HEADER */}
          <div style={{
            height: 64,
            padding: "0 24px",
            background: C.bgCard,
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 20 }}>💻</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{selectedCoding.title}</span>
                  <span style={{ 
                    fontSize: 10, 
                    fontWeight: 700, 
                    background: "#007a5515", 
                    color: "#007a55", 
                    padding: "2px 8px", 
                    borderRadius: 4,
                    border: "1px solid #007a5530" 
                  }}>{selectedCoding.category}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button 
                onClick={() => {
                  if (confirm("Reset editor to default template code? Your current edits will be lost.")) {
                    setUserCode(selectedCoding.templateCode);
                    setConsoleLogs([]);
                  }
                }}
                style={{ 
                  background: "transparent", 
                  border: `1px solid ${C.border}`, 
                  color: C.textSub, 
                  borderRadius: 10, 
                  padding: "8px 16px", 
                  fontSize: 13, 
                  fontWeight: 600, 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
                className="sh-hover"
              >
                🔄 Reset
              </button>

              <button 
                onClick={handleRunCode}
                disabled={isRunning}
                style={{ 
                  background: "#007a55", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: 10, 
                  padding: "8px 20px", 
                  fontSize: 13, 
                  fontWeight: 700, 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: isRunning ? 0.7 : 1
                }}
              >
                {isRunning ? "⚡ Running..." : "▶ Run Tests"}
              </button>

              <div style={{ width: 1, height: 24, background: C.border, margin: "0 4px" }} />

              <button 
                onClick={() => { setSelectedCoding(null); setRevealAnswer(false); }}
                style={{ 
                  background: C.bgHover, 
                  border: "none", 
                  color: C.text, 
                  width: 36, 
                  height: 36, 
                  borderRadius: 10, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  cursor: "pointer" 
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* MAIN split workspace */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            
            {/* LEFT PANE: DESCRIPTION & SOLUTION */}
            <div style={{
              width: "45%",
              background: C.bgCard,
              borderRight: `1px solid ${C.border}`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}>
              {/* Tabs header */}
              <div style={{
                display: "flex",
                background: C.bgPanel,
                borderBottom: `1px solid ${C.border}`,
                padding: "0 16px"
              }}>
                <button 
                  onClick={() => setEditorTab("description")}
                  style={{
                    padding: "14px 16px",
                    background: "transparent",
                    border: "none",
                    borderBottom: editorTab === "description" ? `2px solid #007a55` : "2px solid transparent",
                    color: editorTab === "description" ? C.text : C.textMuted,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <BookOpen size={14} /> Problem Description
                </button>
                <button 
                  onClick={() => setEditorTab("solution")}
                  style={{
                    padding: "14px 16px",
                    background: "transparent",
                    border: "none",
                    borderBottom: editorTab === "solution" ? `2px solid #007a55` : "2px solid transparent",
                    color: editorTab === "solution" ? C.text : C.textMuted,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  {revealAnswer ? "🔓" : "🔒"} Solution / Answer
                </button>
              </div>

              {/* Scrollable Tab Content */}
              <div style={{ flex: 1, overflowY: "auto", padding: 24 }} className="custom-scroll">
                {editorTab === "description" ? (
                  <div style={{ lineHeight: 1.6, color: C.text }}>
                    <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5, color: C.textSub }}>Problem</h4>
                    <p style={{ fontSize: 15, whiteSpace: "pre-line", marginBottom: 24 }}>{selectedCoding.description}</p>
                    
                    <div style={{ padding: 16, background: C.bgPanel, borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 24 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 6 }}>CONSTRAINTS / NOTES</span>
                      <ul style={{ paddingLeft: 16, margin: 0, fontSize: 13, color: C.textSub }}>
                        <li>Do not import external libraries.</li>
                        <li>Write clean, readable variable names.</li>
                        <li>Check console logs at the bottom right for test case execution details.</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div>
                    {!revealAnswer ? (
                      <div style={{ 
                        padding: "48px 24px", 
                        textAlign: "center", 
                        background: C.bgPanel, 
                        borderRadius: 16, 
                        border: `1px dashed ${C.border}`,
                        marginTop: 24
                      }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
                        <h4 style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 8 }}>Actual Answer is Hidden</h4>
                        <p style={{ fontSize: 13, color: C.textMuted, maxWidth: 300, margin: "0 auto 20px", lineHeight: 1.5 }}>
                          Try writing and running your code first! If you get stuck, click below to reveal the complete answer and explanation.
                        </p>
                        <Btn themeC={C} onClick={() => setRevealAnswer(true)} style={{ padding: "10px 24px" }}>
                          👁 Reveal Answer
                        </Btn>
                      </div>
                    ) : (
                      <div style={{ animation: "fadeIn 0.4s ease" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: "uppercase", color: "#007a55" }}>Correct Implementation</h4>
                          <span style={{ fontSize: 11, background: "#007a5515", color: "#007a55", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>VERIFIED</span>
                        </div>
                        
                        <pre style={{ 
                          background: "#080808", 
                          color: "#a9b1d6", 
                          padding: "16px 20px", 
                          borderRadius: 12, 
                          border: "1px solid #1f2335",
                          fontFamily: "'Fira Code', monospace",
                          fontSize: 13,
                          lineHeight: 1.6,
                          overflowX: "auto",
                          marginBottom: 24
                        }}>
                          {selectedCoding.solutionCode}
                        </pre>

                        <div style={{ 
                          fontSize: 14, 
                          lineHeight: 1.6, 
                          color: C.textSub, 
                          borderTop: `1px solid ${C.border}`,
                          paddingTop: 16
                        }}>
                          <p style={{ whiteSpace: "pre-line" }}>{selectedCoding.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANE: EDITOR & CONSOLE */}
            <div style={{
              flex: 1,
              background: "#050608",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}>
              
              {/* CODE EDITOR WORKSPACE */}
              <div style={{
                flex: 1,
                display: "flex",
                position: "relative",
                overflow: "hidden",
                padding: "20px 0"
              }}>
                {/* CodeMirror Editor Integration */}
                <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ flex: 1, overflow: "auto", padding: "0 16px" }} className="custom-scroll">
                    <CodeEditor value={userCode} onChange={setUserCode} />
                  </div>
                </div>
              </div>

              {/* CONSOLE / TEST RESULTS SECTION */}
              <div style={{
                height: "35%",
                background: "#020304",
                borderTop: `1px solid ${C.border}`,
                display: "flex",
                flexDirection: "column"
              }}>
                {/* Console header */}
                <div style={{
                  height: 36,
                  padding: "0 16px",
                  background: "#08090d",
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.textSub, letterSpacing: 0.5 }}>CONSOLE OUTPUT & TEST RESULTS</span>
                  {consoleLogs.length > 0 && (
                    <button 
                      onClick={() => setConsoleLogs([])}
                      style={{ background: "transparent", border: "none", color: "#e06c75", fontSize: 11, cursor: "pointer", fontWeight: 700 }}
                    >
                      Clear Console
                    </button>
                  )}
                </div>

                {/* Console content */}
                <div style={{
                  flex: 1,
                  padding: 16,
                  overflowY: "auto",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 13,
                  lineHeight: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6
                }} className="custom-scroll">
                  {consoleLogs.length === 0 ? (
                    <div style={{ color: "#4b5263", fontSize: 12 }}>
                      No outputs. Click "Run Tests" to execute your code.
                    </div>
                  ) : (
                    consoleLogs.map((log, idx) => (
                      <div 
                        key={idx}
                        style={{
                          color: log.type === 'error' ? '#ef596f' : log.type === 'warn' ? '#d19a66' : log.text.includes('✅') ? '#89ca78' : log.text.includes('❌') ? '#ef596f' : '#abb2bf',
                          whiteSpace: "pre-wrap"
                        }}
                      >
                        {log.text}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </>) }
    </div>
  );
}


