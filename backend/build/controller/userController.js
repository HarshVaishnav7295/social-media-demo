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
exports.findUserById = exports.changePassword = exports.getMyFollowers = exports.getMyFollowings = exports.updateUser = exports.followUnfollowUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../models/User");
const followUnfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const currUserId = req.body.user.id;
        if (id === currUserId) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                "errorMessage": "You can not follow/unfollow yourself"
            });
        }
        else {
            const user = yield User_1.User.findById(id);
            const currUser = yield User_1.User.findById(currUserId);
            if (!user) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    "errorMessage": "No user with this id"
                });
            }
            else {
                let currUsersFollowings = currUser === null || currUser === void 0 ? void 0 : currUser.followings;
                let usersFollowers = user === null || user === void 0 ? void 0 : user.followers;
                let isFollowing = false;
                currUsersFollowings === null || currUsersFollowings === void 0 ? void 0 : currUsersFollowings.map((item) => {
                    if (item._id.toString() == id) {
                        isFollowing = true;
                    }
                });
                if (isFollowing) {
                    // following so need to remove
                    currUsersFollowings = currUsersFollowings === null || currUsersFollowings === void 0 ? void 0 : currUsersFollowings.filter((item) => item._id.toString() != id);
                    usersFollowers = usersFollowers.filter((item) => item._id != currUserId);
                    const updatedCurrUser = yield User_1.User.findByIdAndUpdate(currUserId, { followings: currUsersFollowings });
                    const updatedUser = yield User_1.User.findByIdAndUpdate(id, { followers: usersFollowers });
                    isFollowing = false;
                }
                else {
                    currUsersFollowings === null || currUsersFollowings === void 0 ? void 0 : currUsersFollowings.push(id);
                    usersFollowers === null || usersFollowers === void 0 ? void 0 : usersFollowers.push(currUserId);
                    const updatedCurrUser = yield User_1.User.findByIdAndUpdate(currUserId, { followings: currUsersFollowings });
                    const updatedUser = yield User_1.User.findByIdAndUpdate(id, { followers: usersFollowers });
                    isFollowing = true;
                }
                if (isFollowing) {
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        "isFollowing": true,
                        "message": "Following successful"
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        "isFollowing": false,
                        "message": "UnFollowing successful"
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
exports.followUnfollowUser = followUnfollowUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, bio, avatar } = req.body;
        /*const user = await User.findByIdAndUpdate(req.body.user.id,{
            name:name,
            bio:bio,
            avatar:avatar
        })
        need to use one and update, made pre on findoneandupdate*/
        const user = yield User_1.User.findById(req.body.user.id);
        if (!user) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                "errorMessage": "No user with this id"
            });
        }
        else {
            user.name = name;
            user.bio = bio;
            user.avatar = avatar;
            yield user.save();
            const updatedUser = yield User_1.User.findById(user === null || user === void 0 ? void 0 : user._id);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                "updatedUser": {
                    name: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.name,
                    bio: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.bio,
                    avatar: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.avatar
                }
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage": error
        });
    }
});
exports.updateUser = updateUser;
const getMyFollowings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const curruser = await User.findById(req.body.user.id).populate('followings').exec()
        const currUser = yield User_1.User.findById(req.body.user.id);
        var myFollowings = [];
        currUser === null || currUser === void 0 ? void 0 : currUser.followings.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            const temp = yield User_1.User.findById(item._id);
            if (temp) {
                const obj = {
                    _id: temp._id,
                    name: temp.name,
                    email: temp.email,
                    dob: new Date(temp.dob),
                    gender: temp.gender,
                    bio: temp.bio,
                    avatar: temp.avatar,
                    followers: temp.followers,
                    followings: temp.followings,
                };
                myFollowings.push(obj);
            }
            /** here, added this, bcz when control foes out of foreach, bcz of async the my followings is not getting any
             * updated value as the sync process make it empty
             *
             * so added this as when all the items are pushed just send the response
             */
            if (myFollowings.length === currUser.followings.length) {
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    "Myfollowings": myFollowings
                });
            }
        }));
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage": error
        });
    }
});
exports.getMyFollowings = getMyFollowings;
const getMyFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currUser = yield User_1.User.findById(req.body.user.id);
        var myFollowers = [];
        currUser === null || currUser === void 0 ? void 0 : currUser.followers.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            const temp = yield User_1.User.findById(item._id);
            if (temp) {
                const obj = {
                    _id: temp._id,
                    name: temp.name,
                    email: temp.email,
                    dob: new Date(temp.dob),
                    gender: temp.gender,
                    bio: temp.bio,
                    avatar: temp.avatar,
                    followers: temp.followers,
                    followings: temp.followings,
                };
                myFollowers.push(obj);
            }
            if (myFollowers.length === currUser.followers.length) {
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    "MyFollowers": myFollowers
                });
            }
        }));
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage": error
        });
    }
});
exports.getMyFollowers = getMyFollowers;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                "errorMessage": "Please provide both old and new passwords",
                isPasswordChanged: false
            });
        }
        else {
            const user = yield User_1.User.findById(req.body.user.id);
            const match = yield (user === null || user === void 0 ? void 0 : user.comparePassword(oldPassword));
            if (!match) {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    "errorMessage": "Invalid Credentials",
                    isPasswordChanged: false
                });
            }
            else {
                if (user) {
                    user.password = newPassword;
                    yield (user === null || user === void 0 ? void 0 : user.save());
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        "message": "Password changed.!",
                        isPasswordChanged: true
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
exports.changePassword = changePassword;
const findUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const user = yield User_1.User.findById(id);
        if (!user) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                errorMessage: "user not found",
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    dob: user.dob,
                    gender: user.gender,
                    bio: user.bio,
                    avatar: user.avatar,
                    followings: user.followings,
                    followers: user.followers,
                },
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMessage: error,
        });
    }
});
exports.findUserById = findUserById;
