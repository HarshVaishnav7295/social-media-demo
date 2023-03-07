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
exports.loginWithGoogle = exports.resetPassword = exports.getNewAccessToken = exports.getOTP = exports.checkProtectedRoute = exports.loginUser = exports.signupUser = exports.API_KEY = exports.CLIENT_ID = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../models/User");
const tokenGenerator_1 = require("../utils/tokenGenerator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const Otp_1 = require("../models/Otp");
const google_auth_library_1 = require("google-auth-library");
exports.CLIENT_ID = '988673980743-dk1gmto7c74rktvdbvo2tg77uk2v78tg.apps.googleusercontent.com';
exports.API_KEY = 'AIzaSyA8-3vRKvF9CC1jHZBWeNWUdL-NCZkaNBY';
const image_to_base64_1 = __importDefault(require("image-to-base64"));
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
const getOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        var transporter = nodemailer_1.default.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "e2c2f71f40facb",
                pass: "75c47b6bad2d32"
            }
        });
        const otp = otp_generator_1.default.generate(6, { digits: true });
        const otps = yield Otp_1.Otp.deleteMany({});
        const otpObj = yield Otp_1.Otp.create({
            text: otp
        });
        const data = yield ejs_1.default.renderFile(path_1.default.join(__dirname, '../../public/index.ejs'), { otp: otpObj.text });
        let mailOptions = {
            from: 'Harsh <adminproject@gmail.com>',
            to: email,
            subject: "OTP for password reset",
            html: data
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
exports.getOTP = getOTP;
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
        const { refreshToken } = req.body;
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
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('called');
        const { email, otp, newPassword } = req.body;
        console.log('otp : ', otp);
        console.log('email', email);
        console.log(newPassword);
        if (!otp || !newPassword) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                "errorMessage": "Please provide otp and newPassword"
            });
        }
        else {
            const otps = yield Otp_1.Otp.find({});
            const storedOtp = otps[0];
            console.log('Stored : ', storedOtp);
            console.log('otp : ', otp);
            console.log('email', email);
            if (storedOtp.text.toString() === otp.toString()) {
                const user = yield User_1.User.findOne({
                    email: email
                });
                if (user) {
                    user.password = newPassword;
                    yield (user === null || user === void 0 ? void 0 : user.save());
                    console.log('password changed');
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        message: "Password changed.!",
                        isPasswordChanged: true,
                    });
                }
            }
            else {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    message: "Invalid OTP"
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
exports.resetPassword = resetPassword;
const loginWithGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idToken } = req.body;
        const client = new google_auth_library_1.OAuth2Client(exports.CLIENT_ID);
        const ticket = yield client.verifyIdToken({
            idToken: idToken,
            audience: exports.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userWithoutToken = yield User_1.User.findOne({
            email: payload === null || payload === void 0 ? void 0 : payload.email
        });
        if (userWithoutToken) {
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
            const img = yield (0, image_to_base64_1.default)(payload === null || payload === void 0 ? void 0 : payload.picture.toString()) // Path to the image
                .then((response) => {
                return response;
            });
            const userWithoutToken = yield User_1.User.create({
                name: payload === null || payload === void 0 ? void 0 : payload.name,
                email: payload === null || payload === void 0 ? void 0 : payload.email,
                avatar: "data:image/png;base64," + img
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
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage": error
        });
    }
});
exports.loginWithGoogle = loginWithGoogle;
