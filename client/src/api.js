// API client — talks to the Express/MongoDB backend
const BASE = (import.meta.env.VITE_API_URL || '') + '/api';

export async function fetchProgress() {
  try {
    const res = await fetch(`${BASE}/progress`);
    if (!res.ok) throw new Error('Failed to fetch progress');
    return await res.json(); // { REACT: [...], JS: [...] }
  } catch (err) {
    console.warn('[API] fetchProgress failed, using empty state:', err.message);
    return { REACT: [], JS: [] };
  }
}

export async function toggleProgress(module, topicId) {
  try {
    const res = await fetch(`${BASE}/progress/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module, topicId }),
    });
    if (!res.ok) throw new Error('Failed to toggle progress');
    return await res.json(); // updated { REACT: [...], JS: [...] }
  } catch (err) {
    console.warn('[API] toggleProgress failed:', err.message);
    return null;
  }
}

export async function fetchQA() {
  const res = await fetch(`${BASE}/qa`);
  if (!res.ok) throw new Error('Failed to fetch QA');
  return await res.json();
}

export async function addQA(qa) {
  const res = await fetch(`${BASE}/qa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(qa),
  });
  if (!res.ok) throw new Error('Failed to add QA');
  return await res.json();
}

export async function updateQA(id, updates) {
  const res = await fetch(`${BASE}/qa/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const text = await res.text();
  if (!res.ok || text.startsWith('<')) throw new Error('Backend server is not running. Please start the server and try again.');
  return JSON.parse(text);
}

export async function deleteQA(id) {
  const res = await fetch(`${BASE}/qa/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete QA');
  return await res.json();
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${BASE}/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to upload image');
  const data = await res.json();
  return data.url;
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

// ── Coding Questions CRUD ───────────────────────────────────────────────────
export async function fetchCodingQuestions() {
  const res = await fetch(`${BASE}/coding-questions`);
  if (!res.ok) throw new Error('Failed to fetch coding questions');
  return await res.json();
}

export async function addCodingQuestion(data) {
  const res = await fetch(`${BASE}/coding-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add coding question');
  return await res.json();
}

export async function updateCodingQuestion(id, data) {
  const res = await fetch(`${BASE}/coding-questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update coding question');
  return await res.json();
}

export async function deleteCodingQuestion(id) {
  const res = await fetch(`${BASE}/coding-questions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete coding question');
  return await res.json();
}

// ── Output Questions CRUD ───────────────────────────────────────────────────
export async function fetchOutputQuestions() {
  const res = await fetch(`${BASE}/output-questions`);
  if (!res.ok) throw new Error('Failed to fetch output questions');
  return await res.json();
}

export async function addOutputQuestion(data) {
  const res = await fetch(`${BASE}/output-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add output question');
  return await res.json();
}

export async function updateOutputQuestion(id, data) {
  const res = await fetch(`${BASE}/output-questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update output question');
  return await res.json();
}

export async function deleteOutputQuestion(id) {
  const res = await fetch(`${BASE}/output-questions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete output question');
  return await res.json();
}

// ── LinkedIn Questions CRUD ─────────────────────────────────────────────────
export async function fetchLinkedInQuestions() {
  const res = await fetch(`${BASE}/linkedin-questions`);
  if (!res.ok) throw new Error('Failed to fetch LinkedIn questions');
  return await res.json();
}

export async function addLinkedInQuestion(data) {
  const res = await fetch(`${BASE}/linkedin-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add LinkedIn question');
  return await res.json();
}

export async function updateLinkedInQuestion(id, data) {
  const res = await fetch(`${BASE}/linkedin-questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update LinkedIn question');
  return await res.json();
}

export async function deleteLinkedInQuestion(id) {
  const res = await fetch(`${BASE}/linkedin-questions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete LinkedIn question');
  return await res.json();
}

// ── React Coding Questions CRUD ─────────────────────────────────────────────
export async function fetchReactCodingQuestions() {
  const res = await fetch(`${BASE}/react-coding-questions`);
  if (!res.ok) throw new Error('Failed to fetch React coding questions');
  return await res.json();
}

export async function addReactCodingQuestion(data) {
  const res = await fetch(`${BASE}/react-coding-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add React coding question');
  return await res.json();
}

export async function updateReactCodingQuestion(id, data) {
  const res = await fetch(`${BASE}/react-coding-questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update React coding question');
  return await res.json();
}

export async function deleteReactCodingQuestion(id) {
  const res = await fetch(`${BASE}/react-coding-questions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete React coding question');
  return await res.json();
}

// ── React Scenario Questions CRUD ───────────────────────────────────────────
export async function fetchReactScenarioQuestions() {
  const res = await fetch(`${BASE}/react-scenario-questions`);
  if (!res.ok) throw new Error('Failed to fetch React scenario questions');
  return await res.json();
}

export async function addReactScenarioQuestion(data) {
  const res = await fetch(`${BASE}/react-scenario-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add React scenario question');
  return await res.json();
}

export async function updateReactScenarioQuestion(id, data) {
  const res = await fetch(`${BASE}/react-scenario-questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update React scenario question');
  return await res.json();
}

export async function deleteReactScenarioQuestion(id) {
  const res = await fetch(`${BASE}/react-scenario-questions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete React scenario question');
  return await res.json();
}

// ── System Design Questions CRUD ─────────────────────────────────────────────
export async function fetchSystemDesignQuestions() {
  const res = await fetch(`${BASE}/system-design-questions`);
  if (!res.ok) throw new Error('Failed to fetch System Design questions');
  return await res.json();
}

export async function addSystemDesignQuestion(data) {
  const res = await fetch(`${BASE}/system-design-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add System Design question');
  return await res.json();
}

export async function updateSystemDesignQuestion(id, data) {
  const res = await fetch(`${BASE}/system-design-questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update System Design question');
  return await res.json();
}

export async function deleteSystemDesignQuestion(id) {
  const res = await fetch(`${BASE}/system-design-questions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete System Design question');
  return await res.json();
}

// ── Manager Questions CRUD ─────────────────────────────────────────────
export async function fetchManagerQuestions() {
  const res = await fetch(`${BASE}/manager-questions`);
  if (!res.ok) throw new Error('Failed to fetch Manager questions');
  return await res.json();
}

export async function addManagerQuestion(data) {
  const res = await fetch(`${BASE}/manager-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add Manager question');
  return await res.json();
}

export async function updateManagerQuestion(id, data) {
  const res = await fetch(`${BASE}/manager-questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update Manager question');
  return await res.json();
}

export async function deleteManagerQuestion(id) {
  const res = await fetch(`${BASE}/manager-questions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete Manager question');
  return await res.json();
}

// ── HR Questions CRUD ─────────────────────────────────────────────
export async function fetchHrQuestions() {
  const res = await fetch(`${BASE}/hr-questions`);
  if (!res.ok) throw new Error('Failed to fetch HR questions');
  return await res.json();
}

export async function addHrQuestion(data) {
  const res = await fetch(`${BASE}/hr-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add HR question');
  return await res.json();
}

export async function updateHrQuestion(id, data) {
  const res = await fetch(`${BASE}/hr-questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update HR question');
  return await res.json();
}

export async function deleteHrQuestion(id) {
  const res = await fetch(`${BASE}/hr-questions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete HR question');
  return await res.json();
}

// ── Project Explanation Questions CRUD ─────────────────────────────────────────────
export async function fetchProjectQuestions() {
  const res = await fetch(`${BASE}/project-questions`);
  if (!res.ok) throw new Error('Failed to fetch Project questions');
  return await res.json();
}

export async function addProjectQuestion(data) {
  const res = await fetch(`${BASE}/project-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add Project question');
  return await res.json();
}

export async function updateProjectQuestion(id, data) {
  const res = await fetch(`${BASE}/project-questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update Project question');
  return await res.json();
}

export async function deleteProjectQuestion(id) {
  const res = await fetch(`${BASE}/project-questions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete Project question');
  return await res.json();
}
