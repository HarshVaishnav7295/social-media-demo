import express from 'express'
export const router = express.Router()
import {signupUser,loginUser,checkProtectedRoute} from '../controller/authController'
import { authenticaton } from '../middleware/AuthenticationMiddleware'
router.route('/signup').post(signupUser)
router.route('/login').post(loginUser)

router.route('/protected').get(authenticaton,checkProtectedRoute)
//router.route('/refreshToken').post(refreshToken)