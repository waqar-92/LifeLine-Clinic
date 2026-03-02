
document.getElementById("registrationForm").addEventListener("submit", async function(e) {

    e.preventDefault();

    const data = {

        p_name: document.getElementById("p_name").value,
        p_email: document.getElementById("p_email").value,
        p_phone: document.getElementById("p_phone").value,
        p_dob: document.getElementById("p_dob").value,
        p_gender: document.getElementById("p_gender").value,
        p_pass: document.getElementById("p_pass").value

    };

    try {

        const response = await fetch("/api/patients/register", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (result.success) {

            alert("Registration successful!");

            // Redirect to login page
            window.location.href = "/patientlogin";

        }
        else {

            alert(result.message);

        }

    }
    catch (error) {

        alert("Error occurred");

    }

});


// ------------------------------- Form Validation Code ------------------------------
// Accessing all input fields
let Name = document.getElementById("p_name");
let Email = document.getElementById("p_email");
let Phone = document.getElementById("p_phone");
let DOB = document.getElementById("p_dob");
let Gender = document.getElementById("p_gender");
let Password = document.getElementById("p_pass");

// ---------------------------- Name Validation --------------
function NameValidator() {
    let prev = document.getElementById('NameMessage');
    if(prev) prev.remove();

    let msg = document.createElement('p');
    msg.setAttribute('id','NameMessage');
    msg.style.color = 'red';
    msg.style.fontSize = '12px';

    if(Name.value.trim() === "") {
        msg.innerHTML = "You cannot leave field empty, fill it";
        document.getElementById('NameBox').appendChild(msg);
        return false;
    } else {
        return true;
    }
}

// ---------------------------- Email Validation --------------
function EmailValidator() {
    let prev = document.getElementById('EmailMessage');
    if(prev) prev.remove();

    let msg = document.createElement('p');
    msg.setAttribute('id','EmailMessage');
    msg.style.color = 'red';
    msg.style.fontSize = '12px';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(Email.value.trim() === "") {
        msg.innerHTML = "You cannot leave field empty, fill it";
        document.getElementById('EmailBox').appendChild(msg);
        return false;
    } else if(!emailRegex.test(Email.value)) {
        msg.innerHTML = "Invalid email format";
        document.getElementById('EmailBox').appendChild(msg);
        return false;
    } else {
        return true;
    }
}

// ---------------------------- Phone Validation --------------
function PhoneValidator() {
    let prev = document.getElementById('PhoneMessage');
    if(prev) prev.remove();

    let msg = document.createElement('p');
    msg.setAttribute('id','PhoneMessage');
    msg.style.color = 'red';
    msg.style.fontSize = '12px';

    const phoneRegex = /^[0-9]{11}$/; // allow 11 digits

    if(Phone.value.trim() === "") {
        msg.innerHTML = "You cannot leave field empty, fill it";
        document.getElementById('PhoneBox').appendChild(msg);
        return false;
    } else if(!phoneRegex.test(Phone.value)) {
        msg.innerHTML = "Invalid phone number format";
        document.getElementById('PhoneBox').appendChild(msg);
        return false;
    } else {
        return true;
    }
}

// ---------------------------- DOB Validation --------------
function DOBValidator() {
    let prev = document.getElementById('DOBMessage');
    if(prev) prev.remove();

    let msg = document.createElement('p');
    msg.setAttribute('id','DOBMessage');
    msg.style.color = 'red';
    msg.style.fontSize = '12px';

    if(DOB.value === "") {
        msg.innerHTML = "Please select your date of birth";
        document.getElementById('DOBBox').appendChild(msg);
        return false;
    } else {
        return true;
    }
}

// ---------------------------- Gender Validation --------------
function GenderValidator() {
    let prev = document.getElementById('GenderMessage');
    if(prev) prev.remove();

    let msg = document.createElement('p');
    msg.setAttribute('id','GenderMessage');
    msg.style.color = 'red';
    msg.style.fontSize = '12px';

    if(Gender.value === "") {
        msg.innerHTML = "Please select your gender";
        document.getElementById('GenderBox').appendChild(msg);
        return false;
    } else {
        return true;
    }
}

// ---------------------------- Password Validation --------------
function PassValidator() {
    let prev = document.getElementById('PassMessage');
    if(prev) prev.remove();

    let msg = document.createElement('p');
    msg.setAttribute('id','PassMessage');
    msg.style.color = 'red';
    msg.style.fontSize = '12px';

    if(Password.value.trim() === "") {
        msg.innerHTML = "Password cannot be empty";
        document.getElementById('PassBox').appendChild(msg);
        return false;
    } else if(Password.value.length < 4) {
        msg.innerHTML = "Password must be at least 4 characters";
        document.getElementById('PassBox').appendChild(msg);
        return false;
    } else {
        return true;
    }
}

// ------------------------- Event Listeners -----------------
Name.addEventListener("input", NameValidator);
Email.addEventListener("input", EmailValidator);
Phone.addEventListener("input", PhoneValidator);
DOB.addEventListener("change", DOBValidator);
Gender.addEventListener("change", GenderValidator);
Password.addEventListener("input", PassValidator);

// ------------------------- Submit Button -----------------
let button = document.getElementById('SubButton');

button.addEventListener('click', (e) => {
    let NameRes = NameValidator();
    let EmailRes = EmailValidator();
    let PhoneRes = PhoneValidator();
    let DOBRes = DOBValidator();
    let GenderRes = GenderValidator();
    let PassRes = PassValidator();

    // remove previous final message
    let prevMsg = document.getElementById('FinalMessage');
    if(prevMsg) prevMsg.remove();

    if(!(NameRes && EmailRes && PhoneRes && DOBRes && GenderRes && PassRes)) {
        e.preventDefault();
    }
});