const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const Booking = require('../models/Booking')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// @route  POST /api/reviews
// @desc   Passenger leaves a review after completed trip
router.post('/', protect, async (req, res) => {
  try {
    const { bookingId, routeRating, busRating, comment, photo } = req.body

    // find the booking
    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // make sure it belongs to this passenger
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this booking' })
    }

    // only completed trips can be reviewed
    if (booking.bookingStatus !== 'completed') {
      return res.status(400).json({ message: 'You can only review a trip after it has been completed' })
    }

    // check if this booking already has a review
    const existingReview = await Review.findOne({ booking: bookingId })
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this trip' })
    }

    const review = await Review.create({
      user: req.user._id,
      booking: bookingId,
      route: booking.route,
      bus: booking.bus,
      routeRating,
      busRating,
      comment,
      photo: photo || null
    })

    res.status(201).json({ message: 'Review submitted successfully!', review })

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  GET /api/reviews/route/:routeId
// @desc   Get all reviews for a route sorted by most liked
router.get('/route/:routeId', async (req, res) => {
  try {
    const reviews = await Review.find({
      route: req.params.routeId,
      isVisible: true
    })
      .populate('user', 'name profilePicture')
      .populate('bus', 'busName busType')
      .sort({ createdAt: -1 })

    // sort by most liked
    reviews.sort((a, b) => b.likes.length - a.likes.length)

    // calculate average ratings
    const totalReviews = reviews.length
    const avgRouteRating = totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.routeRating, 0) / totalReviews).toFixed(1)
      : 0

    const avgBusRating = totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.busRating, 0) / totalReviews).toFixed(1)
      : 0

    res.json({
      totalReviews,
      avgRouteRating,
      avgBusRating,
      reviews
    })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  GET /api/reviews/bus/:busId
// @desc   Get all reviews for a specific bus
router.get('/bus/:busId', async (req, res) => {
  try {
    const reviews = await Review.find({
      bus: req.params.busId,
      isVisible: true
    })
      .populate('user', 'name profilePicture')
      .sort({ createdAt: -1 })

    reviews.sort((a, b) => b.likes.length - a.likes.length)

    const totalReviews = reviews.length
    const avgBusRating = totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.busRating, 0) / totalReviews).toFixed(1)
      : 0

    res.json({ totalReviews, avgBusRating, reviews })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  PUT /api/reviews/:id
// @desc   Passenger edits their review within 24 hours
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // make sure it belongs to this passenger
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this review' })
    }

    // check if within 24 hours
    const hoursSinceSubmission = (Date.now() - review.createdAt) / (1000 * 60 * 60)
    if (hoursSinceSubmission > 24) {
      return res.status(400).json({ message: 'Reviews can only be edited within 24 hours of submitting' })
    }

    const { routeRating, busRating, comment, photo } = req.body

    review.routeRating = routeRating || review.routeRating
    review.busRating = busRating || review.busRating
    review.comment = comment || review.comment
    review.photo = photo || review.photo
    await review.save()

    res.json({ message: 'Review updated successfully!', review })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  PUT /api/reviews/:id/like
// @desc   Passenger likes a review
router.put('/:id/like', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    const alreadyLiked = review.likes.includes(req.user._id)

    if (alreadyLiked) {
      // unlike it
      review.likes = review.likes.filter(id => id.toString() !== req.user._id.toString())
    } else {
      // remove from unhelpful if they switch
      review.unhelpful = review.unhelpful.filter(id => id.toString() !== req.user._id.toString())
      review.likes.push(req.user._id)
    }

    await review.save()
    res.json({ message: alreadyLiked ? 'Like removed' : 'Review liked', review })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  PUT /api/reviews/:id/unhelpful
// @desc   Passenger marks a review as unhelpful
router.put('/:id/unhelpful', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    const alreadyMarked = review.unhelpful.includes(req.user._id)

    if (alreadyMarked) {
      review.unhelpful = review.unhelpful.filter(id => id.toString() !== req.user._id.toString())
    } else {
      // remove from likes if they switch
      review.likes = review.likes.filter(id => id.toString() !== req.user._id.toString())
      review.unhelpful.push(req.user._id)
    }

    await review.save()
    res.json({ message: alreadyMarked ? 'Removed unhelpful mark' : 'Marked as unhelpful', review })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  PUT /api/reviews/:id/admin-reply
// @desc   Admin replies to a review
router.put('/:id/admin-reply', protect, adminOnly, async (req, res) => {
  try {
    const { comment } = req.body

    if (!comment) {
      return res.status(400).json({ message: 'Please provide a reply' })
    }

    const review = await Review.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    review.adminReply = {
      comment,
      repliedAt: new Date()
    }

    await review.save()
    res.json({ message: 'Reply added successfully!', review })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

// @route  DELETE /api/reviews/:id
// @desc   Admin removes a review
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    review.isVisible = false
    await review.save()

    res.json({ message: 'Review removed successfully' })

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

module.exports = router