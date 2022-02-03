'use strict'
const { Schema, model } = require('mongoose');

const hostSchema = new Schema({
    code: { type: String, required: true },
    tpDevice: { type: String, required: true },
    name: { type: String, required: true },
    employee: { type: String, default: "Sin Asignar" },
    serial: { type: String, default: null },
    marca: { type: String, default: null },
    modelo: { type: String, default: null },

    hardware: {
        ram: { type: String },
        cpu: { type: String },
        generation: { type: String },
        hardDisk: { type: String },
        architecture: { type: String },
        bios: { type: String },
    },

    software: [],

    observation: { type: String, default: null },
    state: { type: Boolean, default: true },
    retirement_Date: { type: Date },

    /* Datos de Movimiento */
    registration_Date: { type: Date, default: Date.now },
});

module.exports = model('Host', hostSchema);