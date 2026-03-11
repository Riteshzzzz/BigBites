const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { z } = require('zod');

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/),
  role: z.enum(['customer', 'admin', 'restaurant_owner', 'delivery_person']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

exports.register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const userExists = await User.findOne({ email: validatedData.email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const user = await User.create(validatedData);

    const token = generateToken(user._id, user.email, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        userId: user._id,
        token
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await User.findOne({ email: validatedData.email });

    if (!user || !(await user.comparePassword(validatedData.password))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, error: 'Account has been deactivated' });
    }

    const token = generateToken(user._id, user.email, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.logout = async (req, res) => {
  // For JWT, logout is primarily handled on the client by removing the token.
  // We can just send a success response.
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // TODO: Generate reset token, save to DB, send email
    res.json({
      success: true,
      message: 'Password reset link sent to email (Mocked)'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // TODO: Verify token, update password
    res.json({
      success: true,
      message: 'Password reset successful (Mocked)'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
