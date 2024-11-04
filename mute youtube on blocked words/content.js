// List of words to mute
const mutedWords = ["cheese", "cheesy", "cheeses", "cheeseburger", "cheesesteak", "cheesecake", "cheesestick"];

// Select the video element and captions
let videoElement;
let lastWordTimestamp = 0;

const muteVideo = () => {
  if (videoElement) videoElement.muted = true;
};

const unmuteVideo = () => {
  if (videoElement) videoElement.muted = false;
};

// Function to monitor captions
const monitorCaptions = () => {
  const captionElements = document.querySelectorAll(".captions-text");
  captionElements.forEach((caption) => {
    const text = caption.innerText.toLowerCase();
    const currentTime = videoElement ? videoElement.currentTime : 0;

    // Check if any muted words appear in the captions
    mutedWords.forEach((word) => {
      if (text.includes(word) && currentTime > lastWordTimestamp) {
        lastWordTimestamp = currentTime + 1; // Avoid multiple mutes in quick succession
        muteVideo();
        setTimeout(unmuteVideo, 1000); // Unmute after 1 second
      }
    });
  });
};

// Set up observer for video and captions
const setupObserver = () => {
  const observer = new MutationObserver(monitorCaptions);
  const captionsContainer = document.querySelector(".captions-container");
  videoElement = document.querySelector("video");

  if (captionsContainer && videoElement) {
    observer.observe(captionsContainer, { childList: true, subtree: true });
  }
};

// Initialize observer when YouTube video loads
window.addEventListener("load", setupObserver);
document.addEventListener("yt-navigate-finish", setupObserver); // For navigating between videos
