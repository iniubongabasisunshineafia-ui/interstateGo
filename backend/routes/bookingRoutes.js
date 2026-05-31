const express = require('express')
const router = express.Router()
const QRCode = require('qrcode')
const Booking = require('../models/Booking')
const Bus = require('../models/Bus')
const sendEmail = require('../utils/sendEmail')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const generateBookingRef = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let ref = 'IGO-'
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return ref
}

const generateQRCode = async (data) => {
  return await QRCode.toDataURL(JSON.stringify(data))
}

const sendBookingConfirmation = async (user, booking, bus, route) => {
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1d4ed8; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">InterstateGo</h1>
        <p style="color: #93c5fd; margin: 5px 0;">Your Booking is Confirmed!</p>
      </div>
      <div style="padding: 30px; background: #f8fafc;">
        <p>Hi <strong>${user.name}</strong>, your trip is booked and ready to go!</p>
        <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #1d4ed8;">
          <h2 style="color: #1d4ed8; margin-top: 0;">Booking Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #64748b;">Booking Reference</td><td style="padding: 8px 0; font-weight: bold;">${booking.bookingRef}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Route</td><td style="padding: 8px 0; font-weight: bold;">${route.from} to ${route.to}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">From Terminal</td><td style="padding: 8px 0;">${route.fromTerminal}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">To Terminal</td><td style="padding: 8px 0;">${route.toTerminal}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Travel Date</td><td style="padding: 8px 0; font-weight: bold;">${new Date(booking.travelDate).toDateString()}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Departure Time</td><td style="padding: 8px 0; font-weight: bold;">${booking.departureTime}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Bus</td><td style="padding: 8px 0;">${bus.busName}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Seat Number</td><td style="padding: 8px 0; font-weight: bold; font-size: 18px;">${booking.seatNumber}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Amount Paid</td><td style="padding: 8px 0; font-weight: bold; color: #16a34a;">NGN ${booking.amountPaid.toLocaleString()}</td></tr>
          </table>
        </div>
        <div style="text-align: center; margin: 20px 0; background: #eff6ff; border-radius: 10px; padding: 20px;">
          <p style="color: #1d4ed8; font-weight: 700; margin-bottom: 8px;">Show your QR code at the park</p>
          <p style="color: #64748b; font-size: 13px;">Open the InterstateGo app, go to My Bookings and show your QR code at the park for verification.</p>
          <p style="color: #0f172a; font-size: 18px; font-weight: 800; margin-top: 12px;">Or use your booking reference: ${booking.bookingRef}</p>
        </div>
        <div style="background: #fef3c7; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;"><strong>Cancellation Policy</strong></p>
          <p style="margin: 5px 0; color: #92400e;">Full refund if cancelled 24+ hours before departure. 50% refund if cancelled less than 24 hours before.</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">Have a safe trip!</p>
      </div>
      <div style="background: #1e293b; padding: 15px; text-align: center;">
        <p style="color: #94a3b8; margin: 0; font-size: 12px;">2025 InterstateGo. All rights reserved.</p>
      </div>
    </div>
  `

  await sendEmail({
    email: user.email,
    subject: 'InterstateGo - Booking Confirmed! (' + booking.bookingRef + ')',
    message
  })
}

router.post('/', protect, async (req, res) => {
  try {
    const { busId, seatNumber, travelDate, cardNumber, cardExpiry, cardCVV } = req.body

    if (!cardNumber || !cardExpiry || !cardCVV) {
      return res.status(400).json({ message: 'Please fill in all payment details' })
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      return res.status(400).json({ message: 'Please enter a valid 16 digit card number' })
    }

    const bus = await Bus.findById(busId).populate('route')
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' })
    }

    if (!bus.isActive) {
      return res.status(400).json({ message: 'This bus is currently not available' })
    }

    const seat = bus.seats.find(s => s.seatNumber === seatNumber)
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found on this bus' })
    }

    if (!seat.isAvailable) {
      return res.status(400).json({ message: 'Sorry, this seat has already been taken' })
    }

    const existingBooking = await Booking.findOne({
      user: req.user._id,
      bus: busId,
      travelDate: new Date(travelDate),
      bookingStatus: 'confirmed'
    })

    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a booking on this bus for this date' })
    }

    let bookingRef = generateBookingRef()
    let refExists = await Booking.findOne({ bookingRef })
    while (refExists) {
      bookingRef = generateBookingRef()
      refExists = await Booking.findOne({ bookingRef })
    }

    seat.isAvailable = false
    await bus.save()

    const booking = await Booking.create({
      user: req.user._id,
      route: bus.route._id,
      bus: busId,
      seatNumber,
      travelDate: new Date(travelDate),
      departureTime: bus.departureTime,
      amountPaid: bus.price,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      bookingRef
    })

    const fullBooking = await Booking.findById(booking._id)
      .populate('route')
      .populate('bus')

    const bookingForEmail = {
      ...fullBooking.toObject(),
      bookingRef: bookingRef
    }

sendBookingConfirmation(req.user, bookingForEmail, fullBooking.bus, fullBooking.route)
  .catch(err => console.log('Booking email failed:', err.message))
    
    res.status(201).json({
      message: 'Booking successful! Check your email for your ticket.',
      booking,
      bookingRef
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('route', 'from to fromTerminal toTerminal distance duration')
      .populate('bus', 'busName busType departureTime amenities')
      .sort({ createdAt: -1 })
      .lean()

    const upcoming = bookings.filter(b => b.bookingStatus === 'confirmed')
    const completed = bookings.filter(b => b.bookingStatus === 'completed')
    const cancelled = bookings.filter(b => b.bookingStatus === 'cancelled')

    res.json({ upcoming, completed, cancelled })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('route', 'from to fromTerminal toTerminal distance duration')
      .populate('bus', 'busName busType departureTime amenities price')
      .populate('user', 'name email phone')

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' })
    }

    const qrCode = await generateQRCode({
      bookingRef: booking.bookingRef,
      passenger: booking.user.name,
      from: booking.route.from,
      to: booking.route.to,
      seat: booking.seatNumber,
      date: booking.travelDate,
      bus: booking.bus.busName
    })

    res.json({ ...booking.toObject(), qrCode })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('route', 'from to')
      .populate('bus', 'busName departureTime')

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' })
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ message: 'This booking has already been cancelled' })
    }

    if (booking.bookingStatus === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed trip' })
    }

    const now = new Date()
    const departure = new Date(booking.travelDate)
    const hoursBeforeDeparture = (departure - now) / (1000 * 60 * 60)

    let refundAmount = 0
    let refundMessage = ''

    if (hoursBeforeDeparture >= 24) {
      refundAmount = booking.amountPaid
      refundMessage = 'Full refund of NGN ' + refundAmount.toLocaleString() + ' will be processed'
    } else if (hoursBeforeDeparture > 0) {
      refundAmount = booking.amountPaid * 0.5
      refundMessage = '50% refund of NGN ' + refundAmount.toLocaleString() + ' will be processed'
    } else {
      refundAmount = 0
      refundMessage = 'No refund as departure time has passed'
    }

    booking.bookingStatus = 'cancelled'
    booking.paymentStatus = refundAmount > 0 ? 'refunded' : booking.paymentStatus
    booking.cancelledAt = new Date()
    booking.refundAmount = refundAmount
    await booking.save()

    const bus = await Bus.findById(booking.bus)
    const seat = bus.seats.find(s => s.seatNumber === booking.seatNumber)
    if (seat) {
      seat.isAvailable = true
      await bus.save()
    }

    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">InterstateGo</h1>
          <p style="color: #fca5a5; margin: 5px 0;">Booking Cancelled</p>
        </div>
        <div style="padding: 30px; background: #f8fafc;">
          <p>Hi <strong>${req.user.name}</strong>, your booking has been cancelled.</p>
          <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #64748b;">Booking Reference</td><td style="padding: 8px 0; font-weight: bold;">${booking.bookingRef}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Route</td><td style="padding: 8px 0;">${booking.route.from} to ${booking.route.to}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Seat</td><td style="padding: 8px 0;">${booking.seatNumber}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Refund</td><td style="padding: 8px 0; font-weight: bold; color: #16a34a;">${refundMessage}</td></tr>
            </table>
          </div>
          <p style="color: #64748b; font-size: 14px;">We hope to see you again soon!</p>
        </div>
        <div style="background: #1e293b; padding: 15px; text-align: center;">
          <p style="color: #94a3b8; margin: 0; font-size: 12px;">2025 InterstateGo. All rights reserved.</p>
        </div>
      </div>
    `

    sendEmail({
  email: req.user.email,
  subject: 'InterstateGo - Booking Cancelled (' + booking.bookingRef + ')',
  message
}).catch(err => console.log('Cancellation email failed:', err.message))

    res.json({ message: refundMessage, booking })

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

router.put('/:id/reschedule', protect, async (req, res) => {
  try {
    const { newBusId, newTravelDate } = req.body

    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reschedule this booking' })
    }

    if (booking.bookingStatus !== 'confirmed') {
      return res.status(400).json({ message: 'Only confirmed bookings can be rescheduled' })
    }

    const newBus = await Bus.findById(newBusId)
    if (!newBus) {
      return res.status(404).json({ message: 'New bus not found' })
    }

    const seat = newBus.seats.find(s => s.seatNumber === booking.seatNumber)
    if (!seat || !seat.isAvailable) {
      return res.status(400).json({ message: 'Seat ' + booking.seatNumber + ' is not available on this bus. Please cancel and rebook.' })
    }

    const oldBus = await Bus.findById(booking.bus)
    const oldSeat = oldBus.seats.find(s => s.seatNumber === booking.seatNumber)
    if (oldSeat) {
      oldSeat.isAvailable = true
      await oldBus.save()
    }

    seat.isAvailable = false
    await newBus.save()

    booking.bus = newBusId
    booking.travelDate = new Date(newTravelDate)
    booking.departureTime = newBus.departureTime
    await booking.save()

    res.json({ message: 'Booking rescheduled successfully!', booking })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { routeId, status, date } = req.query

    let query = {}
    if (routeId) query.route = routeId
    if (status) query.bookingStatus = status
    if (date) query.travelDate = new Date(date)

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('route', 'from to')
      .populate('bus', 'busName busType departureTime')
      .sort({ createdAt: -1 })

    const totalRevenue = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.amountPaid, 0)

    const totalRefunds = bookings
      .filter(b => b.paymentStatus === 'refunded')
      .reduce((sum, b) => sum + b.refundAmount, 0)

    const totalCancellations = bookings.filter(b => b.bookingStatus === 'cancelled').length
    const totalCompleted = bookings.filter(b => b.bookingStatus === 'completed').length

    res.json({
      stats: {
        totalBookings: bookings.length,
        totalRevenue,
        totalRefunds,
        totalCancellations,
        totalCompleted
      },
      bookings
    })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

router.put('/:id/admin-cancel', protect, adminOnly, async (req, res) => {
  try {
    const { reason } = req.body

    if (!reason) {
      return res.status(400).json({ message: 'Please provide a reason for cancellation' })
    }

    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('route', 'from to')

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ message: 'This booking is already cancelled' })
    }

    booking.bookingStatus = 'cancelled'
    booking.paymentStatus = 'refunded'
    booking.cancelledAt = new Date()
    booking.refundAmount = booking.amountPaid
    await booking.save()

    const bus = await Bus.findById(booking.bus)
    const seat = bus.seats.find(s => s.seatNumber === booking.seatNumber)
    if (seat) {
      seat.isAvailable = true
      await bus.save()
    }

    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">InterstateGo</h1>
          <p style="color: #fca5a5;">Booking Cancelled by Admin</p>
        </div>
        <div style="padding: 30px;">
          <p>Hi <strong>${booking.user.name}</strong>,</p>
          <p>Your booking <strong>${booking.bookingRef}</strong> for <strong>${booking.route.from} to ${booking.route.to}</strong> has been cancelled by our team.</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p style="color: #16a34a;"><strong>A full refund of NGN ${booking.amountPaid.toLocaleString()} will be processed.</strong></p>
          <p>We sincerely apologize for the inconvenience.</p>
        </div>
      </div>
    `

    sendEmail({
  email: booking.user.email,
  subject: 'InterstateGo - Important: Your Booking Has Been Cancelled',
  message
}).catch(err => console.log('Email failed:', err.message))

    res.json({ message: 'Booking cancelled and passenger notified', booking })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

router.put('/:id/complete', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    booking.bookingStatus = 'completed'
    await booking.save()

    res.json({ message: 'Booking marked as completed', booking })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

module.exports = router