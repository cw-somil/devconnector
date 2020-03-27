const express = require("express")
const app = express()
const PORT = process.env.PORT || 5000
const connectDB = require("./config/db")

// Connect Database
connectDB()

app.get("/", (req, res) => res.send("API Running"))

app.use("/api/users", require("./routes/api/users"))
app.use("/api/posts", require("./routes/api/posts"))
app.use("/api/profile", require("./routes/api/profile"))
app.use("/api/auth", require("./routes/api/auth"))

// Make Server Online
app.listen(PORT, () => console.log("Server Online!"))
