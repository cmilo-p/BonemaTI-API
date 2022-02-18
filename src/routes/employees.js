'use strict'
const express = require('express');
const EmployeeController = require('../controllers/employee');

const router = express.Router();

router.post('/employee/save', EmployeeController.save);
router.get('/employees', EmployeeController.getEmployees);
router.get('/employee/:id', EmployeeController.getEmployee);
router.put('/employee/:id', EmployeeController.update);
router.delete('/employee/:id', EmployeeController.delete);
router.get('/employee/search/:search', EmployeeController.search);

module.exports = router;