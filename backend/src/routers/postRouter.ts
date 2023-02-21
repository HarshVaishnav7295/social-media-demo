import express from 'express'
import {getPost,getMyPosts,createPost,updatePost,deletePost,LikeUnlikePost, getAllPost} from '../controller/postController'
export const router = express.Router()

router.route('/likeUnlike/:id').post(LikeUnlikePost)
router.route('/getAllPost').get(getAllPost)
router.route('/getMyPosts').get(getMyPosts)
router.route('/:id').get(getPost).patch(updatePost).delete(deletePost)
router.route('/').post(createPost)
