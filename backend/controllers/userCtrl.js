const User = require("../models/userModel");

const addUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if the requester is an admin
    if (req.user.role !== "admin") {
      return res.status(403).send("Only admins can add users");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || "user", // default role is 'user'
    });

    await newUser.save();
    res.status(201).send("User added successfully");
  } catch (error) {
    res.status(500).send("Error adding user");
  }
};

module.exports = { addUser };
