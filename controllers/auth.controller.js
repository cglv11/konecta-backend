const { response } = require("express");
const bcryptjs = require("bcryptjs");

const { generateJWT } = require("../helpers/generate-jwt");
const { User } = require("../models");

const login = async (req, res = response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(400).json({
                msg: 'The username does not exist'
            });
        }

        if (!user.state) {
            return res.status(400).json({
                msg: 'The user is not exist'
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'The password is incorrect'
            });
        }

        // Generar el JWT
        const token = await generateJWT(user.id);

        res.json({ 
            user,
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            msg: 'Please contact the administrator'
        });
    }
}

const validateToken = async (req, res = response) => {
    const token = req.header('x-token');
    
    res.json({
        user: req.user,
        token: token,
    });
}

module.exports = {
    login,
    validateToken
}
