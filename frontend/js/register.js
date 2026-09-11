const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    // Check passwords
    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        return;
    }

    try {

       const response = await fetch(
    "http://localhost:5000/auth/register",
    {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

     body: JSON.stringify({
    FullName: name,
    email,
    password
})
    }
);

        const data = await response.json();

        if (!response.ok) {
            message.textContent =
                data.message || "Registration failed.";
            return;
        }

        message.textContent =
            "Registration successful!";

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {

        console.error(error);

        message.textContent =
            "Server connection failed.";
    }
});