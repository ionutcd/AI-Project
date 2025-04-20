const ChatbotAppModel = require("../../../models/ChatbotApp");

const CreateChatbotApp = async (req, res) => {
  const { name, description, org_id } = req.body.values;

  // Validate if required fields are present in the request body
  if (!name) {
    return res.status(400).json({
      error: "Missing required fields in creating app for integrating",
    });
  }

  try {
    const apps = await ChatbotAppModel.findOne({ name });
    if (apps) {
      res.status(400).json({ error: "This app name is already exist" });
    } else {
      // Create a new app for chatbot integration
      const newChatbotApp = await ChatbotAppModel.create({
        org_id,
        name,
        description,
      });
      res.status(200).json(newChatbotApp);
    }
  } catch (error) {
    console.error("Error creating app for chatbot integration:", error);
    res.status(500).json({ error: "Creating chatbot for integration" });
  }
};

module.exports = CreateChatbotApp;
