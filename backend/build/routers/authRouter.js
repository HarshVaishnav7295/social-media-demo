"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
const authController_1 = require("../controller/authController");
exports.router.route('/signup').post(authController_1.signupUser);
exports.router.route('/login').post(authController_1.loginUser);
