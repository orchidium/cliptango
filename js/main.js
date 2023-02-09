(function (exports) {
  "use strict";

  exports.EnglishToArabicNumerals = function EnglishToArabicNumerals(
    numberString
  ) {
    var arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    if (document.dir == "rtl") {
      return numberString
        .toLocaleString(navigator.mozL10n.language.code)
        .replace(/[0-9]/g, function (w) {
          return arabicNumerals[+w];
        });
    } else {
      return numberString;
    }
  };

  exports.abbreviateNumber = function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
      var suffixes = [
        "",
        navigator.mozL10n.get("numberUnit-thousand"),
        navigator.mozL10n.get("numberUnit-million"),
        navigator.mozL10n.get("numberUnit-billion"),
        navigator.mozL10n.get("numberUnit-trillion"),
      ];
      var suffixNum = Math.floor(("" + value).length / 3);
      var shortValue = "";
      for (var precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat(
          (suffixNum != 0
            ? value / Math.pow(1000, suffixNum)
            : value
          ).toPrecision(precision)
        );
        var dotLessShortValue = (shortValue + "").replace(
          /[^a-zA-Z 0-9]+/g,
          ""
        );
        if (dotLessShortValue.length <= 2) {
          break;
        }
      }
      if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
      newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
  };

  var bigScreen = window.matchMedia(
    "(min-width: 1024px) and (orientation: landscape)"
  ).matches;
  var elasticScrollEnabled =
    localStorage.getItem("ws.videos.elastic_scroll") == "true" || false;
  if (elasticScrollEnabled) {
    var Scrollbar = window.Scrollbar;
    Scrollbar.use(window.OverscrollPlugin);
    Scrollbar.init(document.querySelector("#sidebar"), {
      plugins: {
        overscroll: {},
      },
    });
    if (!bigScreen) {
      Scrollbar.init(document.querySelector("#videoplayer"), {
        plugins: {
          overscroll: {},
        },
      });
    } else {
      document.querySelectorAll(".content").forEach((item) => {
        Scrollbar.init(item, {
          plugins: {
            overscroll: {},
          },
        });
      });
      document.querySelectorAll(".videoplayer-col").forEach((item) => {
        Scrollbar.init(item, {
          plugins: {
            overscroll: {},
          },
        });
      });
    }
  }

  var offlineMessage = document.getElementById("offline-message");
  var offlineMessageSettingsButton =
    offlineMessage.querySelector(".settings-button");
  var offlineMessageReloadButton =
    offlineMessage.querySelector(".reload-button");

  offlineMessageReloadButton.onclick = () => {
    location.reload();
  };

  var splashscreen = document.getElementById("splashscreen");
  var optionsButton = document.getElementById("options-button");
  var profileButton = document.getElementById("profile-button");
  var profileAvatar = document.getElementById("profile-avatar");

  var sidebar = document.getElementById("sidebar");
  var toggleSidebarButton = document.getElementById("toggle-sidebar-button");

  window.addEventListener("load", function () {
    function initializeUser() {
      if (OrchidServices.isUserLoggedIn()) {
        OrchidServices.getWithUpdate(
          "profile/" + OrchidServices.userId(),
          function (data) {
            profileButton.title = data.username;
            profileAvatar.alt = data.username;
            if (data.profile_picture !== "") {
              profileAvatar.src = data.profile_picture;
            } else {
              profileAvatar.src = "/images/profile_pictures/avatar_default.svg";
            }
          }
        );
        optionsButton.style.display = "none";
      } else {
        profileButton.style.display = "none";
      }
    }

    if (navigator.onLine) {
      initializeUser();
    } else {
      offlineMessage.classList.add("visible");
      profileButton.style.display = "none";
    }

    splashscreen.classList.add("hidden");
    openContentView("content");
  });

  toggleSidebarButton.addEventListener("click", () => {
    sidebar.classList.toggle("visible");
  });

  // Side Tabs
  var uploadButton = document.getElementById("upload-button");
  var homeButton = document.getElementById("sidebar-videos");
  var featuredButton = document.getElementById("sidebar-featured");
  var historyButton = document.getElementById("sidebar-history");
  var downloadedButton = document.getElementById("sidebar-downloaded");
  var settingsButton = document.getElementById("sidebar-settings");

  uploadButton.onclick = () => {
    // TODO: Add a upload dialog
  };

  homeButton.onclick = () => {
    var selected = document.querySelector('[aria-selected="true"]');
    selected.setAttribute("aria-selected", null);
    homeButton.setAttribute("aria-selected", true);
    openContentView("content", true);
  };

  featuredButton.onclick = () => {
    openContentView("featured", true);
  };

  var isHistoryEnabled =
    localStorage.getItem("ws.videos.historyEnabled") == "true" || true;
  if (!isHistoryEnabled) {
    historyButton.style.display = "none";
  }
  historyButton.onclick = () => {
    openContentView("history", true);
  };

  downloadedButton.onclick = () => {
    openContentView("downloaded", true);
  };

  settingsButton.onclick = () => {
    openContentView("settings", true);
  };
})(window);
