// Inicialización del carrusel de licores
$(document).ready(function() {
    if ($('.hero-carousel').length > 0) {
        $('.hero-carousel').owlCarousel({
            center: false,
            items: 1,
            loop: true,
            stagePadding: 0,
            margin: 0,
            smartSpeed: 1000,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            nav: true,
            dots: true,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            responsive: {
                0: {
                    items: 1,
                    nav: true,
                    dots: true
                },
                600: {
                    items: 1,
                    nav: true,
                    dots: true
                },
                1000: {
                    items: 1,
                    nav: true,
                    dots: true
                }
            }
        });
    }
});
