const Userupload = require("../../../models/UserUpload");
const fs = require("fs");
const DeleteModel = async (req, res) => {
  const { id, path } = req.body;
  if (!id && !path) {
    return res.status(400).send("Invalid payload");
  }
  try {
    await Userupload.findByIdAndDelete(id);

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
    // let userIndex = await indexStore.find((item) => item.user == req.token._id);

    // console.log("index store called---------", indexStore);
    // console.log("userindex called---------", userIndex);
    // if (userIndex) {
    //   userIndex[activePrompt] = userIndex[activePrompt] || [];
    //   const filteredIndexs = userIndex.indexes[activePrompt].filter(
    //     (index) => index.fileId != id
    //   );
    //   userIndex = filteredIndexs;

    //   //   userIndex.indexes[activePrompt] = filteredIndexs;
    //   indexStore[0].indexes[activePrompt] = filteredIndexs;

    //   //   indexStore = { ...indexStore[0], system: filteredIndexs };
    //   console.log("delete model called---------", indexStore[0]);
    //   // return res.status(400).send('No retrained model found, please retrain first to continue with your queries')
    // }
    res.status(200).send("Deleted successfully");
  } catch (error) {
    res.status(401).json(error.message);
  }
};

module.exports = DeleteModel;
