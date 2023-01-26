var videos = document.getElementById("videos");

OrchidServices.getContent("videos", (id, data) => {
  var element = document.createElement("a");
  element.href = "?video=" + data.token;
  element.classList.add("video");
  element.onclick = (evt) => {
    evt.preventDefault();
    openVideoPlayer(data);
  };
  videos.appendChild(element);

  var thumbnails = document.createElement("div");
  thumbnails.classList.add("thumbnails");
  element.appendChild(thumbnails);

  var thumbnail = document.createElement("img");
  thumbnail.classList.add("thumbnail");
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

  element.addEventListener('mouseenter', () => {
    preview.currentTime = 0;
    preview.play();
  });
  element.addEventListener('mouseleave', () => {
    preview.pause();
  });

  var textHolder = document.createElement("div");
  textHolder.classList.add("text-holder");
  element.appendChild(textHolder);

  var title = document.createElement("h3");
  title.innerText = data.title;
  textHolder.appendChild(title);

  var stats = document.createElement("p");
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
  stats.innerText = data.views.length + " views - " + timePublished;
  textHolder.appendChild(stats);

  var author = document.createElement("a");
  textHolder.appendChild(author);
  OrchidServices.get("profile/" + data.author_id).then((data) => {
    author.innerText = data.username;
  });
});

function openVideoPlayer(data) {
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
  var homeButton = document.getElementById("home-button");
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

  videoplayer.classList.add("visible");

  homeButton.onclick = () => {
    player.pause();
    player.src = '';
    videoplayer.classList.remove("visible");
  };

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
  player.ontimeupdate = () => {
    playerAmbient.currentTime = player.currentTime;
    timeSlider.min = 0;
    timeSlider.max = player.duration;
    timeSlider.volume = player.currentTime;

    var timeElapsed = new Date(player.currentTime).toLocaleTimeString(navigator.language, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    var duration = new Date(player.duration).toLocaleTimeString(navigator.language, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    time.innerText = timeElapsed + ' / ' + duration;
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
  videoplayerStats.innerText = data.views.length + " views - " + timePublished;
  videoplayerDescriptionText.innerText = data.description;

  // Controls
  var controls = document.getElementById("controls");
  var playPauseButton = document.getElementById("controls-playpause-button");
  var muteButton = document.getElementById("controls-mute-button");
  var volumeSlider = document.getElementById("controls-volume");
  var fullscreenButton = document.getElementById("controls-fullscreen-button");
  var timeSlider = document.getElementById("controls-current-time");
  var time = document.getElementById("controls-time");

  player.onclick = () => {
    if (player.paused) {
      player.play();
      playPauseButton.dataset.icon = 'pause';
    } else {
      player.pause();
      playPauseButton.dataset.icon = 'play';
    }
  };

  var timeoutId;
  player.onpointermove = () => {
    clearTimeout(timeoutId);
    controls.classList.add('visible');
    timeoutId = setTimeout(() => {
      controls.classList.remove('visible');
    }, 1000);
  };

  playPauseButton.onclick = () => {
    if (player.paused) {
      player.play();
      playPauseButton.dataset.icon = 'pause';
    } else {
      player.pause();
      playPauseButton.dataset.icon = 'play';
    }
  };

  muteButton.onclick = () => {
    if (player.muted) {
      player.volume = localStorage.getItem('ws.videos.lastVolume');
      muteButton.dataset.icon = 'sound-max';
    } else {
      localStorage.setItem('ws.videos.lastVolume', player.volume);
      player.volume = 0;
      muteButton.dataset.icon = 'sound-min';
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
      fullscreenButton.dataset.icon = 'fullscreen';
    } else {
      container.requestFullscreen();
      fullscreenButton.dataset.icon = 'fullscreen-exit';
    }
  };

  timeSlider.onchange = () => {
    player.currentTime = timeSlider.value;
  };

  // Recommendations
  videoplayerRecommendation.innerHTML = '';
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

    var element = document.createElement("a");
    element.href = "?video=" + rdata.token;
    element.classList.add("video");
    element.onclick = (evt) => {
      evt.preventDefault();
      openVideoPlayer(rdata);
    };
    videoplayerRecommendation.appendChild(element);

    var thumbnails = document.createElement("div");
    thumbnails.classList.add("thumbnails");
    element.appendChild(thumbnails);

    var thumbnail = document.createElement("img");
    thumbnail.classList.add("thumbnail");
    thumbnails.appendChild(thumbnail);
    OrchidServices.storage.read(rdata.thumbnail).then((url) => {
      thumbnail.src = url;
    });

    var preview = document.createElement("video");
    preview.classList.add("preview");
    preview.volume = 0;
    thumbnails.appendChild(preview);
    OrchidServices.storage.read(rdata.video).then((url) => {
      preview.src = url;
    });

    element.addEventListener('mouseenter', () => {
      preview.currentTime = 0;
      preview.play();
    });
    element.addEventListener('mouseleave', () => {
      preview.pause();
    });

    var textHolder = document.createElement("div");
    textHolder.classList.add("text-holder");
    element.appendChild(textHolder);

    var title = document.createElement("h3");
    title.innerText = rdata.title;
    textHolder.appendChild(title);

    var description = document.createElement("p");
    description.innerText = rdata.description;
    textHolder.appendChild(description);

    var author = document.createElement("a");
    textHolder.appendChild(author);
    OrchidServices.get("profile/" + rdata.author_id).then((data) => {
      author.innerText = data.username;
    });
  });
}
