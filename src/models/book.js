const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'The title must be provided'],
  },
  author: {
    type: String,
    required: [true, 'The author must be provided'],
  },
  genre: String,
  isbn: String,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
