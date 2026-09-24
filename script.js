// =====================================================
// STREETFAULT FRONTEND SCRIPT
// LIVE BACKEND
// =====================================================

const API_URL = "https://streetfault-backend-9qi4.onrender.com";


// =====================================================
// CITIZEN REGISTRATION
// =====================================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/api/users/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (response.ok) {

                alert(
                    "Account created successfully!"
                );

                window.location.href =
                    "login.html";

            } else {

                alert(
                    data.message ||
                    "Registration failed."
                );
            }


        } catch (error) {

            console.error(
                "REGISTRATION ERROR:",
                error
            );

            alert(
                "Unable to connect to StreetFault server."
            );
        }

    });

}



// =====================================================
// CITIZEN LOGIN
// =====================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/users/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (response.ok) {

                    alert(
                        "Login successful!"
                    );


                    localStorage.setItem(
                        "streetfaultUser",
                        JSON.stringify(data.user)
                    );


                    window.location.href =
                        "report.html";


                } else {

                    alert(
                        data.message ||
                        "Login failed."
                    );
                }


            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                alert(
                    "Unable to connect to StreetFault server."
                );
            }

        }
    );

}



// =====================================================
// COMPLAINT SUBMISSION
// =====================================================

const reportForm =
    document.getElementById("reportForm");


if (reportForm) {

    reportForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const storedUser =
                localStorage.getItem(
                    "streetfaultUser"
                );


            if (!storedUser) {

                alert(
                    "Please login before submitting a complaint."
                );

                window.location.href =
                    "login.html";

                return;
            }


            const user =
                JSON.parse(storedUser);


            const issueType =
                document
                    .getElementById("issueType")
                    .value;


            const location =
                document
                    .getElementById("location")
                    .value
                    .trim();


            const description =
                document
                    .getElementById("description")
                    .value
                    .trim();


            const imageInput =
                document.getElementById("image");


            let imageBase64 = "";


            // Convert image to Base64
            if (
                imageInput &&
                imageInput.files &&
                imageInput.files.length > 0
            ) {

                const file =
                    imageInput.files[0];


                imageBase64 =
                    await new Promise(
                        (resolve, reject) => {

                            const reader =
                                new FileReader();


                            reader.onload =
                                () => resolve(
                                    reader.result
                                );


                            reader.onerror =
                                reject;


                            reader.readAsDataURL(
                                file
                            );

                        }
                    );
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/reports/submit`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                citizenId:
                                    user.id,

                                citizenName:
                                    user.name,

                                citizenEmail:
                                    user.email,

                                issueType:
                                    issueType,

                                location:
                                    location,

                                description:
                                    description,

                                image:
                                    imageBase64

                            })
                        }
                    );


                const data =
                    await response.json();


                if (response.ok) {

                    alert(
                        "Complaint submitted successfully!\n\n" +
                        "Complaint ID: " +
                        data.referenceId
                    );


                    window.location.href =
                        "track.html";


                } else {

                    alert(
                        data.message ||
                        "Complaint submission failed."
                    );
                }


            } catch (error) {

                console.error(
                    "REPORT ERROR:",
                    error
                );


                alert(
                    "Unable to connect to StreetFault server."
                );
            }

        }
    );

}



// =====================================================
// TRACK COMPLAINT
// =====================================================

const trackForm =
    document.getElementById("trackForm");


if (trackForm) {

    trackForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const referenceId =
                document
                    .getElementById("complaintId")
                    .value
                    .trim();


            if (!referenceId) {

                alert(
                    "Please enter your complaint ID."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/reports/track/${encodeURIComponent(referenceId)}`
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Complaint not found."
                    );

                    return;
                }


                const report =
                    data.report;


                const complaintIdElement =
                    document.getElementById(
                        "displayComplaintId"
                    );


                const issueElement =
                    document.getElementById(
                        "displayIssue"
                    );


                const locationElement =
                    document.getElementById(
                        "displayLocation"
                    );


                const statusElement =
                    document.getElementById(
                        "statusBadge"
                    );


                const messageElement =
                    document.getElementById(
                        "adminMessage"
                    );


                if (complaintIdElement) {

                    complaintIdElement.textContent =
                        report.referenceId;
                }


                if (issueElement) {

                    issueElement.textContent =
                        report.issueType;
                }


                if (locationElement) {

                    locationElement.textContent =
                        report.location;
                }


                if (statusElement) {

                    statusElement.textContent =
                        report.status;


                    statusElement.className =
                        "status-badge";


                    if (
                        report.status ===
                        "Pending"
                    ) {

                        statusElement.classList.add(
                            "pending"
                        );

                    } else if (
                        report.status ===
                        "In Progress"
                    ) {

                        statusElement.classList.add(
                            "progress"
                        );

                    } else if (
                        report.status ===
                        "Resolved"
                    ) {

                        statusElement.classList.add(
                            "resolved"
                        );

                    } else if (
                        report.status ===
                        "Rejected"
                    ) {

                        statusElement.classList.add(
                            "rejected"
                        );
                    }
                }


                if (messageElement) {

                    messageElement.textContent =
                        report.adminMessage ||
                        "";
                }


                const result =
                    document.getElementById(
                        "complaintResult"
                    );


                if (result) {

                    result.style.display =
                        "block";
                }


            } catch (error) {

                console.error(
                    "TRACK ERROR:",
                    error
                );


                alert(
                    "Unable to connect to StreetFault server."
                );
            }

        }
    );

}



// =====================================================
// ADMIN LOGIN
// =====================================================

const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("adminEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("adminPassword")
                    .value;


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/admin/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (response.ok) {

                    alert(
                        "Admin login successful!"
                    );


                    localStorage.setItem(
                        "streetfaultAdmin",
                        "true"
                    );


                    window.location.href =
                        "admin.html";


                } else {

                    alert(
                        data.message ||
                        "Invalid admin credentials."
                    );
                }


            } catch (error) {

                console.error(
                    "ADMIN LOGIN ERROR:",
                    error
                );


                alert(
                    "Unable to connect to StreetFault server."
                );
            }

        }
    );

}



// =====================================================
// LOGOUT HELPER
// =====================================================

function logoutCitizen() {

    localStorage.removeItem(
        "streetfaultUser"
    );

    window.location.href =
        "login.html";
}


function logoutAdmin() {

    localStorage.removeItem(
        "streetfaultAdmin"
    );

    window.location.href =
        "admin-login.html";
}
