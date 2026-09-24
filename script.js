console.log("StreetFault website loaded successfully!");

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
        const response = await fetch("http://127.0.0.1:5000/api/users/register",  {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Account created successfully!");
                window.location.href = "login.html";
            } else {
                alert(data.message || "Registration failed.");
            }

       } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    alert("ERROR: " + error.message);
}
    });
}// ===============================
// ===============================
// CITIZEN LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch("http://127.0.0.1:5000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful!");

                localStorage.setItem(
                    "streetfaultUser",
                    JSON.stringify(data.user)
                );

                window.location.href = "report.html";
            } else {
                alert(data.message || "Login failed.");
            }

        } catch (error) {
            console.error("LOGIN ERROR:", error);
            alert("Unable to connect to StreetFault server.");
        }
    });
}
// ===============================
// SUBMIT STREET COMPLAINT
// ===============================

const reportForm = document.getElementById("reportForm");

if (reportForm) {
    reportForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const userData = localStorage.getItem("streetfaultUser");

        if (!userData) {
            alert("Please login first.");
            window.location.href = "login.html";
            return;
        }

        const user = JSON.parse(userData);

        const issueType = document.getElementById("issueType").value;
        const location = document.getElementById("location").value.trim();
        const description = document.getElementById("description").value.trim();

        const imageInput = document.getElementById("image");

        let image = "";

        // Convert image to Base64 if an image was selected
        if (imageInput && imageInput.files.length > 0) {
            const file = imageInput.files[0];

            image = await new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = function () {
                    resolve(reader.result);
                };

                reader.onerror = function () {
                    reject(reader.error);
                };

                reader.readAsDataURL(file);
            });
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/api/reports/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    citizenId: user.id,
                    citizenName: user.name,
                    citizenEmail: user.email,
                    issueType: issueType,
                    location: location,
                    description: description,
                    image: image
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(
                    "Complaint submitted successfully!\n\nYour Complaint ID: " +
                    data.referenceId
                );

                reportForm.reset();

                window.location.href = "track.html";
            } else {
                alert(data.message || "Complaint submission failed.");
            }

        } catch (error) {
            console.error("COMPLAINT ERROR:", error);
            alert("Unable to connect to StreetFault server.");
        }
    });
}
// ===============================
// TRACK COMPLAINT
// ===============================

const trackForm = document.getElementById("trackForm");

if (trackForm) {
    trackForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const complaintId = document
            .getElementById("complaintId")
            .value
            .trim();

        if (!complaintId) {
            alert("Please enter your Complaint ID.");
            return;
        }

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/api/reports/track/" +
                encodeURIComponent(complaintId)
            );

            const data = await response.json();

            if (response.ok) {

                const report = data.report;

                // Show complaint information
                document.getElementById("displayComplaintId").textContent =
                    report.referenceId;

                document.getElementById("displayIssue").textContent =
                    report.issueType;

                document.getElementById("displayLocation").textContent =
                    report.location;

                document.getElementById("statusBadge").textContent =
                    report.status;

                document.getElementById("adminMessage").textContent =
                    report.adminMessage;

                // Show the result section
                document.getElementById("complaintResult").style.display =
                    "block";

            } else {
                document.getElementById("complaintResult").style.display =
                    "none";

                alert(data.message || "Complaint not found.");
            }

        } catch (error) {
            console.error("TRACKING ERROR:", error);

            alert(
                "Unable to connect to StreetFault server."
            );
        }
    });
}
// ===============================
// ADMIN LOGIN
// ===============================

const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("adminEmail").value.trim();
        const password = document.getElementById("adminPassword").value;

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/api/admin/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Admin login successful!");

                localStorage.setItem("streetfaultAdmin", "true");

                window.location.href = "admin.html";

            } else {
                alert(data.message || "Invalid admin login.");
            }

        } catch (error) {
            console.error("ADMIN LOGIN ERROR:", error);

            alert(
                "Unable to connect to StreetFault server."
            );
        }
    });
}
// ===============================
// ADMIN DASHBOARD
// LOAD ALL COMPLAINTS
// ===============================

const complaintContainer = document.getElementById("complaintContainer");

if (complaintContainer) {

    async function loadAdminComplaints() {

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/api/reports/all"
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Unable to load complaints.");
                return;
            }

            const reports = data.reports;

            // Clear old sample complaints
            complaintContainer.innerHTML = "";

            if (reports.length === 0) {

                complaintContainer.innerHTML = `
                    <p>No complaints found.</p>
                `;

                return;
            }

            reports.forEach(function (report) {

                const complaintCard = document.createElement("div");

                complaintCard.className = "admin-complaint-card";

                complaintCard.innerHTML = `
                    <div class="complaint-header">

                        <div>
                            <strong>${report.referenceId}</strong>
                            <p>${report.citizenName}</p>
                        </div>

                        <span class="status-badge">
                            ${report.status}
                        </span>

                    </div>

                    <div class="complaint-details">

                        <p>
                            <strong>Issue:</strong>
                            ${report.issueType}
                        </p>

                        <p>
                            <strong>Location:</strong>
                            ${report.location}
                        </p>

                        <p>
                            <strong>Description:</strong>
                            ${report.description}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${report.citizenEmail}
                        </p>

                    </div>

                    <div class="admin-actions">

                        <label>Update Status</label>

                        <select
                            class="status-select"
                            data-id="${report.referenceId}"
                        >
                            <option value="Pending"
                                ${report.status === "Pending" ? "selected" : ""}>
                                Pending
                            </option>

                            <option value="In Progress"
                                ${report.status === "In Progress" ? "selected" : ""}>
                                In Progress
                            </option>

                            <option value="Resolved"
                                ${report.status === "Resolved" ? "selected" : ""}>
                                Resolved
                            </option>

                            <option value="Rejected"
                                ${report.status === "Rejected" ? "selected" : ""}>
                                Rejected
                            </option>
                        </select>

                    </div>
                `;

                complaintContainer.appendChild(complaintCard);

            });

        } catch (error) {

            console.error("ADMIN DASHBOARD ERROR:", error);

            alert("Unable to connect to StreetFault server.");
        }
    }

    loadAdminComplaints();
}