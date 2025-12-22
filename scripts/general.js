/* ---------- Mobile Menu (only if present) ---------- */
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuBtn.classList.toggle("open");
  });
}

/* ---------- Smooth scrolling for in-page anchors ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetSel = this.getAttribute("href");
    const targetEl = document.querySelector(targetSel);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ---------- Scroll-to-top button ---------- */
(() => {
  const btn = document.createElement("button");
  btn.innerText = "↑";
  btn.className = "scroll-to-top";
  document.body.appendChild(btn);
  window.addEventListener("scroll", () => {
    btn.style.display = window.scrollY > 300 ? "block" : "none";
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

/* ---------- Fade-in on scroll (works on any page) ---------- */
(() => {
  const faders = document.querySelectorAll(".fade-in");
  if (!faders.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("appear");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });
  faders.forEach(el => io.observe(el));
})();

/* ---------- Hero background slideshow (if .hero exists) ---------- */
(() => {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const heroImages = ["../assets/hero1.webp", "../assets/hero4.webp","../assets/hero8.jpg", "../assets/hero5.webp", "../assets/hero6.webp", "../assets/hero7.webp"]; // your images
  let i = 0;
  const change = () => {
    hero.style.background = `url('${heroImages[i]}') center/cover no-repeat`;
    i = (i + 1) % heroImages.length;
  };
  change();
  setInterval(change, 5000);
})();

/* ---------- Typing effect (only if #typing-text exists) ---------- */


(() => {
  const typingEl = document.getElementById("typing-text");
  if (!typingEl) return;
  const words = [
    "Equipping Communities with Knowledge & Wellness",
    "Advancing Research for a Healthier Future",
    "Empowering Change through Training & Outreach"
  ];
  let wi = 0, ci = 0, del = false;
  const type = () => {
    const word = words[wi];
    typingEl.textContent = del ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!del && ci > word.length) { del = true; setTimeout(type, 2000); return; }
    if (del && ci < 0) { del = false; wi = (wi + 1) % words.length; setTimeout(type, 800); return; }
    setTimeout(type, del ? 50 : 100);
  };
  type();
})();



/* ---------- Impact counters (only on pages that have them) ---------- */
(() => {
  const counters = document.querySelectorAll(".counter");
  const programsSection = document.querySelector(".programs");
  if (!counters.length || !programsSection || !("IntersectionObserver" in window)) return;

  let started = false;
  const runCounters = () => {
    counters.forEach(counter => {
      const parent = counter.parentElement;
      parent?.classList.add("glow");
      const target = +counter.getAttribute("data-target");
      const step = Math.ceil(target / 100);
      const tick = () => {
        const val = +counter.innerText || 0;
        if (val < target) {
          counter.innerText = Math.min(val + step, target).toString();
          setTimeout(tick, 40);
        } else {
          counter.innerText = target + "+";
          parent?.classList.remove("glow");
        }
      };
      tick();
    });
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !started) {
        started = true;
        runCounters();
      }
    });
  }, { threshold: 0.5 });
  io.observe(programsSection);
})();

/* ---------- Donate button periodic pulse (if present) ---------- */
(() => {
  const donateBtns = document.querySelectorAll(".donate-btn");
  if (!donateBtns.length) return;
  setInterval(() => {
    donateBtns.forEach(btn => {
      btn.classList.add("attention");
      setTimeout(() => btn.classList.remove("attention"), 2000);
    });
  }, 8000);
})();

/* ---------- Team modal (About page only) ---------- */
(() => {
  const teamMembers = document.querySelectorAll(".team-member");
  const modal = document.getElementById("teamModal");
  const modalImage = document.getElementById("modalImage");
  const modalName = document.getElementById("modalName");
  const modalRole = document.getElementById("modalRole");
  const modalBio = document.getElementById("modalBio");
  const closeBtn = document.querySelector(".close-btn");

  if (!teamMembers.length || !modal || !modalImage || !modalName || !modalRole || !modalBio || !closeBtn) return;

  teamMembers.forEach(member => {
    member.addEventListener("click", () => {
      modal.style.display = "flex";
      modalImage.src = member.querySelector("img")?.src || "";
      modalName.textContent = member.getAttribute("data-name") || "";
      modalRole.textContent = member.getAttribute("data-role") || "";
      modalBio.textContent = member.getAttribute("data-bio") || "";
    });
  });

  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
})();
