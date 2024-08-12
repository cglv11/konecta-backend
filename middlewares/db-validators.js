const { prisma } = require('../database/config.db');

const existEmployeeById = async (id) => {
    const employeeId = parseInt(id);

    const employee = await prisma.employee.findUnique({
        where: { id: employeeId }
    });

    if (!employee) {
        throw new Error(`The ID: ${ id } does not exist`);
    }
}

module.exports = {
    existEmployeeById
}
