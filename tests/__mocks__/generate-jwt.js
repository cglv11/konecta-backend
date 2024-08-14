const generateJWT = jest.fn().mockResolvedValue("fake-jwt-token");

module.exports = { generateJWT };