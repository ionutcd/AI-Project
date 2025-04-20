const ChatbotOrgModel = require("../../../models/ChatbotOrg");

const UpdateChatbotOrg = async (req, res) => {
  const { name, description, _id } = req.body.values;

  // Validate if required fields are present in the request body
  if (!name) {
    return res.status(400).json({
      error: "Missing required fields in Updating org for integrating",
    });
  }

  try {
    // Update a new org for chatbot integration
    const orgData = await ChatbotOrgModel.findById(_id);
    if (orgData) {
      const org = await ChatbotOrgModel.findOne({ name });
      if (org && org._id.toString() === orgData._id.toString()) {
        orgData.name = name;
        orgData.description = description;
        orgData.save();
        res.status(200).json({ res: "success" });
      } else {
        res.status(400).json({ error: "This org name is already exist" });
      }
    } else {
      res.status(400).json({ error: "No exist the org to change " });
    }
  } catch (error) {
    console.error("Error updating org for chatbot integration:", error);
    res.status(500).json({ error: "Updating chatbot for integration" });
  }
};

module.exports = UpdateChatbotOrg;
