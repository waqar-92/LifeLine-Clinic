const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// page for patients login
app.get('/patientlogin', (req, res) => {
    res.sendFile(path.join(__dirname, 'patient_login.html'));
});

// page for patients registration
app.get('/patientreg', (req, res) => {
    res.sendFile(path.join(__dirname, 'patient_registration.html'));
});

// page for selection of login portal
app.get('/loginportals', (req, res) => {
    res.sendFile(path.join(__dirname, 'login_portals.html'));
});

// page for doctor login
app.get('/doctorlogin', (req, res) => {
    res.sendFile(path.join(__dirname, 'doc_login.html'));
});

// page for admin login
app.get('/adminlogin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin_login.html'));
});

// patient dashboard page
app.get('/patientdashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'patient_dashboard.html'));
});

// admin dashboard page
app.get('/admindashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin_dashboard.html'));
});

// admin dashboard page sub page manage doctors
app.get('/managedoctors', (req, res) => {
    res.sendFile(path.join(__dirname, 'manage_doctors.html'));
});

// admin dashboard sub page manage patients
app.get('/managepatients', (req, res) => {
    res.sendFile(path.join(__dirname, 'manage_patients.html'));
});

// Book Appointment Page
app.get('/bookappointment', (req, res) => {
    res.sendFile(path.join(__dirname, 'book_appointment.html'));
});

// Doctor Dashboard Page
app.get('/doctordashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'doctor_dashboard.html'));
});

// creation of connection to database
const conn = mysql.createConnection({
    host: "localhost",
    user: "labuser",
    password: "lab123",
    database: "clinicManagement"
});

// connecting the databse
conn.connect((err) => {
    if (err) {
        console.error("Database Connection Failed!");
        console.error("Error Code:", err.code);
        console.error("Error Message:", err.message);
        return;
    }
    console.log("Connected to MySQL Database");
});


// Patient Registration API
app.post('/api/patients/register', (req, res) => {

    const { p_name, p_email, p_phone, p_dob, p_gender, p_pass } = req.body;

    const sql = `INSERT INTO patients (p_name, p_email, p_phone, p_dob, p_gender, p_pass) VALUES (?, ?, ?, ?, ?, ?)`;

    conn.query(sql, [p_name, p_email, p_phone, p_dob, p_gender, p_pass], (err, result) => {

        if (err) {

            if (err.code === 'ER_DUP_ENTRY') {
                return res.json({
                    success: false,
                    message: "Email already exists"
                });
            }

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        res.json({
            success: true,
            message: "Registration successful"
        });

    }
    );

});

// Patient Login API
app.post('/api/patients/login', (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM patients WHERE p_email = ? AND p_pass = ?";

    conn.query(sql, [email, password], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (result.length > 0) {

            res.json({
                success: true,
                message: "Login successful",
                patient: result[0]
            });

        } else {

            res.json({
                success: false,
                message: "Incorrect email or password"
            });

        }

    });

});


// api for admin login
// Admin Login API
app.post('/api/admin/login', (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM admins WHERE admin_username = ? AND admin_password = ?";

    conn.query(sql, [email, password], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (result.length > 0) {

            res.json({
                success: true,
                message: "Login successful",
                admin: result[0]
            });

        } else {

            res.json({
                success: false,
                message: "Incorrect username or password"
            });

        }

    });

});

// api run on admin dashboard page load
app.get('/api/admin/dashboard-stats', (req, res) => {

    const doctorQuery = "SELECT COUNT(*) AS totalDoctors FROM doctors";
    const patientQuery = "SELECT COUNT(*) AS totalPatients FROM patients";

    conn.query(doctorQuery, (err1, doctorResult) => {

        if (err1) return res.status(500).json({ success: false });

        conn.query(patientQuery, (err2, patientResult) => {

            if (err2) return res.status(500).json({ success: false });

            res.json({
                totalDoctors: doctorResult[0].totalDoctors,
                totalPatients: patientResult[0].totalPatients
            });

        });

    });

});

// api run on admin dashboard page load
app.get('/api/admin/appointments', (req, res) => {

    const sql = `
        SELECT 
            a.appointment_id,
            a.appointment_date,
            a.appointment_time,
            p.p_name,
            d.d_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.patient_id
        JOIN doctors d ON a.doctor_id = d.doctor_id
        ORDER BY a.appointment_date DESC
    `;

    conn.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({ success: false });
        }

        res.json(result);

    });

});

// this api is for if admin want to delete an appointment
app.delete('/api/admin/appointments/:id', (req, res) => {

    const appointmentId = req.params.id;

    const sql = "DELETE FROM appointments WHERE appointment_id = ?";

    conn.query(sql, [appointmentId], (err, result) => {

        if (err) {
            return res.status(500).json({ success: false });
        }

        res.json({
            success: true,
            message: "Appointment deleted"
        });

    });

});

// Get All Doctors
app.get('/api/admin/doctors', (req, res) => {

    const sql = "SELECT * FROM doctors ORDER BY doctor_id DESC";

    conn.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        res.json(result);

    });

});

// Add Doctor
app.post('/api/admin/doctors', (req, res) => {

    const { d_name, d_email, d_phone, d_specialization, d_pass } = req.body;

    if (!d_name || !d_email || !d_phone || !d_specialization || !d_pass) {
        return res.json({
            success: false,
            message: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO doctors (d_name, d_email, d_phone, d_specialization,d_pass)
        VALUES (?, ?, ?, ?, ?)
    `;

    conn.query(sql, [d_name, d_email, d_phone, d_specialization, d_pass], (err, result) => {

        if (err) {

            if (err.code === 'ER_DUP_ENTRY') {
                return res.json({
                    success: false,
                    message: "Email already exists"
                });
            }

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        res.json({
            success: true,
            message: "Doctor added successfully"
        });

    });

});

// Delete Doctor
app.delete('/api/admin/doctors/:id', (req, res) => {

    const doctorId = req.params.id;

    const sql = "DELETE FROM doctors WHERE doctor_id = ?";

    conn.query(sql, [doctorId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (result.affectedRows === 0) {
            return res.json({
                success: false,
                message: "Doctor not found"
            });
        }

        res.json({
            success: true,
            message: "Doctor deleted successfully"
        });

    });

});

// Get All Patients
app.get('/api/admin/patients', (req, res) => {

    const sql = "SELECT * FROM patients ORDER BY patient_id DESC";

    conn.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        res.json(result);

    });

});

// Delete Patient
app.delete('/api/admin/patients/:id', (req, res) => {

    const patientId = req.params.id;

    const sql = "DELETE FROM patients WHERE patient_id = ?";

    conn.query(sql, [patientId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (result.affectedRows === 0) {
            return res.json({
                success: false,
                message: "Patient not found"
            });
        }

        res.json({
            success: true,
            message: "Patient deleted successfully"
        });

    });

});

// api to get all appointments to show patient dashboard
app.get('/api/patient/appointments/:id', (req, res) => {

    const patientId = req.params.id;

    const sql = `
        SELECT 
            a.appointment_id,
            a.appointment_date,
            a.status,
            d.d_name
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.doctor_id
        WHERE a.patient_id = ?
        ORDER BY a.appointment_date DESC
    `;

    conn.query(sql, [patientId], (err, result) => {

        if (err) return res.status(500).json({ success: false });

        res.json(result);
    });
});

// api to cancel the appointment if patient want to
app.put('/api/patient/appointments/:id/status', (req, res) => {

    const appointmentId = req.params.id;
    const { status } = req.body;

    if (status !== "cancel") {
        return res.json({
            success: false,
            message: "Invalid status change"
        });
    }

    const sql = "UPDATE appointments SET status = ? WHERE appointment_id = ?";

    conn.query(sql, [status, appointmentId], (err, result) => {

        if (err) return res.status(500).json({ success: false });

        res.json({
            success: true,
            message: "Appointment cancelled"
        });

    });

});

// Get doctors for booking
app.get('/api/patient/doctors', (req, res) => {

    const sql = "SELECT doctor_id, d_name, d_specialization FROM doctors";

    conn.query(sql, (err, result) => {

        if (err) return res.status(500).json({ success: false });

        res.json(result);

    });

});

// Book Appointment api
app.post('/api/patient/book-appointment', (req, res) => {

    const { patient_id, doctor_id, appointment_date, appointment_time, reason } = req.body;

    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
        return res.json({
            success: false,
            message: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO appointments 
        (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit)
        VALUES (?, ?, ?, ?, ?)
    `;

    conn.query(sql,
        [patient_id, doctor_id, appointment_date, appointment_time, reason],
        (err, result) => {

            if (err) return res.status(500).json({ success: false });

            res.json({
                success: true,
                message: "Appointment submitted successfully"
            });

        });

});

//api for doctor login
app.post('/api/doctors/login', (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM doctors WHERE d_email = ? AND d_pass = ?";

    conn.query(sql, [email, password], (err, result) => {
        if (err) { 
            return res.status(500).json({
                 success: false, 
                 message: "Database error" 
                }); }
        if (result.length > 0) { 
            res.json({ 
                success: true, 
                message: "Login successful", 
                doctor: result[0] 
            }); } 
        else { 
            res.json({
             success: false, 
             message: "Incorrect email or password" 
            }); }
    });
});

// api that retrive data for doctor dashboard
app.get("/api/doctor/dashboard/:doctorId", (req, res) => {

    const doctorId = req.params.doctorId;

    const sql = `
        SELECT 
            a.appointment_id,
            a.appointment_date,
            a.appointment_time,
            a.status,
            p.p_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.patient_id
        WHERE a.doctor_id = ?
        ORDER BY a.appointment_date DESC
    `;

    conn.query(sql, [doctorId], (err, results) => {

        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);

    });

});

// api to update the status changed by doctor
app.put("/api/appointments/:id", (req, res) => {

    const appointmentId = req.params.id;
    const { status } = req.body;

    const sql = `
        UPDATE appointments 
        SET status = ?
        WHERE appointment_id = ?
    `;

    conn.query(sql, [status, appointmentId], (err) => {

        if (err) {
            return res.status(500).json({ message: "Update failed" });
        }

        res.json({ message: "Status updated" });

    });

});

// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});