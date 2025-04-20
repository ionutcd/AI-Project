const ChatbotModel = require("../../../models/Chatbot");
const makeHashURL = require("./makeHashURL");

const UpdateChatbot = async (req, res) => {
  const { org, app, email, prompt, avatar, _id } = req.body.values;

  // Validate if required fields are present in the request body
  if (!_id) {
    return res.status(400).json({
      error: "Missing required fields in Updating chatbot",
    });
  }

  try {
    // Update a new app for chatbot integration
    const url = makeHashURL({ org, app, email });
    const chatbot = await ChatbotModel.findById(_id);
    if (chatbot) {
      //   const bot = await ChatbotModel.findOne({
      //     org_id: org,
      //     app_id: app,
      //     user_id: email,
      //   });
      //   if (!bot) {
      chatbot.org_id = org;
      chatbot.app_id = app;
      chatbot.user_id = email;
      chatbot.prompt = prompt;
      chatbot.url = url;
      chatbot.save();
      res.status(200).json({ res: "success", app_id: app, id: chatbot._id });
      // } else {
      //   res.status(400).json({ error: "This chatbot is already exist" });
      // }
    } else {
      res.status(400).json({ error: "No exist the  chatbot to change " });
    }
  } catch (error) {
    console.error("Error updating chatbot integration:", error);
    res.status(500).json({ error: "Updating chatbot " });
  }
};

module.exports = UpdateChatbot;
