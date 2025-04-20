const express = require("express");
const GetProfile = require("./services/getProfile");
const EditProfile = require("./services/editProfile");
const forgetPassword = require("../Auth/services/forgotPassword");
const UpdatePassword = require("./services/updatePassword");

const router = express.Router();

router.get("/", GetProfile);
router.put("/edit", EditProfile);
router.get("/forgotPassword", forgetPassword);
router.put("/updatepassword", UpdatePassword);

module.exports = router;
