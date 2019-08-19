const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.get('Authorization'); // use the req.get method to access headers
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (error, authorizer) => {
      if (error) {
        res.status(401).json({ message: 'Unable to authenticate token' });
      } else {
        req.authorizer = authorizer; // add the authorizer method to access request headers
        next(); // pass control to the next function
      }
    });
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};

module.exports = auth;
