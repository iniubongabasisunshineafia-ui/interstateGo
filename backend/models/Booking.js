const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  bookingRef: {
    type: String,
    default: null
  },
  seatNumber: {
    type: String,
    required: true
  },
  travelDate: {
    type: Date,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  refundAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)