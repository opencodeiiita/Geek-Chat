const profile = document.querySelector("#profile_avatars");

/*
===================================
       ******Modal close********
===================================
*/

const modalDiv = document.querySelector(".modal_div");
const overlayDiv = document.querySelector(".overlay_div ");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnOpenModal = document.querySelector(".btn--show-modal");

/*
===========================================
 ********Function to Open Modal********
===========================================
*/

const OpenModal = () => {
  modalDiv.classList.remove("hidden");
  overlayDiv.classList.remove("overlay_hidden");
};

/*
===========================================
 ********Function to Close Modal********
===========================================
*/

const CloseModal = () => {
  modalDiv.classList.add("hidden");
  overlayDiv.classList.add("overlay_hidden");
};
btnOpenModal.addEventListener("click", OpenModal);
btnCloseModal.addEventListener("click", CloseModal);

/*
==================================================
       ******Modal close with Escape Key********
==================================================
*/
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalDiv.classList.contains("hidden")) {
    CloseModal();
  }
});
overlayDiv.addEventListener("click", () => {
  if (!modalDiv.classList.contains("hidden")) {
    CloseModal();
  }
});

const profileImg = document.querySelectorAll(".ProfileImg");
const profileUrl = document.querySelector("#profile_avatars");
const profileValue = document.querySelector("#profilePhoto");
/*
===========================
 ***Random Profile******
===========================
*/

var PhotoNumber;
if (localStorage.PhotoNumber) {
  PhotoNumber = localStorage.PhotoNumber;
} else {
  var randNumber;
  randNumber = Math.trunc(Math.random() * 12 + 1);
  PhotoNumber = `0${randNumber}`.slice(-2);
  localStorage.PhotoNumber = PhotoNumber;
}
if (localStorage.customAvt) {
	profileUrl.src = `./avtars/${localStorage.customAvt}`;
	profileValue.value = `./avtars/${localStorage.customAvt}`;
} else {
  profileUrl.src = `./avtars/${PhotoNumber}.png`;
  profileValue.value = `./avtars/${PhotoNumber}.png`;
}

/*
===========================
 ***Initital SliderIndex******
===========================
*/

if (localStorage.customAvt) {
  var slideIndex = 1;
} else {
  var slideIndex = Number(profileUrl.src.slice(-6, -4));
}
const numberChange = document.querySelector(".numberChange");
const slides = document.querySelectorAll(".mySlides");
const maxSlide = slides.length;
const BtnRight = document.querySelector(".next");
const BtnLeft = document.querySelector(".prev");
const dotBox = document.querySelector('.dotBox');
/*
===========================
 ***Creating dots******
===========================
*/
const createDots = function (){
    slides.forEach(function(s, i){
        dotBox.insertAdjacentHTML('beforeend',   `<span class="dot" data-slide="${i}"></span>` );
    })
}

createDots();


/*
===========================
 ***Left Right Button***
===========================
*/

const showSlides = (n) => {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - (n - 1))}%)`;
  });
  activeDot(n)
};
const activeDot = (slideIndex) => {
    var dots = document.getElementsByClassName("dot");
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  numberChange.innerHTML = slideIndex;
  dots[slideIndex - 1].className += " active";
};
showSlides(slideIndex);
BtnRight.addEventListener("click", () => {
  if (slideIndex === maxSlide) {
    slideIndex = 1;
  } else {
    slideIndex++;
  }
  showSlides(slideIndex);
 activeDot(slideIndex);
});
BtnLeft.addEventListener("click", () => {
  if (slideIndex === 1) {
    slideIndex = maxSlide;
  } else {
    slideIndex--;
  }
  showSlides(slideIndex);
  activeDot(slideIndex);
});

/*
==================================================
       ******Profile Image Selection********
==================================================
*/
const Dots = document.querySelectorAll(".dot");
var curntSelected = Number(PhotoNumber);
const checkIcon = document.querySelectorAll('.icon_check');
if (curntSelected != 13) {
  Dots[curntSelected - 1].className += " selectDot";
  checkIcon[curntSelected - 1].classList.remove('hidden1');
}
profileImg.forEach((profile) => {
  profile.addEventListener("click", () => {
    var srcNumber = profile.src.slice(-6, -4);
    slideIndex = Number(srcNumber);
    localStorage.PhotoNumber = srcNumber; //storing in local storage current profile Image
    PhotoNumber = srcNumber; //current Profile Number
    profileUrl.src = `./avtars/${PhotoNumber}.png`; // profile src
    profileValue.value = `./avtars/${PhotoNumber}.png`; // profile value to send in chat box
    Dots.forEach((Dot, i) => {
      if(checkIcon[i]) {
        if (Dot.classList.contains("selectDot")) {
          Dot.classList.remove("selectDot");
          
        }
        if(!checkIcon[i].classList.contains('hidden1'))
        {checkIcon[i].classList.add('hidden1');
         }
        }
      });
    Dots[slideIndex - 1].className += " selectDot";
    checkIcon[slideIndex - 1].classList.remove('hidden1');
  });
});


/*
==================================================
       ******Dot activation Selection********
==================================================
*/
dotBox.addEventListener('click', function(e){
    if(e.target.classList.contains('dot')){
        const slide = e.target.dataset.slide;
        // console.log(slide)
        showSlides(Number(slide)+1);
        slideIndex=Number(slide)+1;
    }
})


/*
==================================================
******Custom Avatar********
==================================================
*/
const avtarForm = document.querySelector('#avatarForm')
const upldBtn = document.querySelector('#upload')
const Input = document.querySelector('#fileInp')

avtarForm.addEventListener('submit', (e) => {
  e.preventDefault();
  //make an xml request to upload image
  let xhr = new XMLHttpRequest();

  xhr.open('POST', '/newAvatar');
  let formData = new FormData(avtarForm);
  xhr.send(formData);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 3) {
      // loading
      console.log(3);
    }
    if (xhr.readyState == 4) {
      // request finished
      Input.value = "";
      localStorage.setItem('customAvt',xhr.response);
      window.location.reload(false);

    }
  };
})