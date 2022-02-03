'use strict'
const { Schema, model } = require('mongoose');

const employeeSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    occupation: { type: String, required: true },
    phoneNumber: { type: String },
    state: { type: Boolean, default: true },

    /* Datos de Movimiento */
    registration_Date: { type: Date, default: Date.now }
});

module.exports = model('Employee', employeeSchema);