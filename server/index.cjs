// server/index.cjs
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const jwt = require('jsonwebtoken');

const Progress = require('./models/Progress');
const QA = require('./models/QA');
const User = require('./models/User');
const CodingQuestion = require('./models/CodingQuestion');
const OutputQuestion = require('./models/OutputQuestion');
const LinkedInQuestion = require('./models/LinkedInQuestion');
const ReactCodingQuestion = require('./models/ReactCodingQuestion');
const ReactScenarioQuestion = require('./models/ReactScenarioQuestion');
const SystemDesignQuestion = require('./models/SystemDesignQuestion');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ── Connect to MongoDB ──────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB error:', err.message); });

// ── Cloudinary & Multer Config ────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const upload = multer({ dest: 'uploads/' });

// ── Upload Route ────────────────────────────────────────────────────────────
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── Auth Routes ────────────────────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '30d' });
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Progress routes ───────────────────────────────────────────────────────
app.get('/api/progress', async (req, res) => {
  try {
    let doc = await Progress.findOne({ userId: 'default' });
    if (!doc) doc = await Progress.create({ userId: 'default', REACT: [], JS: [] });
    res.json({ REACT: doc.REACT, JS: doc.JS });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/progress', async (req, res) => {
  try {
    const { REACT, JS } = req.body;
    const doc = await Progress.findOneAndUpdate({ userId: 'default' }, { REACT: REACT || [], JS: JS || [] }, { upsert: true, new: true });
    res.json({ REACT: doc.REACT, JS: doc.JS });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/progress/toggle', async (req, res) => {
  try {
    const { module, topicId } = req.body;
    if (!module || !topicId) return res.status(400).json({ error: 'module and topicId required' });
    let doc = await Progress.findOne({ userId: 'default' });
    if (!doc) doc = await Progress.create({ userId: 'default', REACT: [], JS: [] });
    const list = doc[module] || [];
    if (list.includes(topicId)) doc[module] = list.filter(id => id !== topicId);
    else doc[module] = [...list, topicId];
    await doc.save();
    res.json({ REACT: doc.REACT, JS: doc.JS });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── QA routes ─────────────────────────────────────────────────────────────
app.get('/api/qa', async (req, res) => {
  try { const qas = await QA.find().sort({ createdAt: 1 }); res.json(qas); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/qa', async (req, res) => {
  try {
    const { q, a, category, subCategory, imageUrl, importance } = req.body;
    const newQa = await QA.create({ q, a, category, subCategory, imageUrl, importance });
    res.json(newQa);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/qa/:id', async (req, res) => {
  try {
    const { q, a, category, subCategory, imageUrl, importance } = req.body;
    const updated = await QA.findByIdAndUpdate(req.params.id, { q, a, category, subCategory, imageUrl, importance }, { new: true });
    if (!updated) return res.status(404).json({ error: 'QA not found' });
    res.json(updated);
  } catch (err) { console.error('PUT /api/qa/:id error:', err.message); res.status(500).json({ error: err.message }); }
});

app.delete('/api/qa/:id', async (req, res) => {
  try { await QA.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Coding, Output, LinkedIn routes ───────────────────────────────────────
app.get('/api/coding-questions', async (req, res) => {
  try { const questions = await CodingQuestion.find().sort({ createdAt: 1 }); res.json(questions); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/coding-questions', async (req, res) => {
  try { const newQuestion = await CodingQuestion.create(req.body); res.json(newQuestion); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/coding-questions/:id', async (req, res) => {
  try { const updated = await CodingQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!updated) return res.status(404).json({ error: 'CodingQuestion not found' }); res.json(updated); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/coding-questions/:id', async (req, res) => {
  try { await CodingQuestion.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/output-questions', async (req, res) => {
  try { const questions = await OutputQuestion.find().sort({ createdAt: 1 }); res.json(questions); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/output-questions', async (req, res) => {
  try { const newQuestion = await OutputQuestion.create(req.body); res.json(newQuestion); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/output-questions/:id', async (req, res) => {
  try { const updated = await OutputQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!updated) return res.status(404).json({ error: 'OutputQuestion not found' }); res.json(updated); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/output-questions/:id', async (req, res) => {
  try { await OutputQuestion.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/linkedin-questions', async (req, res) => {
  try { const questions = await LinkedInQuestion.find().sort({ createdAt: 1 }); res.json(questions); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/linkedin-questions', async (req, res) => {
  try { const newQuestion = await LinkedInQuestion.create(req.body); res.json(newQuestion); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/linkedin-questions/:id', async (req, res) => {
  try { const updated = await LinkedInQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!updated) return res.status(404).json({ error: 'LinkedInQuestion not found' }); res.json(updated); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/linkedin-questions/:id', async (req, res) => {
  try { await LinkedInQuestion.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── React coding & scenario routes ───────────────────────────────────────
app.get('/api/react-coding-questions', async (req, res) => {
  try { const questions = await ReactCodingQuestion.find().sort({ createdAt: 1 }); res.json(questions); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/react-coding-questions', async (req, res) => {
  try { const newQuestion = await ReactCodingQuestion.create(req.body); res.json(newQuestion); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/react-coding-questions/:id', async (req, res) => {
  try { const updated = await ReactCodingQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!updated) return res.status(404).json({ error: 'ReactCodingQuestion not found' }); res.json(updated); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/react-coding-questions/:id', async (req, res) => {
  try { await ReactCodingQuestion.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/react-scenario-questions', async (req, res) => {
  try { const questions = await ReactScenarioQuestion.find().sort({ createdAt: 1 }); res.json(questions); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/react-scenario-questions', async (req, res) => {
  try { const newQuestion = await ReactScenarioQuestion.create(req.body); res.json(newQuestion); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/react-scenario-questions/:id', async (req, res) => {
  try { const updated = await ReactScenarioQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!updated) return res.status(404).json({ error: 'ReactScenarioQuestion not found' }); res.json(updated); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/react-scenario-questions/:id', async (req, res) => {
  try { await ReactScenarioQuestion.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── System design routes ────────────────────────────────────────────────────
app.get('/api/system-design-questions', async (req, res) => {
  try { const questions = await SystemDesignQuestion.find().sort({ createdAt: 1 }); res.json(questions); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/system-design-questions', async (req, res) => {
  try { const newQuestion = await SystemDesignQuestion.create(req.body); res.json(newQuestion); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/system-design-questions/:id', async (req, res) => {
  try { const updated = await SystemDesignQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!updated) return res.status(404).json({ error: 'SystemDesignQuestion not found' }); res.json(updated); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/system-design-questions/:id', async (req, res) => {
  try { await SystemDesignQuestion.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
