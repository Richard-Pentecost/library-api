const DataFactory = require('./helpers/data-factory');
const { signUp, login } = require('./helpers/user-helpers');
const jwt = require('jsonwebtoken');

describe('/auth', () => {
  describe('POST /auth/login', () => {
    it('sets up an account and assigns a jwt token', (done) => {
      const data = DataFactory.user();
      signUp(data)
        .then((result) => {
          login(data.email, data.password)
            .then((res) => {
              expect(res.status).to.equal(200);
              const token = jwt.decode(res.body.token);
              expect(token).to.contain({ firstName: result.body.firstName });
              expect(token).to.contain({ lastName: result.body.lastName });
              expect(token).to.contain({ id: result.body._id });
              // expect(token).to.contain.keys('id');
              // expect(token).to.contain.keys('firstName');
              // expect(token).to.contain.keys('lastName');
              done();
            });
        });
    });

    it('tries to login with an email that does not exist', (done) => {
      const data = DataFactory.user();
      signUp(data)
        .then(() => {
          login('richard@gmail.com', data.email)
            .then((res) => {
              expect(res.status).to.equal(401);
              done();
            })
        });
    });

    it('tries to login with an invalid password', (done) => {
      const data = DataFactory.user();
      const email = data.email;
      const password = 'something';
      signUp(data)
        .then(() => {
          login(email, password)
            .then((res) => {
              expect(res.status).to.equal(401);
              done();
            })
        });
    });
  });
});
