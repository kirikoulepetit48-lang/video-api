const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/authMiddleware');

/**
 * POST /admin/generate-key
 * Crée une nouvelle clé API avec un nombre de crédits spécifié.
 * Nécessite une authentification administrateur.
 */
router.post('/generate-key', adminAuth, adminController.validateCreateKey, adminController.generateNewApiKey);

/**
 * GET /admin/keys
 * Liste toutes les clés API et leur solde de crédits.
 * Nécessite une authentification administrateur.
 */
router.get('/keys', adminAuth, adminController.listAllApiKeys);

module.exports = router;
