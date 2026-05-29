const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    trim: true // e.g "Lagos"
  },
  to: {
    type: String,
    required: true,
    trim: true // e.g "Abuja"
  },
  fromTerminal: {
    type: String,
    required: true // e.g "Jibowu Park, Lagos"
  },
  toTerminal: {
    type: String,
    required: true // e.g "Utako Park, Abuja"
  },
  distance: {
    type: Number,
    required: true // in KM
  },
  duration: {
    type: String,
    required: true // e.g "6 hours 30 mins"
  },
  departureTime: {
    type: String,
    required: true // e.g "7:00 AM"
  },
  basePrice: {
    type: Number,
    required: true // in Naira
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model('Route', routeSchema)