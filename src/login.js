document.addEventListener("DOMContentLoaded", function () {
    const formTitle = document.getElementById("form-title");
    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const toggleText = document.getElementById("toggle-text");
    const submitBtn = document.getElementById("submitBtn");
    const form = document.getElementById("auth-form");
    const errorContainer = document.createElement("div");
    errorContainer.id = "form-error";
    errorContainer.style.color = "red";
    form.prepend(errorContainer);
    let isRegistering = false;

    const existingUsernames = ["admin", "testUser", "student123"]; // Simulated existing users
    const HUNTER_API_KEY = "API_key"; // Replace with your Hunter.io API Key

    function showError(input, message) {
        let errorDiv = input.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains("error-message")) {
            errorDiv = document.createElement("div");
            errorDiv.classList.add("error-message");
            errorDiv.style.color = "red";
            input.parentNode.insertBefore(errorDiv, input.nextSibling);
        }
        errorDiv.textContent = message;
    }

    function clearErrors() {
        document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
        errorContainer.textContent = "";
    }

    function validateName(name) {
        return /^[A-Za-z]{2,}$/.test(name);
    }

    function validateUsername(username) {
        return username.length >= 3 && !existingUsernames.includes(username);
    }

    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@students\.utech\.edu\.jm$/;
        return regex.test(email);
    }

    async function verifyEmail(email) {
        try {
            const response = await fetch(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${HUNTER_API_KEY}`);
            const data = await response.json();
            return data.data.result === "deliverable"; // Email is valid if deliverable
        } catch (error) {
            console.error("Error verifying email:", error);
            return false;
        }
    }

    function validatePassword(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    }

    function toggleForm(event) {
        event.preventDefault();
        isRegistering = !isRegistering;

        if (isRegistering) {
            formTitle.textContent = "Register";
            usernameInput.style.display = "block";
            firstNameInput.style.display = "block";
            lastNameInput.style.display = "block";
            confirmPasswordInput.style.display = "block";
            submitBtn.textContent = "Register";
            toggleText.innerHTML = 'Already have an account? <a href="#" id="toggle-link">Login</a>';
        } else {
            formTitle.textContent = "Login";
            usernameInput.style.display = "none";
            firstNameInput.style.display = "none";
            lastNameInput.style.display = "none";
            confirmPasswordInput.style.display = "none";
            submitBtn.textContent = "Login";
            toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-link">Register</a>';
        }

        document.getElementById("toggle-link").addEventListener("click", toggleForm);
    }

    form.addEventListener("submit", async function (event) {
        if (isRegistering) {
            event.preventDefault();
            clearErrors();
            let errors = [];

            if (!validateName(firstNameInput.value)) {
                showError(firstNameInput, "Invalid first name.");
                errors.push("First name is invalid.");
            }
            if (!validateName(lastNameInput.value)) {
                showError(lastNameInput, "Invalid last name.");
                errors.push("Last name is invalid.");
            }
            if (!validateUsername(usernameInput.value)) {
                showError(usernameInput, "Username already taken or too short.");
                errors.push("Username issue.");
            }
            if (!validateEmail(emailInput.value)) {
                showError(emailInput, "Invalid email format. Must be @students.utech.edu.jm");
                errors.push("Invalid email format.");
            } else {
                const isValidEmail = await verifyEmail(emailInput.value);
                if (!isValidEmail) {
                    showError(emailInput, "This email does not appear to exist.");
                    errors.push("Email does not exist.");
                }
            }
            if (!validatePassword(passwordInput.value)) {
                showError(passwordInput, "Weak password: Must be at least 8 characters, include uppercase, lowercase, number, and special character.");
                errors.push("Weak password.");
            }
            if (passwordInput.value !== confirmPasswordInput.value) {
                showError(confirmPasswordInput, "Passwords do not match.");
                errors.push("Passwords do not match.");
            }

            if (errors.length > 0) {
                errorContainer.textContent = "Please fix the highlighted errors before submitting.";
            } else {
                alert("Registration successful (demo mode, no database yet)");
                form.reset();
                toggleForm(event);
            }
        }
    });

    document.addEventListener("click", () => {
        clearErrors();
    });

    document.getElementById("toggle-link").addEventListener("click", toggleForm);
});
