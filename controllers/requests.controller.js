const { response } = require('express');
const { prisma } = require('../database/config.db');

const requestsGet = async (req, res = response) => {
    try {
        const requests = await prisma.request.findMany({ where: { state: true } });
        const total = requests.length;

        res.json({
            total,
            requests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error. Please try again.'
        });
    }
};

const requestGet = async (req, res = response) => {
    const { id } = req.params;

    try {
        const request = await prisma.request.findUnique({
            where: { id: parseInt(id), state: true }
        });

        if (!request) {
            return res.status(404).json({
                msg: 'Request not found',
            });
        }

        res.json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error. Please try again.'
        });
    }
};

const requestsPost = async (req, res = response) => {
    const { code, description, summary, employeeId } = req.body;

    try {
        const existingRequest = await prisma.request.findUnique({
            where: { code }
        });

        if (existingRequest) {
            return res.status(400).json({
                msg: 'The code is already in use.'
            });
        }

        const request = await prisma.request.create({
            data: {
                code,
                description,
                summary,
                employeeId: parseInt(employeeId),
                state: true
            }
        });

        res.status(201).json({
            request
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred. Please try again.'
        });
    }
};

const requestsDelete = async (req, res = response) => {
    const { id } = req.params;

    try {
        const request = await prisma.request.update({
            where: { id: parseInt(id) },
            data: { state: false },
        });

        if (!request) {
            return res.status(404).json({
                msg: 'Request not found',
            });
        }

        res.json({
            msg: 'Request has been deleted',
            request
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error. Please try again.'
        });
    }
};

module.exports = {
    requestGet,
    requestsGet,
    requestsPost,
    requestsDelete
};
