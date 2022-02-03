'use strict'
const express = require('express');
const HostController = require('../controllers/host');

const router = express.Router();

router.post('/host/save', HostController.save);
router.get('/hosts/:last?', HostController.getHosts);
router.get('/host/:id', HostController.getHost);
router.put('/host/:id', HostController.update);
router.delete('/host/:id', HostController.delete);
router.get('/host/search/:search', HostController.search);

module.exports = router