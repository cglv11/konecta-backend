const { response } = require('express')

const isAdminRole = (req, res = response, next) => {

    if (!req.employee) {
        return res.status(500).json({
            msg: 'Token must be verified before validating the role'
        });
    }

    const { role } = req.employee;

    if (role !== 'ADMIN') {
        return res.status(401).json({
            msg: 'Access denied - employee is not an administrator'
        });
    }

    next();
};

module.exports = {
    isAdminRole,
}