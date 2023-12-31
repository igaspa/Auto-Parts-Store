const express = require('express');
const { login } = require('../controllers/authController');
const { callbackErrorHandler } = require('../validators/errorHandler');
const router = express.Router({ mergeParams: true });

router.post('/login', callbackErrorHandler(login));

module.exports = router;
