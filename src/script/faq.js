// faq page ----------------------------------------------------------------------

const headers = document.querySelectorAll('.accordion-header');

headers.forEach(header => {
  header.addEventListener('click', () => {
    const activeItem = document.querySelector('.accordion-item.active');
    
    if (activeItem && activeItem !== header.parentElement) {
      activeItem.classList.remove('active');
    }

    header.parentElement.classList.toggle('active');
  });
});
