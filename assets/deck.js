/* =============================================================================
   The bili-core Quest - deck.js
   A tiny zero-dependency slide engine. No build step, no CDN, works offline.

   Markup contract (see index.html):
     #stage > section.slide            one slide each
     .fragment                         revealed one step at a time (arrow keys)
     [data-reveal] button + .answer    "skill check": click to unveil the answer

   Controls: → / Space / click = next   ← = back   F = fullscreen
             ? = help    Home/End = first/last
   ============================================================================= */
(function () {
  "use strict";

  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var stage  = document.getElementById("stage");
  var torch  = document.getElementById("torchbar");
  var dotsEl = document.getElementById("dots");
  var footIndex = document.getElementById("footIndex");
  var index = 0;

  // Build the dot indicators once.
  slides.forEach(function (_, i) {
    var d = document.createElement("span");
    d.className = "dot";
    d.addEventListener("click", function () { go(i); });
    dotsEl.appendChild(d);
  });
  var dots = Array.prototype.slice.call(dotsEl.children);

  function fragments(slide) {
    return Array.prototype.slice.call(slide.querySelectorAll(".fragment"));
  }

  function render() {
    slides.forEach(function (s, i) { s.classList.toggle("active", i === index); });
    dots.forEach(function (d, i) { d.classList.toggle("on", i === index); });
    var pct = slides.length > 1 ? (index / (slides.length - 1)) * 100 : 100;
    torch.style.width = pct + "%";
    if (footIndex) footIndex.textContent = (index + 1) + " / " + slides.length;
    // Reset fragments on the freshly shown slide so re-entering replays them.
    fragments(slides[index]).forEach(function (f) { f.classList.remove("visible"); });
    location.hash = "#" + (index + 1);
  }

  function go(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    render();
  }

  // Advance: first reveal any pending fragment on this slide, else next slide.
  function next() {
    var frags = fragments(slides[index]);
    var hidden = frags.filter(function (f) { return !f.classList.contains("visible"); });
    if (hidden.length) { hidden[0].classList.add("visible"); return; }
    if (index < slides.length - 1) go(index + 1);
  }
  function prev() {
    var frags = fragments(slides[index]).filter(function (f) { return f.classList.contains("visible"); });
    if (frags.length) { frags[frags.length - 1].classList.remove("visible"); return; }
    if (index > 0) go(index - 1);
  }

  // ---- Keyboard ----
  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case "ArrowRight": case " ": case "PageDown": e.preventDefault(); next(); break;
      case "ArrowLeft":  case "PageUp": e.preventDefault(); prev(); break;
      case "Home": e.preventDefault(); go(0); break;
      case "End":  e.preventDefault(); go(slides.length - 1); break;
      case "f": case "F": toggleFullscreen(); break;
      case "?": toggleHelp(); break;
      case "Escape": document.getElementById("help").classList.remove("on"); break;
    }
  });

  // ---- Click to advance (but not when clicking interactive controls) ----
  stage.addEventListener("click", function (e) {
    if (e.target.closest("button, a, .dot, .no-advance")) return;
    next();
  });

  // ---- Skill-check reveals: <button data-reveal="answerId"> ----
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-reveal]");
    if (!btn) return;
    var ans = document.getElementById(btn.getAttribute("data-reveal"));
    if (ans) {
      ans.classList.add("shown");
      btn.style.display = "none";
    }
  });

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
    } else {
      (document.exitFullscreen || function () {}).call(document);
    }
  }

  function toggleHelp() { document.getElementById("help").classList.toggle("on"); }

  // ---- Scale the fixed 1280x720 canvas to fit any screen ----
  // Reserve a strip at the bottom for the footer and center the slide in the
  // space *above* it, so a short (non-fullscreen) window never lets the slide
  // overlap the footer chrome.
  function fit() {
    var RESERVE = 52; // px kept clear at the bottom for the footer
    var avail = Math.max(240, window.innerHeight - RESERVE);
    var scale = Math.min(window.innerWidth / 1280, avail / 720) * 0.96;
    stage.style.top = (avail / 2) + "px";
    stage.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
  }
  window.addEventListener("resize", fit);

  // ---- Boot ----
  var start = parseInt((location.hash || "#1").slice(1), 10);
  index = isNaN(start) ? 0 : Math.max(0, Math.min(slides.length - 1, start - 1));
  fit();
  render();
})();
