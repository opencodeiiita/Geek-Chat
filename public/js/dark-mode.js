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

  document.querySelector('input[type="text"]').addEventListener('focus', (e) => {
    const out = document.querySelectorAll('.border-gradient')[0];
    out.style.background = 'linear-gradient(45deg, var(--one), var(--two))';
  })  
  document.querySelector('input[type="text"]').addEventListener('blur', (e) => {
    const out = document.querySelectorAll('.border-gradient')[0];
    out.style.background = '';
  })  
  document.querySelector('select').addEventListener('focus', (e) => {
    const out = document.querySelectorAll('.border-gradient')[1];
    out.style.background = 'linear-gradient(45deg, var(--one), var(--two))';
  })  
  document.querySelector('select').addEventListener('blur', (e) => {
    const out = document.querySelectorAll('.border-gradient')[1];
    out.style.background = '';
  })  

});
