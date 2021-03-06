'use strict'
const validator = require('validator');

const User = require('../models/User');

var controller = {

    save: (req, res) => {
        var params = req.body;

        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_email = !validator.isEmpty(params.email);
            var validate_username = !validator.isEmpty(params.username);
            var validate_password = !validator.isEmpty(params.password);
            var validate_role = !validator.isEmpty(params.role);

        } catch (error) {
            return res.status(400).send({
                status: 'Error',
                controller: 'User',
                method: 'UserController.save',
                message: '¡Faltan datos por enviar!'
            });
        }

        if (validate_name && validate_email && validate_username && validate_password && validate_role) {

            var user = new User();
            user.name = params.name;
            user.email = params.email;
            user.username = params.username;
            user.password = params.password;
            user.role = params.role;

            user.save((error, userStored) => {

                if (error || !userStored) {
                    return res.status(500).send({
                        status: 'Error',
                        controller: 'User',
                        method: 'UserController.save',
                        message: '¡El usuario no se ha almacenado!'
                    });
                }

                return res.status(201).send({
                    status: 'success',
                    user: userStored
                });

            });
        } else {
            /* Revisar # status */
            return res.status(200).send({
                status: 'Error',
                controller: 'User',
                method: 'UserController.save',
                message: '¡Los datos no son válidos!'
            });
        }
    },

    getUsers: (req, res) => {
        var query = User.find({});

        query.sort('_id').exec((error, users) => {

            if (error) {
                return res.status(500).send({
                    status: 'Error',
                    controller: 'User',
                    method: 'UserController.getUsers',
                    message: '¡Los datos no son válidos!'
                });
            }

            if (!users) {
                return res.status(404).send({
                    status: 'Error',
                    controller: 'User',
                    method: 'UserController.getUsers',
                    message: '¡No hay datos para mostrar!'
                });
            }

            return res.status(200).send({
                status: 'success',
                users
            });
        });
    },

    getUser: (req, res) => {
        var userId = req.params.id;

        /* Revisar validación, cuando no existe el usuario, no funciona */
        if (!userId || userId == null) {
            return res.status(404).send({
                status: 'Error',
                controller: 'User',
                method: 'UserController.getUser',
                message: '¡No existen datos para mostrar!'
            });
        }

        User.findById(userId, (error, user) => {

            /* Validación length causa error */
            if (error || user.length === 0) {
                return res.status(404).send({
                    status: 'Error',
                    controller: 'User',
                    method: 'UserController.getUser',
                    message: '¡No existe el usuario en la base de datos!'
                });
            }

            return res.status(200).send({
                status: 'success',
                user
            });
        });
    },

    update: (req, res) => {
        var userId = req.params.id;
        var params = req.body;

        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_email = !validator.isEmpty(params.email);
            var validate_username = !validator.isEmpty(params.username);
            var validate_password = !validator.isEmpty(params.password);
            var validate_role = !validator.isEmpty(params.role);

        } catch (error) {
            return res.status(400).send({
                status: 'Error',
                controller: 'User',
                method: 'UserController.update',
                message: '¡Faltan datos por enviar!'
            });
        }

        if (validate_name && validate_email && validate_username && validate_password && validate_role) {

            User.findOneAndUpdate({ _id: userId }, params, { new: true }, (error, userUpdate) => {
                if (error) {
                    return res.status(500).send({
                        status: 'Error',
                        controller: 'User',
                        method: 'UserController.update',
                        message: '¡Error al actualizar!'
                    });
                }

                if (!userUpdate) {
                    return res.status(404).send({
                        status: 'Error',
                        controller: 'User',
                        method: 'UserController.update',
                        message: '¡No existe el usuario en la base de datos!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    userUpdate
                });
            });
        }
    },

    delete: (req, res) => {
        var userId = req.params.id;

        User.findOneAndDelete({ _id: userId }, (error, userRemoved) => {
            if (error) {
                return res.status(500).send({
                    status: 'Error',
                    controller: 'User',
                    method: 'UserController.delete',
                    message: '¡Error al eliminar el usuario!'
                });
            }

            if (!userRemoved) {
                return res.status(404).send({
                    status: 'Error',
                    controller: 'User',
                    method: 'UserController.delete',
                    message: '¡No se ha borrado el usuario, posiblemente no exista!'
                });
            }

            return res.status(200).send({
                status: 'success',
                userRemoved
            });
        });
    },

    search: (req, res) => {
        var searchUser = req.params.search;

        User.find({
            "$or": [
                { "name": { "$regex": searchUser, "$options": "i" } },
                { "email": { "$regex": searchUser, "$options": "i" } },
                { "username": { "$regex": searchUser, "$options": "i" } },
                { "role": { "$regex": searchUser } }
            ]
        })
            .sort([['registration_Date', 'descending']])
            .exec((error, userData) => {

                if (error) {
                    console.log(error);
                    return res.status(500).send({
                        status: 'Error',
                        controller: 'User',
                        method: 'UserController.search',
                        message: '¡Error en la petición!'
                    });
                }

                if (!userData || userData.length <= 0) {
                    return res.status(404).send({
                        status: 'Error',
                        controller: 'User',
                        method: 'UserController.search',
                        message: '¡No hay usuarios que coincidan con tu búsqueda!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    userData
                });
            })
    },

    signIn: (req, res) => {
        var params = req.body;

        try {
            var validate_username = !validator.isEmpty(params.username);
            var validate_password = !validator.isEmpty(params.password);

        } catch (error) {
            return res.status(400).send({
                status: 'Error',
                controller: 'User',
                method: 'UserController.signIn',
                message: '¡Faltan datos por enviar!'
            });
        }

        if (validate_username && validate_password) {

            var user = new User();

            user.username = params.username;
            user.password = params.password;

            User.findOne({ username: user.username }, (error, userdata) => {

                if (error) {
                    return res.status(500).send({
                        status: 'Error',
                        controller: 'User',
                        method: 'UserController.signIn',
                        message: '¡Error en la petición!'
                    });
                }

                if (!userdata || userdata == null) {
                    return res.status(404).send({
                        status: 'Error',
                        controller: 'User',
                        method: 'UserController.signIn',
                        message: '¡No existe el usuario en la base de datos!'
                    });
                }

                if (user.password != userdata.password) {
                    return res.status(404).send({
                        status: 'Error',
                        controller: 'User',
                        method: 'UserController.signIn',
                        message: '¡La contraseña es incorrecta!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    userdata
                });
            });

        } else {
            /* Revisar # status */
            return res.status(400).send({
                status: 'Error',
                controller: 'User',
                method: 'UserController.signIn',
                message: '¡Los datos no son válidos!'
            });
        }
    }
}

module.exports = controller