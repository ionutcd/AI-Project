const ChatbotOrgModel = require("../../../models/ChatbotOrg");

const GetOrgs = async (req, res) => {
  try {
    const allorgs = await ChatbotOrgModel.find();
    if (!allorgs) {
      return res
        .status(400)
        .send("No record found in Orgs for chatbot integration");
    }
    res.status(200).json(allorgs);
  } catch (error) {
    res.status(501).json(error);
  }
};

module.exports = GetOrgs;
