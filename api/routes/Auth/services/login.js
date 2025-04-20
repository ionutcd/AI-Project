const User = require("../../../models/UserSchema");
const Userquery = require("../../../models/UserQuery");
const Userlog = require("../../../models/UserLog");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({ error: "You are not registered...", type: 1 });
    } else {
      if (user.is_EV === false) {
        res.status(401).json({ error: "Please verify your email", type: 2 });
      } else {
        if (user && (await bcrypt.compare(password, user.password))) {
          const userquery = Userquery.findOne({ user_id: user._id });
          if (!userquery.chats) {
            const userquery_data = {
              user_id: user._id,
              chats: null,
            };
            const newUserQuery = new Userquery(userquery_data);
            await newUserQuery.save();
          }

          const user_log = await Userlog.findOne({ user_id: user._id });
          if (user_log) {
            user_log.login_time.push(Date.now());
            await user_log.save();
          } else {
            const new_log = {
              user_id: user._id,
              login_time: [Date.now()],
              direct_link: user.direct_URL || "nodata",
            };
            const new_logs = new Userlog(new_log);
            await new_logs.save();
          }
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
          const { _id, firstName, lastName, email, mobile_no, roles } = user;
          const result = {
            _id,
            firstName,
            lastName,
            email,
            mobile_no,
            roles,
            token,
          };
          res.msg = "Login Successfully";
          res.status(200).json(result);
        } else {
          res.status(401).json({ error: "Invalid email or password", type: 0 });
        }
      }
    }
  } catch (error) {
    res.status(501).json(error.message);
    console.log("login catch error", error);
  }
};

module.exports = Login;
