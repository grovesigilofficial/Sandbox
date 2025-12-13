document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("storyModal");
  const btn = document.getElementById("openStory");
  const span = modal.querySelector(".close");
  const storyContent = document.getElementById("storyContent");

  // Load story content dynamically
  fetch('story.html')
    .then(response => response.text())
    .then(data => storyContent.innerHTML = data)
    .catch(err => storyContent.innerHTML = "Failed to load story.");

  btn.onclick = () => modal.style.display = "block";
  span.onclick = () => modal.style.display = "none";

  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
  };
});
