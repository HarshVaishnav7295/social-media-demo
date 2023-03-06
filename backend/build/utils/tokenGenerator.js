"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.accessTokenSecret = exports.refreshTokenSecret = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.refreshTokenSecret = 'tsnodeexpress@refresh@1234@1234';
exports.accessTokenSecret = 'tsnodeexpress@access@1234@1234';
const generateToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = jsonwebtoken_1.default.sign({ data: { id: id } }, exports.accessTokenSecret, { expiresIn: "120s" });
    const refreshToken = jsonwebtoken_1.default.sign({ data: { id: id } }, exports.refreshTokenSecret, { expiresIn: "3d" });
    return { accessToken, refreshToken };
});
exports.generateToken = generateToken;
