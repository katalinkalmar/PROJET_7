// imports
const express = require("express");
const mongoose = require("mongoose");
const apiKeys = require("./api_keys");


// imports des routers
const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user"); // c'est le fichier user dans le dossier routes!

// import pour la gestion d'image
const path = require("path");

// Connexion à la base de données MongoDB
mongoose.connect(
    `mongodb+srv://katalinkalmar:${apiKeys.password}@clusterprojetoc7.gwfc6w0.mongodb.net/?retryWrites=true&w=majority&appName=ClusterProjetOC7`,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Création de l'application
const app = express()



// Ajout du Middleware Express JSON pour lire les JSON
app.use(express.json());

// Ajout du Middleware gérant les erreurs de CORS - Cross Origin Resourse Sharing,
//c'est à dire les requêtes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// la ressource images est statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// Ajout des routeurs
app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);


module.exports = app;