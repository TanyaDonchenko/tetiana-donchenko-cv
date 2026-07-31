// ============================================================================
// script.js — Mobile navigation toggle
// ============================================================================
// This is the ONLY JavaScript on the whole site. All it does is show/hide
// the mobile dropdown menu when the hamburger button is tapped, and close
// it again once a link inside the menu is clicked. Nothing else on the
// page depends on JavaScript — if a visitor has it disabled, every link,
// button, and the certificate embeds still work; only the mobile menu
// button will not expand (desktop nav is unaffected either way).
//
// How it works:
//   1. Find the hamburger <button id="navToggle"> and the <ul id="navMenu">
//      in index.html.
//   2. On click, toggle the CSS class "is-open" on the menu (this class is
//      what actually shows/hides it — see ".nav__menu.is-open" in styles.css).
//   3. Keep the button's aria-expanded attribute in sync for screen readers.
//   4. Auto-close the menu whenever a nav link is clicked, so it doesn't stay
//      open after navigating to a section.
// ============================================================================

(function () {
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  // Safety check: if either element is missing (e.g. someone edited the
  // HTML and removed the menu), just do nothing instead of throwing an error.
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close the mobile menu after any nav link inside it is chosen.
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();
