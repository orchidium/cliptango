(function (exports) {
  "use strict";

  exports.viewFunction['content'] = () => {
    if (navigator.onLine) {
      setTimeout(() => {
        openContentView('loading-screen', false);
      });
      videos.innerHTML = '';

      OrchidServices.getContent("videos", function (id, data) {
        openContentView('content', false);
        createVideoCard(data, false);
        if (currentVideo == id) {
          openVideoPlayer(data);
        }
      });
    }
  };

  var currentVideo = '';
  var videos = document.getElementById("videos");

  var paramString = location.search.substring(1);
  var queryString = new URLSearchParams(paramString);
  if (location.search !== "") {
    for (let pair of queryString.entries()) {
      switch (pair[0]) {
        case "video":
          currentVideo = pair[1];
          break;

        default:
          break;
      }
    }
  }
})(window);
