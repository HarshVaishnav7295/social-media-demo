import express from 'express'
export const router = express.Router()
import {signupUser,loginUser,getNewAccessToken,getOTP,resetPassword,loginWithGoogle} from '../controller/authController'
router.route('/signup').post(signupUser)
router.route('/login').post(loginUser)
router.route('/getNewAccessToken').post(getNewAccessToken)
router.route('/getOTP').post(getOTP)
router.route('/resetPassword').post(resetPassword)
router.route('/loginWithGoogle').post(loginWithGoogle)
