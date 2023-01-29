//jshint esversion:6

// navigation bar
const navSlide = () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav_links");
  const navLinks = document.querySelectorAll(".nav_links li");

  burger.addEventListener("click", () => {
    // toggle nav
    nav.classList.toggle("nav_active");

    // animate links
    navLinks.forEach((link, index) => {
      // + 0.3 for initial delay
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 +
          0.5}s `;
      }
    });

    // animate burger
    burger.classList.toggle("toggle");
  });
};

// invoke function
navSlide();

// scroll EVENT
window.addEventListener("scroll", function() {
  let nav = document.querySelector(".navigation");
  let windowPosition = window.scrollY > 0;
  nav.classList.toggle("scrolling-active", windowPosition);
});

// footer

const currentYear = new Date().getFullYear();
const copyrightYear = document.querySelector(".year");
copyrightYear.innerHTML = currentYear;
const closeBtn = document.querySelector(".close");
const modal = document.querySelector(".contact-overlay");
const openModal = document.querySelector(".open");

// email form using jquery

$(".footer-form").on("submit", e => {
  e.preventDefault();
  const email = $("#client-email").val().trim();
  const fname = $("#fName").val().trim();
  const lname = $("#lName").val().trim();
  const phone = $("#phone").val().trim();
  const state = $("#state").val().trim();
  const text = $("#message").val().trim();
  let form = $(".footer-form"),
    url = form.attr("action");
  let data = {
    email,
    fname,
    lname,
    phone,
    state,
    text
  };

  $.post(url, data, function() {
    console.log("server received our data");
  });

 
});

// close modal

if (closeBtn !== null) {
  closeBtn.addEventListener("click", () => {
    if (modal.classList.contains("open-modal"))
      modal.classList.remove("open-modal");
  });
}
if (openModal !== null) {
  openModal.addEventListener("click", () => {
    modal.classList.add("open-modal");
  });
}

const mainImg = document.querySelector(".puppy-img");
const otherImgs = Array.from(document.getElementsByClassName("other-image"));

for (let img of otherImgs) {
  if (img !== null) {
    img.addEventListener("click", () => {
      mainImg.src = img.src;
    });
  }
}

$(document).on("click", 'a[href^="#"]', function(event) {
  event.preventDefault();

  $("html, body").animate(
    {
      scrollTop: $($.attr(this, "href")).offset().top
    },
    500
  );
});
