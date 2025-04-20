const CryptoJS = require("crypto-js");
const Chatbot = require("../../../models/Chatbot");
const jwt = require("jsonwebtoken");

const VerifyHashURL = async (req, res) => {
  try {
    const { org, app, email } = req.body;
    console.log("org---------", org);
    console.log("app---------", app);
    console.log("email---------", email);
    const orgString = org
      .toString()
      .replaceAll("xMl3Jk", "+")
      .replaceAll("Por21Ld", "/")
      .replaceAll("Ml32", "=");

    const orgBytes = CryptoJS.AES.decrypt(orgString, process.env.CRYPTO_KEY);
    const org_id = orgBytes.toString(CryptoJS.enc.Utf8);

    const appString = app
      .toString()
      .replaceAll("xMl3Jk", "+")
      .replaceAll("Por21Ld", "/")
      .replaceAll("Ml32", "=");

    const appBytes = CryptoJS.AES.decrypt(appString, process.env.CRYPTO_KEY);
    const app_id = appBytes.toString(CryptoJS.enc.Utf8);

    const emailString = email
      .toString()
      .replaceAll("xMl3Jk", "+")
      .replaceAll("Por21Ld", "/")
      .replaceAll("Ml32", "=");

    const emailBytes = CryptoJS.AES.decrypt(
      emailString,
      process.env.CRYPTO_KEY
    );
    const emailStr = emailBytes.toString(CryptoJS.enc.Utf8);

    const chatbot = await Chatbot.findOne({
      user_id: emailStr,
      app_id,
      org_id,
    });
    if (!chatbot) {
      res.status(422).json({ error: "This chatbot isn't exist" });
    } else {
      const token = jwt.sign({ _id: chatbot._id }, process.env.JWT_SECRET);
      const { _id, app_id, org_id, user_id, avatar, url, description } =
        chatbot;
      const result = {
        _id,
        app_id,
        org_id,
        user_id,
        avatar,
        url,
        description,
        token,
      };
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(501).json(error);
    console.log("catch block error", error);
  }
};

module.exports = VerifyHashURL;
