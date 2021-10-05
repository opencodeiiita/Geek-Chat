$(document).ready(() => {
  var body = document.querySelector("body");
  var toggleButton = document.getElementById("toggle");
  if (localStorage.dark == true) {
    body.classList.add("dark-mode");
    toggleButton.classList.toggle("active");
  } else {
    toggleButton.classList.toggle("toggle");
  }

  //   var heading = document.querySelector("h1");
  //   var select = document.querySelector("select");
  //   var input = document.querySelector("input");

  toggleButton.onclick = function () {
    toggleButton.classList.toggle("active");
    body.classList.toggle("dark-mode");
    localStorage.dark ^= true;
    // heading.classList.toggle("active");
    // select.classList.toggle("active");
    // input.classList.toggle("active");
  };
});
