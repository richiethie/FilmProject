const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if username or email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user with the hashed password
      const newUser = await User.create({
        username,
        email,
        passwordHash: hashedPassword,  // Ensure this is correctly assigned
      });
  
      res.status(201).json({ message: 'User created', user: newUser });
    } catch (err) {
      console.error(err); // Log the error for more insights
      res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
  
      const user = await User.findOne({ username });
      if (!user) {
        console.error('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
  
      console.log('User found:', user);
  
      // Use the correct field name for the hashed password
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '4h' });
      res.status(200).json({ token, user });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Login error', error: err.message });
    }
};
  
