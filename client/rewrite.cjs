const fs = require('fs');
const path = 'c:/Users/Admin/Downloads/react-interview-prep/react-interview-prep/src/topics/INTERVIEW_REACT.jsx';
const lines = fs.readFileSync(path, 'utf8').split('\n');
const keepLines = lines.slice(0, 98).join('\n');

const newComponent = `
export default function INTERVIEW_REACT() {
  const C = useContext(ThemeCtx);
  const [activeTab, setActiveTab] = useState("Machine Coding");
  const [codingQuestions, setCodingQuestions] = useState([]);
  const [scenarioQuestions, setScenarioQuestions] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedCoding, setSelectedCoding] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);

  const [userCode, setUserCode] = useState("");
  const [editorTab, setEditorTab] = useState("description");
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [previewCode, setPreviewCode] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({});
  const [formSaving, setFormSaving] = useState(false);

  const reloadQuestions = () => {
    fetch('/api/react-coding-questions')
      .then(res => res.json())
      .then(data => setCodingQuestions(data))
      .catch(err => console.error(err));

    fetch('/api/react-scenario-questions')
      .then(res => res.json())
      .then(data => setScenarioQuestions(data))
      .catch(err => console.error(err));
  };

  useEffect(() => { reloadQuestions(); }, []);

  const getEmptyForm = (tab) => {
    if (tab === "Machine Coding") return { title: "", description: "", category: "React Coding", templateCode: "", solutionCode: "", explanation: "", testHint: "", isMostAsked: false };
    return { title: "", description: "", scenarioContent: "", explanation: "", category: "React Scenario", isMostAsked: false };
  };

  const openAddModal = () => { setEditingQuestion(null); setFormData(getEmptyForm(activeTab)); setShowFormModal(true); };
  const openEditModal = (q) => { setEditingQuestion(q); setFormData({ ...q }); setShowFormModal(true); };

  const handleDeleteQuestion = async (q) => {
    if (!window.confirm(\`Delete "\${q.title}"?\`)) return;
    try {
      if (activeTab === "Machine Coding") {
        await deleteReactCodingQuestion(q.id);
        setCodingQuestions(prev => prev.filter(x => x.id !== q.id));
      } else {
        await deleteReactScenarioQuestion(q.id);
        setScenarioQuestions(prev => prev.filter(x => x.id !== q.id));
      }
    } catch (err) { alert(err.message); }
  };

  const handleSaveQuestion = async () => {
    if (!formData.title?.trim() || !formData.description?.trim()) return alert("Title and Description required.");
    setFormSaving(true);
    try {
      if (activeTab === "Machine Coding") {
        if (editingQuestion) {
          const updated = await updateReactCodingQuestion(editingQuestion.id, formData);
          setCodingQuestions(prev => prev.map(q => q.id === editingQuestion.id ? updated : q));
        } else {
          const created = await addReactCodingQuestion(formData);
          setCodingQuestions(prev => [...prev, created]);
        }
      } else {
        if (editingQuestion) {
          const updated = await updateReactScenarioQuestion(editingQuestion.id, formData);
          setScenarioQuestions(prev => prev.map(q => q.id === editingQuestion.id ? updated : q));
        } else {
          const created = await addReactScenarioQuestion(formData);
          setScenarioQuestions(prev => [...prev, created]);
        }
      }
      setShowFormModal(false); setEditingQuestion(null);
    } catch (err) { alert(err.message); } finally { setFormSaving(false); }
  };

  const currentQuestions = activeTab === "Machine Coding" ? codingQuestions : scenarioQuestions;
  const filtered = currentQuestions.filter(q => q.title.toLowerCase().includes(search.toLowerCase()) || q.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ animation: "fadeIn 0.5s ease", maxWidth: 900, margin: "0 auto", paddingBottom: 40, fontFamily: C_BASE.sans }}>
      <div style={{ display: "flex", gap: 32, marginBottom: 32, borderBottom: \`1px solid \${C.border}\` }}>
        {["Machine Coding", "Scenario Based"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "0 4px 16px 4px", background: "transparent", border: "none", borderBottom: activeTab === tab ? "2px solid #007a55" : "2px solid transparent", color: activeTab === tab ? C.text : C.textMuted, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>{tab === "Machine Coding" ? "💻 Machine Coding" : "🤔 Scenario Based"}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={18} style={{ position: "absolute", left: 16, color: C.textMuted }} />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "12px 16px 12px 48px", borderRadius: 12, border: \`1px solid \${C.border}\`, background: C.bgCard, color: C.text, fontSize: 14, outline: "none" }} />
        </div>
        <button onClick={openAddModal} style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #007a55, #00c9a7)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}><Plus size={18} /> Add Question</button>
      </div>

      <div style={{ background: C.bgCard, border: \`1px solid \${C.border}\`, borderRadius: 16, overflow: "hidden" }}>
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>No questions found.</div>}
        {filtered.map((q, i) => (
          <div key={q.id} style={{ padding: "24px", borderBottom: i === filtered.length - 1 ? "none" : \`1px solid \${C.border}\`, display: "flex", alignItems: "flex-start", gap: 20, cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = C.bgHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 60, display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => { if (activeTab === "Machine Coding") { setSelectedCoding(q); setUserCode(q.templateCode); setPreviewCode(q.templateCode); setRunKey(k => k + 1); setEditorTab("description"); setRevealAnswer(false); } else { setSelectedScenario(q); setRevealAnswer(false); } }}>
              <div style={{ background: "#007a5510", border: "1px solid #007a5544", borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 2, minWidth: 44, justifyContent: "center", marginTop: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#007a55" }}>Q</span><span style={{ fontSize: 12, fontWeight: 800, color: "#b8860b" }}>{i + 1}</span>
              </div>
            </div>
            <div style={{ flex: 1 }} onClick={() => { if (activeTab === "Machine Coding") { setSelectedCoding(q); setUserCode(q.templateCode); setPreviewCode(q.templateCode); setRunKey(k => k + 1); setEditorTab("description"); setRevealAnswer(false); } else { setSelectedScenario(q); setRevealAnswer(false); } }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>{q.title} {q.isMostAsked && <span style={{ fontSize: 11, fontWeight: 700, background: "#fef9c3", color: "#92400e", padding: "2px 8px", borderRadius: 20, border: "1px solid #fde68a" }}>⭐ Most Asked</span>}</div>
              <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 16 }}>{q.description.split("\\n")[0]}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textMuted }}><span style={{ padding: "2px 6px", background: C.bgPanel, borderRadius: 4, fontWeight: 600 }}>REACT</span> {q.category}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <button onClick={(e) => { e.stopPropagation(); openEditModal(q); }} style={{ width: 34, height: 34, borderRadius: 10, border: \`1px solid \${C.border}\`, background: "transparent", color: C.textMuted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Pencil size={14} /></button>
              <button onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(q); }} style={{ width: 34, height: 34, borderRadius: 10, border: \`1px solid \${C.border}\`, background: "transparent", color: C.textMuted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Trash2 size={14} /></button>
              <ChevronRight size={20} color={C.textMuted} style={{ marginLeft: 4 }} />
            </div>
          </div>
        ))}
      </div>

      {selectedCoding && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(6,8,12,0.96)", backdropFilter: "blur(12px)", zIndex: 1000, display: "flex", flexDirection: "column" }}>
          <div style={{ height: 64, padding: "0 24px", background: C.bgCard, borderBottom: \`1px solid \${C.border}\`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 20 }}>⚛️</span><span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{selectedCoding.title}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => { setUserCode(selectedCoding.templateCode); setPreviewCode(selectedCoding.templateCode); setRunKey(k => k + 1); }} style={{ background: "transparent", border: \`1px solid \${C.border}\`, color: C.textSub, borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🔄 Reset</button>
              <button onClick={() => { setPreviewCode(userCode); setRunKey(k => k + 1); }} style={{ background: "#007a55", color: "#fff", border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>▶ Run</button>
              <div style={{ width: 1, height: 24, background: C.border }} />
              <button onClick={() => setSelectedCoding(null)} style={{ background: C.bgHover, border: "none", color: C.text, width: 36, height: 36, borderRadius: 10, cursor: "pointer" }}><X size={18} /></button>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            <div style={{ width: "30%", background: C.bgCard, borderRight: \`1px solid \${C.border}\`, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", background: C.bgPanel, borderBottom: \`1px solid \${C.border}\`, padding: "0 16px" }}>
                <button onClick={() => setEditorTab("description")} style={{ padding: "14px 14px", background: "transparent", border: "none", borderBottom: editorTab === "description" ? "2px solid #007a55" : "2px solid transparent", color: editorTab === "description" ? C.text : C.textMuted, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Problem</button>
                <button onClick={() => setEditorTab("solution")} style={{ padding: "14px 14px", background: "transparent", border: "none", borderBottom: editorTab === "solution" ? "2px solid #007a55" : "2px solid transparent", color: editorTab === "solution" ? C.text : C.textMuted, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Solution</button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
                {editorTab === "description" ? (
                  <div style={{ color: C.text, lineHeight: 1.7 }}><p style={{ fontSize: 14, whiteSpace: "pre-line" }}>{selectedCoding.description}</p>{selectedCoding.testHint && <div style={{ marginTop: 20, padding: 14, background: C.bgPanel, borderRadius: 10, border: \`1px solid \${C.border}\`, fontSize: 13, color: C.textSub }}>💡 Hint: {selectedCoding.testHint}</div>}</div>
                ) : (
                  <div>
                    {!revealAnswer ? (
                      <div style={{ padding: "40px 16px", textAlign: "center", background: C.bgPanel, borderRadius: 14, border: \`1px dashed \${C.border}\`, marginTop: 16 }}>
                        <div style={{ fontSize: 32, marginBottom: 10 }}>🔒</div><p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>Try solving it first!</p><Btn themeC={C} onClick={() => setRevealAnswer(true)}>👁 Reveal Answer</Btn>
                      </div>
                    ) : (
                      <div>
                        <pre style={{ background: "#080808", color: "#a9b1d6", padding: "14px 16px", borderRadius: 10, border: "1px solid #1f2335", fontFamily: "'Fira Code', monospace", fontSize: 12, overflowX: "auto", marginBottom: 20, whiteSpace: "pre-wrap" }}>{selectedCoding.solutionCode}</pre>
                        <div style={{ fontSize: 13, lineHeight: 1.7, color: C.textSub, borderTop: \`1px solid \${C.border}\`, paddingTop: 14, whiteSpace: "pre-line" }}>{selectedCoding.explanation}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div style={{ flex: 1, background: "#050608", display: "flex", flexDirection: "column", borderRight: \`1px solid \${C.border}\` }}><div style={{ flex: 1, overflow: "auto", padding: "16px 12px" }}><CodeEditor value={userCode} onChange={setUserCode} /></div></div>
            <div style={{ width: "35%", background: "#fff", display: "flex", flexDirection: "column" }}><div style={{ flex: 1, overflow: "hidden" }}><ReactPreview key={runKey} code={previewCode} /></div></div>
          </div>
        </div>
      )}

      {selectedScenario && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10, 10, 15, 0.85)", backdropFilter: "blur(12px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ width: "100%", maxWidth: 800, maxHeight: "85vh", background: C.bgCard, borderRadius: 24, border: \`1px solid \${C.border}\`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "24px 32px", borderBottom: \`1px solid \${C.border}\`, display: "flex", justifyContent: "space-between", alignItems: "center" }}><h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: 0 }}>🤔 {selectedScenario.title}</h3><button onClick={() => { setSelectedScenario(null); setRevealAnswer(false); }} style={{ background: C.bgHover, border: "none", color: C.text, width: 36, height: 36, borderRadius: 10, cursor: "pointer" }}><X size={18} /></button></div>
            <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
              <h4 style={{ fontSize: 13, textTransform: "uppercase", color: C.textMuted, marginBottom: 12 }}>Scenario</h4>
              <div style={{ fontSize: 16, color: C.text, lineHeight: 1.6, marginBottom: 32, whiteSpace: "pre-line" }}>{selectedScenario.scenarioContent}</div>
              <h4 style={{ fontSize: 13, textTransform: "uppercase", color: C.textMuted, marginBottom: 12 }}>Question</h4>
              <div style={{ fontSize: 16, color: C.text, lineHeight: 1.6, marginBottom: 32, whiteSpace: "pre-line" }}>{selectedScenario.description}</div>
              {!revealAnswer ? (
                 <div style={{ textAlign: "center", padding: "32px", background: C.bgPanel, borderRadius: 16, border: \`1px dashed \${C.border}\` }}><Btn themeC={C} onClick={() => setRevealAnswer(true)}>👁 Show Answer</Btn></div>
              ) : (
                <div><h4 style={{ fontSize: 13, textTransform: "uppercase", color: "#00c9a7", marginBottom: 12 }}>Answer</h4><div style={{ fontSize: 15, color: C.text, lineHeight: 1.7, whiteSpace: "pre-line", background: "#007a5510", padding: 24, borderRadius: 16, border: "1px solid #007a5533" }}>{selectedScenario.explanation}</div></div>
              )}
            </div>
          </div>
        </div>
      )}

      {showFormModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10, 10, 15, 0.85)", backdropFilter: "blur(12px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ width: "100%", maxWidth: 720, maxHeight: "85vh", background: C.bgCard, borderRadius: 24, border: \`1px solid \${C.border}\`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "20px 28px", borderBottom: \`1px solid \${C.border}\`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #007a55, #00c9a7)", display: "flex", alignItems: "center", justifyContent: "center" }}>{editingQuestion ? <Pencil size={18} color="#fff" /> : <Plus size={18} color="#fff" />}</div><div><h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>{editingQuestion ? "Edit Question" : "Add Question"}</h3></div></div>
              <button onClick={() => setShowFormModal(false)} style={{ background: C.bgHover, border: "none", color: C.text, width: 36, height: 36, borderRadius: 10, cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div><label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Title *</label><input value={formData.title || ""} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: \`1px solid \${C.border}\`, background: C.bgPanel, color: C.text, outline: "none" }} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Question Description *</label><textarea value={formData.description || ""} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: \`1px solid \${C.border}\`, background: C.bgPanel, color: C.text, outline: "none" }} /></div>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}><label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Category</label><input value={formData.category || ""} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: \`1px solid \${C.border}\`, background: C.bgPanel, color: C.text, outline: "none" }} /></div>
                <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 4 }}><label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: C.text }}><input type="checkbox" checked={formData.isMostAsked || false} onChange={e => setFormData(p => ({ ...p, isMostAsked: e.target.checked }))} /> ⭐ Most Asked</label></div>
              </div>
              {activeTab === "Machine Coding" && (
                <>
                  <div><label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Template Code</label><textarea value={formData.templateCode || ""} onChange={e => setFormData(p => ({ ...p, templateCode: e.target.value }))} rows={4} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: \`1px solid \${C.border}\`, background: "#0d0d0d", color: "#a9b1d6", fontFamily: "monospace", outline: "none" }} /></div>
                  <div><label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Solution Code</label><textarea value={formData.solutionCode || ""} onChange={e => setFormData(p => ({ ...p, solutionCode: e.target.value }))} rows={4} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: \`1px solid \${C.border}\`, background: "#0d0d0d", color: "#89ca78", fontFamily: "monospace", outline: "none" }} /></div>
                </>
              )}
              {activeTab === "Scenario Based" && (
                <div><label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Scenario</label><textarea value={formData.scenarioContent || ""} onChange={e => setFormData(p => ({ ...p, scenarioContent: e.target.value }))} rows={4} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: \`1px solid \${C.border}\`, background: C.bgPanel, color: C.text, outline: "none" }} /></div>
              )}
              <div><label style={{ fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Explanation / Answer</label><textarea value={formData.explanation || ""} onChange={e => setFormData(p => ({ ...p, explanation: e.target.value }))} rows={3} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: \`1px solid \${C.border}\`, background: C.bgPanel, color: C.text, outline: "none" }} /></div>
            </div>
            <div style={{ padding: "16px 28px", borderTop: \`1px solid \${C.border}\`, display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button onClick={() => setShowFormModal(false)} style={{ padding: "10px 24px", borderRadius: 12, border: \`1px solid \${C.border}\`, background: "transparent", color: C.text, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSaveQuestion} disabled={formSaving} style={{ padding: "10px 28px", borderRadius: 12, border: "none", background: formSaving ? "#555" : "#007a55", color: "#fff", cursor: formSaving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}><Save size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(path, keepLines + '\n' + newComponent);
console.log('Successfully updated INTERVIEW_REACT.jsx');
