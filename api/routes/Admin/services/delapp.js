const ChatbotAppModel = require("../../../models/ChatbotApp");

const DelApp = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).send("Invalid payload");
  }
  try {
    const allapps = await ChatbotAppModel.findByIdAndDelete(id);
    if (!allapps) {
      return res.status(400).send("No record found");
    }
    res.status(200).json(allapps);
  } catch (error) {
    res.status(501).json(error);
  }
};

module.exports = DelApp;
