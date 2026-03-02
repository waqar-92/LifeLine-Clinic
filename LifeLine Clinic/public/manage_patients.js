//if admin is not loged in dont allow the access of this page
const admin = JSON.parse(localStorage.getItem("admin"));

if (!admin) {
    window.location.href = "/adminlogin";
}

//
document.addEventListener("DOMContentLoaded", () => {

    const tableBody = document.getElementById("patientTableBody");
    const deleteForm = document.getElementById("deletePatientForm");

    // Load patients
    async function loadPatients() {

        const res = await fetch('/api/admin/patients');
        const data = await res.json();

        tableBody.innerHTML = "";

        data.forEach(patient => {
            tableBody.innerHTML += `
                <tr>
                    <td>${patient.patient_id}</td>
                    <td>${patient.p_name}</td>
                    <td>${patient.p_email}</td>
                    <td>${patient.p_phone}</td>
                    <td>${patient.p_dob}</td>
                    <td>${patient.p_gender}</td>
                </tr>
            `;
        });

    }

    loadPatients();

    // Delete patient
    deleteForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const id = document.getElementById("patient_id").value;

        const res = await fetch(`/api/admin/patients/${id}`, {
            method: 'DELETE'
        });

        const result = await res.json();

        alert(result.message);

        if (result.success) {
            deleteForm.reset();
            loadPatients();
        }

    });

});

// logout button functionality
document.getElementById("adminLogoutBtn").addEventListener("click", function (e) {

    e.preventDefault();

    // Remove admin from localStorage
    localStorage.removeItem("admin");

    // Redirect to admin login page
    window.location.href = "/adminlogin";

});

// for side bar toggling

const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.getElementById('sidebarToggle');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    document.body.classList.toggle('sidebar-open');
});

// Optional: click outside sidebar to close
document.body.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
    }
});


// ------------------------- DELETE PATIENT FORM Validation ----------------------------------

//accessing field and button
let patientId = document.getElementById("patient_id");
let deleteBtn = document.getElementById("deleteButton");

//function to validate that field is not empty
function PatientIdValidator() {
    let prev = document.getElementById("DIdMessage");
    if (prev) prev.remove();

    let msg = document.createElement("p");
    msg.setAttribute("id", "DIdMessage");
    msg.style.color = "red";
    msg.style.fontSize = "12px";

    if (patientId.value.trim() === "") {
        msg.innerHTML = "Enter patient ID";
        patientId.after(msg);
        return false;
    } else if (isNaN(patientId.value) || parseInt(patientId.value) <= 0) {
        msg.innerHTML = "Invalid patient ID";
        patientId.after(msg);
        return false;
    }
    return true;
}

// Real-time validation
patientId.addEventListener("input", PatientIdValidator);

// Submit validation
deleteBtn.addEventListener("click", (e) => {
    let valid = PatientIdValidator();

    if (!valid) {
        e.preventDefault();
    
    }
});