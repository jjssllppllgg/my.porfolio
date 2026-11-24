// Lightbox Controller
var openLightbox, closeLightbox;
(function () {
  var lb = document.getElementById("lightbox"),
    img = document.getElementById("lb-img"),
    stage = document.getElementById("lb-stage"),
    title = document.getElementById("lb-title"),
    zoom = document.getElementById("lb-zoom"),
    closeBtn = document.getElementById("lb-close"),
    last = null;

  function setFull(on) {
    if (!lb || !zoom || !stage) return;
    lb.classList.toggle("is-full", on);
    zoom.setAttribute("aria-pressed", on);
    zoom.textContent = on ? "Fit to screen" : "View full size";
    stage.scrollTop = 0;
    stage.scrollLeft = 0;
  }

  openLightbox = function (fullSrc, certTitle, altText, triggerEl) {
    if (!lb || !img || !title) return;
    last = triggerEl || null;
    img.src = fullSrc;
    img.alt = altText || certTitle;
    title.textContent = certTitle;
    setFull(false);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  };

  closeLightbox = function () {
    if (!lb || !img) return;
    lb.hidden = true;
    document.body.style.overflow = "";
    img.removeAttribute("src");
    if (last && typeof last.focus === "function") last.focus();
  };

  if (zoom) {
    zoom.addEventListener("click", function () {
      setFull(!lb.classList.contains("is-full"));
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }
  if (lb) {
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target === stage) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (lb && !lb.hidden) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      }
      if (e.key === "Tab") {
        var f = [zoom, closeBtn].filter(Boolean);
        var i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    }
  });
})();

// Contact Mailto Form
function sendMsg(f) {
  var s = encodeURIComponent("Inquiry from " + f.name.value);
  var b = encodeURIComponent(
    f.message.value + "\n\n" + f.name.value + "\n" + f.email.value
  );
  window.location.href =
    "mailto:plagajesselann@gmail.com?subject=" + s + "&body=" + b;
  return false;
}

var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Profile Tilt & Scroll Reveal Animations
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
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 10);
    },
    { passive: true }
  );
  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  document.documentElement.classList.add("js");
  var groups = [
    ".cards > *",
    ".experience-stack > *",
    ".experience-secondary-grid > *",
    ".approach-grid > *",
    ".experience-grid > *",
    ".tool-grid > *",
    ".workflow > *",
    ".cert-folders-grid > *",
  ];
  var singles = [
    ".hero-grid > *",
    ".about-grid > *",
    ".work-approach-panel",
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
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach(function (el) {
    el.classList.add("reveal");
    io.observe(el);
  });
})();

// Card Spotlight Cursor Tracker (Stundesign style)
document
  .querySelectorAll(".experience-card, .approach-card, .service-card, .ccard, .ins-logo-card")
  .forEach(function (c) {
    c.addEventListener("mousemove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      c.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
  });

// Experience Accordion Tabs
document
  .querySelectorAll("[data-accordion] .acc-head")
  .forEach(function (b, i) {
    b.addEventListener("click", function () {
      var v = document.querySelector(".exp-visual");
      if (v) v.setAttribute("data-active", i + 1);
    });
  });

// ===== Interactive 4-State macOS Folder UI for Certificates =====
(function () {
  var folders = document.querySelectorAll(".cert-folder");
  if (!folders.length) return;

  function closeAllFolders() {
    folders.forEach(function (f) {
      f.classList.remove("is-open");
      var wrap = f.querySelector(".folder-wrap");
      if (wrap) wrap.setAttribute("aria-expanded", "false");
      var hint = f.querySelector(".folder-hint .hint-text");
      if (hint) hint.textContent = "Click to open";
    });
  }

  folders.forEach(function (folder) {
    var wrap = folder.querySelector(".folder-wrap");
    var fullSrc = folder.getAttribute("data-full");
    var certTitle = folder.getAttribute("data-title");
    var paperMain = folder.querySelector(".paper-main");
    var hint = folder.querySelector(".folder-hint .hint-text");

    if (!wrap) return;

    wrap.addEventListener("click", function (e) {
      var isOpen = folder.classList.contains("is-open");
      var clickedMainPaper = e.target.closest(".paper-main");

      // State 4: If folder is already open and user clicks fanned certificate -> Expand full size in Lightbox!
      if (isOpen && clickedMainPaper) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof openLightbox === "function") {
          openLightbox(fullSrc, certTitle, certTitle, wrap);
        }
        return;
      }

      // State 3: Click to open folder and fan documents
      if (!isOpen) {
        e.preventDefault();
        closeAllFolders();
        folder.classList.add("is-open");
        wrap.setAttribute("aria-expanded", "true");
        if (hint) hint.textContent = "Click cert to expand";
      } else {
        // Clicking folder again closes it
        folder.classList.remove("is-open");
        wrap.setAttribute("aria-expanded", "false");
        if (hint) hint.textContent = "Click to open";
      }
    });

    wrap.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        var isOpen = folder.classList.contains("is-open");
        if (!isOpen) {
          closeAllFolders();
          folder.classList.add("is-open");
          wrap.setAttribute("aria-expanded", "true");
          if (hint) hint.textContent = "Click cert to expand";
        } else {
          // If already open and Enter is pressed, expand full size
          if (typeof openLightbox === "function") {
            openLightbox(fullSrc, certTitle, certTitle, wrap);
          }
        }
      }
    });

    if (paperMain) {
      paperMain.addEventListener("click", function (e) {
        if (folder.classList.contains("is-open")) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof openLightbox === "function") {
            openLightbox(fullSrc, certTitle, certTitle, wrap);
          }
        }
      });
    }
  });

  // Clicking outside any certificate folder closes open folders
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".cert-folder") && !e.target.closest("#lightbox")) {
      closeAllFolders();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllFolders();
    }
  });
})();

// ===== Draggable Insurance Marquees (Mouse Drag & Touch Swipe) =====
(function () {
  var marquees = document.querySelectorAll(".ins-marquee");
  if (!marquees.length) return;

  marquees.forEach(function (marquee) {
    var track = marquee.querySelector(".ins-track");
    if (!track) return;

    var isDown = false;
    var startX = 0;
    var currentTranslate = 0;
    var moved = 0;

    function getTranslateX() {
      var st = window.getComputedStyle(track);
      var transform = st.transform || st.webkitTransform;
      if (!transform || transform === "none") return 0;
      var mat = transform.match(/^matrix\((.+)\)$/);
      if (mat) {
        var vals = mat[1].split(",");
        return parseFloat(vals[4]) || 0;
      }
      return 0;
    }

    marquee.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      isDown = true;
      moved = 0;
      startX = e.clientX;
      currentTranslate = getTranslateX();
      marquee.classList.add("is-dragging");
      track.style.animationPlayState = "paused";
      track.style.transform = "translateX(" + currentTranslate + "px)";
      try {
        marquee.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    marquee.addEventListener("pointermove", function (e) {
      if (!isDown) return;
      var dx = (e.clientX - startX) * 1.35;
      moved += Math.abs(e.movementX || dx);
      var newPos = currentTranslate + dx;
      var halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        while (newPos > 0) newPos -= halfWidth;
        while (newPos < -halfWidth) newPos += halfWidth;
      }
      track.style.transform = "translateX(" + newPos + "px)";
    });

    function stopDrag(e) {
      if (!isDown) return;
      isDown = false;
      marquee.classList.remove("is-dragging");
      try {
        marquee.releasePointerCapture(e.pointerId);
      } catch (err) {}
      setTimeout(function () {
        if (!isDown && !marquee.matches(":hover")) {
          track.style.animationPlayState = "running";
        }
      }, 350);
    }

    marquee.addEventListener("pointerup", stopDrag);
    marquee.addEventListener("pointercancel", stopDrag);

    // Prevent click actions if user was actively dragging
    marquee.addEventListener(
      "click",
      function (e) {
        if (moved > 8) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  });
})();

// ===== Custom Interactive Cursor =====
(function () {
  var cursor = document.getElementById("custom-cursor");
  if (!cursor) return;
  var dot = cursor.querySelector(".cursor-dot");
  var ring = cursor.querySelector(".cursor-ring");
  if (!dot || !ring) return;

  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    cursor.style.display = "none";
    return;
  }

  var mouseX = -100, mouseY = -100;
  var ringX = -100, ringY = -100;

  window.addEventListener("mousemove", function (e) {
    cursor.classList.remove("is-hidden");
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
  });

  window.addEventListener("mousedown", function () {
    cursor.classList.add("is-down");
  });
  window.addEventListener("mouseup", function () {
    cursor.classList.remove("is-down");
  });
  document.addEventListener("mouseleave", function () {
    cursor.classList.add("is-hidden");
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  var hoverSelectors =
    "a, button, [role='button'], input, textarea, select, label, .folder-wrap, .cert-folder, .ins-logo-card, .experience-card, .approach-card, .service-card, .tool, .brand, .nav-cta";

  document.addEventListener("mouseover", function (e) {
    if (e.target.closest(hoverSelectors)) {
      cursor.classList.add("is-hover");
    }
    if (e.target.closest(".ins-marquee, .ins-track")) {
      cursor.classList.add("is-drag");
    }
  });

  document.addEventListener("mouseout", function (e) {
    if (e.target.closest(hoverSelectors)) {
      cursor.classList.remove("is-hover");
    }
    if (e.target.closest(".ins-marquee, .ins-track")) {
      cursor.classList.remove("is-drag");
    }
  });
})();

// ===== WebGL Fluid Smoke Simulation =====
(function () {
  var canvas = document.getElementById("fluid-canvas");
  if (canvas && typeof WebGLFluid === "function") {
    try {
      WebGLFluid(canvas, {
        IMMEDIATE: true,
        TRIGGER: "hover",
        AUTO: false,
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 3.2,
        VELOCITY_DISSIPATION: 2.2,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 20,
        SPLAT_RADIUS: 0.12,
        SPLAT_FORCE: 3200,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 10,
        TRANSPARENT: true,
        BLOOM: true,
        BLOOM_ITERATIONS: 6,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.25,
        BLOOM_THRESHOLD: 0.65,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false,
      });
    } catch (e) {
      console.warn("Fluid canvas could not start:", e);
    }
  }
})();
