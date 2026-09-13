const express = require("express");
const { userMiddleware } = require("../Middleware/user");
const courseRouter = express.Router();
const { courseModel,purchaseModel,progressModel } = require("../db");

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

courseRouter.get('/:courseId/content', userMiddleware, async function(req, res){
    const userId = req.userId;
    const courseId = req.params.courseId;

    const purchase = await purchaseModel.findOne({ userId, courseId });
    if(!purchase){
        return res.status(403).json({
            message: "You have not purchased this course"
        });
    }

    const course = await courseModel.findById(courseId);
    if(!course){
        return res.status(404).json({ message: "Course not found" });
    }

    res.json({ course });
});

courseRouter.get('/:courseId/progress', userMiddleware, async function(req, res){
    const userId = req.userId;
    const courseId = req.params.courseId;

    const progress = await progressModel.findOne({ userId, courseId });
    res.json({
        watchedVideoIds: progress ? progress.watchedVideoIds : []
    });
});

courseRouter.post('/:courseId/progress', userMiddleware, async function(req, res){
    const userId = req.userId;
    const courseId = req.params.courseId;
    const { videoId } = req.body;

    let progress = await progressModel.findOne({ userId, courseId });
    if(!progress){
        progress = await progressModel.create({ userId, courseId, watchedVideoIds: [videoId] });
    } else if(!progress.watchedVideoIds.includes(videoId)){
        progress.watchedVideoIds.push(videoId);
        await progress.save();
    }

    res.json({ watchedVideoIds: progress.watchedVideoIds });
});

module.exports = {
    courseRouter : courseRouter
}