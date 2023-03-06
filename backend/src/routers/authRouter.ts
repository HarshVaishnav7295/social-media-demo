import express from 'express'
export const router = express.Router()
import {signupUser,loginUser,getNewAccessToken} from '../controller/authController'
router.route('/signup').post(signupUser)
router.route('/login').post(loginUser)
router.route('/getNewAccessToken').post(getNewAccessToken)