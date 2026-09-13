const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const userSchema = new schema({
    email : { type : String, required : true, unique : true },
    password: String,
    firstName: String,
    lastName: String,
});
const adminSchema = new schema({
    email : { type : String, required : true, unique : true },
    password: String,
    firstName: String,
    lastName: String,
    
});
const videoSchema = new schema({
    title: { type: String, required: true },
    youtubeId: { type: String, required: true },
    order: { type: Number, default: 0 }
});
const courseSchema = new schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    creatorId: ObjectId,
    videos: [videoSchema]
});
const purchaseSchema = new schema({
    userId: ObjectId,
    courseId: { type: ObjectId, ref: "course" }
});
const progressSchema = new schema({
    userId: { type: ObjectId, required: true },
    courseId: { type: ObjectId, required: true },
    watchedVideoIds: [{ type: String }]
});

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);
const progressModel = mongoose.model("progress", progressSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel,
    progressModel
}