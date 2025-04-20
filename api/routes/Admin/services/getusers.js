const User = require("../../../models/UserSchema");

const GetUsers = async (req, res) => {
  try {
    const allusers = await User.find();
    if (!allusers) {
      return res.status(400).send("No record found");
    }
    res.status(200).json(allusers);
  } catch (error) {
    res.status(501).json(error);
  }
};

module.exports = GetUsers;
