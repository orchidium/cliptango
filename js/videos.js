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
    thumbnail.loading = "lazy";
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
    statsViews.dataset.l10nId = "video-views";
    statsViews.dataset.l10nArgs = '{"n": ' + data.views.length + "}";
    stats.appendChild(statsViews);

    var statsSep = document.createElement("span");
    statsSep.innerText = " • ";
    stats.appendChild(statsSep);

    var statsDate = document.createElement("span");
    var timePublished = new Date(data.published_at).toLocaleDateString(
      navigator.mozL10n.language.code,
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

    navigator.mozL10n.get("video-views", '{"n": "1"}');

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
    var shrinkButton = document.getElementById("controls-shrink-button");
    var fullscreenButton = document.getElementById(
      "controls-fullscreen-button"
    );
    var timeSlider = document.getElementById("controls-current-time");
    var time = document.getElementById("controls-time");

    if (isHistoryEnabled) {
      addToHistory(data.token);
    }
    window.history.pushState(
      { html: "", pageTitle: "" },
      "",
      "?video=" + data.token
    );
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

      currentMinutes =
        currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
      currentSeconds =
        currentSeconds < 10 ? "0" + currentSeconds : currentSeconds;
      durationMinutes =
        durationMinutes < 10 ? "0" + durationMinutes : durationMinutes;
      durationSeconds =
        durationSeconds < 10 ? "0" + durationSeconds : durationSeconds;

      let currentTime = currentHour
        ? currentHour + ":"
        : "" + currentMinutes + ":" + currentSeconds;
      let durationTime = durationHour
        ? durationHour + ":"
        : "" + durationMinutes + ":" + durationSeconds;
      time.innerText = currentTime + "/" + durationTime;
    };

    videoplayerTitle.innerText = data.title;

    videoplayerStats.innerHTML = "";

    var statsViews = document.createElement("span");
    statsViews.dataset.l10nId = "video-views";
    statsViews.dataset.l10nArgs = '{"n": ' + data.views.length + "}";
    videoplayerStats.appendChild(statsViews);

    var statsSep = document.createElement("span");
    statsSep.innerText = " • ";
    videoplayerStats.appendChild(statsSep);

    var statsDate = document.createElement("span");
    var timePublished = new Date(data.published_at).toLocaleDateString(
      navigator.mozL10n.language.code,
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
    videoplayerStats.appendChild(statsDate);

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

    shrinkButton.onclick = () => {
      videoplayer.classList.toggle("pip");
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

    // Author
    var authorAvatar = document.getElementById("videoplayer-author-avatar");
    var authorUsername = document.getElementById("videoplayer-author-username");
    var authorFollowers = document.getElementById(
      "videoplayer-author-followers"
    );
    var followButton = document.getElementById(
      "videoplayer-author-follow-button"
    );

    OrchidServices.get("profile/" + data.author_id).then((udata) => {
      authorAvatar.src = udata.profile_picture;
      authorAvatar.alt = udata.username;
      authorUsername.textContent = udata.username;
      if (udata.followers.length <= 1000) {
        authorFollowers.dataset.l10nArgs =
          '{"n": ' + udata.followers.length + "}";
      } else {
        authorFollowers.dataset.l10nArgs =
          '{"n": "' + abbreviateNumber(udata.followers.length) + '"}';
      }

      if (udata.followers.indexOf(OrchidServices.userId()) !== -1) {
        followButton.classList.remove("recommend");
        followButton.dataset.l10nId = "video-author-unfollow";
      }

      followButton.addEventListener("click", function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        OrchidServices.get("profile/" + udata.token).then((udata) => {
          if (udata.followers.indexOf(OrchidServices.userId()) === -1) {
            udata.followers.push(OrchidServices.userId());
          } else {
            udata.followers.splice(OrchidServices.userId());
          }

          OrchidServices.set("profile/" + udata.token, {
            followers: udata.followers,
          });
          if (udata.followers.length <= 1000) {
            authorFollowers.dataset.l10nArgs =
              '{"n": ' + udata.followers.length + "}";
          } else {
            authorFollowers.dataset.l10nArgs =
              '{"n": "' + abbreviateNumber(udata.followers.length) + '"}';
          }
          followButton.classList.toggle("recommend");
          if (followButton.classList.contains("recommend")) {
            followButton.dataset.l10nId = "video-author-follow";
          } else {
            followButton.dataset.l10nId = "video-author-unfollow";
          }
        });
      });
    });

    // Buttons
    var likeButton = document.getElementById("videoplayer-like-button");
    var dislikeButton = document.getElementById("videoplayer-dislike-button");
    var shareButton = document.getElementById("videoplayer-share-button");
    var optionsButton = document.getElementById("videoplayer-options-button");

    var likeButtonNumber = document.createElement("span");
    likeButtonNumber.textContent = EnglishToArabicNumerals(
      abbreviateNumber(data.likes.length)
    );
    likeButton.appendChild(likeButtonNumber);

    var likeButtonTooltip = document.createElement("div");
    likeButtonTooltip.setAttribute("role", "title");
    likeButtonTooltip.classList.add("bottom");
    likeButtonTooltip.dataset.l10nId = "post-like";
    likeButton.appendChild(likeButtonTooltip);

    var dislikeButtonNumber = document.createElement("span");
    dislikeButtonNumber.textContent = EnglishToArabicNumerals(
      abbreviateNumber(data.dislikes.length)
    );
    dislikeButton.appendChild(dislikeButtonNumber);

    var dislikeButtonTooltip = document.createElement("div");
    dislikeButtonTooltip.setAttribute("role", "title");
    dislikeButtonTooltip.classList.add("bottom");
    dislikeButtonTooltip.dataset.l10nId = "post-dislike";
    dislikeButton.appendChild(dislikeButtonTooltip);

    if (data.likes.indexOf(OrchidServices.userId()) !== -1) {
      likeButton.classList.add("enabled");
    }
    if (data.dislikes.indexOf(OrchidServices.userId()) !== -1) {
      dislikeButton.classList.add("enabled");
    }

    if (!OrchidServices.isUserLoggedIn()) {
      likeButton.setAttribute("disabled", true);
      dislikeButton.setAttribute("disabled", true);
    }

    likeButton.addEventListener("click", function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      OrchidServices.get("videos/" + data.token).then((data) => {
        if (data.likes.indexOf(OrchidServices.userId()) === -1) {
          data.likes.push(OrchidServices.userId());
        } else {
          data.likes.splice(OrchidServices.userId());
        }

        data.dislikes.splice(OrchidServices.userId());
        dislikeButtonNumber.textContent = EnglishToArabicNumerals(
          abbreviateNumber(data.dislikes.length)
        );
        dislikeButton.classList.remove("enabled");
        OrchidServices.set("videos/" + data.token, { likes: data.likes });
        OrchidServices.set("videos/" + data.token, {
          dislikes: data.dislikes,
        });
        likeButtonNumber.textContent = EnglishToArabicNumerals(
          abbreviateNumber(data.likes.length)
        );
        likeButton.classList.toggle("enabled");
      });
    });

    dislikeButton.addEventListener("click", function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      OrchidServices.get("videos/" + data.token).then((data) => {
        if (data.dislikes.indexOf(OrchidServices.userId()) === -1) {
          data.dislikes.push(OrchidServices.userId());
        } else {
          data.dislikes.splice(OrchidServices.userId());
        }

        data.likes.splice(OrchidServices.userId());
        likeButtonNumber.textContent = EnglishToArabicNumerals(
          abbreviateNumber(data.likes.length)
        );
        likeButton.classList.remove("enabled");
        OrchidServices.set("videos/" + data.token, { likes: data.likes });
        OrchidServices.set("videos/" + data.token, {
          dislikes: data.dislikes,
        });
        dislikeButtonNumber.textContent = EnglishToArabicNumerals(
          abbreviateNumber(data.dislikes.length)
        );
        dislikeButton.classList.toggle("enabled");
      });
    });

    var shareButtonTooltip = document.createElement("div");
    shareButtonTooltip.setAttribute("role", "title");
    shareButtonTooltip.classList.add("bottom");
    shareButtonTooltip.dataset.l10nId = "post-share";
    shareButton.appendChild(shareButtonTooltip);

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
