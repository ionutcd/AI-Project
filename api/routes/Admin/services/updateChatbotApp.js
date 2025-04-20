const ChatbotAppModel = require("../../../models/ChatbotApp");

const UpdateChatbotApp = async (req, res) => {
  const { name, description, _id, org_id } = req.body.values;

  // Validate if required fields are present in the request body
  if (!name) {
    return res.status(400).json({
      error: "Missing required fields in Updating app for integrating",
    });
  }

  try {
    // Update a new app for chatbot integration
    const appData = await ChatbotAppModel.findById(_id);
    if (appData) {
      const app = await ChatbotAppModel.findOne({ name });
      if (app && app._id.toString() === appData._id.toString()) {
        appData.org_id = org_id;
        appData.name = name;
        appData.description = description;
        appData.save();
        res.status(200).json({ res: "success" });
      } else {
        res.status(400).json({ error: "This app name is already exist" });
      }
    } else {
      res.status(400).json({ error: "No exist the app to change " });
    }
  } catch (error) {
    console.error("Error updating app for chatbot integration:", error);
    res.status(500).json({ error: "Updating chatbot for integration" });
  }
};

module.exports = UpdateChatbotApp;
