const ChatbotModel = require("../../../models/Chatbot");
const makeHashURL = require("./makeHashURL");

const CreateChatbot = async (req, res) => {
  const { org, app, email, prompt } = req.body.values;

  // Validate if required fields are present in the request body
  if (!org || !app || !email) {
    return res.status(400).json({
      error: "Missing required fields in creating chatbot",
    });
  }

  try {
    const chatbot = await ChatbotModel.findOne({
      org_id: org,
      app_id: app,
      user_id: email,
    });
    if (chatbot) {
      res.status(400).json({ error: "This chatbot is already exist" });
    } else {
      const url = makeHashURL({ org, app, email });
      // Create a new app for chatbot integration
      const newChatbot = await ChatbotModel.create({
        org_id: org,
        app_id: app,
        user_id: email,
        prompt,
        url,
        avatar: "",
      });
      res.status(200).json(newChatbot);
    }
  } catch (error) {
    console.error("Error creating chatbot:", error);
    res.status(500).json({ error: "Creating chatbot..." });
  }
};

module.exports = CreateChatbot;
