(function ($) {
    'use strict';

    $(document).on('advice_preloader_activated', function () {
        TweenMax.staggerTo('.a-js-preloader-pulsate circle', 2, {
            attr: {
                r: 20
            },
            opacity: 0,
            repeat: -1
        }, 1);
    });
})(jQuery);