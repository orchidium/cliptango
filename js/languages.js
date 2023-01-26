(function (exports) {
  "use strict";

  var selectedLanguage = localStorage.getItem("ws.videos.language") || navigator.language;

  window.addEventListener("load", function () {
    setTimeout(() => {
      navigator.mozL10n.language.code = selectedLanguage;
    }, 100);
  });
})(window);
