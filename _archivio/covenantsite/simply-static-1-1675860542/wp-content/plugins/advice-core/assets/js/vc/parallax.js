(function ($) {
    'use strict';

    var $html = $('html');
    var $window = $(window);
    var $simpleParallaxElements = $('.a-js-simple-parallax');
    var $fixedParallaxElements = $('.a-js-fixed-parallax');

    function backgroundResize() {
        var windowH = $window.height();

        $fixedParallaxElements.each(function () {
            var $fixedParallaxElement = $(this);
            var contW = $fixedParallaxElement.width();
            var contH = $fixedParallaxElement.height();
            var imgW = $fixedParallaxElement.data('img-width');
            var imgH = $fixedParallaxElement.data('img-height');
            var ratio = imgW / imgH;

            var remainingH = 0;

            if (!$html.hasClass('a-touch-device')) {
                remainingH = windowH - contH;
            }

            imgH = contH + remainingH;
            imgW = imgH * ratio;

            if (contW > imgW) {
                imgW = contW;
                imgH = imgW / ratio;
            }

            $fixedParallaxElement.data('resized-img-width', imgW);
            $fixedParallaxElement.data('resized-img-height', imgH);
            $fixedParallaxElement.css('background-size', imgW + 'px ' + imgH + 'px');
        });
    }

    function parallaxPosition() {
        var heightWindow = $window.height();
        var topWindow = $window.scrollTop();
        var bottomWindow = topWindow + heightWindow;
        var currentWindow = (topWindow + bottomWindow) / 2;

        $fixedParallaxElements.each(function () {
            var $fixedParallaxElement = $(this);
            var height = $fixedParallaxElement.height();
            var top = $fixedParallaxElement.offset().top;
            var bottom = top + height;

            if (bottomWindow > top && topWindow < bottom) {
                var imgW = $fixedParallaxElement.data('resized-img-width');
                var imgH = $fixedParallaxElement.data('resized-img-height');

                var min = 0;

                var max = -imgH + heightWindow;

                var overflowH = height < heightWindow ? imgH - height : imgH - heightWindow;
                top = top - overflowH;
                bottom = bottom + overflowH;

                var value = min + (max - min) * (currentWindow - top) / (bottom - top);

                var orizontalPosition = $fixedParallaxElement.attr('data-oriz-pos');
                orizontalPosition = orizontalPosition ? orizontalPosition : '50%';
                $(this).css('background-position', orizontalPosition + ' ' + value + 'px');
            }
        });
    }

    if($fixedParallaxElements.length > 0) {
        if ('ontouchstart' in window) {
            $html.addClass('a-touch-device');
        }

        if (!$html.hasClass('a-touch-device')) {
            $fixedParallaxElements.css('background-attachment', 'fixed');
        }

        $(document).on('ready', function() {
            $window.on('resize', backgroundResize);
            backgroundResize();

            if (!$html.hasClass('a-touch-device')) {
                $window.on('resize scroll', parallaxPosition);
                parallaxPosition();
            }
        });
    }

    if($simpleParallaxElements.length > 0) {
        var parallaxSpeed = 10;

        $(window).on('scroll', function() {
            var scrollY = $window.scrollTop();
            var heightWindow = $window.height();
            var bottomWindow = scrollY + heightWindow;

            $simpleParallaxElements.each(function() {
                var $simpleParallaxElement = $(this);
                var height = $simpleParallaxElement.height();
                var top = $simpleParallaxElement.offset().top;
                var bottom = top + height;

                if (bottomWindow > top && scrollY < bottom) {
                    scrollY = bottomWindow - top;

                    $simpleParallaxElement.css('background-position', '50% ' + (-scrollY/parallaxSpeed) + 'px');
                }
            });
        });
    }

})(jQuery);