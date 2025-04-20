const UserUpload = require("../../../models/UserUpload");

const GetAllFiles = async (req, res) => {
  try {
    const upload_data = await UserUpload.find({ owner: req.token._id });
    res.status(200).json({ result: upload_data });
  } catch (error) {
    res.status(401).json(error.message);
  }
};

module.exports = GetAllFiles;
