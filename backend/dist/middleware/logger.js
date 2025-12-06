"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganMiddleware = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("../config/env");
exports.logger = winston_1.default.createLogger({
    level: env_1.config.nodeEnv === 'production' ? 'info' : 'debug',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
        }),
    ],
});
exports.morganMiddleware = (0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
        write: (message) => exports.logger.http(message.trim()),
    },
});
//# sourceMappingURL=logger.js.map