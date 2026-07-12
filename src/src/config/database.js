const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../data/video_api.db');

// Création du dossier 'data' si il n'existe pas
const fs = require('fs');
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const db = new Database(dbPath, { verbose: console.log });

// Exécution des migrations pour créer les tables
db.exec(`
  CREATE TABLE IF NOT EXISTS api_keys (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    is_admin INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('Base de données SQLite initialisée et migrations exécutées.');

module.exports = db;
