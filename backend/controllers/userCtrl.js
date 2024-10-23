const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a token (for example, using JWT)
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role }, // Payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response with token
    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const addUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    res.status(201).send("User added successfully");
  } catch (error) {
    res.status(500).send("Error adding user");
  }
};

module.exports = { addUser,  loginUser}
