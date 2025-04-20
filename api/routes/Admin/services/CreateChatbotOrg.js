const ChatbotOrgModel = require("../../../models/ChatbotOrg");

const CreateChatbotOrg = async (req, res) => {
  const { name, description } = req.body.values;

  // Validate if required fields are present in the request body
  if (!name) {
    return res.status(400).json({
      error: "Missing required fields in creating org for integrating",
    });
  }

  try {
    const orgs = await ChatbotOrgModel.findOne({ name });
    if (orgs) {
      res.status(400).json({ error: "This org name is already exist" });
    } else {
      // Create a new org for chatbot integration
      const newChatbotOrg = await ChatbotOrgModel.create({
        name,
        description,
      });
      res.status(200).json(newChatbotOrg);
    }
  } catch (error) {
    console.error("Error creating org for chatbot integration:", error);
    res.status(500).json({ error: "Creating chatbot for integration" });
  }
};

module.exports = CreateChatbotOrg;
