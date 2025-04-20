const express = require("express");
const multer = require("multer");
const fs = require("fs");
const validateToken = require("../../../middleware/tokenauthenticate");
const router = express.Router();
const ChatbotModel = require("../../../models/Chatbot");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      const path = "uploads/avatar";
      fs.mkdirSync(path, { recursive: true });
      callback(null, path);
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + "-" + file.originalname);
    },
  }),
}).single("file");

const UploadAvatar = router.post(
  "/uploadAvatar",
  validateToken,
  upload,
  async (req, res) => {
    try {
      const { filename } = req.file;
      const id = req.body.id;
      console.log("hisa----", id);
      const filteredBot = await ChatbotModel.findById(id);
      filteredBot.avatar = filename;
      const result = await filteredBot.save();
      res.status(200).json({ result });
    } catch (error) {
      res.status(401).json(error.message);
      console.log("uploading avatar err-------", error);
    }
  }
);

module.exports = UploadAvatar;
