const ChatbotOrgModel = require("../../../models/ChatbotOrg");

const DelOrg = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).send("Invalid payload");
  }
  try {
    const allorgs = await ChatbotOrgModel.findByIdAndDelete(id);
    if (!allorgs) {
      return res.status(400).send("No record found");
    }
    res.status(200).json(allorgs);
  } catch (error) {
    res.status(501).json(error);
  }
};

module.exports = DelOrg;
