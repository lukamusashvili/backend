const jwt = require("jsonwebtoken");
const { getUser } = require("../db.js");

async function isAdmin(token) {
    try {
        if (!token) {
            return false;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.email;
        const user = await getUser(userEmail);
        if (user.role == "admin") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    isAdmin,
};
