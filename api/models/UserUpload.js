const mongoose = require("mongoose");

const userUploadSchema = new mongoose.Schema({
  name: { type: String },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  type: { type: String },
  path: { type: String },
  size: { type: Number },
  status: { type: Number, default: 0 },
  last_modified: { type: Date, default: new Date() },
});

const UserUpload = new mongoose.model("user_upload", userUploadSchema);
module.exports = UserUpload;
