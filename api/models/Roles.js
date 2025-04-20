const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  value: { type: Number },
});

const Roles = new mongoose.model("roles", roleSchema);
module.exports = Roles;
