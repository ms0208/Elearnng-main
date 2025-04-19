import User from '../models/user.js';
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields (name, email, password, role) are required' });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with the same email already exists' });
    }

    // Create a new user
    const newUser = new User({ name, email, password, role });
    const savedUser = await newUser.save();

    // Create JWT token (corrected syntax)
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SK, { expiresIn: '5d' });

    // Send response
    res.status(201).json({ message: 'User created successfully', user: savedUser, "token":token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// READ all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ one user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE user by ID
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE user by ID
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneByIdAndDelete({ userid: req.params.userid });
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN user (basic)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ $or: [{ email }, { password}] });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Create JWT token (corrected syntax)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SK, { expiresIn: '5d' });

    // Optional: implement token system or session if needed
    res.status(200).json({ message: 'Login successful', user , "token":token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
