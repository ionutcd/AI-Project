const BotUpload = require("../../../models/BotUpload");

const GetAllBotFiles = async (req, res) => {
  try {
    const { app_id, org_id } = req.body;
    if (app_id !== "" && org_id !== "") {
      const upload_data = await BotUpload.find({ app_id, org_id })
        .populate("app_id")
        .populate("org_id");
      res.status(200).json({ result: upload_data });
    } else if (app_id !== "" && org_id === "") {
      const upload_data = await BotUpload.find({ app_id })
        .populate("app_id")
        .populate("org_id");
      res.status(200).json({ result: upload_data });
    } else if (app_id === "" && org_id !== "") {
      const upload_data = await BotUpload.find({ org_id })
        .populate("app_id")
        .populate("org_id");
      res.status(200).json({ result: upload_data });
    } else {
      const upload_data = await BotUpload.find()
        .populate("app_id")
        .populate("org_id");
      res.status(200).json({ result: upload_data });
    }
  } catch (error) {
    res.status(401).json(error.message);
  }
};

module.exports = GetAllBotFiles;
