const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
mongoose.set("strictQuery", false);
const mongoPath = process.env.MongoDBPath;
const db = mongoose.connection;
const dbUpdate = { useNewUrlParser: true, useUnifiedTopology: true };
const user = require("./model/user.js");
const { hashPassword } = require("./tools/encrypt.js");

mongoose.connect(mongoPath, dbUpdate);

db.on("error", (err) => console.log("Error, DB Not Connected"));
db.on("connected", () => console.log("Connected to Mongo"));
db.on("disconnected", (err) => console.log("Mongo is disconnected"));
db.on("open", (err) => console.log("Connection Made!"));

async function getAllUsers() {
  const result = await user
    .find({}, "-_id -updatedAt -__v -password -token")
    .lean();
  return result;
}

async function getUser(email) {
  const result = await user
    .findOne({ email: email }, "-_id -updatedAt -__v -token -password")
    .lean();
  return result;
}

async function insertUser(data) {
  try {
    const hashedPassword = await hashPassword(data.password);
    const token = jwt.sign({ email: data.email }, process.env.JWT_SECRET);
    data.password = hashedPassword;
    data.token = token;
    data.role = "user";
    data.status = "inactive";
    await user.create(data);
    return token;
  } catch (err) {
    console.log(err);
    return err.message;
  }
}

async function updateUser(data) {
  try {
    const result = await user.updateOne({ email: data.email }, data);
    return result;
  } catch (err) {
    console.log(err);
    return err.message;
  }
}

async function deleteUser(email) {
  try {
    const result = await user.deleteOne({ email: email });
    return result;
  } catch (err) {
    console.log(err);
    return err.message;
  }
}

module.exports = {
  getAllUsers,
  getUser,
  insertUser,
  updateUser,
  deleteUser,
};
