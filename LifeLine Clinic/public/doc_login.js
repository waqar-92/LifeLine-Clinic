


document.getElementById("DoctorLoginForm").addEventListener("submit", async function(e) {

    e.preventDefault();

    const data = {

        email: document.getElementById("email").value,
        password: document.getElementById("password").value

    };

    try {

        const response = await fetch("/api/doctors/login", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (result.success) {

            // store login user in local storage
            localStorage.setItem("doctor", JSON.stringify(result.doctor));
            // Redirect to dashboard
            window.location.href = "/doctordashboard";

        }
        else {

            document.getElementById("errorMessage").innerText =
                "Incorrect email or password";

        }

    }
    catch (error) {

        document.getElementById("errorMessage").innerText =
            "Server error";

    }

});

//  ---------------------------------  Validation Code ---------------------------

//accessing input fields & submit button
let Email=document.getElementById("email")
let Pass=document.getElementById("password")
let button=document.getElementById('doc_sub_btn')


//---- function to validate email ---
function EmailValidator(){

    //deleting previous message if any
    let previousMessage = document.getElementById('emailMessage')
    if (previousMessage) {
        previousMessage.remove()
    }

    let message = document.createElement('p')
    message.setAttribute('id', 'emailMessage')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (Email.value.trim() === "") {
        message.innerHTML = "You cannot leave field empty, fill it"
        message.style.color = "red"
        message.style.fontSize = "12px"
        Email.after(message)
        return false
    }
    else if (!emailRegex.test(Email.value)) {
        message.innerHTML = "Invalid email format"
        message.style.color = "red"
        message.style.fontSize = "12px"
        Email.after(message)
        return false
    }
    else {
        return true
    }

}

// --- function to ensure name field is not empty ---
function PasswordValidator(){

     //deletion of previous message
    let previousMessage = document.getElementById('NameMessage')
    if (previousMessage) {
        previousMessage.remove()
    }

    let Nmessage = document.createElement('p') //creating paragraph to display message

    if (Pass.value.trim() === "") { //if name not inserted
        Nmessage.innerHTML = `You cannot leave field empty, fill it`
        Nmessage.setAttribute('id', 'NameMessage')
        Nmessage.style.color = "red"
        Nmessage.style.fontSize="12px"
        Pass.after(Nmessage)
        return false
    }
    else{
        return true
    }

}

//adding event listener
Email.addEventListener('input',EmailValidator)
Pass.addEventListener('input',PasswordValidator)


button.addEventListener('click', (e) => {
    

    //stroring value returned from validation functions
    let EmailResponse=EmailValidator()
    let PassResponse=PasswordValidator()

    if (PassResponse != true || EmailResponse != true ) {
        e.preventDefault()
    }
    else {

    }
    
})

