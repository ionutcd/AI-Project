const mongoose = require("mongoose");

const ChatbotSchema = new mongoose.Schema({
  app_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chatbot_app",
  },
  org_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chatbot_org",
  },
  user_id: {
    type: String,
  },
  avatar: { type: String },
  url: { type: String },
  prompt: {
    type: String,
  },
});

const Chatbot = new mongoose.model("chatbot", ChatbotSchema);
module.exports = Chatbot;
