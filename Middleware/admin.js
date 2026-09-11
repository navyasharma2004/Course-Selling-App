const jwt = require("jsonwebtoken");
const {JWT_ADMIN_SECRET} = require("../config");

const adminMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET)
    if(!decoded){
        return res.status(403).json({
            message: "you are not signed in"
        });
    }
    req.userId = decoded.id;
    next();
};
module.exports = {
    adminMiddleware: adminMiddleware
}
