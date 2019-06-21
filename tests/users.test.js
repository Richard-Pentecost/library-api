const mongoose = require('mongoose');
const User = require('../src/models/user');

describe('/users', () => {
  beforeEach((done) => {
    mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  describe('POST /users', () => {
    it('creates a new user to the database', (done) => {
      chai.request(server)
        .post('/users')
        .send({
          firstName: 'Richard',
          lastName: 'Pentecost',
          email: 'r@r.com',
          password: '1234asdf',
        })
        .end((error, res) => {
          expect(error).to.equal(null);
          expect(res.status).to.equal(200);
          User.findById(res.body._id, (err, user) => {
            expect(err).to.equal(null);
            expect(user.firstName).to.equal('Richard');
            expect(user.lastName).to.equal('Pentecost');
            expect(user.email).to.equal('r@r.com');
            expect(user.password).to.not.equal('1234');
            expect(user.password).to.have.length(60);
            expect(res.body).to.not.have.property('password');
          });
          done();
        });
    });

    it('validates a users email address', (done) => {
      chai.request(server)
        .post('/users')
        .send({
          firstName: 'Richard',
          lastName: 'Pentecost',
          email: 'richard.com',
          password: '1234asdf',
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(400);
          expect(res.body.errors.email).to.equal('Invalid email address');
          User.countDocuments((error, count) => {
            expect(count).to.equal(0);
          });
          done();
        });
    });

    it('checks a users password is at least 8 characters', (done) => {
      chai.request(server)
        .post('/users')
        .send({
          firstName: 'Richard',
          lastName: 'Pentecost',
          email: 'r@r.com',
          password: '1234',
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(400);
          expect(res.body.errors.password).to.equal('Password must be at least 8 characters long');
          User.countDocuments((error, count) => {
            expect(count).to.equal(0);
          });
          done();
        });
    });
  });
});
