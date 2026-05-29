const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

// routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/routes', require('./routes/routeRoutes'))
app.use('/api/buses', require('./routes/busRoutes'))
app.use('/api/bookings', require('./routes/bookingRoutes'))
app.use('/api/reviews', require('./routes/reviewRoutes'))

// just to confirm the server is alive
app.get('/', (req, res) => {
  res.json({ message: 'InterstateGo API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))