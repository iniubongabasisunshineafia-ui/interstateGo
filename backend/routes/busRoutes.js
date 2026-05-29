const express = require('express')
const router = express.Router()
const Bus = require('../models/Bus')
const Route = require('../models/Route')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// helper to generate seats for a bus
const generateSeats = (busType) => {
  const seats = []
  const totalSeats = busType === 'coaster' ? 30 : 16
  const seatsPerRow = 2

  for (let i = 1; i <= totalSeats / seatsPerRow; i++) {
    seats.push({ seatNumber: `${i}A`, isAvailable: true })
    seats.push({ seatNumber: `${i}B`, isAvailable: true })
  }

  return seats
}

// helper to calculate bus price based on type
const calculateBusPrice = (basePrice, busType) => {
  if (busType === 'coaster') {
    return Math.round(basePrice * 1.3) // coaster is 30% more expensive
  }
  return basePrice // hiace uses base price
}

// @route  GET /api/buses
// @desc   Get all buses (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { routeId, busType, isActive } = req.query

    let query = {}
    if (routeId) query.route = routeId
    if (busType) query.busType = busType
    if (isActive !== undefined) query.isActive = isActive === 'true'

    const buses = await Bus.find(query).populate('route', 'from to departureTime')
    res.json(buses)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  GET /api/buses/route/:routeId
// @desc   Get all buses for a specific route (passengers can see this)
router.get('/route/:routeId', async (req, res) => {
  try {
    const buses = await Bus.find({
      route: req.params.routeId,
    }).populate('route', 'from to fromTerminal toTerminal distance duration')

    // add available seat count and urgency message to each bus
    const busesWithSeatInfo = buses.map(bus => {
      const availableSeats = bus.seats.filter(s => s.isAvailable).length
      const totalSeats = bus.totalSeats
      const isFull = availableSeats === 0

      let urgencyMessage = null
      if (availableSeats <= 5 && availableSeats > 0) {
        urgencyMessage = `Only ${availableSeats} seat${availableSeats === 1 ? '' : 's'} left!`
      }

      return {
        ...bus.toObject(),
        availableSeats,
        isFull,
        urgencyMessage
      }
    })

    res.json(busesWithSeatInfo)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  GET /api/buses/:id
// @desc   Get a single bus with full seat map
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id)
      .populate('route', 'from to fromTerminal toTerminal distance duration basePrice')

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' })
    }

    const availableSeats = bus.seats.filter(s => s.isAvailable).length
    const isFull = availableSeats === 0

    let urgencyMessage = null
    if (availableSeats <= 5 && availableSeats > 0) {
      urgencyMessage = `Only ${availableSeats} seat${availableSeats === 1 ? '' : 's'} left!`
    }

    res.json({
      ...bus.toObject(),
      availableSeats,
      isFull,
      urgencyMessage
    })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  POST /api/buses
// @desc   Admin adds a new bus to a route
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { busName, busNumber, busType, routeId, departureTime, amenities } = req.body

    // check if route exists
    const route = await Route.findById(routeId)
    if (!route) {
      return res.status(404).json({ message: 'Route not found' })
    }

    // check if bus number already exists
    const existingBus = await Bus.findOne({ busNumber })
    if (existingBus) {
      return res.status(400).json({ message: 'A bus with this number already exists' })
    }

    // generate seats based on bus type
    const seats = generateSeats(busType)
    const totalSeats = busType === 'coaster' ? 30 : 16
    const price = calculateBusPrice(route.basePrice, busType)

    // set default amenities based on bus type
    const defaultAmenities = busType === 'coaster'
      ? { ac: true, wifi: false, usb: true }
      : { ac: true, wifi: false, usb: false }

    const bus = await Bus.create({
      busName,
      busNumber,
      busType,
      route: routeId,
      totalSeats,
      seats,
      departureTime,
      price,
      amenities: amenities || defaultAmenities
    })

    res.status(201).json(bus)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  PUT /api/buses/:id
// @desc   Admin updates a bus
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id)
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' })
    }

    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedBus)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  PUT /api/buses/:id/deactivate
// @desc   Admin deactivates or activates a bus
router.put('/:id/deactivate', protect, adminOnly, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id)
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' })
    }

    bus.isActive = !bus.isActive
    await bus.save()

    res.json({
      message: `Bus ${bus.isActive ? 'activated' : 'deactivated'} successfully`,
      bus
    })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  PUT /api/buses/:id/reassign
// @desc   Admin reassigns a bus to a different route
router.put('/:id/reassign', protect, adminOnly, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id)
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' })
    }

    const newRoute = await Route.findById(req.body.routeId)
    if (!newRoute) {
      return res.status(404).json({ message: 'Route not found' })
    }

    bus.route = req.body.routeId
    bus.price = calculateBusPrice(newRoute.basePrice, bus.busType)
    await bus.save()

    res.json({ message: 'Bus reassigned successfully', bus })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  PUT /api/buses/:id/reset-seats
// @desc   Admin resets all seats after trip is completed
router.put('/:id/reset-seats', protect, adminOnly, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id)
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' })
    }

    // reset all seats to available
    bus.seats = bus.seats.map(seat => ({
      ...seat.toObject(),
      isAvailable: true
    }))

    await bus.save()
    res.json({ message: 'All seats have been reset successfully', bus })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  DELETE /api/buses/:id
// @desc   Admin deletes a bus
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id)
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' })
    }

    await bus.deleteOne()
    res.json({ message: 'Bus deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

module.exports = router 