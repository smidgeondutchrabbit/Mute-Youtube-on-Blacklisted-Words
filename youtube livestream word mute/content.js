// List of words to mute
const mutedWords = ["word1" "word2" "word3"];

// Variables to hold the video element and manage timing
let videoElement;
let lastMuteTimestamp = 0;
const muteDuration = 5000; // Mute for 5 seconds to cover any delays

// Function to mute and unmute the video
const muteVideo = () => {
  if (videoElement) videoElement.muted = true;
};

const unmuteVideo = () => {
  if (videoElement) videoElement.muted = false;
};

// Function to monitor captions and mute if blacklisted words are found
const monitorCaptions = () => {
  const captionElements = document.querySelectorAll(".ytp-caption-segment, .ytp-caption-window-container, .captions-text");
  const currentTime = videoElement ? videoElement.currentTime : 0;

  captionElements.forEach((caption) => {
    const text = caption.innerText.toLowerCase();

    // Check if any muted words appear in the captions
    mutedWords.forEach((word) => {
      if (text.includes(word) && currentTime > lastMuteTimestamp) {
        lastMuteTimestamp = currentTime + muteDuration / 1000; // Track when muting occurred
        muteVideo();
        setTimeout(unmuteVideo, muteDuration); // Unmute after the specified duration
      }
    });
  });
};

// Set up observer to monitor dynamic captions for live streams
const setupObserver = () => {
  const captionsContainer = document.querySelector(".ytp-caption-window-container, .captions-container, .captions-text");
  videoElement = document.querySelector("video");

  if (captionsContainer && videoElement) {
    const observer = new MutationObserver(monitorCaptions);
    observer.observe(captionsContainer, { childList: true, subtree: true });
  }
};

// Initialize observer when YouTube video or live stream loads
window.addEventListener("load", setupObserver);
document.addEventListener("yt-navigate-finish", setupObserver); // For navigating between videos or live streams
