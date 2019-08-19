
exports.signUp = user => new Promise((resolve, reject) => {
  chai.request(server)
    .post('/users')
    .send(user)
    .end((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
});

exports.login = (email, password) => new Promise((resolve, reject) => {
  chai.request(server)
    .post('/auth/login')
    .send({
      email,
      password,
    })
    .end((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
});

exports.createBook = (book, credentials) => new Promise((resolve, reject) => {
  chai.request(server)
    .post('/books')
    .set('Authorization', credentials.body.token)
    .send({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
    })
    .end((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    })
})