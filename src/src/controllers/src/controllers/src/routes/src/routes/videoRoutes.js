const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { apiKeyAuth } = require('../middleware/authMiddleware');

/**
 * POST /generate-video
 * Génère une vidéo (simulée) et déduit un crédit pour la clé API utilisée.
 * Nécessite une clé API valide avec des crédits suffisants.
 */
router.post('/generate-video', apiKeyAuth, videoController.generateVideo);

module.exports = router;
