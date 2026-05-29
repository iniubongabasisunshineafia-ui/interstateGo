const express = require('express')
const router = express.Router()
const Route = require('../models/Route')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// @route  GET /api/routes
// @desc   Get all active routes (passengers can see this)
router.get('/', async (req, res) => {
  try {
    const { from, to, sort } = req.query

    let query = { isActive: true }

    // filter by from and to if provided
    if (from) query.from = { $regex: from, $options: 'i' }
    if (to) query.to = { $regex: to, $options: 'i' }

    let routes = await Route.find(query)

    // sort by price if requested
    if (sort === 'price_asc') {
      routes = routes.sort((a, b) => a.basePrice - b.basePrice)
    }

    res.json(routes)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  GET /api/routes/popular
// @desc   Get popular routes for homepage
router.get('/popular', async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true, isPopular: true })
    res.json(routes)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  GET /api/routes/:id
// @desc   Get a single route by id
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)

    if (!route) {
      return res.status(404).json({ message: 'Route not found' })
    }

    res.json(route)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  POST /api/routes
// @desc   Admin adds a new route
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      from,
      to,
      fromTerminal,
      toTerminal,
      distance,
      duration,
      departureTime,
      basePrice,
      isPopular
    } = req.body

    // check if this route already exists
    const existingRoute = await Route.findOne({
      from: { $regex: from, $options: 'i' },
      to: { $regex: to, $options: 'i' }
    })

    if (existingRoute) {
      return res.status(400).json({ message: 'This route already exists' })
    }

    const route = await Route.create({
      from,
      to,
      fromTerminal,
      toTerminal,
      distance,
      duration,
      departureTime,
      basePrice,
      isPopular: isPopular || false
    })

    res.status(201).json(route)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  PUT /api/routes/:id
// @desc   Admin updates a route
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)

    if (!route) {
      return res.status(404).json({ message: 'Route not found' })
    }

    const updatedRoute = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedRoute)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  PUT /api/routes/:id/deactivate
// @desc   Admin deactivates a route temporarily
router.put('/:id/deactivate', protect, adminOnly, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)

    if (!route) {
      return res.status(404).json({ message: 'Route not found' })
    }

    route.isActive = !route.isActive
    await route.save()

    res.json({
      message: `Route ${route.isActive ? 'activated' : 'deactivated'} successfully`,
      route
    })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  DELETE /api/routes/:id
// @desc   Admin deletes a route
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)

    if (!route) {
      return res.status(404).json({ message: 'Route not found' })
    }

    await route.deleteOne()
    res.json({ message: 'Route deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  POST /api/routes/request
// @desc   Passenger requests a new route
router.post('/request', protect, async (req, res) => {
  try {
    const { from, to, message } = req.body

    // for now we just send an email to admin
    // we'll hook this up properly later
    res.json({
      message: `Thank you! Your request for a route from ${from} to ${to} has been received. We'll look into it!`
    })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

module.exports = router