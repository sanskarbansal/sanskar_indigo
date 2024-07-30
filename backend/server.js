require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const http = require("http");

const apiV1Router = require("./routes");
const User = require("./models/user.model");
const { initSocket } = require("./services/socket.service");

const app = express();

const server = http.createServer(app);

app.use(cors());
initSocket(server);
// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", apiV1Router);

// Define the PORT
const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, async () => {
    try {
        await User.create({ email: "admin@indigo.in", role: "admin", password: await bcrypt.hash("admin", 10) });
    } catch (err) {
        console.log(err);
    }
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
