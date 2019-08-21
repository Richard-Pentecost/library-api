const { signUp, login } = require('./helpers/user-helpers');
const { createMany, create } = require('./helpers/book-helpers');
const DataFactory = require('./helpers/data-factory');
const Book = require('../src/models/book');

describe('/books', () => {
  const userData = DataFactory.user();
  let user;
  let token;

  beforeEach((done) => {
    signUp(userData).then((res) => {
      login(userData.email, userData.password).then((credentials) => {
        user = res.body;
        token = credentials.body.token;
        done();
      });
    });
  });

  describe('POST /books', () => {
    it('creates a book listing', (done) => {
      const book = DataFactory.book();
      create(book, token)
        .then((res) => {
          expect(res.status).to.equal(201);
          Book.findById(res.body._id, (error, newBook) => {
            expect(error).to.equal(null);
            expect(newBook.title).to.equal(book.title);
            expect(newBook.author).to.equal(book.author);
            expect(newBook.genre).to.equal(book.genre);
            expect(newBook.isbn).to.equal(book.isbn);
            expect(JSON.stringify(newBook.user)).to.equal(JSON.stringify(user._id));
          });
          done();
        })
        .catch((error) => done(error));
    });

    it('validates that a book has a title', (done) => {
      const book = {
        author: 'Andy McNab',
        genre: 'non-fiction',
        isbn: '01234',
      };
      create(book, token)
        .then((res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.title).to.equal('The title must be provided');
          done();
        })
        .catch((error) => done(error));
    });

    it('validates that a book has an author', (done) => {
      chai.request(server)
        .post('/books')
        .set('Authorization', token)
        .send({
          title: 'Bravo Two Zero',
          genre: 'non-fiction',
          isbn: '01234',
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(400);
          expect(res.body.errors.author).to.equal('The author must be provided');
          done();
        });
    });

    it('book listing will not be created if invalid authorization is given', (done) => {
      chai.request(server)
        .post('/books')
        .send({
          title: 'Bravo Two Zero',
          author: 'Andy McNab',
          genre: 'non-fiction',
          isbn: '01234',
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('No token provided');
          Book.countDocuments((error, count) => {
            expect(count).to.equal(0);
          });
          done();
        });
    });
  });

  describe('GET /books', () => {
    it('lists all books', (done) => {
      const books = [
        DataFactory.book(),
        DataFactory.book(),
        DataFactory.book(),
      ];
      createMany(books, token)
        .then(() => {
          chai.request(server)
            .get('/books')
            .end((error, response) => {
              expect(response.status).to.equal(200);
              expect(response.body).to.have.length(books.length);
              response.body.forEach((item) => {
                const expected = books.find(book => {
                  return book.title === item.title;
                });
                expect(item.user).to.equal(user._id);
                expect(item.title).to.equal(expected.title);
                expect(item.author).to.equal(expected.author);
                expect(item.isbn).to.equal(expected.isbn);
                expect(item.genre).to.equal(expected.genre);
              });
              done();
            });
        });
    });
  });
});
