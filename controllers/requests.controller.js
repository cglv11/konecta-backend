const { response } = require('express');

const requestsGet = async (req, res = response) => {
    try {
        const requests = await Request.findMany({ where: { state: true } });
        const total = requests.length;

        res.json({
            total,
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
        const request = await Request.findOne({ where: { id, state: true } });

        if (!request) {
            return res.status(404).json({
                msg: 'Request not found',
            });
        }

        res.json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred. Please try again.'
        });
    }
};

const requestsPost = async (req, res = response) => {
    const { code, description, summary, employeeId } = req.body;

    try {
        const newRequest = {
            code,
            description,
            summary,
            employeeId,
            state: true
        };

        const request = await Request.insert(newRequest);

        res.status(201).json({
            request
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred while creating the request. Please try again.'
        });
    }
};

const requestsDelete = async (req, res = response) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            msg: 'You do not have permission to perform this action',
        });
    }

    try {
        const request = await Request.update({
            where: { id },
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
            msg: 'An unexpected error occurred while deleting the request. Please try again.'
        });
    }
};

module.exports = {
    requestGet,
    requestsGet,
    requestsPost,
    requestsDelete
};
