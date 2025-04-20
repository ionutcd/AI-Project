const UserStyle = require("../../../models/UserStyle");

const AddStyle = async (req, res) => {
  const {
    userId,
    chat_back,
    first_question,
    font_color,
    font_size,
    sidebar_back,
    sidebar_hover,
    sidebar_setting_back,
    text_title,
    theme_state,
  } = req.body.value;

  try {
    const style_data = await UserStyle.find({ userId });

    if (style_data.length > 0) {
      style_data[0].chat_back = chat_back;
      style_data[0].first_question = first_question;
      style_data[0].font_color = font_color;
      style_data[0].font_size = font_size;
      style_data[0].sidebar_back = sidebar_back;
      style_data[0].sidebar_hover = sidebar_hover;
      style_data[0].sidebar_setting_back = sidebar_setting_back;
      style_data[0].text_title = text_title;
      style_data[0].theme_state = theme_state;
      style_data[0].userId = userId;

      const new_user_query = new UserStyle(style_data[0]);
      const result = await new_user_query.save();
      res.status(200).json(result);
    } else {
      const newUser = await UserStyle.create({
        userId,
        chat_back,
        first_question,
        font_color,
        font_size,
        sidebar_back,
        sidebar_hover,
        sidebar_setting_back,
        text_title,
        theme_state,
      });

      res.status(201).json(newUser);
    }
  } catch (error) {
    console.error("Error adding/updating user styles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = AddStyle;
