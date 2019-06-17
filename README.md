SETTING UP AN API FROM SCRATCH

REPO SETUP

- Setup an empty git repository and link it to a local repository using git clone
- use npm init to setup the package json file
- create a .gitignore, putting 'node_modules/' in it
- setup a .eslintrc file
- install 'eslintrc-config-mcr-codes' using npm, and configure it in the .eslintrc file
  - copy the overrides object into the .eslintrc file from music-library-api

APPLICATION SETUP

- install express and mongoose as dependencies
- create an index.js file and a src directory with an app.js file inside it
- fill out the index.js file so that it listens for the app
  - require mongoose and app
  - use 'mongoose.connect' with the 'DATABASE_CONN' string
  - 'app.listen(3000);'
- configure and export a basic Express application
  - require in express
  - create an app constant that is an express instance (i.e. const app = express())
  - export the app;
- install dotenv and nodemon as dev dependencies
- add the following start script to the package.json file
  - 'nodemon -r dotenv/config index.js'
  - uses nodemon to execute the index.js file with the environment variable loaded from a .env file
- create a .env file with a DATABASE_CONN value set to a MongoDB database
  - this will either be a local database (e.g. mongodb://127.0.0.1/library-api)or one created on MLab
- add the .env file to the .gitignore

Running 'npm start' should get a successful database connection and listening Express server.

TESTING ENVIRONMENT SETUP

- install chai, mocha and chai-http as dev dependencies
- copy accross .mocha.opts and mocha.config.js from music-library-api project
- create a .env.test file and put in a different DATABASE_CONN string to the .env file (e.g. mongodb://127.0.0.1/library-api-test)
- add the .env.text file to the .gitignore file
- add the following tests script to the package.json file
  - mocha tests/**/*.test.js --opts .mocha.opts
- create a tests folder with an empty test file in it

Running 'npm test' should allow Mocha to connect to the test database, start a test server and run test, not that there are any yet.
