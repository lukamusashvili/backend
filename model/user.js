const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };

const userSchema = new Schema(
    {
        email: reqString,
        full_name: reqString,
        password: reqString,
        token: reqString,
        role: reqString,
        status: reqString,
        files: Array,
    },
    { collection: "user", timestamps: true }
);

const user = mongoose.model("user", userSchema);

module.exports = user;
