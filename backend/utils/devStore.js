const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadUsers() {
  ensureDir();
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  ensureDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function findUserByEmail(email) {
  const users = loadUsers();
  const target = email.toLowerCase().trim();
  return users.find((u) => u.email === target);
}

function findUserById(id) {
  const users = loadUsers();
  return users.find((u) => u.id === id);
}

function addUser(userData) {
  const users = loadUsers();
  users.push(userData);
  saveUsers(users);
  return userData;
}

module.exports = { loadUsers, saveUsers, findUserByEmail, findUserById, addUser };
