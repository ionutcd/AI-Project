const Roles = require("../../../models/Roles");

const GetRoles = async (req, res) => {
  try {
    const allroles = await Roles.find();
    if (!allroles) {
      return res.status(400).send("No record found");
    }
    res.status(200).json(allroles);
  } catch (error) {
    res.status(501).json(error);
  }
};

module.exports = GetRoles;
