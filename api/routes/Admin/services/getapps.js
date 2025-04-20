const ChatbotAppModel = require("../../../models/ChatbotApp");

const GetApps = async (req, res) => {
  try {
    const allapps = await ChatbotAppModel.find().populate("org_id");
    if (!allapps) {
      return res
        .status(400)
        .send("No record found in Apps for chatbot integration");
    }
    res.status(200).json(allapps);
  } catch (error) {
    res.status(501).json(error);
  }
};

module.exports = GetApps;
