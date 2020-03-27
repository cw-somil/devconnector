const express = require("express")
const app = express()
const PORT = process.env.PORT || 5000
const connectDB = require("./config/db")

// Connect Database
connectDB()

// Make Server Online
app.listen(PORT, () => console.log("Server Online!"))
