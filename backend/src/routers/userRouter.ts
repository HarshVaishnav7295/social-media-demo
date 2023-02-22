import express, { Request, Response } from "express";
export const router = express.Router();
import {
  followUnfollowUser,
  updateUser,
  getMyFollowings,
  getMyFollowers,
  changePassword,
  findUserById,
  getAllUser,
} from "../controller/userController";

router.route("/followUnfollow").post(followUnfollowUser);
router.route("/myFollowings").get(getMyFollowings);
router.route("/getAllUser").get(getAllUser);
router.route("/myFollowers").get(getMyFollowers);
router.route("/updateUser").patch(updateUser);
router.route("/changePassword").patch(changePassword);
router.route("/findById").post(findUserById);
router.get("/protectedCheck", (req: Request, res: Response): void => {
  res.send("protected running");
});
