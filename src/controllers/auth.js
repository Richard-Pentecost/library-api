const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json({ error: 'User not found' });
      } else {
        if (user.validatePassword(req.body.password)) {
          const payload = {
            firstName: user.firstName,
            lastName: user.lastName,
            id: user._id,
          };
          jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' }, (err, token) => {
            if (err) {
              res.sendStatus(500);
            } else {
              res.status(200).json({ token });
            }
          });
        } else {
          res.status(401).json({ error: 'Password not correct' });
        }
      }
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};
