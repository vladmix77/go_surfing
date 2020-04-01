$(function() {
  $(".header__slider").slick({
    infinite: true,
    fade: true,
    prevArrow:
      '<img class="slider-arrows slider-arrows__left" src="images/arrows-left.svg" alt="" />',
    nextArrow:
      '<img class="slider-arrows slider-arrows__right" src="images/arrows-right.svg" alt="" />'
  });
});
