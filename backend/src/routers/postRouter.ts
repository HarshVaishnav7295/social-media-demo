import express from "express";
import {
  getPost,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
  LikeUnlikePost,
  getUserPost,
  getFeed,
} from "../controller/postController";
export const router = express.Router();

router.route("/likeUnlike/:id").post(LikeUnlikePost);
router.route("/getMyPosts").get(getMyPosts);
router.route("/getUserPost").post(getUserPost);
router.route("/getFeed").get(getFeed);
router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);
router.route("/").post(createPost);
