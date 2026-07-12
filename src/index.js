const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/database');
const adminRoutes = require('./routes/adminRoutes');
const videoRoutes = require('./routes/videoRoutes');
const { seedAdminKey } = require('./config/seed');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// Initialisation de la base de données et seeding
db.pragma('journal_mode = WAL'); // Optimisation pour SQLite
seedAdminKey();

// Routes de l'API
app.use('/admin', adminRoutes);
app.use('/', videoRoutes);

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur interne du serveur est survenue' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
