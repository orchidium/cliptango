(function (exports) {
  "use strict";

  var helpButton = document.getElementById("help-button");
  var helpDropdownButton = document.getElementById("options-dropdown-help");
  var helpDropdown = document.getElementById("help-dropdown");

  [helpButton, helpDropdownButton].forEach(button => {
    Dropdown(button, helpDropdown, () => {
      // Account
      var buyLink = document.getElementById("help-dropdown-buy");
      var refundLink = document.getElementById("help-dropdown-refund");
      var syncLink = document.getElementById("help-dropdown-sync");
      var moreLink = document.getElementById("help-dropdown-more");

      buyLink.onclick = () => {
        window.open('https://digitbyteg.github.io/?p=help/videos/buy-with-orchid-pay');
      };

      refundLink.onclick = () => {
        window.open('https://digitbyteg.github.io/?p=help/videos/refund-safely-with-orchid-pay');
      };

      syncLink.onclick = () => {
        window.open('https://digitbyteg.github.io/?p=help/videos/sync-apps');
      };

      moreLink.onclick = () => {
        window.open('https://digitbyteg.github.io/?p=help/videos');
      };
    });
  });
})(window);
