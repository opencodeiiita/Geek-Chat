const slides = document.querySelectorAll('.slide');
// console.log(slides)
slides.forEach((s,i)=>(s.style.transform=`translateX(${100*i}vw)`));
const slider = document.querySelector('.slider');
slider.style.transform = 'scale(0.5)'
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const profile = document.querySelector('#profile_avatars');
// console.log(profile)
let curSlide = 0;

let maxSlide = slides.length;  // It will be use to determin wheter we are at the end of left or right ride in slider.

// For slider Buttons 
btnRight.addEventListener('click', function(){
    // Here we are hidding current avatar.and str will store the on which profile number wer are at currently.
    let str = (`0${curSlide+1}`).slice(-2)
    document.querySelector(`.avatar_div${str}`).classList.add("hidden_slide")
    curSlide++;
    curSlide = curSlide%maxSlide
    slides.forEach((s,i)=>(s.style.transform=`translateX(${120*(i-curSlide)}vw)`));
    // here we are removing hidden class from avatar which is currently active and str will store the on which profile number wer are at currently.
    str = (`0${curSlide+1}`).slice(-2)
    document.querySelector(`.avatar_div${str}`).classList.remove("hidden_slide")
})
btnLeft.addEventListener('click', function(){
     // Here we are hidding current avatar.and str will store the on which profile number wer are at currently.
     let str = (`0${curSlide+1}`).slice(-2)
    document.querySelector(`.avatar_div${str}`).classList.add("hidden_slide")
    curSlide--;
    curSlide = (curSlide+maxSlide)%maxSlide

    slides.forEach((s,i)=>(s.style.transform=`translateX(${120*(i-curSlide)}vw)`));
        // here we are removing hidden class from avatar which is currently active and str will store the on which profile number wer are at currently.
        str = (`0${curSlide+1}`).slice(-2)
    document.querySelector(`.avatar_div${str}`).classList.remove("hidden_slide")
})


/*
===================================
       ******Modal close********
===================================
*/

const modalDiv = document.querySelector('.modal_div');
const overlayDiv = document.querySelector('.overlay_div ');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnOpenModal = document.querySelector('.btn--show-modal');

/*
===========================================
 ********Function to Open Modal********
===========================================
*/

const OpenModal = ()=>{
    modalDiv.classList.remove('hidden');
    overlayDiv.classList.remove('hidden');
}

/*
===========================================
 ********Function to Close Modal********
===========================================
*/

const CloseModal = ()=>{
    modalDiv.classList.add('hidden');
    overlayDiv.classList.add('hidden');
}
btnOpenModal.addEventListener('click', OpenModal);
btnCloseModal.addEventListener('click', CloseModal);

/*
==================================================
       ******Modal close with Escape Key********
==================================================
*/
document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape'&&!modalDiv.classList.contains('hidden')){
        CloseModal();
    }
})
overlayDiv.addEventListener('click', ()=>{
    if(!modalDiv.classList.contains('hidden')){
        CloseModal();

    }
})

/*
==================================================
       ******Profile Image Selection********
==================================================
*/
const profilePhoto = document.querySelector('#profilePhoto')
slides.forEach((slide, i)=>{

    slide.addEventListener('click', (a)=>{
      
        let imgNumber = slide.classList[1].slice(-2)
        console.log(imgNumber)
        profile.src = `./avtars/${imgNumber}.png`;
        profilePhoto.value = `./avtars/${imgNumber}.png`
        CloseModal();
        
      })
})