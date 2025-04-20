const express = require("express");
const SetLLMOption = require("./services/setLLMOption");
const GetLLMOption = require("./services/getLLMOption");
const GetLLMOptionWithUser = require("./services/getLLMOptionWithUser");

const router = express.Router();

router.post("/setLLMOption", SetLLMOption);
router.get("/getLLMOption", GetLLMOption);
router.get("/getOptionWithUser", GetLLMOptionWithUser);

module.exports = router;
