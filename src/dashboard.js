document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navBar = document.getElementById("navBar");

    // Toggle menu visibility when clicking the menu button
    menuToggle.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent this click from reaching the document
        navBar.classList.toggle("show");
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
        if (!navBar.contains(event.target) && !menuToggle.contains(event.target)) {
            navBar.classList.remove("show");
        }
    });
});