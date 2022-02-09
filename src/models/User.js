'use strict'
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    state: { type: Boolean, default: true },

    /* Datos de Movimiento */
    registration_Date: { type: Date, default: Date.now }
});
    
module.exports = model('User', userSchema);