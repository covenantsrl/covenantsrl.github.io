(function ($) {
    'use strict';

    function init() {
        var sliderOptions = {
                dots: true,
                arrows: false,
                speed: 700,
                autoplay: true,
                fade: true,
                cssEase: 'ease',
                rtl: $('html').is('[dir]'),
            },
            $sliderTweets = $('.a-js-slider-tweets');

        if ($sliderTweets.length > 0) {
            $sliderTweets.each(function () {
                var $this = $(this);

                if (!$this.hasClass('slick-initialized')) {
                    $this.slick(sliderOptions);
                }
            });
        }
    }

    init();

    $(document).on('advice_loaded_tweets_slider', init);
})(jQuery);