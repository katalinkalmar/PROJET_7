const mongoose = require('mongoose');
// la méthode Schema me permet de créer un schéma de données 
//pour la base de données MongoDB
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
     title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [{
        userId: { type: String },
         grade: { type: Number },
    }],
    averageRating: { type: Number },
});
//la méthode model tranforme ce schéma en modele réutilisable
module.exports = mongoose.model('Book', bookSchema);