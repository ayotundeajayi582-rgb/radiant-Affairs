document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- SCROLL ANIMATION ---------------- */
  const scrollElements = document.querySelectorAll(".scroll-animate");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });
  scrollElements.forEach(el => observer.observe(el));

  /* ---------------- FORM + INVOICE ---------------- */
  const form = document.getElementById("eventForm");
  const successMsg = document.getElementById("successMessage");
  const invoiceList = document.getElementById("invoiceList");
  const totalAmount = document.getElementById("totalAmount");
  const clearInvoiceBtn = document.getElementById("clearInvoice");

  // ✅ Update Invoice
  function updateInvoice() {
    const options = document.querySelectorAll("input[type='radio'][data-price]");
    invoiceList.innerHTML = "";
    let total = 0;

    options.forEach(option => {
      if (option.checked) {
        const serviceName = option.value;
        const price = parseInt(option.getAttribute("data-price"));
        const li = document.createElement("li");
        li.innerHTML = `<span>${serviceName}</span> <span>₦${price.toLocaleString()}</span>`;
        invoiceList.appendChild(li);
        total += price;
      }
    });

    totalAmount.textContent = `₦${total.toLocaleString()}`;
  }

  // ✅ Listen for radio button changes
  document.querySelectorAll("input[type='radio'][data-price]").forEach(option => {
    option.addEventListener("change", updateInvoice);
  });

  // ✅ Clear Invoice Button
  if (clearInvoiceBtn) {
    clearInvoiceBtn.addEventListener("click", () => {
      document.querySelectorAll("input[type='radio'][data-price]").forEach(option => {
        option.checked = false;
      });
      invoiceList.innerHTML = "";
      totalAmount.textContent = "₦0";
    });
  }

  // ✅ Submit Form
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      updateInvoice();
      successMsg.style.display = "block";
      form.reset();
      invoiceList.innerHTML = "";
      totalAmount.textContent = "₦0";

      // 🎉 Confetti effect
      confetti();
      setTimeout(() => successMsg.style.display = "none", 4000);
    });
  }

  /* ---------------- CONFETTI EFFECT ---------------- */
  function confetti() {
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement("div");
      piece.classList.add("confetti");
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.animationDuration = 2 + Math.random() * 3 + "s";
      document.body.appendChild(piece);

      setTimeout(() => piece.remove(), 5000);
    }
  }

    /* ---------------- SLIDESHOW ---------------- */
  let slides = document.querySelectorAll(".slide");
  let index = 0;

  function showSlide() {
    slides.forEach(s => s.classList.remove("active"));
    slides[index].classList.add("active");
    index = (index + 1) % slides.length;
  }

  showSlide();
  setInterval(showSlide, 4000); // change every 4 seconds

});
