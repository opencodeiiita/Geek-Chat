$(document).ready(() => {
  var body = document.querySelector("body");
  var toggleButton = document.getElementById("toggle");
  if (localStorage.dark == true) {
    body.classList.add("dark-mode");
    toggleButton.classList.toggle("active");
  } else {
    toggleButton.classList.toggle("toggle");
  }

  toggleButton.onclick = function () {
    toggleButton.classList.toggle("active");
    body.classList.toggle("dark-mode");
    localStorage.dark ^= true;
  };
});
