const ChatbotOrgModel = require("../../../models/ChatbotOrg");
const ChatbotAppModel = require("../../../models/ChatbotApp");
const ChatbotModel = require("../../../models/Chatbot");
const MakeHashURL = require("../../Admin/services/MakeHashURL");
const GetChatbotURL = async (req, res) => {
  try {
    const { org_id, app_id, user_id } = req.body;
    let orgId, appId;
    const orgData = await ChatbotOrgModel.findOneAndUpdate(
      { name: org_id },
      { name: org_id },
      { upsert: true, new: true, runValidators: true }
    );
    orgId = orgData._id;

    const appData = await ChatbotAppModel.findOneAndUpdate(
      { name: app_id },
      { name: app_id, org_id: orgId },
      { upsert: true, new: true, runValidators: true }
    );
    appId = appData._id;

    const hashURL = MakeHashURL({
      org: orgId.toString(),
      app: appId.toString(),
      email: user_id.toString(),
    });

    await ChatbotModel.findOneAndUpdate(
      { app_id: appId, org_id: orgId, user_id: user_id },
      {
        app_id: appId,
        org_id: orgId,
        user_id: user_id,
        url: hashURL,
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json(hashURL);
  } catch (error) {
    res.status(501).json(error);
    console.log("catch block error", error);
  }
};

module.exports = GetChatbotURL;
