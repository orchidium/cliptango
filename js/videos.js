(function (exports) {
  "use strict";

  exports.createVideoCard = function createVideoCard(data, parent) {
    var element = document.createElement("a");
    element.href = "?video=" + data.token;
    element.classList.add("video");
    element.onclick = (evt) => {
      evt.preventDefault();
      openVideoPlayer(data);
    };
    if (parent) {
      parent.appendChild(element);
    } else {
      videos.appendChild(element);
    }

    var thumbnails = document.createElement("div");
    thumbnails.classList.add("thumbnails");
    element.appendChild(thumbnails);

    var thumbnail = document.createElement("img");
    thumbnail.classList.add("thumbnail");
    thumbnail.loading = 'lazy';
    thumbnails.appendChild(thumbnail);
    OrchidServices.storage.read(data.thumbnail).then((url) => {
      thumbnail.src = url;
    });

    var preview = document.createElement("video");
    preview.classList.add("preview");
    preview.volume = 0;
    thumbnails.appendChild(preview);
    OrchidServices.storage.read(data.video).then((url) => {
      preview.src = url;
    });

    element.addEventListener("mouseenter", () => {
      preview.currentTime = 0;
      preview.play();
    });
    element.addEventListener("mouseleave", () => {
      preview.pause();
    });

    var textHolder = document.createElement("div");
    textHolder.classList.add("text-holder");
    element.appendChild(textHolder);

    var title = document.createElement("h3");
    title.innerText = data.title;
    textHolder.appendChild(title);

    var stats = document.createElement("p");
    textHolder.appendChild(stats);

    var statsViews = document.createElement("span");
    statsViews.dataset.l10nId = 'video-views';
    statsViews.dataset.l10nArgs = '{"n": ' + data.views.length + '}';
    stats.appendChild(statsViews);

    var statsSep = document.createElement("span");
    statsSep.innerText = ' • ';
    stats.appendChild(statsSep);

    var statsDate = document.createElement("span");
    var timePublished = new Date(data.published_at).toLocaleDateString(
      navigator.language,
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }
    );
    statsDate.innerText = timePublished;
    stats.appendChild(statsDate);

    navigator.mozL10n.get('video-views', '{"n": "1"}');

    var author = document.createElement("a");
    textHolder.appendChild(author);
    OrchidServices.get("profile/" + data.author_id).then((data) => {
      author.innerText = data.username;
    });
  };

  exports.openVideoPlayer = function openVideoPlayer(data) {
    var sidebar = document.getElementById("sidebar");
    var toggleSidebarButton = document.getElementById("toggle-sidebar-button");
    var backButton = document.getElementById("back-button");
    var content = document.getElementById(exports.selectedView);
    var videoplayer = document.getElementById("videoplayer");
    var container = document.getElementById("videoplayer-container");
    var player = document.getElementById("videoplayer-element");
    var playerAmbient = document.getElementById("videoplayer-element-ambient");
    var videoplayerTitle = document.getElementById("videoplayer-title");
    var videoplayerStats = document.getElementById("videoplayer-stats");
    var videoplayerDescriptionText = document.getElementById(
      "videoplayer-description-text"
    );
    var videoplayerRecommendation = document.getElementById("recommended");
    var controls = document.getElementById("controls");
    var playPauseButton = document.getElementById("controls-playpause-button");
    var muteButton = document.getElementById("controls-mute-button");
    var volumeSlider = document.getElementById("controls-volume");
    var fullscreenButton = document.getElementById(
      "controls-fullscreen-button"
    );
    var timeSlider = document.getElementById("controls-current-time");
    var time = document.getElementById("controls-time");

    if (isHistoryEnabled) {
      addToHistory(data.token);
    }
    window.history.pushState({ html: "", pageTitle: "" }, "", "?video=" + data.token);
    toggleSidebarButton.style.display = "none";
    backButton.style.display = "block";

    backButton.onclick = () => {
      document.body.classList.remove("app-header-shown");

      player.pause();
      player.src = "";
      videoplayer.classList.remove("visible");
      sidebar.style.display = "block";
      toggleSidebarButton.style.display = "block";
      backButton.style.display = "none";
      content.classList.add("visible");
      window.history.pushState({ html: "", pageTitle: "" }, "", "?");
    };

    if (OrchidServices.isUserLoggedIn()) {
      if (data.views) {
        if (data.views.indexOf(OrchidServices.userId()) == -1) {
          data.views.push(OrchidServices.userId());
          OrchidServices.set("videos/" + data.token, { views: data.views });
        }
      } else {
        OrchidServices.set("videos/" + data.token, {
          views: [OrchidServices.userId()],
        });
      }
    }

    // Player
    videoplayer.classList.add("visible");

    playerAmbient.volume = 0;
    OrchidServices.storage.read(data.video).then((url) => {
      player.src = url;
      playerAmbient.src = url;
    });

    player.onpause = () => {
      playerAmbient.pause();
    };
    player.onplay = () => {
      playerAmbient.play();
    };
    player.ontimeupdate = (evt) => {
      playerAmbient.currentTime = player.currentTime;
      timeSlider.min = 0;
      timeSlider.max = player.duration;
      timeSlider.step = 1 / 1000;
      timeSlider.value = player.currentTime;

      let currentMinutes = Math.floor(player.currentTime / 60);
      let currentSeconds = Math.floor(player.currentTime - currentMinutes * 60);
      let durationMinutes = Math.floor(player.duration / 60);
      let durationSeconds = Math.floor(player.duration - durationMinutes * 60);

      let currentHour = 0;
      let durationHour = 0;
      if (currentMinutes >= 60) {
        currentHour = Math.floor(currentMinutes / 60);
        currentMinutes = currentMinutes - currentHour * 60;
      }
      if (durationMinutes >= 60) {
        durationHour = Math.floor(durationMinutes / 60);
        durationMinutes = durationMinutes - durationHour * 60;
      }

      currentMinutes = currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
      currentSeconds = currentSeconds < 10 ? "0" + currentSeconds : currentSeconds;
      durationMinutes = durationMinutes < 10 ? "0" + durationMinutes : durationMinutes;
      durationSeconds = durationSeconds < 10 ? "0" + durationSeconds : durationSeconds;

      let currentTime = currentHour ? currentHour + ":" : "" + currentMinutes + ":" + currentSeconds;
      let durationTime = durationHour ? durationHour + ":" : "" + durationMinutes + ":" + durationSeconds;
      time.innerText = currentTime + '/' + durationTime;
    };

    videoplayerTitle.innerText = data.title;

    var timePublished = new Date(data.published_at).toLocaleDateString(
      navigator.language,
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }
    );
    videoplayerStats.innerText =
      data.views.length + " views - " + timePublished;
    videoplayerDescriptionText.innerText = data.description;

    // Controls
    player.onclick = () => {
      if (player.paused) {
        player.play();
        playPauseButton.dataset.icon = "pause";
      } else {
        player.pause();
        playPauseButton.dataset.icon = "play";
      }
    };

    var timeoutId;
    player.onpointermove = () => {
      clearTimeout(timeoutId);
      controls.classList.add("visible");
      timeoutId = setTimeout(() => {
        controls.classList.remove("visible");
      }, 3000);
    };

    playPauseButton.onclick = () => {
      if (player.paused) {
        player.play();
        playPauseButton.dataset.icon = "pause";
      } else {
        player.pause();
        playPauseButton.dataset.icon = "play";
      }
    };

    muteButton.onclick = () => {
      if (player.muted) {
        player.volume = localStorage.getItem("ws.videos.lastVolume");
        muteButton.dataset.icon = "sound-max";
      } else {
        localStorage.setItem("ws.videos.lastVolume", player.volume);
        player.volume = 0;
        muteButton.dataset.icon = "sound-min";
      }
    };

    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = 0.1;
    volumeSlider.onchange = () => {
      player.volume = volumeSlider.value;
    };

    fullscreenButton.onclick = () => {
      if (document.fullscreenElement == container) {
        document.exitFullscreen();
        fullscreenButton.dataset.icon = "fullscreen";
      } else {
        container.requestFullscreen();
        fullscreenButton.dataset.icon = "fullscreen-exit";
      }
    };

    timeSlider.onchange = () => {
      player.currentTime = timeSlider.value;
    };

    // Recommendations
    videoplayerRecommendation.innerHTML = "";
    OrchidServices.getContent("videos", (id, rdata) => {
      if (rdata.author_id !== data.author_id) {
        var randomness = parseInt(Math.random() * 4);
        if (randomness >= 3) {
          return;
        }
      }

      if (rdata.token == data.token) {
        return;
      }

      createVideoCard(rdata, videoplayerRecommendation);
    });
  };
})(window);
