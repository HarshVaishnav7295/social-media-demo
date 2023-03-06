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
exports.getFeed = exports.getUserPost = exports.LikeUnlikePost = exports.getMyPosts = exports.deletePost = exports.updatePost = exports.getPost = exports.createPost = void 0;
const http_status_codes_1 = require("http-status-codes");
const Post_1 = require("../models/Post");
const User_1 = require("../models/User");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { desc, img } = req.body;
        if (!desc) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errorMessage: "Description is required.",
            });
        }
        else {
            const post = yield Post_1.Post.create({
                description: desc,
                image: img,
                createdBy: req.body.user.id,
            });
            res.status(http_status_codes_1.StatusCodes.CREATED).json({
                post: post,
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMessage: error,
        });
    }
});
exports.createPost = createPost;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const post = yield Post_1.Post.findById(id);
        if (post) {
            res.status(http_status_codes_1.StatusCodes.OK).json({
                post: post,
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errorMessage: "No post with this id",
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMessage: error,
        });
    }
});
exports.getPost = getPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { desc, img } = req.body;
        const post = yield Post_1.Post.findOneAndUpdate({
            _id: id,
            createdBy: req.body.user.id,
        }, {
            description: desc,
            image: img,
        });
        if (post) {
            const updatedPost = yield Post_1.Post.findById(post === null || post === void 0 ? void 0 : post._id);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                updatedPost: updatedPost,
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errorMessage: "You are not allowed to update this post",
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMessage: error,
        });
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { desc, img } = req.body;
        const post = yield Post_1.Post.findOneAndDelete({
            _id: id,
            createdBy: req.body.user.id,
        });
        if (post) {
            const updatedPost = yield Post_1.Post.findById(post === null || post === void 0 ? void 0 : post._id);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Post deleted",
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errorMessage: "You are not allowed to delete this post",
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMessage: error,
        });
    }
});
exports.deletePost = deletePost;
const getMyPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.Post.find({
            createdBy: req.body.user.id,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            posts: posts,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMessage: error,
        });
    }
});
exports.getMyPosts = getMyPosts;
const LikeUnlikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const post = yield Post_1.Post.findById(id);
        if (post) {
            let isLiked = false;
            post.likedBy.map((item) => {
                if (item._id == req.body.user.id) {
                    isLiked = true;
                }
            });
            if (isLiked) {
                const newlikedby = post.likedBy.filter((item) => item._id != req.body.user.id);
                const newlen = newlikedby.length;
                const posttemp = yield Post_1.Post.findByIdAndUpdate(id, {
                    likedBy: newlikedby,
                    likes: newlen,
                });
                const updatedPost = yield Post_1.Post.findById(id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: "Unlike successful",
                    likedBy: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.likedBy,
                });
            }
            else {
                const newlikedby = post.likedBy;
                newlikedby.push(req.body.user.id);
                const newlen = newlikedby.length;
                const posttemp = yield Post_1.Post.findByIdAndUpdate(id, {
                    likedBy: newlikedby,
                    likes: newlen,
                });
                const updatedPost = yield Post_1.Post.findById(id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: "Like successful",
                    likedBy: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.likedBy,
                });
            }
        }
        else {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errorMessage: "No post with this id",
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMessage: error,
        });
    }
});
exports.LikeUnlikePost = LikeUnlikePost;
const getUserPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedUserId = yield req.body.user.id;
        const _id = yield req.body._id;
        if (!loggedUserId || !_id) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errorMessage: "User Id Required.",
            });
        }
        else {
            const loggedUser = yield User_1.User.findById(loggedUserId);
            if (loggedUser) {
                const userposts = yield Post_1.Post.find({ createdBy: _id });
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: true,
                    posts: userposts,
                });
            }
            else {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    errorMessage: "User not Found.",
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
exports.getUserPost = getUserPost;
const getFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currUser = yield User_1.User.findById(req.body.user.id);
        var currUsersFollowingsIds = currUser === null || currUser === void 0 ? void 0 : currUser.followings;
        var feed = [];
        var counter = 0;
        const myPosts = yield Post_1.Post.find({ createdBy: req.body.user.id });
        console.log('called feed:', currUsersFollowingsIds);
        if ((currUsersFollowingsIds === null || currUsersFollowingsIds === void 0 ? void 0 : currUsersFollowingsIds.length) === 0) {
            res.status(http_status_codes_1.StatusCodes.OK).json({
                feed: myPosts,
            });
        }
        else {
            currUsersFollowingsIds === null || currUsersFollowingsIds === void 0 ? void 0 : currUsersFollowingsIds.map((user) => __awaiter(void 0, void 0, void 0, function* () {
                const posts = yield Post_1.Post.find({
                    createdBy: user,
                });
                feed = feed.concat(posts);
                counter += 1;
                if (counter === (currUsersFollowingsIds === null || currUsersFollowingsIds === void 0 ? void 0 : currUsersFollowingsIds.length)) {
                    feed = feed.concat(myPosts);
                    console.log('Feed : ', feed);
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        feed: feed,
                    });
                }
            }));
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMessage: error,
        });
    }
});
exports.getFeed = getFeed;
