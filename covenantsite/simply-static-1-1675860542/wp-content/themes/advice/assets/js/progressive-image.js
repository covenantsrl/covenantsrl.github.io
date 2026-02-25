(function ($) {
    'use strict';

    $(window).on('load', function () {
        var $progressiveImages = $('.a-js-progressive-image');
        var timer;

        $(window).on('scroll resize', scroller);

        $(document).on('advice_load_progressive_image', reloadImages);

        $(document).ajaxSuccess(reloadImages);

        inView();

        function reloadImages() {
            $progressiveImages = $('.a-js-progressive-image');

            scroller();
        }

        function scroller(e) {
            timer = timer || setTimeout(function () {
                    timer = null;

                    requestAnimationFrame(inView);
                }, 300);
        }

        function inView() {
            var wT = window.pageYOffset,
                wB = wT + window.innerHeight,
                cRect,
                pT,
                pB,
                p = 0;

            $progressiveImages.each(function () {
                var progressiveImage = this;
                var $progressiveImage = $(progressiveImage);

                cRect = progressiveImage.getBoundingClientRect();

                pT = wT + cRect.top;
                pB = pT + cRect.height;

                if (wT < pB && wB > pT) {
                    loadImage($progressiveImage);

                    $progressiveImage.removeClass('a-js-progressive-image');
                }
            });
        }

        function loadImage($progressiveImage) {
            if (typeof $progressiveImage.data('progressive-image-srcset') !== 'undefined') {
                $progressiveImage.attr('srcset', $progressiveImage.data('progressive-image-srcset'));
            }

            if (typeof $progressiveImage.data('progressive-image-sizes') !== 'undefined') {
                $progressiveImage.attr('sizes', $progressiveImage.data('progressive-image-sizes'));
            }

            $progressiveImage.attr('src', $progressiveImage.data('progressive-image-src'));

            $progressiveImage.addClass('a-progressive-image--loaded');

            if ($progressiveImage.hasClass('portfolio-item__img') && $progressiveImage.closest('.a-js-portfolio-init-masonry').length > 0) {
                $progressiveImage.closest('.a-js-portfolio-init-masonry').masonry('layout')
            }
        }
    });
})(jQuery);