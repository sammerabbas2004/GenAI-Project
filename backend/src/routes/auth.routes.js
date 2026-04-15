const express = require('express');
const authRouter=express.Router();
const authController=require('../controller/auth.controller');
const authMiddleware=require('../middlewares/auth.middleware');
/** 
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

authRouter.post('/register',authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @desc Login user with email and password
 * @access Public
 */
authRouter.post('/login',authController.loginUserController);

/**
 * @route get /api/auth/logout
 * @desc Logout user by blacklisting the token
 * @access Public
 */
authRouter.get('/logout',authController.logoutUserController);
/**
 * @route get /api/auth/get-me
 * @desc Get the details of logged in user
 * @access Private
 */
authRouter.get('/get-me',authMiddleware.authUser,authController.getMeController);

module.exports = authRouter;