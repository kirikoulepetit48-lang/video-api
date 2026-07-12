const db = require('../config/database');

/**
 * Simule la génération d'une vidéo et déduit un crédit de la clé API.
 * Nécessite une authentification par clé API valide et avec des crédits suffisants.
 */
const generateVideo = (req, res) => {
  const apiKey = req.apiKey; // Récupéré par le middleware apiKeyAuth

  try {
    // Décrémenter le crédit pour la clé utilisée
    db.prepare('UPDATE api_keys SET credits = credits - 1 WHERE id = ?').run(apiKey.id);

    // Logique de génération de vidéo (simulée ici)
    const videoUrl = `https://example.com/videos/${apiKey.id}-${Date.now()}.mp4`;
    const remainingCredits = apiKey.credits - 1;

    res.status(200).json({
      message: 'Vidéo générée avec succès',
      videoUrl: videoUrl,
      remainingCredits: remainingCredits
    });
  } catch (error) {
    console.error('Erreur lors de la génération de la vidéo ou de la déduction des crédits:', error.message);
    res.status(500).json({ message: 'Erreur serveur lors de la génération de la vidéo.' });
  }
};

module.exports = {
  generateVideo
};
