"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllServices = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllServices = async () => {
    const services = await prisma.service.findMany();
    return { services };
};
exports.getAllServices = getAllServices;
//# sourceMappingURL=service.service.js.map