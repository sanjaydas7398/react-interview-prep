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

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ── Connect to MongoDB ──────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB error:', err.message); });

// ── Cloudinary & Multer Config ──────────────────────────────────────────────
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

// ── Auth Routes ─────────────────────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '30d' });
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Progress Routes ─────────────────────────────────────────────────────────
app.get('/api/progress', async (req, res) => {
  try {
    let doc = await Progress.findOne({ userId: 'default' });
    if (!doc) doc = await Progress.create({ userId: 'default', REACT: [], JS: [], CODING: [] });
    res.json({ REACT: doc.REACT, JS: doc.JS, CODING: doc.CODING || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/progress', async (req, res) => {
  try {
    const { REACT, JS, CODING } = req.body;
    const doc = await Progress.findOneAndUpdate(
      { userId: 'default' },
      { REACT: REACT || [], JS: JS || [], CODING: CODING || [] },
      { upsert: true, new: true }
    );
    res.json({ REACT: doc.REACT, JS: doc.JS, CODING: doc.CODING || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/progress/toggle', async (req, res) => {
  try {
    const { module, topicId } = req.body;
    if (!module || !topicId) return res.status(400).json({ error: 'module and topicId required' });
    let doc = await Progress.findOne({ userId: 'default' });
    if (!doc) doc = await Progress.create({ userId: 'default', REACT: [], JS: [], CODING: [] });
    const list = doc[module] || [];
    doc[module] = list.includes(topicId) ? list.filter(id => id !== topicId) : [...list, topicId];
    await doc.save();
    res.json({ REACT: doc.REACT, JS: doc.JS, CODING: doc.CODING || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── QA Routes ───────────────────────────────────────────────────────────────
app.get('/api/qa', async (req, res) => {
  try {
    const qas = await QA.find().sort({ createdAt: 1 });
    res.json(qas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/qa', async (req, res) => {
  try {
    const { q, a, category, subCategory, imageUrl } = req.body;
    const newQa = await QA.create({ q, a, category, subCategory, imageUrl });
    res.json(newQa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/qa/:id', async (req, res) => {
  try {
    const { q, a, category, subCategory, imageUrl } = req.body;
    const updated = await QA.findByIdAndUpdate(
      req.params.id,
      { q, a, category, subCategory, imageUrl },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'QA not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/qa/:id error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/qa/:id', async (req, res) => {
  try {
    await QA.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Generic Question Factory ────────────────────────────────────────────────────────
function makeQuestionModel(name, extraFields = {}) {
  const schema = new mongoose.Schema(
    { title: String, description: String, explanation: String, category: String, isMostAsked: { type: Boolean, default: false }, ...extraFields },
    { timestamps: true }
  );
  schema.set('toJSON', { virtuals: true, transform: (_, ret) => { ret.id = ret._id; delete ret.__v; } });
  return mongoose.model(name, schema);
}

function registerCRUD(app, path, Model) {
  app.get(path, async (req, res) => { try { res.json(await Model.find().sort({ createdAt: 1 })); } catch (err) { res.status(500).json({ error: err.message }); } });
  app.post(path, async (req, res) => { try { res.status(201).json(await Model.create(req.body)); } catch (err) { res.status(500).json({ error: err.message }); } });
  app.put(`${path}/:id`, async (req, res) => { try { const u = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!u) return res.status(404).json({ error: 'Not found' }); res.json(u); } catch (err) { res.status(500).json({ error: err.message }); } });
  app.delete(`${path}/:id`, async (req, res) => { try { await Model.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); } });
}

registerCRUD(app, '/api/coding-questions',        makeQuestionModel('CodingQuestion',        { templateCode: String, solutionCode: String, testCases: String }));
registerCRUD(app, '/api/output-questions',         makeQuestionModel('OutputQuestion',         { code: String, options: [String], correct: Number }));
registerCRUD(app, '/api/linkedin-questions',       makeQuestionModel('LinkedInQuestion',       { content: String }));
registerCRUD(app, '/api/react-coding-questions',   makeQuestionModel('ReactCodingQuestion',   { templateCode: String, solutionCode: String, testCases: String }));
registerCRUD(app, '/api/react-scenario-questions', makeQuestionModel('ReactScenarioQuestion', {}));
registerCRUD(app, '/api/system-design-questions',  makeQuestionModel('SystemDesignQuestion',  {}));

registerCRUD(app, '/api/project-questions',  makeQuestionModel('ProjectQuestion',  {}));
registerCRUD(app, '/api/hr-questions',        makeQuestionModel('HrQuestion',        {}));
registerCRUD(app, '/api/manager-questions',   makeQuestionModel('ManagerQuestion',   {}));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
