"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controller/postController");
exports.router = express_1.default.Router();
exports.router.route("/likeUnlike/:id").post(postController_1.LikeUnlikePost);
exports.router.route("/getMyPosts").get(postController_1.getMyPosts);
exports.router.route("/getUserPost").post(postController_1.getUserPost);
exports.router.route("/getFeed").get(postController_1.getFeed);
exports.router.route("/:id").get(postController_1.getPost).patch(postController_1.updatePost).delete(postController_1.deletePost);
exports.router.route("/").post(postController_1.createPost);
