const mysql = require('mysql2');

// DATABASE CONNECTION

const conn = mysql.createConnection({
    host: "localhost",
    user: "labuser",
    password: "lab123",
    database: "clinicManagement"
});

// CONNECT TO DATABASE

conn.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log("Connected to MySQL Database");

    createTables();
});

// CREATE TABLES FUNCTION

function createTables() {

    // Patients Table
    const patientsTable = `
    CREATE TABLE patients (
        patient_id INT AUTO_INCREMENT PRIMARY KEY,
        p_name VARCHAR(100) NOT NULL,
        p_email VARCHAR(100) UNIQUE NOT NULL,
        p_phone VARCHAR(20) NOT NULL,
        p_dob DATE NOT NULL,
        p_geneder VARCHAR(10) NOT NULL,
        p_pass VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // Doctors Table
    const doctorsTable = `
    CREATE TABLE doctors (
        doctor_id INT AUTO_INCREMENT PRIMARY KEY,
        d_name VARCHAR(100) NOT NULL,
        d_email VARCHAR(100) NOT NULL UNIQUE,
        d_phone VARCHAR(20),
        d_specialization VARCHAR(100) NOT NULL,
        d_pass VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // Appointments Table 
    const appointmentsTable = `
    CREATE TABLE appointments (
        appointment_id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status ENUM('submitted','cancel','attended') DEFAULT 'submitted',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
    )`;

    // Admins Table
    const adminsTable = `
    CREATE TABLE admins (
        admin_id INT AUTO_INCREMENT PRIMARY KEY,
        admin_username VARCHAR(50) NOT NULL UNIQUE,
        admin_password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // Execute Queries
    conn.query(patientsTable, (err) => {
        if (err) console.log("Error creating patients table:", err);
        else console.log("Patients table ready");
    });

    conn.query(doctorsTable, (err) => {
        if (err) console.log("Error creating doctors table:", err);
        else console.log("Doctors table ready");
    });

    conn.query(appointmentsTable, (err) => {
        if (err) console.log("Error creating appointments table:", err);
        else console.log("Appointments table ready");
    });

    conn.query(adminsTable, (err) => {
        if (err) console.log("Error creating admins table:", err);
        else console.log("Admins table ready");
    });
}