const BotUpload = require("../../../models/BotUpload");
const fs = require("fs");
const DeleteModelForBot = async (req, res) => {
  const { id, path } = req.body;
  if (!id && !path) {
    return res.status(400).send("Invalid payload");
  }
  try {
    await BotUpload.findByIdAndDelete(id);

    fs.unlink(path, function (err) {
      if (err && err.code == "ENOENT") {
        // file doens't exist
        console.info("File doesn't exist, won't remove it.");
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        console.error("Error occurred while trying to remove file");
      } else {
        console.info(`removed`);
      }
    });
    res.status(200).send("Deleted successfully");
  } catch (error) {
    res.status(401).json(error.message);
  }
};

module.exports = DeleteModelForBot;
