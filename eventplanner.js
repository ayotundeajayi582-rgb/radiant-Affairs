
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".event-card");

  if (cards[0]) cards[0].classList.add("show");
  if (cards[1]) cards[1].classList.add("show");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); 
      }
    });
  }
   ,{ threshold: 0.3 });

  cards.forEach((card, index) => {
    if (index > 1) observer.observe(card);
  });
});
