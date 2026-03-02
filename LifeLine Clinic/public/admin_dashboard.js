
//if admin is not loged in dont allow the access of dashboard
const admin = JSON.parse(localStorage.getItem("admin"));

if (!admin) {
    window.location.href = "/adminlogin";
}

//
document.addEventListener("DOMContentLoaded", function () {

    loadStats();
    loadAppointments();

});

// Load doctors & patients count
async function loadStats() {

    const response = await fetch("/api/admin/dashboard-stats");
    const data = await response.json();

    document.getElementById("doc_num").innerText = data.totalDoctors;
    document.getElementById("patients_num").innerText = data.totalPatients;
}


// Load appointments
async function loadAppointments() {

    const response = await fetch("/api/admin/appointments");
    const appointments = await response.json();

    const table = document.getElementById("appointmentsTable");
    table.innerHTML = "";

    appointments.forEach(app => {

        const row = `
            <tr>
                <td>${app.appointment_id}</td>
                <td>${app.appointment_date}</td>
                <td>${app.appointment_time}</td>
                <td>${app.p_name}</td>
                <td>${app.d_name}</td>
                <td>
                    <button onclick="deleteAppointment(${app.appointment_id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;

        table.innerHTML += row;

    });

}


// Delete appointment
async function deleteAppointment(id) {

    if (!confirm("Are you sure?")) return;

    await fetch(`/api/admin/appointments/${id}`, {
        method: "DELETE"
    });

    loadAppointments();
}

// logout button functionality
document.getElementById("adminLogoutBtn").addEventListener("click", function (e) {

    e.preventDefault();

    // Remove admin from localStorage
    localStorage.removeItem("admin");

    // Redirect to admin login page
    window.location.href = "/adminlogin";

});

// admin_dashboard.js

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