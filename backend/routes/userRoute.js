const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const {addUser} = require('../controllers/userCtrl');

router.post('/addUser', addUser);

module.exports = {router};