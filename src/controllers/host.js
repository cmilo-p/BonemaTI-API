'use strict'
const validator = require('validator');

const Host = require('../models/Host');

var controller = {

    save: (req, res) => {
        var params = req.body;

        /* Validación en campos Hardware y Software */
        try {
            var validate_code = !validator.isEmpty(params.code);
            var validate_tpDevice = !validator.isEmpty(params.tpDevice);
            var validate_name = !validator.isEmpty(params.name);

        } catch (error) {
            return res.status(400).send({
                status: 'Error',
                controller: 'Host',
                method: 'HostController.save',
                message: '¡Faltan datos por enviar!'
            });
        }

        if (validate_code && validate_tpDevice && validate_name) {

            var host = new Host();
            host.code = params.code;
            host.tpDevice = params.tpDevice;
            host.name = params.name;
            host.employee = params.employee
            host.serial = params.serial
            host.marca = params.marca
            host.modelo = params.modelo
            host.hardware = params.hardware;
            host.software = params.software;
            host.observation = params.observation;

            host.save((error, hostStored) => {

                if (error || !hostStored) {
                    return res.status(500).send({
                        status: 'Error',
                        controller: 'Host',
                        method: 'HostController.save',
                        message: '¡El host no se ha almacenado!',
                    });
                }

                return res.status(201).send({
                    status: 'success',
                    user: hostStored
                });
            });
        } else {
            /* Revisar # status */
            return res.status(200).send({
                status: 'Error',
                controller: 'Host',
                method: 'HostController.save',
                message: '¡Los datos no son válidos!'
            });
        }
    },

    getHosts: (req, res) => {
        var query = Host.find({});

        query.sort('_id').exec((error, hosts) => {

            if (error) {
                return res.status(500).send({
                    status: 'Error',
                    controller: 'Host',
                    method: 'HostController.getHosts',
                    message: '¡Los datos no son válidos!'
                });
            }

            if (!hosts) {
                return res.status(404).send({
                    status: 'Error',
                    controller: 'Host',
                    method: 'HostController.getHosts',
                    message: '¡No hay datos para mostrar!'
                });
            }

            return res.status(200).send({
                status: 'success',
                hosts
            });
        });
    },

    getHost: (req, res) => {
        var hostId = req.params.id;

        /* Revisar validación, cuando no existe el usuario, no funciona */
        if (!hostId || hostId == null) {
            return res.status(404).send({
                status: 'Error',
                controller: 'Host',
                method: 'HostController.getHost',
                message: '¡No existen datos para mostrar!'
            });
        }

        Host.findById(hostId, (error, host) => {

            /* Validación length causa error */
            if (error || host.length === 0) {
                return res.status(404).send({
                    status: 'Error',
                    controller: 'Host',
                    method: 'HostController.getHost',
                    message: '¡No existe el usuario en la base de datos!'
                });
            }

            return res.status(200).send({
                status: 'success',
                host
            });

        });
    },

    update: (req, res) => {
        var hostId = req.params.id;
        var params = req.body;

        try {
            var validate_code = !validator.isEmpty(params.code);
            var validate_tpDevice = !validator.isEmpty(params.tpDevice);
            var validate_name = !validator.isEmpty(params.name);

        } catch (error) {
            return res.status(400).send({
                status: 'Error',
                controller: 'Host',
                method: 'HostController.update',
                message: '¡Faltan datos por enviar!'
            });
        }

        if (validate_code && validate_tpDevice && validate_name) {

            Host.findOneAndUpdate({ _id: hostId }, params, { new: true }, (error, hostUpdate) => {
                if (error) {
                    return res.status(500).send({
                        status: 'Error',
                        controller: 'Host',
                        method: 'HostController.update',
                        message: '¡Error al actualizar!'
                    });
                }

                if (!hostUpdate) {
                    return res.status(404).send({
                        status: 'Error',
                        controller: 'Host',
                        method: 'HostController.update',
                        message: '¡No existe el host en la base de datos!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    hostUpdate
                });
            });
        }
    },

    delete: (req, res) => {
        var hostId = req.params.id;

        Host.findOneAndDelete({ _id: hostId }, (error, hostRemoved) => {
            if (error) {
                return re.status(500).send({
                    status: 'Error',
                    controller: 'Host',
                    method: 'HostController.delete',
                    message: '¡Error al eliminar el host!'
                });
            }

            if (!hostRemoved) {
                return res.status(404).send({
                    status: 'Error',
                    controller: 'Host',
                    method: 'HostController.delete',
                    message: '¡No se ha borrado el host, posiblemente no exista!'
                });
            }

            return res.status(200).send({
                status: 'success',
                hostRemoved
            });
        });
    },

    search: (req, res) => {
        var searchHost = req.params.search;

        Host.find({
            "$or": [
                { "code": { "$regex": searchHost, "$options": "i" } },
                { "tpDevice": { "$regex": searchHost, "$options": "i" } },
                { "name": { "$regex": searchHost, "$options": "i" } },
                { "employee": { "$regex": searchHost, "$options": "i" } },
                { "serial": { "$regex": searchHost, "$options": "i" } },
                { "marca": { "$regex": searchHost, "$options": "i" } },
                { "modelo": { "$regex": searchHost, "$options": "i" } }
                /* Busqueda para hardware y software implementar */
            ]
        })
            .sort([['registration_Date', 'descending']])
            .exec((error, hostData) => {

                if (error) {
                    console.log(error);
                    return res.status(500).send({
                        status: 'Error',
                        controller: 'Host',
                        method: 'HostController.search',
                        message: '¡Error en la petición!'
                    });
                }

                if (!hostData || hostData.length <= 0) {
                    return res.status(404).send({
                        status: 'Error',
                        controller: 'Host',
                        method: 'HostController.search',
                        message: '¡No hay usuarios que coincidan con tu búsqueda!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    hostData
                });
            })
    }
}

module.exports = controller;