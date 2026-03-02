
document.addEventListener("DOMContentLoaded", () => {

    const patient = JSON.parse(localStorage.getItem("patient"));

    if (!patient) {
        window.location.href = "/patientlogin";
        return;
    }

    const doctorSelect = document.getElementById("doctor_id");
    const doctorCards = document.getElementById("doctorCards");
    const form = document.getElementById("appointmentForm");

    // Load Doctors
    async function loadDoctors() {

        const res = await fetch('/api/patient/doctors');
        const doctors = await res.json();

        doctors.forEach(doc => {

            // Dropdown
            doctorSelect.innerHTML += `
                <option value="${doc.doctor_id}">
                    ${doc.d_name} (${doc.d_specialization})
                </option>
            `;

            // Cards
            doctorCards.innerHTML += `
                <div class="doctor-card">
                    <h3>${doc.d_name}</h3>
                    <p>${doc.d_specialization}</p>
                </div>
            `;
        });

    }

    loadDoctors();

    // Submit Appointment
    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const data = {
            patient_id: patient.patient_id,
            doctor_id: doctorSelect.value,
            appointment_date: document.getElementById("appointment_date").value,
            appointment_time: document.getElementById("appointment_time").value,
            reason: document.getElementById("reason").value
        };

        const res = await fetch('/api/patient/book-appointment', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        alert(result.message);

        if (result.success) {
            form.reset();
        }

    });

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

// ----------------------- Validation Code -----------------------------
// Access all input fields
let doctor = document.getElementById("doctor_id");
let date = document.getElementById("appointment_date");
let time = document.getElementById("appointment_time");
let reason = document.getElementById("reason");
let submitBtn = document.getElementById("sub_button");

// ---------------------------- Function to validate doctor selection -------------------
function DoctorValidator() {
    // remove previous message
    let prevMsg = document.getElementById('DoctorMessage');
    if (prevMsg) prevMsg.remove();

    let msg = document.createElement('p');
    msg.setAttribute('id', 'DoctorMessage');
    msg.style.color = "red";
    msg.style.fontSize = "12px";

    if (doctor.value === "") {
        msg.innerHTML = "Please select a doctor";
        doctor.after(msg);
        return false;
    } else {
        return true;
    }
}

// ---------------------------- Function to validate appointment date -------------------
function DateValidator() {
    let prevMsg = document.getElementById('DateMessage');
    if (prevMsg) prevMsg.remove();

    let msg = document.createElement('p');
    msg.setAttribute('id', 'DateMessage');
    msg.style.color = "red";
    msg.style.fontSize = "12px";

    if (date.value === "") {
        msg.innerHTML = "Please select a date";
        date.after(msg);
        return false;
    } else {
        return true;
    }
}

// ---------------------------- Function to validate appointment time -------------------
function TimeValidator() {
    let prevMsg = document.getElementById('TimeMessage');
    if (prevMsg) prevMsg.remove();

    let msg = document.createElement('p');
    msg.setAttribute('id', 'TimeMessage');
    msg.style.color = "red";
    msg.style.fontSize = "12px";

    if (time.value === "") {
        msg.innerHTML = "Please select a time";
        time.after(msg);
        return false;
    } else {
        return true;
    }
}

// ---------------------------- Function to validate reason -------------------
function ReasonValidator() {
    let prevMsg = document.getElementById('ReasonMessage');
    if (prevMsg) prevMsg.remove();

    let msg = document.createElement('p');
    msg.setAttribute('id', 'ReasonMessage');
    msg.style.color = "red";
    msg.style.fontSize = "12px";

    if (reason.value.trim() === "") {
        msg.innerHTML = "Please provide a reason for your visit";
        reason.after(msg);
        return false;
    } else {
        return true;
    }
}

// ------------------------- Add event listeners for real-time validation -----------------
doctor.addEventListener("change", DoctorValidator);
date.addEventListener("input", DateValidator);
time.addEventListener("input", TimeValidator);
reason.addEventListener("input", ReasonValidator);

// ------------------------- Form submission validation -------------------------------
submitBtn.addEventListener("click", (e) => {
    let docValid = DoctorValidator();
    let dateValid = DateValidator();
    let timeValid = TimeValidator();
    let reasonValid = ReasonValidator();

    if (!docValid || !dateValid || !timeValid || !reasonValid) {
        e.preventDefault();
    }
});