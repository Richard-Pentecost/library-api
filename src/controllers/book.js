const Book = require('../models/book');

exports.create = (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    isbn: req.body.isbn,
    user: req.authorizer.id, // we can get the user id from the authorizer - the person who sent the request, rather than taking it from the request body
  });

  book.save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch(error => {
      if (error.name === 'ValidationError') {
        if (error.errors.title) {
          res.status(400).json({
            errors: {
              title: error.errors.title.message,
            },
          });
        } else {
          res.status(400).json({
            errors: {
              author: error.errors.author.message,
            },
          });
        }
      } else {
        res.sendStatus(500);
      }
    });
  // User.findById(req.body.user, (err, user) => {
  //   if (!user) {
  //     res.status(400).json({ error: 'user could not be found' });
  //   } else {
  //     book.save().then(() => {
  //       res.status(201).json(book);
  //     });
  //   }
  // });
};

exports.listBooks = (req, res) => {
  Book.find({}, (err, books) => {
    if (!books) {
      res.status(400).json({ error: 'There is a problem retrieving books' });
    } else {
      res.status(200).json(books);
    }
  });
};
