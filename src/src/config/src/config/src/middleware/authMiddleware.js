const db = require('../config/database');

/**
 * Middleware pour vérifier si la clé API fournie est une clé administrateur valide.
 */
const adminAuth = (req, res, next) => {
  const adminApiKey = req.headers['x-api-key'];

  if (!adminApiKey) {
    return res.status(401).json({ message: 'Authentification requise: Clé API manquante.' });
  }

  try {
    // Recherche de la clé dans la base de données
    const keyRecord = db.prepare('SELECT * FROM api_keys WHERE key = ? AND is_admin = 1').get(adminApiKey);

    if (!keyRecord) {
      return res.status(403).json({ message: 'Accès refusé: Clé API invalide ou non-administrateur.' });
    }

    // La clé est valide et est une clé administrateur
    req.apiKey = keyRecord;
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification de la clé admin:', error.message);
    res.status(500).json({ message: 'Erreur serveur lors de l\'authentification.' });
  }
};

/**
 * Middleware pour vérifier si la clé API fournie est une clé d'accès valide
 * et dispose de crédits suffisants.
 */
const apiKeyAuth = (req, res, next) => {
  const clientApiKey = req.headers['x-api-key'];

  if (!clientApiKey) {
    return res.status(401).json({ message: 'Authentification requise: Clé API manquante.' });
  }

  try {
    // Recherche de la clé dans la base de données
    const keyRecord = db.prepare('SELECT * FROM api_keys WHERE key = ? AND is_admin = 0').get(clientApiKey);

    if (!keyRecord) {
      return res.status(403).json({ message: 'Accès refusé: Clé API invalide.' });
    }

    if (keyRecord.credits <= 0) {
      return res.status(403).json({ message: 'Accès refusé: Crédits insuffisants.' });
    }

    // La clé est valide et dispose de crédits
    req.apiKey = keyRecord; // Attache la clé API à l'objet requête pour un usage ultérieur
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification de la clé client:', error.message);
    res.status(500).json({ message: 'Erreur serveur lors de l\'authentification.' });
  }
};

module.exports = { adminAuth, apiKeyAuth };
