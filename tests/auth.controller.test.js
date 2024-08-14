const { login } = require('../controllers/auth.controller');
const { prisma } = require('./__mocks__/prisma');
const { generateJWT } = require('./__mocks__/generate-jwt');
const bcryptjs = require('bcryptjs');

jest.mock('../database/config.db', () => ({
    prisma: {
        employee: {
            findUnique: jest.fn(),
        }
    }
}));

jest.mock('../helpers/generate-jwt', () => ({
    generateJWT: jest.fn(),
}));

describe('Auth Controller - Login', () => {
    const mockRequest = (body) => ({ body });
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if user does not exist', async () => {
        prisma.employee.findUnique.mockResolvedValue(null);
        const req = mockRequest({ username: 'nonexistent', password: 'password' });
        const res = mockResponse();

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'The user does not exist' });
    });

    it('should return 400 if the password is incorrect', async () => {
        prisma.employee.findUnique.mockResolvedValue({ id: 1, username: 'test', password: 'hashed_password', state: true });
        bcryptjs.compareSync = jest.fn().mockReturnValue(false); // Password mismatch
        const req = mockRequest({ username: 'test', password: 'wrong_password' });
        const res = mockResponse();

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'The password is incorrect' });
    });

    it('should return the employee and token on successful login', async () => {
        prisma.employee.findUnique.mockResolvedValue({ id: 1, username: 'test', password: 'hashed_password', state: true });
        bcryptjs.compareSync = jest.fn().mockReturnValue(true); // Password matches
        generateJWT.mockResolvedValue('fake_token');
        const req = mockRequest({ username: 'test', password: 'password' });
        const res = mockResponse();

        await login(req, res);

        expect(res.json).toHaveBeenCalledWith({ 
            employee: { 
                id: 1, 
                username: 'test', 
                password: 'hashed_password', 
                state: true 
            }, 
            token: 'fake_token' 
        });
    });

    it('should return 500 on unexpected error', async () => {
        prisma.employee.findUnique.mockRejectedValue(new Error('Unexpected Error'));
        const req = mockRequest({ username: 'test', password: 'password' });
        const res = mockResponse();

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Please contact the administrator' });
    });
});
