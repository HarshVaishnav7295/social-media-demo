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
exports.getNewAccessToken = exports.forgotPassword = exports.checkProtectedRoute = exports.loginUser = exports.signupUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../models/User");
const tokenGenerator_1 = require("../utils/tokenGenerator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, dob, gender, bio, avatar } = req.body;
        if (!name || !email || !password || !dob) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                "errorMessage": "name,email,password,dob are required."
            });
        }
        else {
            const userExists = yield User_1.User.findOne({
                email: email
            });
            if (userExists) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    "errorMessage": "Email is already in user,Try different one."
                });
            }
            else {
                const userWithoutToken = yield User_1.User.create({
                    name: name,
                    email: email,
                    password: password,
                    dob: new Date(dob),
                    gender: gender,
                    bio: bio,
                    avatar: avatar
                });
                const { accessToken, refreshToken } = yield (0, tokenGenerator_1.generateToken)(userWithoutToken._id);
                const user = yield User_1.User.findByIdAndUpdate(userWithoutToken._id, {
                    refreshToken: refreshToken
                });
                //const token = await generateToken(user._id)
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    user: {
                        _id: user === null || user === void 0 ? void 0 : user._id,
                        name: user === null || user === void 0 ? void 0 : user.name,
                        email: user === null || user === void 0 ? void 0 : user.email,
                        dob: user === null || user === void 0 ? void 0 : user.dob,
                        gender: user === null || user === void 0 ? void 0 : user.gender,
                        bio: user === null || user === void 0 ? void 0 : user.bio,
                        avatar: user === null || user === void 0 ? void 0 : user.avatar,
                        followings: user === null || user === void 0 ? void 0 : user.followings,
                        followers: user === null || user === void 0 ? void 0 : user.followers,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                });
            }
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage": error
        });
    }
});
exports.signupUser = signupUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                "errorMessage": "email,password are required."
            });
        }
        else {
            const userWithoutToken = yield User_1.User.findOne({
                email: email
            });
            if (!userWithoutToken) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    "errorMessage": "No user with provided email."
                });
            }
            else {
                const correctCredentials = yield userWithoutToken.comparePassword(password);
                if (correctCredentials) {
                    const { accessToken, refreshToken } = yield (0, tokenGenerator_1.generateToken)(userWithoutToken._id);
                    const user = yield User_1.User.findByIdAndUpdate(userWithoutToken._id, {
                        refreshToken: refreshToken
                    });
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        user: {
                            _id: user === null || user === void 0 ? void 0 : user._id,
                            name: user === null || user === void 0 ? void 0 : user.name,
                            email: user === null || user === void 0 ? void 0 : user.email,
                            dob: user === null || user === void 0 ? void 0 : user.dob,
                            gender: user === null || user === void 0 ? void 0 : user.gender,
                            bio: user === null || user === void 0 ? void 0 : user.bio,
                            avatar: user === null || user === void 0 ? void 0 : user.avatar,
                            followings: user === null || user === void 0 ? void 0 : user.followings,
                            followers: user === null || user === void 0 ? void 0 : user.followers,
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        }
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                        "errorMessage": "Invalid Credentials"
                    });
                }
            }
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage": error
        });
    }
});
exports.loginUser = loginUser;
const checkProtectedRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json({
        "message": "Protected route"
    });
});
exports.checkProtectedRoute = checkProtectedRoute;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        let transporter = nodemailer_1.default.createTransport({
            host: "ram21636519@gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: 'ram21636519@gmail.com',
                pass: 'nodemailer@123@pass', // generated ethereal password
            },
        });
        let mailOptions = {
            from: '"Harsh" <ram21636519@gmail.com>',
            to: "ram21636519@gmail.com",
            subject: "Hello ✔",
            text: "Hello world?",
            html: "<b>Hello world?</b>", // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    "errorMessage": error
                });
            }
            else {
                //console.log('Message sent : ',info.messageId)
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    "status": info.messageId
                });
            }
        });
        /*onst msg = {
            to: email, // Change to your recipient
            from: 'ram21636519@gmail.com', // Change to your verified sender
            subject: 'OTP for forgot password',
            text: 'OTP'
        }
        sgMail.setApiKey(SEND_GRID_KEY)
        sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
            res.status(StatusCodes.OK).json({
                "status":"Email sent"
            })
        })
        .catch((error) => {
            console.error(error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                "errorMessage":error
            })
        })*/
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage": error
        });
    }
});
exports.forgotPassword = forgotPassword;
/*
export const refreshToken = async(req:Request,res:Response):Promise<void>=>{
    try{
        const {accessToken,refreshToken} = req.body as {accessToken:string,refreshToken:string}
        if(!accessToken || !refreshToken){
            res.status(StatusCodes.BAD_REQUEST).json({
                "errorMessage":"please provide both tokens"
            })
        }else{
            const {data:{id:id}} = jwt.verify(refreshToken,refreshTokenSecretKey)
            const user = await User.findById(id)
            if(user){
                const {accessToken,refreshToken} = await generateToken(id)
                res.status(StatusCodes.OK).json({
                    "accessToken":accessToken,
                    "refreshToken":refreshToken
                })
            }else{
                res.status(StatusCodes.BAD_REQUEST).json({
                    "errorMessage":"please provide correct referesh token"
                })
            }

        }
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":error
        })
    }
}*/
const getNewAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accessToken, refreshToken } = req.body;
        const decoded = jsonwebtoken_1.default.verify(refreshToken, tokenGenerator_1.refreshTokenSecret);
        if (decoded.data.id) {
            const { accessToken } = yield (0, tokenGenerator_1.generateToken)(decoded.data.id);
            console.log('New token generated');
            res.status(http_status_codes_1.StatusCodes.OK).json({
                "accessToken": accessToken,
                "refreshToken": refreshToken
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                "errorMessage": "Invalid refresh token"
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage": error
        });
    }
});
exports.getNewAccessToken = getNewAccessToken;
