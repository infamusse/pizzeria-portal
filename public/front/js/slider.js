function changeManually() {
  const dots = document.querySelectorAll('.slider__dots .fas');
  const slider_elements = document.querySelectorAll('.carousel-item');

  for (let dot of dots) {
    dot.addEventListener('click', function() {
      const clickedElement = this;
      dots.forEach(function(dot) {
        dot.classList.remove('color');
      });
      clickedElement.classList.add('color');
      for (let slider__element of slider_elements) {
        slider__element.classList.toggle(
          'active',
          clickedElement.getAttribute('data-position') ==
            slider__element.getAttribute('data-position')
        );
      }
    });
  }
}
changeManually();
