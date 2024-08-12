const { response } = require('express');
const bcryptjs = require('bcryptjs');

const { prisma } = require("../database/config.db");
const { generateJWT } = require('../helpers');

const usersGet = async (req, res = response) => {
    try {
        const users = await prisma.user.findMany({
            where: { state: true }
        });
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
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
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
            msg: 'An unexpected error occurred. Please try again.'
        });
    }
};

const usersPost = async (req, res = response) => {
    const { password, username, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            return res.status(400).json({
                msg: `The username ${username} is already registered`,
            });
        }

        const salt = bcryptjs.genSaltSync();
        const hashedPassword = bcryptjs.hashSync(password, salt);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role,
                state: true
            }
        });

        const token = await generateJWT(newUser.id);

        res.status(201).json({
            user: newUser,
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
    let { username, password, role, ...rest } = req.body;

    try {
        if (username) {
            const userDBUsername = await prisma.user.findUnique({
                where: { username }
            });

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

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: rest
        });

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'An unexpected error occurred while updating the user. Please try again.'
        });
    }
};

const usersDelete = async (req, res = response) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { state: false }
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
