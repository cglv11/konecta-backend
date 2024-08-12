const { response } = require('express');
const bcryptjs = require('bcryptjs')

const { User } = require('../models');
const { generateJWT } = require('../helpers');

const usersGet = async (req, res = response) => {
    try {
        const users = await User.findMany({ where: { state: true } });
        const total = users.length;
    
        res.json({
            total,
            users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred. Please try again.'
        });
    }
};


const userGet = async (req, res = response) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ where: { id } });
        
        if (!user) {
            return res.status(404).json({
                msg: 'User not found',
            });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred. Please try again.'
        });
    }
};

const usersPost = async (req, res = response) => {
    const { name, password, username, role } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            msg: 'You do not have permission to perform this action',
        });
    }

    try {
        const username = await User.findOne({ where: { username, state: true } });
        if (username) {
            return res.status(400).json({
                msg: `The username ${username} is already registered`,
            });
        }

        const salt = bcryptjs.genSaltSync();
        const hashedPassword = bcryptjs.hashSync(password, salt);

        const newUser = {
            name,
            password: hashedPassword,
            username,
            role,
            state: true
        };

        const user = await User.insert(newUser);

        // Generar JWT
        const token = await generateJWT(user.id);

        res.status(202).json({
            user,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred while registering the user. Please try again.'
        });
    }
};

const usersPut = async (req, res = response) => {
    const { id } = req.params;
    let { _id, username, password, role, ...rest } = req.body;

    try {
        if (username) {
            const userDBUsername = await User.findOne({ where: { username, state: true } });

            if (userDBUsername && userDBUsername.id !== parseInt(id)) {
                return res.status(400).json({
                    msg: `The username ${userDBUsername.username} is already in use`,
                });
            } else {
                rest.username = username;
            }
        }

        if (password) {
            const salt = bcryptjs.genSaltSync();
            rest.password = bcryptjs.hashSync(password, salt);
        }

        if (role && req.user.role !== 'admin') {
            return res.status(403).json({
                msg: 'You do not have permission to change the user\'s role',
            });
        }

        rest.role = role;

        const user = await User.update({
            where: { id },
            data: rest,
        });

        if (!user) {
            return res.status(404).json({
                msg: 'User not found',
            });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred while updating the user. Please try again.'
        });
    }
};

const usersDelete = async (req, res = response) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            msg: 'You do not have permission to perform this action',
        });
    }

    try {
        const user = await User.update({
            where: { id },
            data: { state: false },
        });

        const userAuthenticated = req.user;

        res.json({
            msg: 'User has been deleted',
            user,
            userAuthenticated
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred while deleting the user. Please try again.'
        });
    }
};


module.exports = {
    userGet,
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}
