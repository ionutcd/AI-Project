const mongoose = require("mongoose");

const userQueries = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  bot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chatbot",
  },
  activePrompt: {
    type: String,
  },
  chats: { type: Object },
});

const Userquery = new mongoose.model("user_queries", userQueries);
module.exports = Userquery;
