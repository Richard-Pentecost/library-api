const create = (book, token) => new Promise((resolve, reject) => {
  chai.request(server)
    .post('/books')
    .set('Authorization', token)
    .send(book)
    .end((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
});

// additional helper to create many books in one go
const createMany = (books, token) => Promise.all(
  books.map(book => create(book, token))
);

module.exports = {
  create,
  createMany,
};
