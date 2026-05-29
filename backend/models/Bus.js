const mongoose = require('mongoose')

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true // e.g "1A", "1B", "2A", "2B"
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
})

const busSchema = new mongoose.Schema({
  busName: {
    type: String,
    required: true // e.g "InterstateGo Coaster 1"
  },
  busNumber: {
    type: String,
    required: true,
    unique: true // e.g "BUS-001"
  },
  busType: {
    type: String,
    enum: ['coaster', 'hiace'],
    required: true
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  totalSeats: {
    type: Number,
    required: true // 30 for coaster, 16 for hiace
  },
  seats: [seatSchema],
  departureTime: {
    type: String,
    required: true // e.g "7:00 AM"
  },
  price: {
    type: Number,
    required: true // calculated from route basePrice
  },
  amenities: {
    ac: { type: Boolean, default: true },
    wifi: { type: Boolean, default: false },
    usb: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Bus', busSchema)