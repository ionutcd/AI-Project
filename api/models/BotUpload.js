const mongoose = require("mongoose");

const botUploadSchema = new mongoose.Schema({
  name: { type: String },
  app_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chatbot_app",
  },
  org_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chatbot_org",
  },
  type: { type: String },
  path: { type: String },
  size: { type: Number },
  status: { type: Number, default: 0 },
  last_modified: { type: Date, default: new Date() },
});

const BotUpload = new mongoose.model("bot_upload", botUploadSchema);
module.exports = BotUpload;
