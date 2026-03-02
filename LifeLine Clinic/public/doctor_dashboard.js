
document.addEventListener("DOMContentLoaded", async () => {

    const doctor = JSON.parse(localStorage.getItem("doctor"));

    if (!doctor) {
        window.location.href = "/doctorlogin";
        return;
    }

    // Show doctor name
    document.getElementById("doc_name").innerText = doctor.d_name;

    try {

        const response = await fetch(`/api/doctor/dashboard/${doctor.doctor_id}`);
        const appointments = await response.json();

        let pendingCount = 0;
        let totalCount = appointments.length;

        const tableBody = document.getElementById("appointmentsTableBody");
        tableBody.innerHTML = "";

        appointments.forEach(app => {

            if (app.status === "submitted") {
                pendingCount++;
            }

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${app.appointment_id}</td>
                <td>${app.p_name}</td>
                <td>${app.appointment_date.split("T")[0]}</td>
                <td>${app.appointment_time}</td>
                <td>${app.status}</td>
                <td>
                    ${app.status === "submitted" ? `
                        <select onchange="changeStatus(${app.appointment_id}, this.value)">
                            <option value="">Select</option>
                            <option value="cancel">Cancel</option>
                            <option value="attended">Attended</option>
                        </select>
                    ` : "—"}
                </td>
            `;

            tableBody.appendChild(row);

        });

        document.getElementById("pen_appointment_num").innerText = pendingCount;
        document.getElementById("total_appointment_num").innerText = totalCount;

    }
    catch (error) {
        console.error("Error loading dashboard:", error);
    }

});

// 
async function changeStatus(id, status) {

    if (!status) return;

    await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
    });

    location.reload();
}

//logout button functionality
document.getElementById("logoutBtn").addEventListener("click", function(e) {

    e.preventDefault();

    // remove doctor from localStorage
    localStorage.removeItem("doctor");

    // redirect to login
    window.location.href = "/doctorlogin";

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