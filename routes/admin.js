const { Router } = require("express");
const adminRouter = Router();
const {adminModel} = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_ADMIN_SECRET} = require("../config");
const {adminMiddleware} = require("../Middleware/admin");
const {courseModel} = require("../db");
adminRouter.post("/signup", async function(req, res) {
     try{
   const {email, password, firstName, lastName} = req.body;
   const hashedPassword = await bcrypt.hash(password, 10);
   await adminModel.create({
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
})
adminRouter.post("/signin", async function(req, res) {
    try{
       const email = req.body.email;
       const password = req.body.password;
       const admin = await adminModel.findOne({
           email: email
       })
       if(!admin){
           return res.status(404).json({
               message : "Admin not found"
           });
       }
   
       const isMatch = await bcrypt.compare(password, admin.password);
       if(isMatch){
           const token = jwt.sign({id: admin._id}, JWT_ADMIN_SECRET);
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
})
adminRouter.post("/course",adminMiddleware, async function(req, res){
    const adminId = req.userId;
    const {title, description, price, imageLink, creatorId} = req.body;

    const course =await courseModel.create({
        title: title,
        description: description,
        price: price,
        imageLink: imageLink,
        creatorId: adminId
    })
    res.json({
        message: "course created successfully",
        courseId : course._id
    })
})
adminRouter.put("/course/:courseId",adminMiddleware, async function(req, res){
   const courseId = req.params.courseId;
   const {title, description, price, imageLink} = req.body;

   const course = await courseModel.updateOne({
    _id: courseId
   }, {
    title: title,
    description: description,
    price: price,
    imageLink: imageLink
   })
   res.json({
       message: "Course updated successfully",
       course: course,
       courseId: courseId
   })
})
adminRouter.get("/courses/bulk",adminMiddleware, async function(req, res){
   try{
    const courses = await courseModel.find();
    res.json({
        courses: courses
    });
   } catch(error){
    res.status(500).json({
        message: "Error fetching courses"
    });
   }
});
module.exports = {
    adminRouter: adminRouter
}