const LLMOption = require("../../../models/LLMOption");

const GetLLMOption = async (req, res) => {
  try {
    const llm_option = await LLMOption.findOne({ user_id: req.token._id });
    res.status(200).send(llm_option);
  } catch (error) {
    res.status(501).send(error.message);
    console.log("getting llm options------------", error);
  }
};

module.exports = GetLLMOption;
