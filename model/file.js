const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };

const fileSchema = new Schema(
    {
        title: reqString,
        description: reqString,
        url: reqString,
    },
    { collection: "file", timestamps: true }
);

const file = mongoose.model("file", fileSchema);

module.exports = file;
