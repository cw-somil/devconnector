// Used for Schema Building with Mongo
const mongoose = require("mongoose")
// Used to get Default Values
const config = require("config")
// Contains Mongo DB URI
const db = config.get("mongoURI")

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    console.log("MongoDB connected")
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
}

module.exports = connectDB
