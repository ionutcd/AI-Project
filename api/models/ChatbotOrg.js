const mongoose = require("mongoose");

const chatbotOrgSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    reuqired: true,
  },
  description: { type: String },
});

const ChatbotOrg = new mongoose.model("chatbot_org", chatbotOrgSchema);
module.exports = ChatbotOrg;
