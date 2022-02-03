'use strict'
const { Schema, model } = require('mongoose');

const appointmentSchema = new Schema({
    date_appointment: { type: Date, required: true },
    tpMaintenance: { type: String, required: true },
    host: { type: String, required: true },
    employee: { type: String, required: true },
    support_tec: { type: String, required: true },
    procedures: { type: String },
    observations: { type: String },
    state: { type: String, default: 'Agendado' },

    /* Datos de Movimiento */
    registration_Date: { type: Date, default: Date.now }
});

module.exports = model('Appointment', appointmentSchema);