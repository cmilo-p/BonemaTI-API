'use strict'
const validator = require('validator');

const Employee = require('../models/Employee');

var controller = {

    save: (req, res) => {
        var params = req.body;

        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_email = !validator.isEmpty(params.email);
            var validate_occupation = !validator.isEmpty(params.occupation);

        } catch (error) {
            return res.status(400).send({
                status: 'Error',
                controller: 'Employee',
                method: 'EmployeeController.save',
                message: '¡Faltan datos por enviar!'
            });
        }

        if (validate_name && validate_email && validate_occupation) {

            var employee = new Employee();

            employee.name = params.name;
            employee.email = params.email;
            employee.occupation = params.occupation;
            employee.phoneNumber = params.phoneNumber;
            employee.extension = params.extension;

            employee.save((error, employeeStored) => {

                if (error || !employeeStored) {
                    return res.status(500).send({
                        status: 'Error',
                        controller: 'Employee',
                        method: 'EmployeeController.save',
                        message: '¡El empleado no se ha almacenado!'
                    });
                }

                return res.status(201).send({
                    status: 'success',
                    employee: employeeStored
                });

            });

        } else {
            return res.status(400).send({
                status: 'Error',
                controller: 'Employee',
                method: 'EmployeeController.save',
                message: '¡Los datos no son válidos!'
            });
        }
    },

    getEmployees: (req, res) => {
        var query = Employee.find({});

        query.sort("-_id").exec((error, employees) => {

            if (error) {
                return res.status(500).send({
                    status: 'Error',
                    controller: 'Employee',
                    method: 'EmployeeController.getEmployees',
                    message: '¡Los datos no son válidos!'
                });
            }

            if (!employees) {
                return res.status(404).send({
                    status: 'Error',
                    controller: 'Employee',
                    method: 'EmployeeController.getEmployees',
                    message: '¡No hay datos para mostrar!'
                });
            }

            return res.status(200).send({
                status: 'success',
                employees
            });
        });
    },

    /* Revisar validación, cuando no existe el usuario, no funciona */
    getEmployee: (req, res) => {
        var employeeId = req.params.id

        if (!employeeId || employeeId == null) {
            return res.status(404).send({
                status: 'Error',
                controller: 'Employee',
                method: 'EmployeeController.getEmployee',
                message: '¡No existen datos para mostrar!'
            });
        }

        Employee.findById(employeeId, (error, employee) => {

            /* Validación length causa error */
            if (error || employee.length === 0) {

                return res.status(404).send({
                    status: 'Error',
                    controller: 'Employee',
                    method: 'EmployeeController.getEmployee',
                    message: '¡No existe el usuario en la base de datos!'
                });
            }

            return res.status(200).send({
                status: 'success',
                employee
            });
        });
    },

    update: (req, res) => {
        var userId = req.params.id;
        var params = req.body;

        try {
            var validator_name = !validator.isEmpty(params.name);
            var validator_email = !validator.isEmpty(params.email);
            var validator_occupation = !validator.isEmpty(params.occupation);
        } catch (error) {
            return res.status(500).send({
                status: 'Error',
                controller: 'Employee',
                method: 'EmployeeController.update',
                message: '¡Faltan datos por enviar!'
            });
        }

        if (validator_name && validator_email && validator_occupation) {

            Employee.findOneAndUpdate({ _id: userId }, params, { new: true }, (error, employeeUpdate) => {
                if (error) {
                    return res.status(500).send({
                        status: 'Error',
                        controller: 'Employee',
                        method: 'EmployeeController.update',
                        message: '¡Error al actualizar!'
                    });
                }

                if (!employeeUpdate) {
                    return res.status(404).send({
                        status: 'Error',
                        controller: 'Employee',
                        method: 'EmployeeController.update',
                        message: '¡No existe el empleado en la base de datos!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    employeeUpdate
                })
            });
        }
    },

    delete: (req, res) => {

        var employeeId = req.params.id;

        Employee.findByIdAndDelete({ _id: employeeId }, (error, employeeRemoved) => {
            if (error) {
                return res.status(500).send({
                    status: 'Error',
                    controller: 'Employee',
                    method: 'EmployeeController.delete',
                    message: '¡Error al eliminar el empleado!'
                });
            }

            if (!employeeRemoved) {
                return res.status(404).send({
                    status: 'Error',
                    controller: 'Employee',
                    method: 'EmployeeController.delete',
                    message: '¡No se ha borrado el usuario, posiblemente no exista!'
                });
            }

            return res.status(200).send({
                status: 'success',
                employeeRemoved
            });

        });
    },

    search: (req, res) => {
        var searchDeleted = req.params.search;

        Employee.find({
            "$or": [
                { "name": { "$regex": searchDeleted, "$options": "i" } },
                { "email": { "$regex": searchDeleted, "$options": "i" } },
                { "occupation": { "$regex": searchDeleted, "$options": "i" } },
                { "phoneNumber": { "$regex": searchDeleted, "$options": "i" } },
                { "extension": { "$regex": searchDeleted, "$options": "i" } }
            ]
        })
            .sort([['registration_Date', 'descending']])
            .exec((error, employeeData) => {

                if (error) {
                    console.log(error);
                    return res.status(500).send({
                        status: 'Error',
                        controller: 'Employee',
                        method: 'EmployeeController.search',
                        message: '¡Error en la petición!'
                    });
                }

                if (!employeeData || employeeData.length <= 0) {
                    return res.status(404).send({
                        status: 'Error',
                        controller: 'Employee',
                        method: 'EmployeeController.search',
                        message: '¡No hay empleados que coincidan con tu búsqueda!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    employeeData
                });
            });
    }

}//End Controller

module.exports = controller