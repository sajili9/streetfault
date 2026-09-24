const express = require("express");

const router = express.Router();

// ===============================
// ADMIN LOGIN
// ===============================

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
    ) {
        return res.json({
            success: true,
            message: "Admin login successful"
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid admin email or password"
    });
});

module.exports = router;