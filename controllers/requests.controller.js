const { response } = require('express');
const { prisma } = require('../database/config.db');

const requestsGet = async (req, res = response) => {
    const { page = 1, limit = 10, code, employeeId } = req.query;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    try {
        const filters = {
            state: true
        };

        if (code) {
            filters.code = {
                contains: code,
            };
        }

        if (employeeId) {
            filters.employeeId = parseInt(employeeId);
        }

        const [total, requests] = await Promise.all([
            prisma.request.count({ where: filters }),
            prisma.request.findMany({
                where: filters,
                skip,
                take
            })
        ]);

        res.json({
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            requests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred. Please try again.'
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
