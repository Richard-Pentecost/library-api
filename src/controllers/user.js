const User = require('../models/user');

exports.create = (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  user.save()
    .then((data) => {
      res.status(200).json(user.sanitise(data));
    })
    .catch(error => {
      if (error.name === 'ValidationError') {
        if (error.errors.email) {
          res.status(400).json({
            errors: {
              email: error.errors.email.message,
            },
          });
        } else {
          res.status(400).json({
            errors: {
              password: error.errors.password.message,
            },
          });
        }
      } else {
        res.sendStatus(500);
      }
    });
};
