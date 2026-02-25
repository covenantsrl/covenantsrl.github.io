;(function ($) {
    'use strict';

    $(document).on('ready', function() {
        var $sliders = $('.js-init-testimonials-slider');

        if ($sliders.length > 0) {
            $sliders.each(function () {
                var $slider = $(this);
                var sliderParams = $slider.data('params');
                var slickOptions = {
                    dots: sliderParams.dots,
                    arrows: sliderParams.arrows,
                    prevArrow: '<button type="button" class="slick-prev"><span class="ai ai-arrow-left"></span></button>',
                    nextArrow: '<button type="button" class="slick-next"><span class="ai ai-arrow-right"></span></button>',
                    autoplay: sliderParams.autoplay,
                    autoplaySpeed: sliderParams.autoplaySpeed,
                    rtl: $('html').is('[dir]'),
                    speed: sliderParams.speed
                };

                if (sliderParams.slidesToShow !== undefined && sliderParams.slidesToShow > 1) {
                    slickOptions.slidesToShow = sliderParams.slidesToShow;
                    slickOptions.responsive = sliderParams.responsive;
                } else {
                    slickOptions.fade = true;
                    slickOptions.cssEase = 'ease';
                    slickOptions.responsive = [
                        {
                            breakpoint: 992,
                            settings: {
                                arrows: false
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                arrows: false,
                                autoplay: false,
                                adaptiveHeight: true
                            }
                        }
                    ];
                }

                $slider.slick(slickOptions);

                if (sliderParams.navColor !== undefined) {
                    var cssSelector = '#' + $slider.attr('id');
                    var style = cssSelector + ' .slick-arrow {color:' + sliderParams.navColor + ';}\n';
                    style += cssSelector + ' .slick-dots button:before {border-color:' + sliderParams.navColor + ';background:' + sliderParams.navColor + ';}\n';
                    style += cssSelector + ' .slick-dots .slick-active button:before {background:transparent;}';

                    $('head').append('<style>' + style + '</style>');
                }
            });
        }
    });
})(jQuery);