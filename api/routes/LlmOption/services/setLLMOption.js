const LLMOption = require("../../../models/LLMOption");

const setLLMOption = async (req, res) => {
  try {
    const { gpt, llmKey, llmTemp, userId } = req.body;
    const uid = userId ? userId : req.token._id;
    const llm_option = await LLMOption.findOne({ user_id: uid });
    if (llm_option) {
      gpt && (llm_option.gpt_name = gpt);
      llmKey && (llm_option.llm_key = llmKey);
      llmTemp && (llm_option.llm_temperature = llmTemp);
    }
    const new_llmoption = llm_option
      ? llm_option
      : {
          user_id: uid,
          gpt_name: gpt ? gpt : "",
          llm_key: llmKey ? llmKey : "",
          llm_temperature: llmTemp ? llmTemp : 0,
        };

    const llmData = new LLMOption(new_llmoption);
    const saved = await llmData.save();
    res.status(200).send(saved);
  } catch (error) {
    res.status(501).send(error.message);
    console.log("error occure in saving llm options-----", error);
  }
};

module.exports = setLLMOption;
