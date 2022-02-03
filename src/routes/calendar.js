'use strict'
const express = require('express');
const AppointmentController = require('../controllers/appointment');

const router = express.Router();

router.post('/appointment/save', AppointmentController.save);
router.get('/appointments/:last?', AppointmentController.getAppointments);
router.get('/appointment/:id', AppointmentController.getAppointment);
router.put('/appointment/:id', AppointmentController.update);
router.delete('/appointment/:id', AppointmentController.delete);
router.get('/appointment/search/:search', AppointmentController.search);

module.exports = router;