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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.signupUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../models/User");
const tokenGenerator_1 = require("../utils/tokenGenerator");
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const {name,email,password,dob,gender,bio,avatar} = req.body as ISignupRequest
        const { name, email, password, dob, gender, bio, avatar } = req.body;
        if (!name || !email || !password || !dob) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errorMessage: "name,email,password,dob are required.",
            });
        }
        else {
            const userExists = yield User_1.User.findOne({
                email: email,
            });
            if (userExists) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    errorMessage: "Email is already in user,Try different one.",
                });
            }
            else {
                const user = yield User_1.User.create({
                    name: name,
                    email: email,
                    password: password,
                    dob: new Date(dob),
                    gender: gender,
                    bio: bio,
                    avatar: avatar,
                });
                const token = yield (0, tokenGenerator_1.generateToken)(user._id);
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        dob: user.dob,
                        gender: user.gender,
                        bio: user.bio,
                        avatar: user.avatar,
                        followings: user.followings,
                        followers: user.followers,
                        token: token,
                    },
                });
            }
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMessage: error,
        });
    }
});
exports.signupUser = signupUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { email, password } = req.body as ILoginRequest;
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errorMessage: "email,password are required.",
            });
        }
        else {
            const user = yield User_1.User.findOne({
                email: email,
            });
            if (!user) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    errorMessage: "No user with provided email.",
                });
            }
            else {
                const correctCredentials = yield user.comparePassword(password);
                if (correctCredentials) {
                    const token = yield (0, tokenGenerator_1.generateToken)(user._id);
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            dob: user.dob,
                            gender: user.gender,
                            bio: user.bio,
                            avatar: user.avatar,
                            followings: user.followings,
                            followers: user.followers,
                            token: token,
                        },
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                        errorMessage: "Invalid Credentials",
                    });
                }
            }
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMessage: error,
        });
    }
});
exports.loginUser = loginUser;
