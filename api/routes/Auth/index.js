const express = require("express");
const Register = require("./services/register");
const VerifyEmail = require("./services/verifyEmail");
const GoogleRegister = require("./services/googleRegister");
const Login = require("./services/login");
// const validateToken = require("../../middleware/tokenauthenticate");
const forgetPassword = require("./services/forgotPassword");
const router = express.Router();

router.post("/googleRegister", GoogleRegister);
router.post("/register", Register);
router.post("/verifyEmail", VerifyEmail);
router.post("/login", Login);
router.post("/forgotpassword", forgetPassword);

module.exports = router;
