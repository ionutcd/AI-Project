const express = require("express");
const addStyle = require("./services/addStyle");
const getStyles = require("./services/getStyles");

const router = express.Router();

router.get("/get", getStyles);

router.post("/addStyle", addStyle);

module.exports = router;
