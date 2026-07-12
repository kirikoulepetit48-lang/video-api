const db = require('../config/database');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { generateSecureApiKey } = require('../config/seed');

/**
 * Validation des entrées pour la création d'une clé API.
 */
const validateCreateKey = [
  body('initialCredits')
    .isInt({ min: 1 }).withMessage('Le nombre de crédits doit être un entier positif.')
];

/**
 * Crée une nouvelle clé API avec un nombre de crédits défini.
 * Nécessite une authentification administrateur.
 */
const generateNewApiKey = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { initialCredits } = req.body;
  const newApiKey = generateSecureApiKey();

  try {
    const stmt = db.prepare('INSERT INTO api_keys (id, key, credits, is_admin) VALUES (?, ?, ?, 0)');
    stmt.run(uuidv4(), newApiKey, initialCredits);
    res.status(201).json({ message: 'Clé API générée avec succès', key: newApiKey, credits: initialCredits });
  } catch (error) {
    console.error('Erreur lors de la génération de la clé API:', error.message);
    res.status(500).json({ message: 'Erreur serveur lors de la génération de la clé API.' });
  }
};

/**
 * Liste toutes les clés API existantes avec leur solde de crédits.
 * Nécessite une authentification administrateur.
 */
const listAllApiKeys = (req, res) => {
  try {
    const keys = db.prepare('SELECT id, key, credits, is_admin, created_at FROM api_keys').all();
    res.status(200).json(keys);
  } catch (error) {
    console.error('Erreur lors de la récupération des clés API:', error.message);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des clés API.' });
  }
};

module.exports = {
  validateCreateKey,
  generateNewApiKey,
  listAllApiKeys
};
