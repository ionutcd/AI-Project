const { VectorStoreIndex, SimpleDirectoryReader } = require("llamaindex");
const fs = require("fs");
const { indexStore } = require("./chat");

const RetrainModel = async (req, res) => {
  try {
    const { uploads } = req.body;
    if (uploads) {
      const readDir = new SimpleDirectoryReader();
      const app_id = uploads[0]?.app_id?._id;
      const data = await readDir.loadData({
        directoryPath: "./uploads/chatbot/" + app_id,
      });
      const index = await VectorStoreIndex.fromDocuments(data);

      const isPresent = indexStore.find((item) => item.app == app_id);

      if (!isPresent) {
        indexStore.push({
          user: null,
          app: app_id,
          index,
        });
      } else {
        console.log("this index has already existed");
      }

      res.status(200).json({ msg: "ok" });
    } else {
      const readDir = new SimpleDirectoryReader();
      const data = await readDir.loadData({
        directoryPath: "./uploads/" + req.token._id,
      });
      const index = await VectorStoreIndex.fromDocuments(data);

      const isPresent = indexStore.find((item) => item.user == req.token._id);

      if (!isPresent) {
        indexStore.push({
          user: req.token._id,
          app: null,
          index,
        });
      } else {
        console.log("this index has already existed");
      }

      res.status(200).json({ msg: "ok" });
    }
  } catch (error) {
    res.status(501).json(error.message);
    console.log("catch block error", error.message);
  }
};

module.exports = RetrainModel;
