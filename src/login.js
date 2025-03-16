document.addEventListener("DOMContentLoaded", function () {
    const formTitle = document.getElementById("form-title");
    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const usernameInput = document.getElementById("username");
    const checkPassword = document.getElementById("confirmPassword");
    const toggleText = document.getElementById("toggle-text");
    const submitBtn = document.getElementById("submitBtn"); 
    let isRegistering = false;

    function toggleForm(event) {
        event.preventDefault();
        isRegistering = !isRegistering;

        if (isRegistering) {
            formTitle.textContent = "Register";
            usernameInput.style.display = "block";
            firstNameInput.style.display = "block";
            lastNameInput.style.display = "block";
            checkPassword.style.display = "block";
            submitBtn.textContent = "Register";
            toggleText.innerHTML = 'Already have an account? <a href="#" id="toggle-link">Login</a>';
        } else {
            formTitle.textContent = "Login";
            usernameInput.style.display = "none";
            usernameInput.style.display = "none";
            firstNameInput.style.display = "none";
            lastNameInput.style.display = "none";
            checkPassword.style.display = "none";
            submitBtn.textContent = "Login";
            toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-link">Register</a>';
        }

        // Reattach event listener since innerHTML update removes old event listeners
        document.getElementById("toggle-link").addEventListener("click", toggleForm);
    }

    // Initial event listener
    document.getElementById("toggle-link").addEventListener("click", toggleForm);
});
