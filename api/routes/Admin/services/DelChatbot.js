const ChatbotModel = require("../../../models/Chatbot");

const DelChatbot = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).send("Invalid payload");
  }
  try {
    const allchatbots = await ChatbotModel.findByIdAndDelete(id);
    if (!allchatbots) {
      return res.status(400).send("No record found");
    }
    res.status(200).json(allchatbots);
  } catch (error) {
    res.status(501).json(error);
  }
};

module.exports = DelChatbot;
