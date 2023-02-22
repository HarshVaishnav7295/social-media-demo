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
//import { accessTokenSecretKey,refreshTokenSecretKey } from "../utils/tokenGenerator";
const tokenGenerator_1 = require("../utils/tokenGenerator");
const authenticaton = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            "errorMessage": "Please provide correct bearer token"
        });
    }
    else {
        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                "errorMessage": "Please provide authentication token"
            });
        }
        else {
            const { data: { id: id } } = jsonwebtoken_1.default.verify(token, tokenGenerator_1.PK);
            const user = yield User_1.User.findById(id);
            if (!user) {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    "errorMessage": "You are not authorized to use this route"
                });
            }
            else {
                req.body['user'] = {
                    id: id
                };
                next();
            }
            /*
            let dataPayload
            jwt.verify(token,accessTokenSecretKey,async function(error,payload){
                if(error){
                    if(error.message === 'jwt expired'){
                        res.status(StatusCodes.BAD_REQUEST).json({
                            "errorMessage":"Jwt is expired"
                        })
                    }else{
                        res.status(StatusCodes.BAD_REQUEST).json({
                            "errorMessage":error.message
                        })
                    }
                }else{
                    dataPayload = payload
                    const id = dataPayload.data.id
                    const user = await User.findById(id)
                    if(!user){
                        res.status(StatusCodes.UNAUTHORIZED).json({
                            "errorMessage":"You are not authorized to use this route"
                        })
                    }
                    else{
                        req.body['user'] = {
                            id : id
                        }
                        next()
                    }
                }
            })*/
        }
    }
});
exports.authenticaton = authenticaton;