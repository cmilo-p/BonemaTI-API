'use strict'
const express = require('express');
const UserController = require('../controllers/users');

const router = express.Router();

router.post('/user/save', UserController.save);
router.get('/users/:last?', UserController.getUsers);
router.get('/user/:id', UserController.getUser);
router.put('/user/:id', UserController.update);
router.delete('/user/:id', UserController.delete);
router.get('/user/search/:search', UserController.search);

router.post('/user/signIn', UserController.signIn);

module.exports = router;