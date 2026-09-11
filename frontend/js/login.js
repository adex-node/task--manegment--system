const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(
            "http://localhost:5000/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent =
                data.message || "Login failed.";
            return;
        }

        localStorage.setItem("token", data.token);

        message.textContent = "Login successful!";

        setTimeout(() => {
            window.location.href = "tasks.html";
        }, 1000);

    } catch (error) {
        console.error(error);
        message.textContent = "Server connection failed.";
    }
});