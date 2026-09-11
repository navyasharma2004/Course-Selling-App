const express = require("express");
const { userMiddleware } = require("../Middleware/user");
const courseRouter = express.Router();
const { courseModel,purchaseModel } = require("../db");

courseRouter.post('/purchase',userMiddleware, async function(req,res){
    const userId = req.userId;
    const courseId = req.body.courseId;

    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        message: "you are purchased the course"
    });
    
});
courseRouter.get('/preview',async function(req, res){
    const courses = await courseModel.find({});
    res.json({
        courses: courses
    })
});
module.exports = {
    courseRouter : courseRouter
}