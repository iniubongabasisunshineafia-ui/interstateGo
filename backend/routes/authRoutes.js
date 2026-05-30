const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// @route  POST /api/auth/register
// @desc   Register a new passenger
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    // check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' })
    }

    // generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // create the user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      verificationToken
    })

    // send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`
    const message = `
      <h2>Welcome to InterstateGo, ${name}!</h2>
      <p>Thanks for signing up. Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}" style="background:#1d4ed8;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Verify Email</a>
      <p>If you didn't create an account, just ignore this email.</p>
    `

  
// send email in background - don't wait for it
sendEmail({
  email: user.email,
  subject: 'InterstateGo - Verify Your Email',
  message
}).catch(emailErr => console.log('Email sending failed:', emailErr.message))

res.status(201).json({
  message: 'Registration successful! Please check your email to verify your account.',
  verificationToken: user.verificationToken
})

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  GET /api/auth/verify-email/:token
// @desc   Verify email address
router.get('/verify-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link' })
    }

    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    res.json({ message: 'Email verified successfully! You can now log in.' })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  POST /api/auth/login
// @desc   Login passenger
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // find the user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' })
    }

    // check password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  POST /api/auth/forgot-password
// @desc   Send password reset email
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' })
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetToken
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes
    await user.save()

    // send reset email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    const message = `
      <h2>InterstateGo Password Reset</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background:#1d4ed8;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Reset Password</a>
      <p>This link expires in 10 minutes.</p>
      <p>If you didn't request this, just ignore this email.</p>
    `

  try {
  await sendEmail({
    email: user.email,
    subject: 'InterstateGo - Password Reset Request',
    message
  })
} catch (emailErr) {
  console.log('Email sending failed:', emailErr.message)
}

res.json({ message: 'Password reset link sent to your email' })
    

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  PUT /api/auth/reset-password/:token
// @desc   Reset password
router.put('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link' })
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.json({ message: 'Password reset successful! You can now log in.' })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  GET /api/auth/me
// @desc   Get logged in user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  PUT /api/auth/me
// @desc   Update logged in user profile
router.put('/me', protect, async (req, res) => {
  try {
    const { name, phone } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.name = name || user.name
    user.phone = phone || user.phone
    await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  GET /api/auth/users
// @desc   Admin gets all users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password -verificationToken -resetPasswordToken -resetPasswordExpire')
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

module.exports = router