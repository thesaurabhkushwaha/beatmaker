class DrumKit {
  constructor() {
    this.pads = document.querySelectorAll(".pad");
    this.playButton = document.querySelector(".play");
    this.currentKick = "./sounds/kick-classic.wav";
    this.currentSnare = "./sounds/snare-acoustic01.wav";
    this.currentHihat = "./sounds/hihat-acoustic01.wav";
    this.kickAudio = document.querySelector(".kick-sound");
    this.snareAudio = document.querySelector(".snare-sound");
    this.hihatAudio = document.querySelector(".hihat-sound");
    this.selects = document.querySelectorAll("select");
    this.muteButtons = document.querySelectorAll(".mute");
    this.tempoSlider = document.querySelector(".tempo-slider");
    this.index = 0;
    this.bpm = 150;
    this.isPlaying = null;
  }

  activatePad() {
    this.classList.toggle("active");
  }

  repeat() {
    let step = this.index % 8;
    const activeBars = document.querySelectorAll(`.b${step}`);
    //Loop over the pads
    activeBars.forEach((bar) => {
      bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
      if (bar.classList.contains("active")) {
        if (bar.classList.contains("kick-pad")) {
          this.kickAudio.currentTime = 0;
          this.kickAudio.play();
        }
        if (bar.classList.contains("snare-pad")) {
          this.snareAudio.currentTime = 0;
          this.snareAudio.play();
        }
        if (bar.classList.contains("hihat-pad")) {
          this.hihatAudio.currentTime = 0;
          this.hihatAudio.play();
        }
      }
    });
    this.index++;
  }

  start() {
    // convert beats per 1 minute (beats per 60 seconds) to ms
    const interval = (60 / this.bpm) * 1000;
    //Check if sound is playing, if not, loop the sound
    if (this.isPlaying) {
      // clear interval - so pressing "play" button multiple times
      // pauses the sound and does not stack the interval
      clearInterval(this.isPlaying);
      this.isPlaying = null;
    } else {
      this.isPlaying = setInterval(() => {
        this.repeat();
      }, interval);
    }
  }

  updatePlayButton() {
    if (!this.isPlaying) {
      this.playButton.innerHTML = "Play";
      this.playButton.classList.add("active");
    } else {
      this.playButton.innerHTML = "Pause";
      this.playButton.classList.remove("active");
    }
  }

  changeSound(event) {
    const selectName = event.target.name;
    const selectedAudio = event.target.value;
    switch (selectName) {
      case "kick-select":
        this.kickAudio.src = selectedAudio;
        break;
      case "snare-select":
        this.snareAudio.src = selectedAudio;
        break;
      case "hihat-select":
        this.hihatAudio.src = selectedAudio;
        break;
    }
  }

  toggleMute(event) {
    const muteIndex = event.target.getAttribute("data-track");
    event.target.classList.toggle("active");

    if (event.target.classList.contains("active")) {
      switch (muteIndex) {
        case "0":
          this.kickAudio.volume = 0;
          break;
        case "1":
          this.snareAudio.volume = 0;
          break;
        case "2":
          this.hihatAudio.volume = 0;
          break;
      }
    } else {
      switch (muteIndex) {
        case "0":
          this.kickAudio.volume = 1;
          break;
        case "1":
          this.snareAudio.volume = 1;
          break;
        case "2":
          this.hihatAudio.volume = 1;
          break;
      }
    }
  }

  changeTempo(event) {
    const tempoText = document.querySelector(".current-tempo");
    tempoText.innerText = event.target.value;
  }

  updateTempo(event) {
    this.bpm = event.target.value;
    clearInterval(this.isPlaying);
    this.isPlaying = null;
    const playBtn = document.querySelector(".play");
    if (playBtn.classList.contains("active")) {
      this.start();
    }
  }
}

const drumKit = new DrumKit();

// Event listeners

drumKit.pads.forEach((pad) => {
  pad.addEventListener("click", drumKit.activatePad);
  pad.addEventListener("animationend", function () {
    this.style.animation = "";
  });
});

drumKit.playButton.addEventListener("click", function () {
  drumKit.start();
  drumKit.updatePlayButton();
});

drumKit.selects.forEach((select) => {
  select.addEventListener("change", function (event) {
    drumKit.changeSound(event);
  });
});

drumKit.muteButtons.forEach((muteButton) => {
  muteButton.addEventListener("click", function (event) {
    drumKit.toggleMute(event);
  });
});

drumKit.tempoSlider.addEventListener("input", function (event) {
  drumKit.changeTempo(event);
});

drumKit.tempoSlider.addEventListener("change", function (event) {
  drumKit.updateTempo(event);
});
