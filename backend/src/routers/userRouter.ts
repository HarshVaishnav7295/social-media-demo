import express,{Request,Response} from "express";
export const router = express.Router()
import {followUnfollowUser,updateUser,getMyFollowings,findUserById, getMyFollowers,changePassword} from '../controller/userController'

router.route('/followUnfollow/:id').post(followUnfollowUser)
router.route('/findById').post(findUserById)
router.route('/myFollowings').get(getMyFollowings)
router.route('/myFollowers').get(getMyFollowers)
router.route('/updateUser').patch(updateUser)
router.route('/changePassword').patch(changePassword)
router.get('/protectedCheck',(req:Request,res:Response):void=>{
    res.send('protected running')
})