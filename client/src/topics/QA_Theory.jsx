import { useState, useEffect, useCallback, useContext, useMemo, useRef } from "react";
import { Block, Btn, Row, ThemeCtx, Spacer } from "../shared";
import { C_BASE } from "../constants";
import { fetchQA, addQA, updateQA, deleteQA, uploadImage } from "../api";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "../quill-diamond.css";


export default function QA_Theory() {
  const C = useContext(ThemeCtx);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // view state
  const [mainTab, setMainTab] = useState("learn"); // 'learn' or 'manage'
  const [selectedId, setSelectedId] = useState(null); // specific question ID
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null); // local draft for editing
  
  // form state
  const [newItem, setNewItem] = useState({ q: "", a: "", category: "React", subCategory: "All", imageUrl: "", importance: "normal" });
  const [uploading, setUploading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isEditFullScreen, setIsEditFullScreen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const lastScrollPos = useRef(0);
  const quillRef = useRef(null);
  const quillEditRef = useRef(null);

  const quillEditImageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        setUploading(true);
        try {
          const url = await uploadImage(file);
          const quill = quillEditRef.current.getEditor();
          const range = quill.getSelection(true) || { index: quill.getLength() };
          quill.insertEmbed(range.index, 'image', url);
          quill.setSelection(range.index + 1);
        } catch (err) {
          console.error("Upload failed", err);
          alert("Failed to upload image. Make sure the backend is running.");
        }
        setUploading(false);
      }
    };
  }, []);

  const quillImageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        setUploading(true);
        try {
          const url = await uploadImage(file);
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true) || { index: quill.getLength() };
          quill.insertEmbed(range.index, 'image', url);
          quill.setSelection(range.index + 1);
        } catch (err) {
          console.error("Upload failed", err);
          alert("Failed to upload inline image.");
        }
        setUploading(false);
      }
    };
  }, []);

  const diamondBulletHandler = useCallback(() => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection(true) || { index: quill.getLength() };
    quill.insertText(range.index, '❖ ');
    quill.setSelection(range.index + 2);
  }, []);

  const diamondBulletEditHandler = useCallback(() => {
    const quill = quillEditRef.current.getEditor();
    const range = quill.getSelection(true) || { index: quill.getLength() };
    quill.insertText(range.index, '❖ ');
    quill.setSelection(range.index + 2);
  }, []);

  // Emoji definitions
  const EMOJIS = [
    { emoji: '✅', label: 'Correct' },
    { emoji: '❌', label: 'Wrong' },
    { emoji: '🚀', label: 'Launch' },
    { emoji: '⚠️', label: 'Warning' },
    { emoji: '💡', label: 'Tip' },
    { emoji: '🔥', label: 'Popular' },
    { emoji: '⭐', label: 'Important' },
    { emoji: '📌', label: 'Key Point' },
    { emoji: '🎯', label: 'Goal' },
    { emoji: '🛠️', label: 'Tool' },
    { emoji: '📈', label: 'Growth' },
    { emoji: '🔒', label: 'Secure' },
    { emoji: '⏳', label: 'Processing' },
  ];

  const insertEmoji = useCallback((emoji, ref) => {
    if (!ref.current) return;
    const quill = ref.current.getEditor();
    const range = quill.getSelection(true) || { index: quill.getLength() };
    quill.insertText(range.index, emoji + ' ');
    quill.setSelection(range.index + emoji.length + 1);
  }, []);

  const TEXT_COLORS = [
    '#000000', '#ffffff', '#e03131', '#e8590c', '#f59f00',
    '#2f9e44', '#1971c2', '#7048e8', '#c2255c',
    '#868e96', '#495057', '#007a55'
  ];
  const BG_COLORS = [
    'transparent', '#fff9db', '#fff3bf', '#d3f9d8',
    '#d0ebff', '#e5dbff', '#ffdeeb', '#ffe8cc',
    '#f8f9fa', '#343a40', '#1a1a2e'
  ];

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': TEXT_COLORS }, { 'background': BG_COLORS }],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['code-block', 'image'],
        [{ 'diamond': '❖' }],
        ['clean']
      ],
      handlers: { image: quillImageHandler, diamond: diamondBulletHandler }
    }
  }), [quillImageHandler, diamondBulletHandler]);

  const modulesEdit = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': TEXT_COLORS }, { 'background': BG_COLORS }],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['code-block', 'image'],
        [{ 'diamond': '❖' }],
        ['clean']
      ],
      handlers: { image: quillEditImageHandler, diamond: diamondBulletEditHandler }
    }
  }), [quillEditImageHandler, diamondBulletEditHandler]);

  // filter state
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeImportance, setActiveImportance] = useState("All");
  const [search, setSearch] = useState("");
  const [displayLimit, setDisplayLimit] = useState(20);
  const observer = useRef();

  const categories = ["All", "React", "JS", "HTML", "CSS", "Node.js", "System Design"];

  const JS_SUB_CATEGORIES = [
    "All", "Fundamentals", "Functions", "Object Prototypes", "Array and Array Method", 
    "Asynchronous JavaScript", "Es6 Features", "Advance Concept", "Dom and Browser API", 
    "Error Handling and Debugging", "Security and Best Practice", "Design Patterns", 
    "Performances Optimizatons", "Functional Programming", "Tooling and EcoSystem", 
    "TypeScript", "Testing", "ES2020", "Interview Specific Topic", "Pollyfills to Implements",
    "Event Loop", "Memory Management", "Browser Rendering", "Execution Context", 
    "Microtask vs Macrotask", "Module System", "Highest Priority", "Important Concept"
  ];

  const REACT_SUB_CATEGORIES = [
    "All", "React Life Cycle Methods", "React Fundamentals", "React Hooks", "Components",
    "State Management", "Rendering & Virtual DOM", "Performance Optimization",
    "Advanced State Management", "Routing & Navigation", "Data Fetching & API",
    "Forms & Validation", "Authentication & Authorization", "Testing"
  ];

  const [activeSubCategory, setActiveSubCategory] = useState("All");

  // Fetch from MongoDB via Express API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const serverData = await fetchQA();
      setItems(serverData);
    } catch (error) {
      console.error("Error fetching QA:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpload = async (e, updateFn) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      updateFn(url);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image. Make sure the backend is running.");
    }
    setUploading(false);
  };

  const add = async () => {
    if (!newItem.q || !newItem.a) return;
    try {
      const data = await addQA(newItem);
      setItems(prev => [...prev, data]);
    } catch (error) {
      console.error("Error adding QA:", error);
    }
    setNewItem({ q: "", a: "", category: "React", subCategory: "All", imageUrl: "", importance: "normal" });
    setMainTab("learn");
  };

  const del = async (id) => {
    if (!confirm("Delete this Q&A?")) return;
    try {
      await deleteQA(id);
      setItems(prev => prev.filter(i => (i.id || i._id) !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (error) {
      console.error("Error deleting QA:", error);
    }
  };

  const saveEdit = async () => {
    if (!editDraft) return;
    const id = editDraft._id || editDraft.id;
    try {
      const data = await updateQA(id, {
        q: editDraft.q,
        a: editDraft.a,
        category: editDraft.category,
        subCategory: editDraft.subCategory,
        imageUrl: editDraft.imageUrl,
        importance: editDraft.importance,
      });
      setItems(prev => prev.map(i => (i._id || i.id) === id ? { ...i, ...data } : i));
      setEditingId(null);
      setEditDraft(null);
      setMainTab("learn");
      setSelectedId(id);
    } catch (error) {
      console.error("Error saving edit:", error.message, error);
      alert("Failed to save: " + error.message);
    }
  };

  const lastElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setDisplayLimit(prev => prev + 20);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    setDisplayLimit(20);
  }, [search, activeCategory, activeSubCategory, activeImportance]);

  const filtered = useMemo(() => {
    return items.filter(i => {
      const matchCat = activeCategory === "All" || i.category === activeCategory;
      const matchSubCat = (activeCategory !== "JS" && activeCategory !== "React") || activeSubCategory === "All" || i.subCategory === activeSubCategory;
      const matchImportance = activeImportance === "All" || (i.importance || "normal") === activeImportance;
      const matchSearch = i.q.toLowerCase().includes(search.toLowerCase()) || i.a.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSubCat && matchImportance && matchSearch;
    });
  }, [items, activeCategory, activeSubCategory, activeImportance, search]);

  const selectedItem = useMemo(() => items.find(i => (i.id || i._id) === selectedId), [items, selectedId]);
  const selectedIndex = useMemo(() => filtered.findIndex(i => (i.id || i._id) === selectedId), [filtered, selectedId]);

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      <style>{`
        .qa-question-btn {
          flex: 1;
          padding-left: 16px;
          color: ${C.type === "light" ? "#4f46e5" : "#818cf8"};
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .qa-question-btn:hover {
          color: ${C.type === "light" ? "#6366f1" : "#a5b4fc"};
          transform: translateX(4px);
        }
        .qa-question-btn.important {
          color: ${C.type === "light" ? "#dc2626" : "#f87171"};
          font-weight: 600;
        }
        .qa-question-btn.important:hover {
          color: ${C.type === "light" ? "#ef4444" : "#fca5a5"};
        }

        /* Sticky Quill Toolbar and Theme Adaptiveness */
        .ql-toolbar.ql-snow {
          position: sticky;
          top: 0;
          z-index: 10;
          background: ${C.bgCard};
          border: none;
          border-bottom: 1px solid ${C.border};
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .ql-container.ql-snow {
          border: none;
          background: ${C.bgCard};
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          transition: background-color 0.2s ease;
          overflow-x: hidden !important;
        }
        .ql-editor {
          overflow-x: hidden !important;
          word-break: break-word !important;
        }
        .ql-editor img {
          max-width: 100% !important;
          max-height: 450px !important;
          width: auto !important;
          height: auto !important;
          object-fit: contain;
        }
        .ql-snow.ql-toolbar .ql-stroke {
          stroke: ${C.text};
          transition: stroke 0.2s ease;
        }
        .ql-snow.ql-toolbar .ql-fill {
          fill: ${C.text};
          transition: fill 0.2s ease;
        }
        .ql-snow.ql-toolbar .ql-picker {
          color: ${C.text};
          transition: color 0.2s ease;
        }
        .ql-snow.ql-toolbar button:hover .ql-stroke,
        .ql-snow.ql-toolbar button.ql-active .ql-stroke,
        .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
        .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke {
          stroke: #007a55 !important;
        }
        .ql-snow.ql-toolbar button:hover .ql-fill,
        .ql-snow.ql-toolbar button.ql-active .ql-fill,
        .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
        .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill {
          fill: #007a55 !important;
        }
        .ql-snow.ql-toolbar .ql-picker-label:hover,
        .ql-snow.ql-toolbar .ql-picker-label.ql-active,
        .ql-snow.ql-toolbar .ql-picker-item:hover,
        .ql-snow.ql-toolbar .ql-picker-item.ql-selected {
          color: #007a55 !important;
        }
        .ql-snow .ql-picker-options {
          background-color: ${C.bgCard} !important;
          border: 1px solid ${C.border} !important;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        /* Color picker swatches */
        .ql-snow .ql-color-picker .ql-picker-options {
          padding: 6px;
          width: 184px;
        }
        .ql-snow .ql-color-picker .ql-picker-item {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          margin: 2px;
          border: 1px solid ${C.border};
        }
        .ql-snow .ql-color-picker .ql-picker-item:hover {
          border-color: #007a55;
          transform: scale(1.15);
          transition: transform 0.15s;
        }
        /* Emoji bar */
        .emoji-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding: 6px 10px;
          background: ${C.bgCard};
          border-bottom: 1px solid ${C.border};
        }
        .emoji-btn {
          background: ${C.bgPanel};
          border: 1px solid ${C.border};
          border-radius: 6px;
          padding: 3px 7px;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.15s ease;
          line-height: 1.4;
          position: relative;
        }
        .emoji-btn:hover {
          background: #007a5515;
          border-color: #007a55;
          transform: translateY(-1px) scale(1.12);
          box-shadow: 0 3px 8px rgba(0,122,85,0.18);
        }
        .emoji-btn:active {
          transform: translateY(0) scale(0.97);
        }
      `}</style>
      {/* MAIN TABS */}
      {!selectedId && !editingId && (
        <div style={{ display: "flex", gap: 16, marginBottom: 32, maxWidth: 400 }}>
          {["learn", "manage"].map(t => {
            const isActive = mainTab === t;
            return (
              <button key={t} onClick={() => { setMainTab(t); setSelectedId(null); setEditingId(null); }} style={{ 
                flex: 1, padding: "10px 24px", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer",
                background: isActive ? "#008858" : "transparent",
                color: isActive ? "#ffffff" : "#008858",
                border: `1.5px solid #008858`,
                transition: "all 0.2s"
              }}>
                {t === 'learn' ? "Learn Theory" : "Manage Bank"}
              </button>
            )
          })}
        </div>
      )}

      {mainTab === "manage" && !editingId ? (
        <div style={{ maxWidth: 800, margin: "0 auto", animation: "fadeIn 0.4s ease-out" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, color: C.text }}>Add New Question</h2>
          <div style={{ display: "grid", gap: 24 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, letterSpacing: 0.5 }}>QUESTION TITLE</label>
              <input 
                placeholder="What is your interview question?" 
                value={newItem.q} 
                onChange={e => setNewItem({...newItem, q: e.target.value})}
                style={{ width: "100%", background: C.bgCard, border: "none", borderBottom: `2px solid ${C.border}`, padding: "16px 0", color: C.text, fontSize: 18, fontWeight: 600, outline: "none", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderBottom = `2px solid #007a55`}
                onBlur={e => e.target.style.borderBottom = `2px solid ${C.border}`}
              />
            </div>
                <div style={isFullScreen ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: C.bgCard, display: 'flex', flexDirection: 'column', padding: 40 } : {}}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ fontSize: isFullScreen ? 16 : 12, fontWeight: 700, color: C.textMuted, letterSpacing: 0.5 }}>COMPREHENSIVE ANSWER</label>
                    <button 
                      onClick={() => setIsFullScreen(!isFullScreen)} 
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#007a55", display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}
                    >
                      {isFullScreen ? "↙️ Exit Fullscreen" : "⤢ Fullscreen Editor"}
                    </button>
                  </div>
                  <div style={{ flex: isFullScreen ? 1 : 'none', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "visible", display: 'flex', flexDirection: 'column' }}>
                    <ReactQuill 
                      ref={quillRef}
                      theme="snow"
                      value={newItem.a} 
                      onChange={val => setNewItem({...newItem, a: val})} 
                      modules={modules}
                      style={{ flex: 1, display: 'flex', flexDirection: 'column', height: isFullScreen ? 'auto' : "300px", color: C.text }}
                    />
                    {/* Emoji Quick-Insert Bar */}
                    <div className="emoji-toolbar">
                      {EMOJIS.map(({ emoji, label }) => (
                        <button
                          key={emoji}
                          title={label}
                          className="emoji-btn"
                          onMouseDown={e => { e.preventDefault(); insertEmoji(emoji, quillRef); }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
            
            {/* IMAGE UPLOAD */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: C.bgPanel, padding: "10px 16px", borderRadius: 8, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 16 }}>📸</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.textSub }}>Attach Image</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => handleUpload(e, url => setNewItem({...newItem, imageUrl: url}))}
                  style={{ display: "none" }}
                />
              </label>
              {uploading && <span style={{ color: "#007a55", fontSize: 13, fontWeight: 700 }}>⏳ Uploading...</span>}
            </div>
            
            {newItem.imageUrl && (
              <div>
                <img src={newItem.imageUrl} alt="Preview" style={{ height: 120, borderRadius: 8, objectFit: "cover" }} />
                <div style={{ color: "#007a55", fontSize: 11, marginTop: 4, fontWeight: 600 }}>✅ Image uploaded</div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <select 
                  value={newItem.category} 
                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                  style={{ background: C.bgPanel, border: "none", color: C.text, borderRadius: 8, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", outline: "none" }}
                >
                  {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {(newItem.category === "JS" || newItem.category === "React") && (
                  <select 
                    value={newItem.subCategory || "All"} 
                    onChange={e => setNewItem({...newItem, subCategory: e.target.value})}
                    style={{ background: C.bgPanel, color: "#007a55", borderRadius: 8, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", outline: "none", border: "1px solid #007a5530" }}
                  >
                    {(newItem.category === "JS" ? JS_SUB_CATEGORIES : REACT_SUB_CATEGORIES).map(sc => <option key={sc} value={sc}>{sc}</option>)}
                  </select>
                )}

                <select 
                  value={newItem.importance || "normal"} 
                  onChange={e => setNewItem({...newItem, importance: e.target.value})}
                  style={{ background: C.bgPanel, border: "none", color: C.text, borderRadius: 8, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", outline: "none" }}
                >
                  <option value="normal">🟢 Normal</option>
                  <option value="important">🔴 Important</option>
                </select>
              </div>
              
              <button 
                onClick={add} 
                disabled={uploading}
                style={{ background: "#007a55", color: "white", border: "none", borderRadius: 8, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s", opacity: uploading ? 0.7 : 1 }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : mainTab === "learn" && selectedId && selectedItem ? (
        // ── DETAIL VIEW (Reading a specific question) ──
        <div style={{ animation: "fadeIn 0.3s ease", padding: "0 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <button onClick={() => {
              setSelectedId(null);
              setTimeout(() => {
                const main = document.querySelector('main');
                if (main) main.scrollTo({ top: lastScrollPos.current, behavior: 'instant' });
              }, 0);
            }} style={{ 
              background: "none", border: "none", color: "#0066cc", fontSize: 14, 
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0
            }}>
              ← Back to questions list
            </button>
            <div style={{ display: "flex", gap: 16 }}>
              <button onClick={() => { setEditDraft({...selectedItem}); setMainTab("manage"); setEditingId(selectedItem.id || selectedItem._id); }} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.6, fontSize: 16 }}>✏️</button>
              <button onClick={() => del(selectedItem.id || selectedItem._id)} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.6, fontSize: 16 }}>🗑️</button>
            </div>
          </div>
          
          <div>
            <style>{`#main-header { display: none !important; }`}</style>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24, color: C.text, lineHeight: 1.4 }}>
              {selectedIndex + 1}. {selectedItem.q}
            </h2>
            
            <style>{`
              .qa-answer p { margin: 0; min-height: 1.8em; }
              .qa-answer p:empty { height: 1.8em; }
              .qa-answer ol, .qa-answer ul { padding-left: 1.5em; margin: 8px 0; }
              .qa-answer li { margin: 4px 0; }
              .qa-answer strong { font-weight: 700; }
              .qa-answer pre { background: #1e1e1e; color: #d4d4d4; padding: 12px 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; margin: 8px 0; }
              .qa-answer img {
                max-width: 100% !important;
                max-height: 450px !important;
                width: auto !important;
                height: auto !important;
                border-radius: 8px;
                object-fit: contain;
                display: block;
                margin: 16px 0;
              }
            `}</style>
            <div 
              className="qa-answer"
              style={{ fontSize: 16, lineHeight: 1.8, color: C.text }}
              dangerouslySetInnerHTML={{ __html: selectedItem.a }}
            />

            {selectedItem.imageUrl && (
              <div style={{ marginTop: 32 }}>
                <img src={selectedItem.imageUrl} alt="Diagram" style={{ maxWidth: "100%", maxHeight: 450, width: "auto", height: "auto", objectFit: "contain", borderRadius: 8, display: "block" }} />
              </div>
            )}
          </div>
        </div>
      ) : mainTab === "learn" && !selectedId ? (
        // ── LIST VIEW (List of question links) ──
        <>
          {/* SEARCH & FILTERS */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ position: "relative", marginBottom: 20 }}>
              <input 
                placeholder="Quick search questions..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", background: C.bgSidebar, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 20px 14px 48px", color: C.text, fontSize: 14, boxShadow: C.shadow, outline: "none" }}
              />
              <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 18, opacity: 0.5 }}>🔍</span>
            </div>

            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }} className="no-scrollbar">
              {categories.map(c => (
                <button key={c} onClick={() => { setActiveCategory(c); setActiveSubCategory("All"); }} style={{ 
                  whiteSpace: "nowrap", padding: "8px 16px", borderRadius: 10, border: `1px solid ${activeCategory === c ? C_BASE.purple : C.border}`,
                  background: activeCategory === c ? C_BASE.purple + "15" : C.bgPanel,
                  color: activeCategory === c ? C_BASE.purple : C.textSub,
                  fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                }}>
                  {c}
                </button>
              ))}
            </div>
<div style={{ marginTop: 8 }}>
  <select
    value={activeImportance}
    onChange={e => setActiveImportance(e.target.value)}
    style={{
      background: C.bgPanel,
      border: 'none',
      color: C.text,
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      outline: 'none',
    }}
  >
    <option value="All">All</option>
    <option value="normal">🟢 Normal</option>
    <option value="important">🔴 Important</option>
  </select>
</div>

            {(activeCategory === "JS" || activeCategory === "React") && (
              <div style={{ 
                marginTop: 24, 
                padding: isExplorerOpen ? 24 : "12px 24px", 
                background: C.bgPanel, 
                borderRadius: 24, 
                border: `1px solid ${C.border}`,
                animation: "fadeIn 0.4s ease-out",
                transition: "all 0.3s ease"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isExplorerOpen ? 20 : 0 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: C.text, letterSpacing: 0.5, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#007a55" }}></span>
                    {activeCategory} Topic Explorer
                    {!isExplorerOpen && activeSubCategory !== "All" && (
                      <span style={{ fontSize: 12, color: "#007a55", textTransform: "none", fontWeight: 600 }}>• {activeSubCategory}</span>
                    )}
                  </h3>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <button onClick={() => setIsExplorerOpen(!isExplorerOpen)} style={{ 
                      padding: "6px 12px", borderRadius: 8, border: `1px solid ${C.border}`,
                      background: C.bgCard, color: C.textSub, fontSize: 11, fontWeight: 700, cursor: "pointer"
                    }}>
                      {isExplorerOpen ? "Collapse Grid ↑" : "Expand Grid ↓"}
                    </button>
                    <button onClick={() => { setActiveSubCategory("All"); setIsExplorerOpen(true); }} style={{ 
                      padding: "6px 12px", borderRadius: 8, border: "none",
                      background: activeSubCategory === "All" ? "#007a55" : "transparent",
                      color: activeSubCategory === "All" ? "#fff" : "#007a55",
                      fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                    }}>
                      Reset Filter
                    </button>
                  </div>
                </div>

                {isExplorerOpen && (
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", 
                    gap: 12,
                    animation: "slideDown 0.3s ease-out"
                  }}>
                    {(activeCategory === "JS" ? JS_SUB_CATEGORIES : REACT_SUB_CATEGORIES).map(sc => {
                      const icons = {
                        "All": "🌈", "Fundamentals": "🧊", "Functions": "⚙️", "Object Prototypes": "🧬", 
                        "Array and Array Method": "🔢", "Asynchronous JavaScript": "⏳", "Es6 Features": "🌟", 
                        "Advance Concept": "🚀", "Dom and Browser API": "🌐", "Error Handling and Debugging": "🐞", 
                        "Security and Best Practice": "🛡️", "Design Patterns": "📐", "Performances Optimizatons": "⚡", 
                        "Functional Programming": "λ", "Tooling and EcoSystem": "🛠️", "TypeScript": "🟦", 
                        "Testing": "🧪", "ES2020": "📅", "Interview Specific Topic": "🎯", "Pollyfills to Implements": "🔧",
                        "Event Loop": "🔄", "Memory Management": "🧠", "Browser Rendering": "🎨", 
                        "Execution Context": "🏗️", "Microtask vs Macrotask": "⏱️", "Module System": "📦", "Highest Priority": "🔥", "Important Concept": "💎",
                        "React Life Cycle Methods": "🔄", "React Fundamentals": "⚛️", "React Hooks": "🪝", "Components": "🧩",
                        "State Management": "📦", "Rendering & Virtual DOM": "🌐", "Performance Optimization": "⚡",
                        "Advanced State Management": "🏪", "Routing & Navigation": "🛣️", "Data Fetching & API": "📡",
                        "Forms & Validation": "📝", "Authentication & Authorization": "🔐"
                      };
                      const isActive = activeSubCategory === sc;
                      return (
                        <button 
                          key={sc} 
                          onClick={() => { setActiveSubCategory(sc); setIsExplorerOpen(false); }} 
                          style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 10,
                            padding: "12px 14px", 
                            borderRadius: 12, 
                            border: `1.5px solid ${isActive ? "#007a55" : C.border}`,
                            background: isActive ? "#007a5510" : C.bgCard,
                            color: isActive ? "#007a55" : C.text,
                            fontSize: 12, 
                            fontWeight: isActive ? 700 : 600, 
                            cursor: "pointer", 
                            transition: "all 0.2s",
                            textAlign: "left",
                            boxShadow: isActive ? "0 4px 12px rgba(0,122,85,0.1)" : "none"
                          }}
                          onMouseEnter={e => !isActive && (e.currentTarget.style.borderColor = "#007a5580")}
                          onMouseLeave={e => !isActive && (e.currentTarget.style.borderColor = C.border)}
                        >
                          <span style={{ fontSize: 16 }}>{icons[sc] || "📄"}</span>
                          <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sc}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 60, height: 24, background: C.border, borderRadius: 4, marginRight: 16, animation: "pulse 1.5s infinite ease-in-out", animationDelay: `${n * 0.1}s` }}></div>
                  <div style={{ flex: 1, height: 24, background: C.border, borderRadius: 4, animation: "pulse 1.5s infinite ease-in-out", animationDelay: `${n * 0.1}s` }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, display: "flex", flexDirection: "column" }}>
              {filtered.slice(0, displayLimit).map((item, index) => (
                <div 
                  key={item.id || item._id} 
                  ref={index === filtered.slice(0, displayLimit).length - 1 ? lastElementRef : null}
                  style={{ 
                    display: "flex", alignItems: "center", 
                    borderBottom: index < filtered.length - 1 ? `1px solid ${C.border}` : "none",
                    padding: "12px 0", cursor: "pointer",
                    position: "relative"
                  }}
                >

                  <div style={{ width: 80, display: "flex", justifyContent: "center", alignItems: "center", borderRight: `1px solid ${C.border}`, paddingRight: 12 }}>
                    <div style={{ 
                      background: "#007a5510", 
                      border: "1px solid #007a5544", 
                      borderRadius: 20, 
                      padding: "4px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      minWidth: 48,
                      justifyContent: "center"
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#007a55" }}>Q</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#b8860b" }}>{index + 1}</span>
                    </div>
                  </div>
                  <div 
                    onClick={() => {
                      const main = document.querySelector('main');
                      if (main) lastScrollPos.current = main.scrollTop;
                      setSelectedId(item.id || item._id);
                    }}
                    className={`qa-question-btn ${item.importance === "important" ? "important" : ""}`}
                  >
                    {item.q}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filtered.length > displayLimit && (
            <div style={{ textAlign: "center", padding: "20px", color: C.textMuted, fontSize: 12 }}>
              🌀 Loading more theory...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px", background: C.bgCard, borderRadius: 24, border: `1px dashed ${C.border}` }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.text }}>No questions in {activeCategory}</h3>
              <p style={{ color: C.textMuted, marginTop: 8 }}>Start building your cloud-synced theory bank!</p>
              <Btn variant="purple" onClick={() => setMainTab("manage")} style={{ marginTop: 24 }}>Add a Question</Btn>
            </div>
          )}
        </>
      ) : null}

      {/* EDIT EXISTING ITEM */}
      {editingId && mainTab === "manage" && editDraft && (
        <div style={{ maxWidth: 800, margin: "0 auto", animation: "fadeIn 0.4s ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <button onClick={() => { setEditingId(null); setEditDraft(null); setMainTab("learn"); setSelectedId(editingId); }} style={{ background: "none", border: "none", color: "#0066cc", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0 }}>
              ← Back to question
            </button>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text }}>Edit Question</h2>
          </div>
          <div style={{ display: "grid", gap: 24 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, letterSpacing: 0.5 }}>QUESTION TITLE</label>
              <input
                value={editDraft.q}
                onChange={e => setEditDraft(p => ({ ...p, q: e.target.value }))}
                style={{ width: "100%", background: C.bgCard, border: "none", borderBottom: `2px solid ${C.border}`, padding: "16px 0", color: C.text, fontSize: 18, fontWeight: 600, outline: "none", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderBottom = `2px solid #007a55`}
                onBlur={e => e.target.style.borderBottom = `2px solid ${C.border}`}
              />
            </div>
            <div style={isEditFullScreen ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: C.bgCard, display: 'flex', flexDirection: 'column', padding: 40 } : {}}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: isEditFullScreen ? 16 : 12, fontWeight: 700, color: C.textMuted, letterSpacing: 0.5 }}>COMPREHENSIVE ANSWER</label>
                <button onClick={() => setIsEditFullScreen(!isEditFullScreen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#007a55", display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
                  {isEditFullScreen ? "↙️ Exit Fullscreen" : "⤢ Fullscreen Editor"}
                </button>
              </div>
              <div style={{ flex: isEditFullScreen ? 1 : 'none', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "visible", display: 'flex', flexDirection: 'column' }}>
                <ReactQuill
                  ref={quillEditRef}
                  theme="snow"
                  value={editDraft.a}
                  onChange={val => setEditDraft(p => ({ ...p, a: val }))}
                  modules={modulesEdit}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', height: isEditFullScreen ? 'auto' : "300px", color: C.text }}
                />
                {/* Emoji Quick-Insert Bar */}
                <div className="emoji-toolbar">
                  {EMOJIS.map(({ emoji, label }) => (
                    <button
                      key={emoji}
                      title={label}
                      className="emoji-btn"
                      onMouseDown={e => { e.preventDefault(); insertEmoji(emoji, quillEditRef); }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: C.bgPanel, padding: "10px 16px", borderRadius: 8, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 16 }}>📸</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.textSub }}>Replace Image</span>
                <input type="file" accept="image/*" onChange={e => handleUpload(e, url => setEditDraft(p => ({ ...p, imageUrl: url })))} style={{ display: "none" }} />
              </label>
              {uploading && <span style={{ color: "#007a55", fontSize: 13, fontWeight: 700 }}>⏳ Uploading...</span>}
            </div>

            {editDraft.imageUrl && (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <img src={editDraft.imageUrl} alt="Current" style={{ height: 120, borderRadius: 8, objectFit: "cover" }} />
                <button onClick={() => setEditDraft(p => ({ ...p, imageUrl: "" }))} style={{ padding: "8px 16px", borderRadius: 8, background: "#ffecec", color: "#cc0000", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Remove</button>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <select value={editDraft.category} onChange={e => setEditDraft(p => ({ ...p, category: e.target.value }))} style={{ background: C.bgPanel, border: "none", color: C.text, borderRadius: 8, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", outline: "none" }}>
                  {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {(editDraft.category === "JS" || editDraft.category === "React") && (
                  <select value={editDraft.subCategory || "All"} onChange={e => setEditDraft(p => ({ ...p, subCategory: e.target.value }))} style={{ background: C.bgPanel, color: "#007a55", borderRadius: 8, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", outline: "none", border: "1px solid #007a5530" }}>
                    {(editDraft.category === "JS" ? JS_SUB_CATEGORIES : REACT_SUB_CATEGORIES).map(sc => <option key={sc} value={sc}>{sc}</option>)}
                  </select>
                )}
                <select value={editDraft.importance || "normal"} onChange={e => setEditDraft(p => ({ ...p, importance: e.target.value }))} style={{ background: C.bgPanel, border: "none", color: C.text, borderRadius: 8, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", outline: "none" }}>
                  <option value="normal">🟢 Normal</option>
                  <option value="important">🔴 Important</option>
                </select>
              </div>
              <button onClick={saveEdit} disabled={uploading} style={{ background: "#007a55", color: "white", border: "none", borderRadius: 8, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: uploading ? 0.7 : 1 }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
