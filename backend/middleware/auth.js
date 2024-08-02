//j'importela bibliothèque Node.js qui gère les JSON Web Tokens. 
//C'est un standard pour transmettre l'information de manière sécurisée
const jwt = require('jsonwebtoken');

// On récupère l'en-tête d'autorisation de la requête HTTP avec le token JWT.
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // On retire le mot Bearer
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Vérifie si le token est valide
       const userId = decodedToken.userId; // On récupère l'userID
       req.auth = {
           userId: userId // On rajoute l'userID décrypté à la requete pour l'utiliser dans les futures routes
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};