
document.addEventListener("DOMContentLoaded", () => {

    const patient = JSON.parse(localStorage.getItem("patient"));

    if (!patient) {
        window.location.href = "/patientlogin";
        return;
    }

    document.getElementById("patient_name").textContent = patient.p_name;

    const tableBody = document.getElementById("appointmentsTableBody");
    const appointmentNum = document.getElementById("appointment_num");

    async function loadAppointments() {

        const res = await fetch(`/api/patient/appointments/${patient.patient_id}`);
        const data = await res.json();

        tableBody.innerHTML = "";
        appointmentNum.textContent = data.length;

        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5">No appointments found</td>
                </tr>
            `;
            return;
        }

        data.forEach(app => {

            let dropdown = "";

            // Patient can only cancel if status is submitted
            if (app.status === "submitted") {
                dropdown = `
                    <select onchange="updateStatus(${app.appointment_id}, this.value)">
                        <option value="">Select</option>
                        <option value="cancel">Cancel</option>
                    </select>
                `;
            } else {
                dropdown = "-";
            }

            tableBody.innerHTML += `
                <tr>
                    <td>${app.appointment_id}</td>
                    <td>${app.appointment_date.split("T")[0]}</td>
                    <td>${app.d_name}</td>
                    <td>${app.status}</td>
                    <td>${dropdown}</td>
                </tr>
            `;
        });

    }

    window.updateStatus = async function(id, status) {

        if (!status) return;

        const res = await fetch(`/api/patient/appointments/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });

        const result = await res.json();

        alert(result.message);

        if (result.success) {
            loadAppointments();
        }
    };

    loadAppointments();

});

//logut
document.getElementById("logoutBtn").addEventListener("click", function(e) {

    e.preventDefault();

    // remove doctor from localStorage
    localStorage.removeItem("patient");

    // redirect to login
    window.location.href = "/patientlogin";

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