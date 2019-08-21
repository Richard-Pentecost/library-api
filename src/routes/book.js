const express = require('express');
const bookController = require('../controllers/book');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, bookController.create);
router.get('/', bookController.listBooks);
module.exports = router;
