const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_USER_SECRET} = require("../config");
const {z} = require("zod");
const {userModel,purchaseModel} = require("../db");
const {userMiddleware} = require("../Middleware/user");
const userRouter = express.Router();

userRouter.post('/signup', async function(req,res){
    try{
   const {email, password, firstName, lastName} = req.body;
   const hashedPassword = await bcrypt.hash(password, 10);
   await userModel.create({
    email: email,
    password: hashedPassword,
    firstName: firstName,
    lastName: lastName
   })
   res.json({
    message: "Signup succeeded"
   });
} catch(error){
    res.status(500).json({
        message: "Signup failed",
        error: error.message
    });
}
});
userRouter.post('/signin', async function(req,res){
    try{
    const email = req.body.email;
    const password = req.body.password;
    const user = await userModel.findOne({
        email: email
    })
    if(!user){
        return res.status(404).json({
            message : "User not found"
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(isMatch){
        const token = jwt.sign({id: user._id}, JWT_USER_SECRET);
       return res.json({
            message: "Signin succeeded",
            token: token
        });
    } else {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }
}  catch(error){
    res.status(500).json({
        message: "Signin failed",
        error: error.message
    });
}
});

userRouter.get('/purchases', userMiddleware, async function(req,res){
     const userId = req.userId;
     const purchases = await purchaseModel.find({
        userId: userId
    }).populate("courseId");
    res.json({
        purchases: purchases
    });
});
module.exports = {
    userRouter: userRouter
}