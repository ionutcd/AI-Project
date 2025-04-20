const mongoose = require("mongoose");

const chatbotAppSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  org_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chatbot_org",
  },
  description: { type: String },
});

const ChatbotApp = new mongoose.model("chatbot_app", chatbotAppSchema);
module.exports = ChatbotApp;
