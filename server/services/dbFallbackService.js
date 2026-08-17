const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'fallback_db.json');

// Ensure directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], history: [] }, null, 2));
}

const readData = () => {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { users: [], history: [] };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[DB FALLBACK ERROR] Could not write fallback db file:', err.message);
  }
};

// Fallback User Store Methods
const findUser = async (query) => {
  const db = readData();
  if (query.email) {
    const targetEmail = query.email.toLowerCase();
    const user = db.users.find(u => u.email.toLowerCase() === targetEmail);
    if (user) return user;
  }
  if (query.username) {
    const targetName = query.username.toLowerCase();
    const user = db.users.find(u => u.username.toLowerCase() === targetName);
    if (user) return user;
  }
  if (query._id) {
    const user = db.users.find(u => u._id === query._id);
    if (user) return user;
  }
  if (query.$or) {
    for (const cond of query.$or) {
      const user = await findUser(cond);
      if (user) return user;
    }
  }
  return null;
};

const createUser = async ({ username, email, password }) => {
  const db = readData();
  const newUser = {
    _id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    username,
    email: email.toLowerCase(),
    password,
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);
  writeData(db);
  return newUser;
};

// Fallback Analysis History Methods
const createAnalysisRecord = async (payload) => {
  const db = readData();
  const newRecord = {
    _id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    ...payload,
    createdAt: new Date().toISOString()
  };
  db.history.unshift(newRecord);
  writeData(db);
  return newRecord;
};

const getAnalysisHistory = async ({ userId, search, classification }) => {
  const db = readData();
  let list = db.history;

  if (userId) {
    list = list.filter(item => item.userId === userId || !item.userId);
  }

  if (classification) {
    list = list.filter(item => item.classification === classification);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(item => 
      (item.headline && item.headline.toLowerCase().includes(q)) ||
      (item.content && item.content.toLowerCase().includes(q))
    );
  }

  return list;
};

const deleteAnalysisRecord = async (id, userId) => {
  const db = readData();
  const initialLen = db.history.length;
  db.history = db.history.filter(item => item._id !== id);
  if (db.history.length !== initialLen) {
    writeData(db);
    return true;
  }
  return false;
};

module.exports = {
  findUser,
  createUser,
  createAnalysisRecord,
  getAnalysisHistory,
  deleteAnalysisRecord
};
