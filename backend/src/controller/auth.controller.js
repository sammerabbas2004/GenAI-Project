const model=require('../model/user.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const blacklistModel=require('../model/blacklist.model');
/** 
 * @name registerUserController
 * @desc Register a new user,expects username,email,password in the request body
 * @access Public
 */
async function registerUserController(req,res){
    const {username,email,password}=req.body;
    if(!username || !email || !password){
        return res.status(400).json({message:'Username, email and password are required'});
    }
    const isUserAlreadyExist= await model.findOne({
        $or:[{username},{email}]
    });
    if(isUserAlreadyExist){
        return res.status(400).json({message:'User with the same username or email already exists'});
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const user=new model({
        username,
        email,
        password:hashedPassword
    });
    const token =jwt.sign({
        id:user._id,
        username:user.username},
         process.env.JWT_SECRET, {expiresIn:'1d'});
    res.cookie('token',token)
    res.status(201).json({message:'User registered successfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    });
    await user.save();//Saving user after sending response to avoid delay in response time
}

/**
 * @name loginUserController
 * @desc Login a user,expects email,password in the request body
 * @access Public
 */
async function loginUserController(req,res){
    const {email,password}=req.body;
    const user=await model.findOne({email});
    if(!user){
        return res.status(400).json({message:'Invalid email or password'});
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({message:'Invalid email or password'});
    }
    const token =jwt.sign({
        id:user._id,
        username:user.username},
        process.env.JWT_SECRET, {expiresIn:'1d'});
    res.cookie('token',token)
    res.status(200).json({message:'Login successful',
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    });
}
/** * @name logoutUserController
 * @desc Logout a user by blacklisting the token,expects token in cookies
 * @access Public
 */
async function logoutUserController(req,res){
    const token=req.cookies.token;
    if(token){
      await blacklistModel.create({token});
    }
    res.clearCookie('token');
    res.status(200).json({message:'User logged out successfully'});

}
/**
 * @name getMeController
 * @desc Get the details of logged in user
 * @access Private
 */
async function getMeController(req,res){
    const user=await model.findById(req.user.id)
    res.status(200).json({
        message:'User details fetched successfully',
        user:{
        id:user._id,
        username:user.username,
        email:user.email
    }});
}

module.exports={
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};