const express = require("express");
const GetQuery = require("./services/getQuery");
const UploadFile = require("./services/uploadFile");
const UploadURL = require("./services/uploadURL");
const speechText = require("./services/speechText");
const StoreVectorDB = require("./services/storeVectorDB");
const RetrainModel = require("./services/retrainModel");
const RetrainAllModels = require("./services/retrainAllModels");
const { Chat } = require("./services/chat");
const GetAllFiles = require("./services/getAllFiles");
const GetAllBotFiles = require("./services/getAllBotFiles");
const GetSingleFile = require("./services/getSingleFile");
const LlmTemp = require("./services/llmTemp");
const LlmKey = require("./services/llmKey");
const DeleteModel = require("./services/deleteModel");
const DeleteModelForBot = require("./services/deleteModelForBot");
const DeleteChat = require("./services/deleteChat");
const SetActiveModel = require("./services/setActiveModel");
const GetActiveModel = require("./services/getActiveModel");

const router = express.Router();

router.get("/", GetQuery);
router.post("/retrainModel", RetrainModel);
router.post("/retrainAllModels", RetrainAllModels);
router.post("/chat", Chat);
router.get("/getAllFiles", GetAllFiles);
router.post("/getAllBotFiles", GetAllBotFiles);
router.post("/getSingleFile", GetSingleFile);
router.post("/setLlmTemp", LlmTemp);
router.post("/setLlmKey", LlmKey);
router.post("/deleteModel", DeleteModel);
router.post("/deleteModelForBot", DeleteModelForBot);
router.post("/deleteChat", DeleteChat);
router.post("/setActiveModel", SetActiveModel);
router.get("/getActiveModel", GetActiveModel);
router.post("/storeVectorDB", StoreVectorDB);
router.post("/uploadURL", UploadURL);
router.get("/get-speech-token", speechText);

router.use(UploadFile);

module.exports = router;
