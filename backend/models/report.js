const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        referenceId: {
            type: String,
            required: true,
            unique: true
        },

        citizenId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        citizenName: {
            type: String,
            required: true
        },

        citizenEmail: {
            type: String,
            required: true
        },

        issueType: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        image: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["Pending", "In Progress", "Resolved", "Rejected"],
            default: "Pending"
        },

        adminMessage: {
            type: String,
            default: "Your complaint has been received and is waiting for review."
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Report", reportSchema);