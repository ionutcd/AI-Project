const LLMOption = require("../../../models/LLMOption");
const UserModel = require("../../../models/UserSchema");

const GetLLMOptionwithUser = async (req, res) => {
  try {
    const users = await UserModel.find();
    const promises = users.map(async (item) => {
      const llm_option = await LLMOption.findOne({ user_id: item._id });
      return { user: item, llm_data: llm_option };
    });

    const data = await Promise.all(promises);
    res.status(200).send(data);
  } catch (error) {
    res.status(501).send(error.message);
    console.log("getting llm options with users------------", error);
  }
};

module.exports = GetLLMOptionwithUser;
