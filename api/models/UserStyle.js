const mongoose = require("mongoose");

const userStyleSchema = new mongoose.Schema({
  chat_back: { type: String },
  first_question: { type: String },
  font_color: { type: String },
  font_size: { type: Number },
  sidebar_back: { type: String },
  sidebar_hover: { type: String },
  sidebar_setting_back: { type: String },
  text_title: { type: String },
  theme_state: { type: String },
  is_default: { type: Boolean, default: false },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const UserStyle = new mongoose.model("user_style", userStyleSchema);
module.exports = UserStyle;
