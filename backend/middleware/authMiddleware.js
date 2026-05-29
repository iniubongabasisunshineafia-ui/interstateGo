const jwt = require('jsonwebtoken')
const User = require('../models/User')

// protect routes - only logged in users can access
const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // grab the token from the header
      token = req.headers.authorization.split(' ')[1]

      // verify it
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // attach the user to the request
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (err) {
      res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' })
  }
}

// admin only routes
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'Not authorized as admin' })
  }
}

module.exports = { protect, adminOnly }