// radiant_affairs.js (replace the whole file with this)
document.addEventListener('DOMContentLoaded', () => {
  // tiny helpers
  const q = sel => document.querySelector(sel);
  const qa = sel => Array.from(document.querySelectorAll(sel));

  /* NAVBAR SCROLL EFFECT */
  const navbar = q('.navbar');
  const handleNavScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  /* HAMBURGER MENU (accessible) */
  const menuToggle = q('.menu-toggle');
  const navMenu = q('.nav-links ul');
  if (menuToggle && navMenu) {
    const toggleMenu = () => {
      const isOpen = navMenu.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('menu-open', isOpen);
    };
    menuToggle.addEventListener('click', e => { e.preventDefault(); toggleMenu(); });

    // close when a link is clicked
    navMenu.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        navMenu.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });

    // close with Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });
  }

  /* SMOOTH SCROLL for in-page anchors (only if target exists) */
  qa('a[href^="#"]').forEach(a => {
    const href = a.getAttribute('href');
    const target = href === '#' ? null : document.querySelector(href);
    if (!target) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });

      // close mobile menu if it was open
      if (navMenu && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        menuToggle?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });
  });

  /* HERO SLIDESHOW (uses .hero-slide elements) */
  const slides = qa('.hero-slide');
  if (slides.length) {
    let idx = slides.findIndex(s => s.classList.contains('active'));
    if (idx === -1) idx = 0;
    const show = i => slides.forEach((s, j) => s.classList.toggle('active', j === i));
    show(idx);
    let auto = setInterval(() => {
      idx = (idx + 1) % slides.length;
      show(idx);
    }, 5000);

    // pause on hover for better UX
    slides.forEach(s => {
      s.addEventListener('mouseenter', () => clearInterval(auto));
      s.addEventListener('mouseleave', () => {
        auto = setInterval(() => {
          idx = (idx + 1) % slides.length;
          show(idx);
        }, 5000);
      });
    });
  }

  /* SCROLL-REVEAL using IntersectionObserver (targets your existing .scroll-animate) */
  const revealTargets = qa('.scroll-animate');
  if (revealTargets.length) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(el => io.observe(el));
  }

  /* ACCORDION */
  qa('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('active');
      const content = item.querySelector('.accordion-content');
      const icon = header.querySelector('.icon');
      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon && (icon.textContent = '−');
      } else {
        content.style.maxHeight = null;
        icon && (icon.textContent = '+');
      }
    });
  });

  /* MODAL (SIGN UP) */
  const signupBtn = q('.signup-btn');
  const modal = q('#signupModal');
  const closeBtn = modal?.querySelector('.close');
  const signupForm = q('#signupForm');
  const successMsg = q('#successMessage');

  if (signupBtn && modal) {
    signupBtn.addEventListener('click', e => {
      e.preventDefault();
      modal.style.display = 'block';
    });
  }
  closeBtn?.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal && modal.style.display === 'block') modal.style.display = 'none'; });

  signupForm?.addEventListener('submit', e => {
    e.preventDefault();
    successMsg && (successMsg.style.display = 'block');
    signupForm.reset();
    setTimeout(() => {
      successMsg && (successMsg.style.display = 'none');
      modal && (modal.style.display = 'none');
    }, 1400);
  });

  /* BACK TO TOP BUTTON */
  const backBtn = document.createElement('button');
  backBtn.className = 'back-to-top';
  backBtn.title = 'Back to top';
  backBtn.innerHTML = '↑';
  document.body.appendChild(backBtn);

  const toggleBackBtn = () => backBtn.style.display = window.scrollY > 350 ? 'block' : 'none';
  window.addEventListener('scroll', toggleBackBtn);
  toggleBackBtn();
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // debug helper (call in console if you want): window.forceShow = () => qa('.scroll-animate').forEach(e => e.classList.add('visible'));
    /* --------------------------------
     ANIMATED COUNTERS
  -------------------------------- */
  const counters = document.querySelectorAll('.counter');
  const speed = 150; // smaller = faster

  const animateCounters = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const updateCount = () => {
          const target = +counter.getAttribute('data-target');
          const count = +counter.innerText;
          const inc = target / speed;

          if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(updateCount, 20);
          } else {
            counter.innerText = target;
          }
        };
        updateCount();
        observer.unobserve(counter); // only animate once
      }
    });
  };

  const observer = new IntersectionObserver(animateCounters, { threshold: 0.4 });
  counters.forEach(c => observer.observe(c));

// FLOATING + FADING HERO SLIDES WITH TYPEWRITER

let floatOffset = 0;
const heroSlides = document.querySelectorAll(".hero-slide");
let currentSlide = 0;

// Floating motion for slides
function animateHeroSlides() {
  floatOffset += 0.03;
  heroSlides.forEach((slide, index) => {
    const movement = Math.sin(floatOffset + index) * 15;
    slide.style.transform = `translateY(${movement}px) scale(1.03)`;
  });
  requestAnimationFrame(animateHeroSlides);
}
animateHeroSlides();

// --- TYPEWRITER FUNCTION ---
function typeWriter(element) {
  if (!element) return;
  const text = element.textContent.trim();
  element.textContent = "";
  let i = 0;

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, 100);
    }
  }
  type();
}

// --- INITIAL TYPEWRITER on first slide ---
const firstText = heroSlides[0].querySelector(".hero-text h1");
typeWriter(firstText);

// --- SLIDE SWITCHING ---
setInterval(() => {
  // remove active from current
  heroSlides[currentSlide].classList.remove("active");

  // move to next
  currentSlide = (currentSlide + 1) % heroSlides.length;
  heroSlides[currentSlide].classList.add("active");

  // run typewriter on the new slide text
  const newText = heroSlides[currentSlide].querySelector(".hero-text h1");
  typeWriter(newText);
}, 6000); // switch every 6 seconds


const faqs = [
  {
    question: "What types of events do you plan?",
    answer: "We plan weddings, corporate functions, birthdays, product launches, charity galas, festivals, and more—each tailored to your unique vision.",
    bg: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
  },
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 3–6 months before your event to ensure availability and proper planning.",
    bg: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
  },
  {
    question: "Do you handle destination events?",
    answer: "Yes, we specialize in both local and destination events, managing logistics, vendors, and travel arrangements.",
    bg: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    question: "Can you work with my budget?",
    answer: "Absolutely. We customize our services to fit your budget while maintaining quality and creativity.",
    bg: "https://images.unsplash.com/photo-1515165562835-c4c9e1e1fb13"
  },
  {
    question: "Do you offer on-the-day coordination?",
    answer: "Yes, our team ensures everything runs smoothly from start to finish so you can relax and enjoy your event.",
    bg: "https://images.unsplash.com/photo-1531058020387-3be344556be6"
  },
  {
    question: "Can I hire you for partial planning?",
    answer: "Yes, we offer flexible packages including full, partial, and day-of planning to meet your specific needs.",
    bg: "https://images.unsplash.com/photo-1529253355930-b1d0a9ef0f9a"
  },
  {
    question: "Do you provide decorations and designs?",
    answer: "Yes, we handle decor, floral designs, lighting, and full event styling to bring your vision to life.",
    bg: "https://images.unsplash.com/photo-1530107973768-581951e62d9a"
  },
  {
    question: "How do I get a quote?",
    answer: "Simply contact us through our website or phone number. We’ll discuss your goals and provide a detailed quote.",
    bg: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
  },
  {
    question: "Do you coordinate with vendors?",
    answer: "Yes, we work closely with trusted vendors to ensure seamless coordination and top-quality service.",
    bg: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
  },
  {
    question: "What makes your planning services unique?",
    answer: "We focus on personal touches, creative storytelling, and stress-free execution for memorable experiences.",
    bg: "https://images.unsplash.com/photo-1520975918311-82adfa6a4c5b"
  }
];

let currentIndex = 0;

const questionEl = document.getElementById("faq-question");
const answerEl = document.getElementById("faq-answer");
const cardEl = document.getElementById("faq-card");

function showFAQ(index) {
  const { question, answer, bg } = faqs[index];
  questionEl.textContent = question;
  answerEl.textContent = answer;
  cardEl.style.backgroundImage = `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url('${bg}')`;
}

document.getElementById("nextBtn").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % faqs.length;
  showFAQ(currentIndex);
});

document.getElementById("prevBtn").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + faqs.length) % faqs.length;
  showFAQ(currentIndex);
});

showFAQ(currentIndex);


});
