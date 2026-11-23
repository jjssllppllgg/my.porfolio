(function () {
          var lb = document.getElementById("lightbox"),
            img = document.getElementById("lb-img"),
            stage = document.getElementById("lb-stage"),
            title = document.getElementById("lb-title"),
            zoom = document.getElementById("lb-zoom"),
            closeBtn = document.getElementById("lb-close"),
            last = null;
          function setFull(on) {
            lb.classList.toggle("is-full", on);
            zoom.setAttribute("aria-pressed", on);
            zoom.textContent = on ? "Fit to screen" : "View full size";
            stage.scrollTop = 0;
            stage.scrollLeft = 0;
          }
          function open(card) {
            last = card;
            img.src = card.getAttribute("data-full");
            img.alt = card.querySelector("img").alt;
            title.textContent = card.getAttribute("data-title");
            setFull(false);
            lb.hidden = false;
            document.body.style.overflow = "hidden";
            closeBtn.focus();
          }
          function close() {
            lb.hidden = true;
            document.body.style.overflow = "";
            img.removeAttribute("src");
            if (last) last.focus();
          }
          document.querySelectorAll(".ccard").forEach(function (c) {
            c.addEventListener("click", function (e) { e.preventDefault(); open(c); });
          });
          zoom.addEventListener("click", function () { setFull(!lb.classList.contains("is-full")); });
          closeBtn.addEventListener("click", close);
          lb.addEventListener("click", function (e) { if (e.target === lb || e.target === stage) close(); });
          document.addEventListener("keydown", function (e) {
            if (lb.hidden) return;
            if (e.key === "Escape") { e.preventDefault(); close(); }
            if (e.key === "Tab") {
              var f = [zoom, closeBtn], i = f.indexOf(document.activeElement);
              e.preventDefault();
              f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
            }
          });
        })();

function sendMsg(f) {
          var s = encodeURIComponent("Inquiry from " + f.name.value);
          var b = encodeURIComponent(
            f.message.value + "\n\n" + f.name.value + "\n" + f.email.value,
          );
          window.location.href =
            "mailto:plagajesselann@gmail.com?subject=" + s + "&body=" + b;
          return false;
        }

document.getElementById("year").textContent = new Date().getFullYear();
      (function () {
        var pc = document.querySelector(".profile-card"),
          pi = pc && pc.querySelector("img");
        if (
          pc &&
          pi &&
          window.matchMedia("(hover:hover)").matches &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          pc.addEventListener("mousemove", function (e) {
            var r = pc.getBoundingClientRect(),
              x = (e.clientX - r.left) / r.width - 0.5,
              y = (e.clientY - r.top) / r.height - 0.5;
            pi.style.setProperty("--ry", x * 8 + "deg");
            pi.style.setProperty("--rx", -y * 6 + "deg");
          });
          pc.addEventListener("mouseleave", function () {
            pi.style.setProperty("--ry", "0deg");
            pi.style.setProperty("--rx", "0deg");
          });
        }
        var nav = document.querySelector(".nav");
        window.addEventListener(
          "scroll",
          function () {
            nav.classList.toggle("scrolled", window.scrollY > 10);
          },
          { passive: true },
        );
        if (
          !("IntersectionObserver" in window) ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        document.documentElement.classList.add("js");
        var groups = [
          ".cards > *",
          ".experience-grid > *",
          ".tool-grid > *",
          ".workflow > *",
        ];
        var singles = [
          ".hero-grid > *",
          ".about-grid > *",
          "section .section-kicker",
          "section h2",
          ".section-intro",
          ".contact-panel",
        ];
        var items = [];
        singles.forEach(function (s) {
          document.querySelectorAll(s).forEach(function (el) {
            items.push(el);
          });
        });
        groups.forEach(function (s) {
          document.querySelectorAll(s).forEach(function (el, i) {
            el.style.setProperty("--d", (i % 4) * 0.08 + "s");
            items.push(el);
          });
        });
        var io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) {
                e.target.classList.add("in");
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
        );
        items.forEach(function (el) {
          el.classList.add("reveal");
          io.observe(el);
        });
      })();

document.querySelectorAll(".experience-card").forEach(function (c) {
        c.addEventListener("mousemove", function (e) {
          var r = c.getBoundingClientRect();
          c.style.setProperty(
            "--mx",
            ((e.clientX - r.left) / r.width) * 100 + "%",
          );
          c.style.setProperty(
            "--my",
            ((e.clientY - r.top) / r.height) * 100 + "%",
          );
        });
      });

document
        .querySelectorAll("[data-accordion] .acc-head")
        .forEach(function (b, i) {
          b.addEventListener("click", function () {
            var v = document.querySelector(".exp-visual");
            if (v) v.setAttribute("data-active", i + 1);
          });
        });
