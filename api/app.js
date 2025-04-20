const express = require("express");
const app = express();
const cors = require("cors");
const env = require("dotenv").config();
const connectDb = require("./db/connection");
const runtimeConfig = require("./config/runtimeConfig");
const AuthRoutes = require("./routes/Auth");
const AdminRoutes = require("./routes/Admin");
const UserQueryRoutes = require("./routes/UserQuery");
const ProfileRoutes = require("./routes/Profile");
const PromptRoutes = require("./routes/Prompt");
const LlmOptionRoutes = require("./routes/LlmOption");
const UserStyle = require("./routes/UserStyle");
const Other = require("./routes/Other");
const validateToken = require("./middleware/tokenauthenticate");
const validateBotToken = require("./middleware/bottokenauthenticate");

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
// connectDb();
const PORT = process.env.PORT;
const ENV = process.env.ENV;
app.use("/api/auth", AuthRoutes);
app.use("/api/admin", validateToken, AdminRoutes);
app.use("/api/user_query", validateToken, UserQueryRoutes);
app.use("/api/profile", validateToken, ProfileRoutes);
app.use("/api/prompt", validateToken, PromptRoutes);
app.use("/api/llm_option", validateToken, LlmOptionRoutes);
app.use("/api/user_style", validateToken, UserStyle);
app.use("/api/other", Other);
app.use("/api/user_query_bubble", validateBotToken, UserQueryRoutes);
runtimeConfig();
app.get("/", (req, res) => {
  res.send("Running Server");
});
const server = app.listen(
  PORT,
  ENV == "prod" ? "0.0.0.0" : "127.0.0.1",
  function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log(server.address());
    console.log("running at http://" + host + ":" + port);
  }
);
