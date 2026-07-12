const db = require('./database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// Fonction pour générer une clé API sécurisée
const generateSecureApiKey = () => {
  return crypto.randomBytes(32).toString('hex'); // 64 caractères hexadécimaux
};

/**
 * Crée une clé administrateur si elle n'existe pas déjà.
 * La clé admin est utilisée pour gérer d'autres clés API.
 */
const seedAdminKey = () => {
  const adminKey = process.env.ADMIN_SEED_KEY || generateSecureApiKey();

  try {
    const existingKey = db.prepare('SELECT 1 FROM api_keys WHERE key = ? AND is_admin = 1').get(adminKey);

    if (!existingKey) {
      db.prepare('INSERT INTO api_keys (id, key, credits, is_admin) VALUES (?, ?, ?, ?)')
        .run(uuidv4(), adminKey, -1, 1); // -1 pour crédits illimités pour l'admin
      console.log('Clé administrateur créée avec succès. Utilisez cette clé pour les routes admin:', adminKey);
      console.log('Il est recommandé de définir cette clé via ADMIN_SEED_KEY dans votre .env');
    }
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.log('La clé administrateur existe déjà dans la base de données.');
    } else {
      console.error('Erreur lors de la création de la clé administrateur:', error.message);
    }
  }
};

module.exports = { seedAdminKey, generateSecureApiKey };
