const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const { prisma } = require("../database/config.db");

const validateJWT = async (req = request, res = response, next) => {
    const authorizationHeader = req.header('Authorization');

    if (!authorizationHeader) {
        return res.status(401).json({
            msg: 'No token provided'
        });
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            msg: 'Invalid token format'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const employee = await prisma.employee.findUnique({
            where: { id: uid }
        });

        if (!employee || !employee.state) {
            return res.status(401).json({
                msg: 'Invalid token - employee does not exist in DB'
            });
        }

        req.employee = employee;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Invalid token'
        });
    }
};

module.exports = {
    validateJWT
};
