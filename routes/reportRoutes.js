const express = require("express");
const Report = require("../models/Report");

const router = express.Router();


// =====================================================
// SUBMIT COMPLAINT
// =====================================================

router.post("/submit", async (req, res) => {

    try {

        const {
            citizenId,
            citizenName,
            citizenEmail,
            issueType,
            location,
            description,
            image
        } = req.body;


        if (
            !citizenId ||
            !citizenName ||
            !citizenEmail ||
            !issueType ||
            !location ||
            !description
        ) {

            return res.status(400).json({
                message: "Please fill all required fields"
            });

        }


        const referenceId =
            "SF-" +
            Date.now().toString().slice(-8);


        const report = await Report.create({

            referenceId,

            citizenId,

            citizenName,

            citizenEmail,

            issueType,

            location,

            description,

            image: image || "",

            status: "Pending",

            adminMessage:
                "Your complaint has been received and is waiting for review."

        });


        res.status(201).json({

            message:
                "Complaint submitted successfully",

            referenceId:
                report.referenceId,

            report

        });


    } catch (error) {

        console.error(
            "Complaint submission error:",
            error
        );

        res.status(500).json({

            message:
                "Complaint submission failed"

        });

    }

});



// =====================================================
// TRACK ONE COMPLAINT
// =====================================================

router.get("/track/:referenceId", async (req, res) => {

    try {

        const { referenceId } =
            req.params;


        const report =
            await Report.findOne({
                referenceId: referenceId
            });


        if (!report) {

            return res.status(404).json({

                message:
                    "Complaint not found"

            });

        }


        res.json({

            message:
                "Complaint found",

            report

        });


    } catch (error) {

        console.error(
            "Tracking error:",
            error
        );

        res.status(500).json({

            message:
                "Unable to track complaint"

        });

    }

});



// =====================================================
// GET ALL COMPLAINTS FOR ADMIN
// =====================================================

router.get("/all", async (req, res) => {

    try {

        const reports =
            await Report.find()
                .sort({
                    createdAt: -1
                });


        res.json({

            reports

        });


    } catch (error) {

        console.error(
            "Get reports error:",
            error
        );

        res.status(500).json({

            message:
                "Unable to get complaints"

        });

    }

});



// =====================================================
// UPDATE COMPLAINT STATUS
// =====================================================

router.put("/status/:referenceId", async (req, res) => {

    try {

        const { referenceId } =
            req.params;

        const { status } =
            req.body;


        const allowedStatuses = [

            "Pending",

            "In Progress",

            "Resolved",

            "Rejected"

        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                message:
                    "Invalid complaint status"

            });

        }


        let adminMessage =
            "Your complaint has been received and is waiting for review.";


        if (status === "In Progress") {

            adminMessage =
                "Your complaint is currently being reviewed and worked on.";

        }


        if (status === "Resolved") {

            adminMessage =
                "Your complaint has been resolved.";

        }


        if (status === "Rejected") {

            adminMessage =
                "Your complaint has been rejected after review.";

        }


        const report =
            await Report.findOneAndUpdate(

                {
                    referenceId:
                        referenceId
                },

                {
                    status:
                        status,

                    adminMessage:
                        adminMessage
                },

                {
                    new: true
                }

            );


        if (!report) {

            return res.status(404).json({

                message:
                    "Complaint not found"

            });

        }


        res.json({

            message:
                "Complaint status updated successfully",

            report

        });


    } catch (error) {

        console.error(
            "Status update error:",
            error
        );

        res.status(500).json({

            message:
                "Unable to update complaint status"

        });

    }

});


module.exports = router;