// ============================================================================
// script.js — Mobile navigation toggle + Light/Dark theme switcher
// ============================================================================
// Two independent, self-contained features live in this file. Nothing on
// the page depends on JavaScript beyond these two things — every link,
// button, and the certificate embeds work fine with JS disabled; only the
// mobile menu button and the theme switch button won't do anything.
//
// PART 1 — MOBILE NAVIGATION (unchanged from before)
//   1. Find the hamburger <button id="navToggle"> and the <ul id="navMenu">.
//   2. On click, toggle the CSS class "is-open" on the menu (this class is
//      what actually shows/hides it — see ".nav__menu.is-open" in styles.css).
//   3. Keep the button's aria-expanded attribute in sync for screen readers.
//   4. Auto-close the menu whenever a nav link is clicked.
//
// PART 2 — THEME SWITCHER (light / dark)
//   1. On page load, decide which theme to show:
//        a. If the visitor has manually chosen a theme before, use the
//           value saved in localStorage ("theme": "light" | "dark").
//        b. Otherwise, follow the operating system's preference via the
//           prefers-color-scheme media query.
//   2. Apply the theme by setting data-theme="dark" (or removing it for
//      light) on the <html> element — styles.css reacts to that attribute
//      and swaps every color variable (see the "[data-theme="dark"]"
//      block near the top of styles.css).
//   3. When the toggle button is clicked, flip the theme, save the
//      explicit choice to localStorage so it's remembered next visit, and
//      update the button's label/aria-pressed/aria-label for screen readers.
// ============================================================================

(function () {
  // ---- Part 1: mobile navigation -----------------------------------------
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the mobile menu after any nav link inside it is chosen.
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Part 2: theme switcher ---------------------------------------------
  var STORAGE_KEY = 'theme'; // localStorage key; value is "light" or "dark"
  var themeToggle = document.getElementById('themeToggle');
  var htmlEl = document.documentElement;

  if (!themeToggle) return;

  function getSavedTheme() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // localStorage can throw in some privacy modes — fail quietly.
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // Ignore write failures (e.g. storage disabled); the toggle still
      // works for the current page view, it just won't persist.
    }
  }

  function systemPrefersDark() {
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // Updates the <html> attribute, the button's accessible state, and its
  // visible label to match the given theme ("light" or "dark").
  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlEl.setAttribute('data-theme', 'dark');
      themeToggle.setAttribute('aria-pressed', 'true');
      themeToggle.setAttribute('aria-label', 'Switch to light theme');
      var label = themeToggle.querySelector('.theme-toggle__label');
      if (label) label.textContent = 'Light';
    } else {
      htmlEl.removeAttribute('data-theme');
      themeToggle.setAttribute('aria-pressed', 'false');
      themeToggle.setAttribute('aria-label', 'Switch to dark theme');
      var labelEl = themeToggle.querySelector('.theme-toggle__label');
      if (labelEl) labelEl.textContent = 'Dark';
    }
  }

  // Decide the starting theme: saved choice first, then OS preference,
  // then fall back to light (the approved default design).
  var saved = getSavedTheme();
  var initialTheme = saved === 'dark' || saved === 'light'
    ? saved
    : (systemPrefersDark() ? 'dark' : 'light');

  applyTheme(initialTheme);

  // Manual toggle: flip the theme and remember the visitor's explicit choice.
  themeToggle.addEventListener('click', function () {
    var isCurrentlyDark = htmlEl.getAttribute('data-theme') === 'dark';
    var nextTheme = isCurrentlyDark ? 'light' : 'dark';
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });

  // If the visitor never manually chose a theme, keep following the OS
  // preference live (e.g. their system switches to dark mode at sunset).
  if (window.matchMedia && !getSavedTheme()) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!getSavedTheme()) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
})();
