const UserStyle = require("../../../models/UserStyle");

const GetStyles = async (req, res) => {
  try {
    if (req.query?.type === "default") {
      res.status(200).json(await UserStyle.find({ is_default: true }));
    } else {
      styles = await UserStyle.find({ userId: req.token._id });
      if (styles.length > 0) {
        res.status(200).json(styles);
      } else {
        res.status(200).json(await UserStyle.find({ is_default: true }));
      }
    }
  } catch (error) {
    res.status(501).json(error);
  }
};

module.exports = GetStyles;
