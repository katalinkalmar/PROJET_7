const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // On retire le mot Bearer
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Vérifie si le token est valide
       const userId = decodedToken.userId; // On récupère l'userID
       req.auth = {
           userId: userId // On rajoute l'userID à la requete pour l'utiliser dans les futures routes
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};