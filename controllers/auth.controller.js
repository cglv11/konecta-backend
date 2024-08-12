const { response } = require("express");
const bcryptjs = require("bcryptjs");

const { generateJWT } = require("../helpers/generate-jwt");
const { prisma } = require("../database/config.db");

const login = async (req, res = response) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user || !user.state) {
            return res.status(400).json({
                msg: 'The user does not exist'
            });
        }        

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'The password is incorrect'
            });
        }

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
};

module.exports = {
    login
};
