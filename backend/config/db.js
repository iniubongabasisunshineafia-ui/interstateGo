const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    })
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.log('DB connection failed:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB