const mongoose = require("mongoose");
const env = require("dotenv").config();
const Roles = require("../models/Roles");
const UserStyle = require("../models/UserStyle");

const connectDb = async () => {
  try {
    const env = process.env.ENV;
    const mongo_url =
      env === "dev" ? process.env.MONGODB_URL : process.env.AZURE_MONGODB_URL;
    const connect = await mongoose.connect(mongo_url);
    console.log("Database connected: ");

    const role_data = await Roles.find();
    if (role_data.length === 0) {
      const initialData = [
        { title: "Admin", value: 0 },
        { title: "Employee", value: 1 },
        { title: "User", value: 2 },
        { title: "Chat-bot", value: 3 },
      ];
      await Roles.insertMany(initialData);
      console.log("Initial Role data inserted successfully");
    }
    const style_data = await UserStyle.find();
    if (style_data.length === 0) {
      const initData = [
        {
          chat_back: "#171717",
          first_question: "How can I help today!",
          font_color: "#ffffff",
          font_size: 25,
          sidebar_back: "#00000",
          sidebar_hover: "#333333",
          sidebar_setting_back: "#202123",
          text_title: "IYKYK Agent",
          theme_state: "true",
          is_default: true,
        },
      ];
      await UserStyle.insertMany(initData);
      console.log("Initial Style data inserted successfully");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDb;
