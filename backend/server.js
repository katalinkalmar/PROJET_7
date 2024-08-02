// imports
const http = require('http');
const app = require('./app');

// Fonction de recherche de port valide
//parseInt(val,10) convertit un string en integer, ici en base 10
// val est une variable intermédiaire
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// Recherche de port valide
const port = normalizePort(process.env.PORT || '4000');
// On enregistre le port valide dans l'app
app.set('port', port);

// Fonction de gestion d'erreur lors de l'écoute
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
// On récupère l'adresse réseau et le port sur lesquels le serveur écoute les requêtes:    
// la variable bind est une chaîne de caractères représentant l'adresse du liaison du serveur.
//Le ternaire vérifie. Si oui, l'adresse est un chemin de fichier.
//si non, l'adresse est lié à un port TCP.
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

    // Comportements différents en fonction des erreurs
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Création du serveur avec l'app
const server = http.createServer(app);

// server.on est une méthode en Node.js pour écouter le serveur.
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});


server.listen(port);