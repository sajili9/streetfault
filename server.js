const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("StreetFault Backend is Running!");
});

// User routes
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `StreetFault server running on port ${PORT}`
    );
});
    })
    .catch((error) => {
        console.error("MongoDB connection failed:");
        console.error(error.message);
    });