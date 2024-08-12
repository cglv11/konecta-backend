const { prisma } = require('../database/config.db'); // Asegúrate de que Prisma esté importado correctamente

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
