const { employeesGet } = require('../controllers/employees.controller');
const { prisma } = require('./__mocks__/prisma');

jest.mock('../database/config.db', () => ({
    prisma: {
        employee: {
            count: jest.fn(),
            findMany: jest.fn(),
        }
    }
}));

describe('Employees Controller - Get Employees', () => {
    const mockRequest = (query) => ({ query });
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of employees and total count', async () => {
        prisma.employee.count.mockResolvedValue(2);
        prisma.employee.findMany.mockResolvedValue([{ id: 1, username: 'test1' }, { id: 2, username: 'test2' }]);

        const req = mockRequest({ page: '1', limit: '10' });
        const res = mockResponse();

        await employeesGet(req, res);

        expect(res.json).toHaveBeenCalledWith({
            total: 2,
            page: 1,
            totalPages: 1,
            employees: [{ id: 1, username: 'test1' }, { id: 2, username: 'test2' }]
        });
    });

    it('should handle errors and return 500 status', async () => {
        prisma.employee.count.mockRejectedValue(new Error('Unexpected Error'));
        const req = mockRequest({ page: '1', limit: '10' });
        const res = mockResponse();

        await employeesGet(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'An unexpected error. Please try again.' });
    });
});
