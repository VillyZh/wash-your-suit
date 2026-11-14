(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
  }

  var revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
      );
      revealItems.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealItems.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  var LANG_KEY = "washyoursuit.lang";
  var HINT_KEY = "washyoursuit.lang-hint-dismissed";
  var langLinks = document.querySelectorAll(".lang-switch__link");

  langLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      var lang = link.getAttribute("data-lang");
      if (!lang) {
        return;
      }
      try {
        localStorage.setItem(LANG_KEY, lang);
      } catch (error) {
        /* Storage can be unavailable in private browsing. */
      }
    });
  });

  var pageLang = (document.documentElement.lang || "en").toLowerCase();
  var isEnglishPage = pageLang === "en" || pageLang.indexOf("en-") === 0;

  if (isEnglishPage) {
    try {
      var preferred = localStorage.getItem(LANG_KEY);
      var dismissed = sessionStorage.getItem(HINT_KEY) === "1";
      if (!dismissed && (preferred === "fr" || preferred === "bg")) {
        showLanguageHint(preferred);
      }
    } catch (error) {
      /* Storage can be unavailable in private browsing. */
    }
  }

  function showLanguageHint(lang) {
    var messages = {
      fr: {
        text: "Vous avez choisi le français.",
        action: "Continuer en français",
        close: "Fermer"
      },
      bg: {
        text: "Избрахте български език.",
        action: "Продължете на български",
        close: "Затвори"
      }
    };
    var message = messages[lang];
    var header = document.querySelector(".site-header");

    if (!message || !header) {
      return;
    }

    var page = window.location.pathname.split("/").pop();
    if (!page || page.indexOf(".") === -1) {
      page = "index.html";
    }

    var hint = document.createElement("div");
    hint.className = "lang-hint";

    var inner = document.createElement("div");
    inner.className = "container lang-hint__inner";

    var text = document.createElement("p");
    text.textContent = message.text + " ";

    var link = document.createElement("a");
    link.href = lang + "/" + page + window.location.search + window.location.hash;
    link.textContent = message.action;
    link.setAttribute("hreflang", lang);
    link.setAttribute("lang", lang);

    var close = document.createElement("button");
    close.type = "button";
    close.className = "lang-hint__close";
    close.setAttribute("aria-label", message.close);
    close.innerHTML = "&times;";
    close.addEventListener("click", function () {
      hint.remove();
      try {
        sessionStorage.setItem(HINT_KEY, "1");
      } catch (error) {
        /* Storage can be unavailable in private browsing. */
      }
    });

    text.appendChild(link);
    inner.appendChild(text);
    inner.appendChild(close);
    hint.appendChild(inner);
    header.insertAdjacentElement("afterend", hint);
  }
})();
