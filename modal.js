// Modal setup
document.addEventListener("DOMContentLoaded", () => {
  const modalContainer = document.getElementById("modal-container");

  // Load modal.html into #modal-container
  fetch("modal.html")  // ✅ relative path (since radiant_affairs.html and modal.html are in same folder)
    .then(response => response.text())
    .then(data => {
      modalContainer.innerHTML = data;

      const modal = document.getElementById("signupModal");
      const closeBtn = modal.querySelector(".close");
      const signupForm = modal.querySelector("#signupForm");
      const successMessage = modal.querySelector("#successMessage");

      // Open modal when button is clicked
      document.querySelectorAll(".signup-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          modal.style.display = "block";
        });
      });

      // Close modal on X
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });

      // Close modal when clicking outside
      window.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });

      // Handle form submit
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        successMessage.style.display = "block";
        signupForm.reset();
      });
    })
    .catch(err => console.error("Modal failed to load:", err));
});
