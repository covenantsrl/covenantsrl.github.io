(function ($) {
    'use strict';

    $(document).on('ready', function () {
        var $carousels = $('.a-js-images-carousel');

        if ($carousels.length > 0) {
            $carousels.each(function () {
                var $carousel = $(this);
                var settings = $carousel.data('settings');

                settings.rtl = $('html').is('[dir]');

                $carousel.slick(settings);
            });
        }
    });
})(jQuery);