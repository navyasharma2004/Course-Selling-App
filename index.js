require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
console.log("MONGO_URL:", process.env.MONGO_URL);
const {userRouter} = require("./routes/user");
const {courseRouter} = require("./routes/course");
const {adminRouter} = require("./routes/admin");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);
async function main(){
    try{
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000);
    console.log("Server is running on port 3000");
    } catch (error) {
        console.log("MongoDB connection failed:");
        console.log(error.message);
    }
}
main();