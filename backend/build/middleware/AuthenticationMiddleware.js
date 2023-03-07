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
exports.authenticaton = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const tokenGenerator_1 = require("../utils/tokenGenerator");
const authenticaton = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            errorMessage: "Please provide correct bearer token",
        });
    }
    else {
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                errorMessage: "Please provide authentication token",
            });
        }
        else {
            let id;
            jsonwebtoken_1.default.verify(token, tokenGenerator_1.accessTokenSecret, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        "errorMessage": err.message
                    });
                }
                else {
                    const jwtPayloadData = decoded;
                    id = jwtPayloadData.data.id;
                    const user = yield User_1.User.findById(id);
                    if (!user) {
                        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                            errorMessage: "You are not authorized to use this route",
                        });
                    }
                    else {
                        req.body["user"] = {
                            id: id,
                        };
                        next();
                    }
                }
            }));
        }
    }
});
exports.authenticaton = authenticaton;
