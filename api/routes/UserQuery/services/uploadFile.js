const express = require("express");
const multer = require("multer");
const fs = require("fs");
const validateToken = require("../../../middleware/tokenauthenticate");
const UserSchema = require("../../../models/UserSchema");
const UserUpload = require("../../../models/UserUpload");
const BotUpload = require("../../../models/BotUpload");
const { serverInfo } = require("./chat");
const router = express.Router();
const { BlockBlobClient } = require("@azure/storage-blob");
const path = require("path");

const ENV = process.env.ENV;

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      const path = "uploads/" + req.token._id;
      fs.mkdirSync(path, { recursive: true });
      callback(null, path);
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + "-" + file.originalname);
    },
  }),
}).single("file");

const getBlobName = async (originalName, token_id) => {
  const user = await UserSchema.findOne({ _id: token_id });
  const identifier = Math.random().toString().replace(/0\./, ""); // remove "0." from start of string
  return user
    ? `${user.email}-${originalName}`
    : `${identifier}-${originalName}`;
};

const UploadFile = router.post(
  "/uploadFile",
  validateToken,
  upload,
  async (req, res) => {
    try {
      const { filename, path, size } = req.file;
      if (ENV === "prod") {
        const blobName = await getBlobName(filename, req.token._id);
        const blobService = new BlockBlobClient(
          process.env.AZURE_STORAGE_CONNECTION_STRING,
          process.env.AZURE_CONTAINER_NAME,
          blobName
        );

        blobService
          .uploadFile(path)
          .then(() => {
            // fs.unlinkSync(path);
            console.log("------file upload success");
          })
          .catch((err) => {
            if (err) {
              console.log("------file upload error", err);
              return;
            }
          });
      }

      const upload_data = {
        name: filename,
        owner: req.token._id,
        type: "File",
        size,
        path: path,
      };

      const new_upload = new UserUpload(upload_data);
      const result = await new_upload.save();

      serverInfo.restarted = false;
      res.status(200).json({ result });
    } catch (error) {
      res.status(401).json(error.message);
      console.log("err", error);
    }
  }
);

const uploadForBot = multer({ storage: multer.memoryStorage() }).single("file");

const handleFileUploadForBot = async (req, res, next) => {
  const app_id = req.body.app_id; // Get app_id from the request body

  if (!app_id) {
    return res.status(400).json({ error: "app_id is required" });
  }

  const uploadPath = path.join("uploads/chatbot", app_id);
  fs.mkdirSync(uploadPath, { recursive: true });

  const filename = Date.now() + "-" + req.file.originalname;
  const filePath = path.join(uploadPath, filename);

  fs.writeFile(filePath, req.file.buffer, (err) => {
    if (err) {
      return next(err);
    }
    req.file.path = filePath;
    req.file.filename = filename;
    next();
  });
};

const uploadFileForBot = router.post(
  "/uploadFileForBot",
  validateToken,
  uploadForBot,
  handleFileUploadForBot,
  async (req, res) => {
    try {
      const { filename, path, size } = req.file;
      const app_id = req.body.app_id;
      const org_id = req.body.org_id;
      if (ENV === "prod") {
        const blobName = await getBlobName(filename, req.token._id);
        const blobService = new BlockBlobClient(
          process.env.AZURE_STORAGE_CONNECTION_STRING,
          process.env.AZURE_CONTAINER_NAME,
          blobName
        );

        blobService
          .uploadFile(path)
          .then(() => {
            // fs.unlinkSync(path);
            console.log("------file upload success");
          })
          .catch((err) => {
            if (err) {
              console.log("------file upload error", err);
              return;
            }
          });
      }

      const upload_data = {
        name: filename,
        app_id,
        org_id,
        type: "File",
        size,
        path: path,
      };

      const new_upload = new BotUpload(upload_data);
      const result = await new_upload.save();

      serverInfo.restarted = false;
      res.status(200).json({ result });
    } catch (error) {
      res.status(401).json(error.message);
      console.log("err", error);
    }
  }
);

module.exports = UploadFile;
