import Router from 'express'
import { getUserDetails, loginUser, registerUser } from '../controllers/userController'
import { autherizationToken } from '../utilits/jwtUtilit';

export const userRouter=Router()

userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/getuserprofile').get(autherizationToken,getUserDetails);
