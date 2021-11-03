$(document).ready(() => {
    
    document.querySelector('.new-room').value = document.querySelector('select').value;
  
    document.querySelector('input[type="text"]').addEventListener('focus', (e) => {
      const out = document.querySelectorAll('.border-gradient')[0];
      out.style.background = 'linear-gradient(45deg, var(--one), var(--two))';
    })  
    document.querySelector('input[type="text"]').addEventListener('blur', (e) => {
      const out = document.querySelectorAll('.border-gradient')[0];
      out.style.background = '';
    })  
    document.querySelector('select').addEventListener('change', (e) => {
      document.querySelector('.new-room').value = e.target.value;
    })  
    document.querySelector('.new-room').addEventListener('focus', (e) => {
      const out = document.querySelectorAll('.border-gradient')[2];
      out.style.background = 'linear-gradient(45deg, var(--one), var(--two))';
    })  
    document.querySelector('.new-room').addEventListener('blur', (e) => {
      const out = document.querySelectorAll('.border-gradient')[2];
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
  