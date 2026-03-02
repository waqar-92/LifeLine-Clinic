//if admin is not loged in dont allow the access of this page
const admin = JSON.parse(localStorage.getItem("admin"));

if (!admin) {
    window.location.href = "/adminlogin";
}

document.addEventListener("DOMContentLoaded", () => {

    const addFormDiv = document.getElementById("addDoctorForm");
    const deleteFormDiv = document.getElementById("deleteDoctorForm");

    const showAddBtn = document.getElementById("showAdd");
    const showDeleteBtn = document.getElementById("showDelete");

    const addForm = document.getElementById("addForm");
    const deleteForm = document.getElementById("deleteForm");

    const tableBody = document.getElementById("doctorTableBody");

    // Switch forms
    showAddBtn.addEventListener("click", () => {
        addFormDiv.style.display = "block";
        deleteFormDiv.style.display = "none";
    });

    showDeleteBtn.addEventListener("click", () => {
        addFormDiv.style.display = "none";
        deleteFormDiv.style.display = "block";
    });

    // Load doctors
    async function loadDoctors() {

        const res = await fetch('/api/admin/doctors');
        const data = await res.json();

        tableBody.innerHTML = "";

        data.forEach(doc => {
            tableBody.innerHTML += `
                <tr>
                    <td>${doc.doctor_id}</td>
                    <td>${doc.d_name}</td>
                    <td>${doc.d_email}</td>
                    <td>${doc.d_specialization}</td>
                    <td>${doc.d_phone}</td>
                </tr>
            `;
        });

    }

    loadDoctors();

    // Add doctor
    addForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const doctorData = {
            d_name: document.getElementById("d_name").value,
            d_email: document.getElementById("d_email").value,
            d_phone: document.getElementById("d_phone").value,
            d_specialization: document.getElementById("d_specialization").value,
            d_pass: document.getElementById("d_pass").value
        };

        const res = await fetch('/api/admin/doctors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doctorData)
        });

        const result = await res.json();

        alert(result.message);

        if (result.success) {
            addForm.reset();
            loadDoctors();
        }

    });

    // Delete doctor
    deleteForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const id = document.getElementById("doctor_id").value;

        const res = await fetch(`/api/admin/doctors/${id}`, {
            method: 'DELETE'
        });

        const result = await res.json();

        alert(result.message);

        if (result.success) {
            deleteForm.reset();
            loadDoctors();
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

//side bar toggling

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

//  ---------------------------------------- Validation Code ----------------------------------------

// ------------------------- ADD DOCTOR FORM  Validation ---------------------------------------------------------

//accessing field and button
let dName = document.getElementById("d_name");
let dEmail = document.getElementById("d_email");
let dSpecialization = document.getElementById("d_specialization");
let dPhone = document.getElementById("d_phone");
let dPass = document.getElementById("d_pass");
let addBtn = document.getElementById("addButton");

// ----------- Add Doctor Validators -----------

function DNameValidator() {
    let prev = document.getElementById("DNameMessage");
    if (prev) prev.remove();

    let msg = document.createElement("p");
    msg.setAttribute("id", "DNameMessage");
    msg.style.color = "red";
    msg.style.fontSize = "12px";

    if (dName.value.trim() === "") {
        msg.innerHTML = "Enter doctor's name";
        dName.after(msg);
        return false;
    }
    return true;
}

// email validator function
function DEmailValidator() {
    let prev = document.getElementById("DEmailMessage");
    if (prev) prev.remove();

    let msg = document.createElement("p");
    msg.setAttribute("id", "DEmailMessage");
    msg.style.color = "red";
    msg.style.fontSize = "12px";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (dEmail.value.trim() === "") {
        msg.innerHTML = "Enter email address";
        dEmail.after(msg);
        return false;
    } else if (!emailRegex.test(dEmail.value)) {
        msg.innerHTML = "Invalid email format";
        dEmail.after(msg);
        return false;
    }
    return true;
}

//Specilazation must entered validator function
function DSpecializationValidator() {
    let prev = document.getElementById("DSpecMessage");
    if (prev) prev.remove();

    let msg = document.createElement("p");
    msg.setAttribute("id", "DSpecMessage");
    msg.style.color = "red";
    msg.style.fontSize = "12px";

    if (dSpecialization.value.trim() === "") {
        msg.innerHTML = "Enter specialization";
        dSpecialization.after(msg);
        return false;
    }
    return true;
}

// function to validate number phone entrance
function DPhoneValidator() {
    let prev = document.getElementById("DPhoneMessage");
    if (prev) prev.remove();

    let msg = document.createElement("p");
    msg.setAttribute("id", "DPhoneMessage");
    msg.style.color = "red";
    msg.style.fontSize = "12px";

    const phoneRegex = /^[0-9]{11}$/;
    if (dPhone.value.trim() === "") {
        msg.innerHTML = "Enter phone number";
        dPhone.after(msg);
        return false;
    } else if (!phoneRegex.test(dPhone.value)) {
        msg.innerHTML = "Invalid phone number 11 digit";
        dPhone.after(msg);
        return false;
    }
    return true;
}

// function to validate password entry
function DPassValidator() {
    let prev = document.getElementById("DPassMessage");
    if (prev) prev.remove();

    let msg = document.createElement("p");
    msg.setAttribute("id", "DPassMessage");
    msg.style.color = "red";
    msg.style.fontSize = "12px";

    if (dPass.value.trim() === "") {
        msg.innerHTML = "Set a password";
        dPass.after(msg);
        return false;
    } else if (dPass.value.length < 4) {
        msg.innerHTML = "Password must be at least 4 characters";
        dPass.after(msg);
        return false;
    }
    return true;
}

// adding event listener validation
dName.addEventListener("input", DNameValidator);
dEmail.addEventListener("input", DEmailValidator);
dSpecialization.addEventListener("input", DSpecializationValidator);
dPhone.addEventListener("input", DPhoneValidator);
dPass.addEventListener("input", DPassValidator);

// Submit validation
addBtn.addEventListener("click", (e) => {
    let valid = DNameValidator() || DEmailValidator() || DSpecializationValidator() || DPhoneValidator() || DPassValidator();

    if (!valid) {
        e.preventDefault();
    }
});

// ------------------------- DELETE DOCTOR FORM Validation ----------------------------------

//accessing field and button
let doctorId = document.getElementById("doctor_id");
let deleteBtn = document.getElementById("deleteButton");

//function to validate that field is not empty
function DoctorIdValidator() {
    let prev = document.getElementById("DIdMessage");
    if (prev) prev.remove();

    let msg = document.createElement("p");
    msg.setAttribute("id", "DIdMessage");
    msg.style.color = "red";
    msg.style.fontSize = "12px";

    if (doctorId.value.trim() === "") {
        msg.innerHTML = "Enter doctor ID";
        doctorId.after(msg);
        return false;
    } else if (isNaN(doctorId.value) || parseInt(doctorId.value) <= 0) {
        msg.innerHTML = "Invalid doctor ID";
        doctorId.after(msg);
        return false;
    }
    return true;
}

// Real-time validation
doctorId.addEventListener("input", DoctorIdValidator);

// Submit validation
deleteBtn.addEventListener("click", (e) => {
    let valid = DoctorIdValidator();

    if (!valid) {
        e.preventDefault();
    
    }
});