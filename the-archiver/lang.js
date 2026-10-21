// Sprachauswahl: #de/#en in der Adresse > gespeicherte Wahl > Browsersprache (Deutsch, sonst Englisch).
(function () {
  var supported = ["de", "en"];

  function stored() {
    try { return localStorage.getItem("lang"); } catch (e) { return null; }
  }
  function store(lang) {
    try { localStorage.setItem("lang", lang); } catch (e) {}
  }
  function fromBrowser() {
    var langs = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < langs.length; i++) {
      var code = (langs[i] || "").slice(0, 2).toLowerCase();
      if (supported.indexOf(code) >= 0) return code;
    }
    return "en";
  }
  function fromHash() {
    var h = location.hash.replace("#", "");
    return supported.indexOf(h) >= 0 ? h : null;
  }

  function apply(lang) {
    var root = document.documentElement;
    root.setAttribute("data-ui-lang", lang);
    root.lang = lang;
    var title = root.getAttribute("data-title-" + lang);
    if (title) document.title = title;
    document.querySelectorAll("[data-switch]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-switch") === lang ? "true" : "false");
    });
    // Links zur anderen Seite behalten die Sprache
    document.querySelectorAll("a[data-keep-lang]").forEach(function (a) {
      a.href = a.getAttribute("href").split("#")[0] + "#" + lang;
    });
  }

  var lang = fromHash() || stored() || fromBrowser();
  apply(lang);

  document.addEventListener("DOMContentLoaded", function () {
    apply(lang);
    document.querySelectorAll("[data-switch]").forEach(function (b) {
      b.addEventListener("click", function () {
        lang = b.getAttribute("data-switch");
        store(lang);
        history.replaceState(null, "", "#" + lang);
        apply(lang);
      });
    });
  });
  window.addEventListener("hashchange", function () {
    var h = fromHash();
    if (h) { lang = h; store(h); apply(h); }
  });
})();
