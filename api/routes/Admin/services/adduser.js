const User = require("../../../models/UserSchema");

const Addusers = async (req, res) => {
  const { firstName, lastName, email, mobile_no, roles } = req.body;

  // Validate if required fields are present in the request body
  if (!firstName || !lastName || !email || !mobile_no || !roles) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Create a new user document using the User model
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      mobile_no,
      roles,
    });

    // Respond with the newly created user document
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = Addusers;
