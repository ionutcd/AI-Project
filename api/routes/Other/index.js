const express = require("express");
const VerifyHashURL = require("./services/VerifyHashURL");
const GetChatbotURL = require("./services/GetChatbotURL");
const router = express.Router();

router.post("/verifyHashURL", VerifyHashURL);
router.post("/getChatbotURL", GetChatbotURL);

module.exports = router;
