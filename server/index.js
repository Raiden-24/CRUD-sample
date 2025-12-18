const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'equipment.json');

const ALLOWED_TYPES = ['Machine', 'Vessel', 'Tank', 'Mixer'];
const ALLOWED_STATUS = ['Active', 'Inactive', 'Under Maintenance'];

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function validateEquipment(payload) {
  const errors = [];
  const { name, type, status, lastCleanedDate } = payload || {};

  if (typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required');
  }
  if (!ALLOWED_TYPES.includes(type)) {
    errors.push('Type must be one of: ' + ALLOWED_TYPES.join(', '));
  }
  if (!ALLOWED_STATUS.includes(status)) {
    errors.push('Status must be one of: ' + ALLOWED_STATUS.join(', '));
  }
  if (!lastCleanedDate || Number.isNaN(Date.parse(lastCleanedDate))) {
    errors.push('Last Cleaned Date must be a valid date string');
  }
  return errors;
}

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/equipment', (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/equipment', (req, res) => {
  try {
    const errors = validateEquipment(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    const data = readData();
    const nextId = data.length ? Math.max(...data.map((e) => e.id)) + 1 : 1;
    const item = {
      id: nextId,
      name: req.body.name.trim(),
      type: req.body.type,
      status: req.body.status,
      lastCleanedDate: new Date(req.body.lastCleanedDate).toISOString().slice(0, 10),
    };
    data.push(item);
    writeData(data);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add equipment' });
  }
});

app.put('/api/equipment/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = readData();
    const idx = data.findIndex((e) => e.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    const candidate = {
      ...data[idx],
      name: req.body.name,
      type: req.body.type,
      status: req.body.status,
      lastCleanedDate: req.body.lastCleanedDate,
    };
    const errors = validateEquipment(candidate);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    data[idx] = {
      id,
      name: candidate.name.trim(),
      type: candidate.type,
      status: candidate.status,
      lastCleanedDate: new Date(candidate.lastCleanedDate).toISOString().slice(0, 10),
    };
    writeData(data);
    res.json(data[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update equipment' });
  }
});

app.delete('/api/equipment/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = readData();
    const idx = data.findIndex((e) => e.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    const [removed] = data.splice(idx, 1);
    writeData(data);
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

