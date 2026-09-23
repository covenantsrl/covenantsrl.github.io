(function ($) {
    'use strict';

    $(document).on('ready', function () {
        var $carousels = $('.a-js-init-services-carousel');

        if ($carousels.length > 0) {
            $carousels.each(function () {
                var $carousel = $(this);
                var carouselParams = $carousel.data('params');
                var slickOptions = {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    dots: true,
                    infinite: false,
                    speed: 500,
                    rtl: $('html').is('[dir]'),
                    arrows: false,
                    prevArrow: '<button type="button" class="slick-prev"><span class="ai ai-arrow-left"></span></button>',
                    nextArrow: '<button type="button" class="slick-next"><span class="ai ai-arrow-right"></span></button>',
                    responsive: [
                        {
                            breakpoint: 1200,
                            settings: {
                                slidesToShow: 3
                            }
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 2
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 2
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 1,
                                dots: false
                            }
                        }
                    ]
                };

                if (typeof carouselParams.navId !== 'undefined') {
                    var $carouselNav = $(carouselParams.navId);

                    if ($carouselNav.length > 0) {
                        slickOptions.appendArrows = $carouselNav;
                        slickOptions.arrows = true;
                        slickOptions.appendDots = $carouselNav;
                    }
                }

                $carousel.slick(slickOptions);
            });
        }
    });

})(jQuery);