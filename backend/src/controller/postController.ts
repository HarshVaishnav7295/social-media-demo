import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Post } from "../models/Post";
import { findUserById } from "./userController";

interface IPostReq {
  desc: string;
  img: string;
}

export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { desc, img } = req.body as IPostReq;
    if (!desc) {
      res.status(StatusCodes.BAD_REQUEST).json({
        errorMessage: "Description is required.",
      });
    } else {
      const post = await Post.create({
        description: desc,
        image: img,
        createdBy: req.body.user.id,
      });
      res.status(StatusCodes.CREATED).json({
        post: post,
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};
export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (post) {
      res.status(StatusCodes.OK).json({
        post: post,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        errorMessage: "No post with this id",
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};
export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const { desc, img } = req.body as IPostReq;
    const post = await Post.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.body.user.id,
      },
      {
        description: desc,
        image: img,
      }
    );
    if (post) {
      const updatedPost = await Post.findById(post?._id);
      res.status(StatusCodes.OK).json({
        updatedPost: updatedPost,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        errorMessage: "You are not allowed to update this post",
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};
export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const { desc, img } = req.body as IPostReq;
    const post = await Post.findOneAndDelete({
      _id: id,
      createdBy: req.body.user.id,
    });
    if (post) {
      const updatedPost = await Post.findById(post?._id);
      res.status(StatusCodes.OK).json({
        message: "Post deleted",
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        errorMessage: "You are not allowed to delete this post",
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};
export const getMyPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const posts = await Post.find({
      createdBy: req.body.user.id,
    });
    res.status(StatusCodes.OK).json({
      posts: posts,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};

export const LikeUnlikePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (post) {
      let isLiked: Boolean = false;
      post.likedBy.map((item) => {
        if (item._id == req.body.user.id) {
          isLiked = true;
        }
      });

      if (isLiked) {
        const newlikedby = post.likedBy.filter(
          (item) => item._id != req.body.user.id
        );
        const newlen = newlikedby.length;
        const posttemp = await Post.findByIdAndUpdate(id, {
          likedBy: newlikedby,
          likes: newlen,
        });
        const updatedPost = await Post.findById(id);

        res.status(StatusCodes.OK).json({
          message: "Unlike successful",
          likedBy: updatedPost?.likedBy,
        });
      } else {
        const newlikedby = post.likedBy;
        newlikedby.push(req.body.user.id);
        const newlen = newlikedby.length;
        const posttemp = await Post.findByIdAndUpdate(id, {
          likedBy: newlikedby,
          likes: newlen,
        });
        const updatedPost = await Post.findById(id);

        res.status(StatusCodes.OK).json({
          message: "Like successful",
          likedBy: updatedPost?.likedBy,
        });
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        errorMessage: "No post with this id",
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};

export const getAllPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allPost = await Post.find({});
    res.status(StatusCodes.OK).json({
      posts: allPost,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};
