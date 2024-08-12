const { response } = require('express');
const bcryptjs = require('bcryptjs');

const { prisma } = require("../database/config.db");
const { generateJWT } = require('../helpers');

const employeesGet = async (req, res = response) => {
    try {
        const employees = await prisma.employee.findMany({
            where: { state: true }
        });
        const total = employees.length;
    
        res.json({
            total,
            employees
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred. Please try again.'
        });
    }
};

const employeeGet = async (req, res = response) => {
    const { id } = req.params;

    try {
        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(id) }
        });
        
        if (!employee) {
            return res.status(404).json({
                msg: 'Employee not found',
            });
        }

        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred. Please try again.'
        });
    }
};

const employeesPost = async (req, res = response) => {
    const { password, username, role, hireDate, name, salary } = req.body;

    try {
        const existingEmployee = await prisma.employee.findUnique({
            where: { username }
        });

        if (existingEmployee) {
            return res.status(400).json({
                msg: `The username ${username} is already registered`,
            });
        }

        const salt = bcryptjs.genSaltSync();
        const hashedPassword = bcryptjs.hashSync(password, salt);

        const newEmployee = await prisma.employee.create({
            data: {
                username,
                password: hashedPassword,
                role,
                hireDate: new Date(hireDate),
                name,
                salary,
                state: true
            }
        });

        const token = await generateJWT(newEmployee.id);

        res.status(201).json({
            employee: newEmployee,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred while registering the employee. Please try again.'
        });
    }
};

const employeesPut = async (req, res = response) => {
    const { id } = req.params;
    let { username, password, role, hireDate, name, salary, ...rest } = req.body;

    try {
        if (username) {
            const employeeDBUsername = await prisma.employee.findUnique({
                where: { username }
            });

            if (employeeDBUsername && employeeDBUsername.id !== parseInt(id)) {
                return res.status(400).json({
                    msg: `The username ${employeeDBUsername.username} is already in use`,
                });
            } else {
                rest.username = username;
            }
        }

        if (password) {
            const salt = bcryptjs.genSaltSync();
            rest.password = bcryptjs.hashSync(password, salt);
        }

        const existingEmployee = await prisma.employee.findUnique({
            where: { id: parseInt(id) }
        });

        if (hireDate) {
            rest.hireDate = new Date(hireDate);
        } else {
            rest.hireDate = existingEmployee.hireDate;
        }

        if (name) {
            rest.name = name;
        } else {
            rest.name = existingEmployee.name;
        }

        if (salary) {
            rest.salary = salary;
        } else {
            rest.salary = existingEmployee.salary;
        }

        const updatedEmployee = await prisma.employee.update({
            where: { id: parseInt(id) },
            data: rest
        });

        res.json(updatedEmployee);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred while updating the employee. Please try again.'
        });
    }
};


const employeesDelete = async (req, res = response) => {
    const { id } = req.params;

    try {
        const employee = await prisma.employee.update({
            where: { id: parseInt(id) },
            data: { state: false }
        });

        const employeeAuthenticated = req.user;

        res.json({
            msg: 'Employee has been deleted',
            employee,
            employeeAuthenticated
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred while deleting the employee. Please try again.'
        });
    }
};

module.exports = {
    employeeGet,
    employeesGet,
    employeesPut,
    employeesPost,
    employeesDelete
}
