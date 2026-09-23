(function ($) {
    'use strict';

    $(document).on('ready', function () {
        var $sliders = $('.a-js-images-slider');

        if ($sliders.length > 0) {
            $sliders.each(function () {
                var $slider = $(this);
                var settings = $slider.data('settings');

                settings.rtl = $('html').is('[dir]');

                $slider.slick(settings);
            });
        }
    });
})(jQuery);