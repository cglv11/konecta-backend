const { response } = require('express');

const employeesGet = async (req, res = response) => {
    if (req.user.role !== 'employee' && req.user.role !== 'admin') {
        return res.status(403).json({
            msg: 'You do not have permission to perform this action',
        });
    }

    try {
        const employees = await Employee.findMany({ where: { state: true } });
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

    if (req.user.role !== 'employee' && req.user.role !== 'admin') {
        return res.status(403).json({
            msg: 'You do not have permission to perform this action',
        });
    }

    try {
        const employee = await Employee.findOne({ where: { id, state: true } });

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
    const { hireDate, name, salary, userId } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            msg: 'You do not have permission to perform this action',
        });
    }

    try {
        const newEmployee = {
            hireDate,
            name,
            salary,
            userId,
            state: true
        };

        const employee = await Employee.insert(newEmployee);

        res.status(201).json({
            employee
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred while creating the employee. Please try again.'
        });
    }
};

module.exports = {
    employeesGet,
    employeeGet,
    employeesPost
};
