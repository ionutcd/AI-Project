const mongoose = require("mongoose");

const llmOptionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  gpt_name: {
    type: String,
  },
  llm_key: {
    type: String,
  },
  llm_temperature: {
    type: Number,
  },
});

const LLMOption = new mongoose.model("llm_option", llmOptionSchema);
module.exports = LLMOption;
