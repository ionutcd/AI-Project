const User = require("../../../models/UserSchema");
const Userquery = require("../../../models/UserQuery");
const jwt = require("jsonwebtoken");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const CryptoJS = require("crypto-js");
const { activePrompt, allPrompts } = require("../../../prompts");

const Register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    mobile_no,
    password,
    is_EV,
    confirmPassword,
    roles,
    state,
  } = req.body;
  if (state === "user") {
    if (req.body._id) {
      if (!firstName || !lastName || !email) {
        return res
          .status(400)
          .json({ error: "Invalid Payload alredy exist user admin" });
      }
    } else {
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res
          .status(400)
          .json({ error: "Invalid Payload  new user in admin" });
      }
    }
  } else {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !mobile_no ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ error: "Invalid Payload" });
    }
  }

  try {
    if (req.body._id) {
      let userData = await User.findById(req.body._id);

      userData.firstName = req.body.firstName;
      userData.lastName = req.body.lastName;
      userData.email = req.body.email;
      userData.mobile_no = req.body.mobile_no;
      userData.roles = req.body.roles;
      userData.password = req.body.password;

      await userData.save();

      res.status(200).json({ message: "update" });
    } else {
      const user = await User.findOne({ email });
      if (user) {
        res.status(422).json({ error: "This Email is Already Exist" });
      } else if (password !== confirmPassword) {
        res
          .status(400)
          .json({ error: "Password and Confirm password must be same" });
      } else {
        const finalUser = new User({
          firstName,
          lastName,
          email,
          mobile_no,
          password,
          roles,
          is_EV,
        });
        // Password Hashing
        const token = jwt.sign({ _id: finalUser._id }, process.env.JWT_SECRET);
        const storeData = await finalUser.save();
        const userQueryData = new Userquery({
          user_id: storeData._id,
          activePrompt,
        });
        await userQueryData.save();
        if (state !== "user") {
          // mail sending
          const mailgun = new Mailgun(formData);
          const mg = mailgun.client({
            username: "api",
            key: process.env.MAILGUN_API_KEY || "",
          });
          const e_token = CryptoJS.AES.encrypt(email, process.env.CRYPTO_KEY)
            .toString()
            .replaceAll("+", "xMl3Jk")
            .replaceAll("/", "Por21Ld")
            .replaceAll("=", "Ml32");
          const p_token = CryptoJS.AES.encrypt(password, process.env.CRYPTO_KEY)
            .toString()
            .replaceAll("+", "xMl3Jk")
            .replaceAll("/", "Por21Ld")
            .replaceAll("=", "Ml32");
          const registrationURL = `${process.env.MY_DOMAIN}/signup?etoken=${e_token}&ptoken=${p_token}`;
          const messageData = {
            from: `IYKYK team <noreply@${process.env.MAILGUN_DOMAIN}> `,
            to: email,
            subject: `Please verify your email`,
            text: `Click on the following link to complete your registration: ${registrationURL}`,
          };

          await mg.messages.create(process.env.MAILGUN_DOMAIN, messageData);
        }
        const result = {
          _id: storeData._id,
          firstName,
          lastName,
          email,
          mobile_no,
          roles: storeData.roles,
          token,
          is_EV: storeData.is_EV,
        };

        res.status(200).json(result);
      }
    }
  } catch (error) {
    res.status(501).json(error);
    console.log("catch block error", error);
  }
};

module.exports = Register;
