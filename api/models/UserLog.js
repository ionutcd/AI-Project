const mongoose = require("mongoose");

const userLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  login_time: [{ type: Date, required: true }],
  direct_link: { type: String, required: true },
});

const UserLog = new mongoose.model("user_log", userLogSchema);
module.exports = UserLog;
