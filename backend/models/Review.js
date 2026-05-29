const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true // one review per booking only
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  routeRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  busRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  photo: {
    type: String,
    default: null // optional photo url
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  unhelpful: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  adminReply: {
    comment: { type: String, default: null },
    repliedAt: { type: Date, default: null }
  },
  isVisible: {
    type: Boolean,
    default: true // admin can hide reviews
  }
}, { timestamps: true })

module.exports = mongoose.model('Review', reviewSchema)