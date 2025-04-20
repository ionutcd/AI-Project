const Chatbot = require("../models/Chatbot");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

const botValidateToken = async (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(400).json({ msg: "Unauthorized request" });
  }

  try {
    const token = req.headers.authorization;
    const verifiedToken = jwt.verify(token, secretKey);

    if (verifiedToken._id) {
      const chatbot = await Chatbot.findById(verifiedToken._id);
      if (chatbot) {
        req.token = verifiedToken;
        next();
      } else {
        res.status(400).send("Invalid token");
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).send(error.message);
  }
};

module.exports = botValidateToken;
