(function (exports) {
  "use strict";

  var darkModeEnabled = localStorage.getItem("ws.videos.darkMode") == "true";
  var root = document.querySelector(":root");

  root.dataset.theme = darkModeEnabled ? "dark" : "light";
  root.dataset.accentScheme = darkModeEnabled ? "light" : "dark";
})(window);
