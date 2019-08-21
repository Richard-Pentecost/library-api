const faker = require('faker');

exports.user = (options = {}) => ({
  firstName: options.firstName || faker.name.firstName(),
  lastName: options.lastName || faker.name.lastName(),
  email: options.email || faker.internet.email(),
  password: options.password || faker.internet.password(),
});

exports.book = (opts = {}) => ({
  title: opts.title || faker.random.word(),
  author: opts.author || faker.name.findName(),
  isbn: opts.isbn || faker.random.number().toString(),
  genre: opts.genre || faker.random.word(),
});
