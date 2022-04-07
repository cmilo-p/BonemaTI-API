'use strict'
const validator = require('validator');

const Appointment = require('../models/Appointment');

var controller = {

    save: (req, res) => {
        var params = req.body;

        try {
            var validate_date_appointment = !validator.isEmpty(params.date_appointment);
            var validate_tpMaintenance = !validator.isEmpty(params.tpMaintenance);
            var validate_host = !validator.isEmpty(params.host);
            var validate_employee = !validator.isEmpty(params.employee);
            var validate_support_tec = !validator.isEmpty(params.support_tec);

        } catch (error) {
            return res.status(400).send({
                status: 'Error',
                controller: 'Appointment',
                method: 'AppointmentController.save',
                message: '¡Faltan datos por enviar!'
            });
        }

        if (validate_date_appointment && validate_tpMaintenance && validate_host && validate_employee && validate_support_tec) {

            var appointment = new Appointment();
            appointment.date_appointment = params.date_appointment;
            appointment.tpMaintenance = params.tpMaintenance;
            appointment.host = params.host;
            appointment.employee = params.employee;
            appointment.support_tec = params.support_tec;
            /* Faltan parametros del modelo */

            appointment.save((error, appointmentStored) => {

                if (error || !appointmentStored) {
                    return res.status(500).send({
                        status: 'Error',
                        controller: 'Appointment',
                        method: 'AppointmentController.save',
                        message: '¡El Appointment no se almaceno!'
                    });
                }

                return res.status(201).send({
                    status: 'success',
                    appointment: appointmentStored
                });

            });
        } else {
            /* Revisar # status */
            return res.status(200).send({
                status: 'Error',
                controller: 'Appointment',
                method: 'AppointmentController.save',
                message: '¡Los datos no son válidos!'
            });
        }
    },

    getAppointments: (req, res) => {
        var query = Appointment.find({});

        query.sort('-_id').exec((error, appointments) => {

            if (error) {
                return res.status(500).send({
                    status: 'Error',
                    controller: 'Appointment',
                    method: 'AppointmentController.getAppointments',
                    message: '¡Los datos no son válidos!'
                });
            }

            if (!appointments) {
                return res.status(404).send({
                    status: 'Error',
                    controller: 'Appointment',
                    method: 'AppointmentController.getAppointments',
                    message: '¡No hay datos para mostrar!'
                });
            }

            return res.status(200).send({
                status: 'success',
                appointments
            });
        });
    },

    getAppointment: (req, res) => {
        var appointmentId = req.params.id;

        /* Revisar validación, cuando no existe el usuario, no funciona */
        if (!appointmentId || appointmentId == null) {
            return res.status(404).send({
                status: 'Error',
                controller: 'Appointment',
                method: 'AppointmentController.getAppointment',
                message: '¡No existen datos para mostrar!'
            });
        }

        Appointment.findById(appointmentId, (error, appointment) => {

            /* Validación length causa error */
            if (error || appointment.length === 0) {
                return res.status(404).send({
                    status: 'Error',
                    controller: 'Appointment',
                    method: 'AppointmentController.getAppointment',
                    message: '¡No existe el registro en la base de datos!'
                });
            }

            return res.status(200).send({
                status: 'success',
                appointment
            });
        });
    },

    update: (req, res) => {
        var appointmentId = req.params.id;
        var params = req.body;

        try {
            var validate_date_appointment = !validator.isEmpty(params.date_appointment);
            var validate_tpMaintenance = !validator.isEmpty(params.tpMaintenance);
            var validate_host = !validator.isEmpty(params.host);
            var validate_employee = !validator.isEmpty(params.employee);
            var validate_support_tec = !validator.isEmpty(params.support_tec);

        } catch (error) {
            return res.status(400).send({
                status: 'Error',
                controller: 'Appointment',
                method: 'AppointmentController.update',
                message: '¡Faltan datos por enviar!'
            });
        }

        if (validate_date_appointment && validate_tpMaintenance && validate_host && validate_employee && validate_support_tec) {

            Appointment.findOneAndUpdate({ _id: appointmentId }, params, { new: true }, (error, appointmentUpdate) => {
                if (error) {
                    return res.status(500).send({
                        status: 'Error',
                        controller: 'Appointment',
                        method: 'AppointmentController.update',
                        message: '¡Error al actualizar!'
                    });
                }

                if (!appointmentUpdate) {
                    return res.status(404).send({
                        status: 'Error',
                        controller: 'Appointment',
                        method: 'AppointmentController.update',
                        message: '¡No existe el appointment en la base de datos!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    appointmentUpdate
                });
            });
        }
    },

    delete: (req, res) => {
        var appointmentId = req.params.id;

        Appointment.findOneAndDelete({ _id: appointmentId }, (error, appointmentRemoved) => {
            if (error) {
                return res.status(500).send({
                    status: 'Error',
                    controller: 'Appointment',
                    method: 'AppointmentController.delete',
                    message: '¡Error al eliminar el Appointment!'
                });
            }

            if (!appointmentRemoved) {
                return res.status(404).send({
                    status: 'Error',
                    controller: 'Appointment',
                    method: 'AppointmentController.delete',
                    message: '¡No se ha borrado el Appointment, posiblemente no este agendado!'
                });
            }

            return res.status(200).send({
                status: 'success',
                appointmentRemoved
            });
        });
    },

    search: (req, res) => {
        var searchAppointment = req.params.search;

        Appointment.find({
            "$or": [
                /* Filtro fehcas Mongo */
                { "tpMaintenance": { "$regex": searchAppointment, "$options": "i" } },
                { "host": { "$regex": searchAppointment, "$options": "i" } },
                { "employee": { "$regex": searchAppointment, "$options": "i" } },
                { "support_tec": { "$regex": searchAppointment, "$options": "i" } }
            ]
        })
            .sort([['registration_Date', 'descending']])
            .exec((error, appointmentData) => {

                if (error) {
                    console.log(error);
                    return res.status(500).send({
                        status: 'error',
                        controller: 'appointment',
                        message: '¡Error en la petición!'
                    });
                }

                if (!appointmentData || appointmentData.length <= 0) {
                    return res.status(404).send({
                        status: 'Error',
                        controller: 'Appointment',
                        method: 'AppointmentController.search',
                        message: '¡No hay datos que coincidan con tu búsqueda!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    appointmentData
                });
            })
    }
}

module.exports = controller