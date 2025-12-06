"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactRequest = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createContactRequest = async (data) => {
    const contactRequest = await prisma.contactRequest.create({
        data,
    });
    return { contactRequestId: contactRequest.id };
};
exports.createContactRequest = createContactRequest;
//# sourceMappingURL=contact.service.js.map