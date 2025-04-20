const ChatbotModel = require("../../../models/Chatbot");

const GetChatbots = async (req, res) => {
  try {
    const allbots = await ChatbotModel.find()
      .populate("org_id")
      .populate("app_id");
    if (!allbots) {
      return res.status(400).send("No record found in data for chatbot");
    }
    res.status(200).json(allbots);
  } catch (error) {
    res.status(501).json(error);
  }
};

module.exports = GetChatbots;
