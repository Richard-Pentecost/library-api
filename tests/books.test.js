const { signUp, login, createBook } = require('./helpers/user-helpers');
const DataFactory = require('./helpers/data-factory');
const Book = require('../src/models/book');

describe('/books', () => {
  describe('POST /books', () => {
    it('creates a book listing', (done) => {
      const userData = DataFactory.user();
      signUp(userData).then((user) => {
        login(userData.email, userData.password).then((credentials) => {
          const book = {
            title: 'Bravo Two Zero',
            author: 'Andy McNab',
            genre: 'non-fiction',
            isbn: '01234',
          };
          createBook(book, credentials)
            .then((res) => {
              expect(res.status).to.equal(201);
              Book.findById(res.body._id, (error, newBook) => {
                expect(error).to.equal(null);
                expect(newBook.title).to.equal('Bravo Two Zero');
                expect(newBook.author).to.equal('Andy McNab');
                expect(newBook.genre).to.equal('non-fiction');
                expect(newBook.isbn).to.equal('01234');
                expect(JSON.stringify(newBook.user)).to.equal(JSON.stringify(user.body._id));
              });
              done();
            })
            .catch((error) => done(error));
        });
      });
    });

    it('validates that a book has a title', (done) => {
      const userData = DataFactory.user();
      signUp(userData).then((user) => {
        login(userData.email, userData.password).then((credentials) => {
          const book = {
            author: 'Andy McNab',
            genre: 'non-fiction',
            isbn: '01234',
          };
          createBook(book, credentials)
            .then((res) => {
              expect(res.status).to.equal(400);
              expect(res.body.errors.title).to.equal('The title must be provided');
              done();
            })
            .catch((error) => done(error));
        });
      });
    });

    it('validates that a book has an author', (done) => {
      const userData = DataFactory.user();
      signUp(userData).then((user) => {
        login(userData.email, userData.password).then((credentials) => {
          chai.request(server)
            .post('/books')
            .set('Authorization', credentials.body.token)
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
});
