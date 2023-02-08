(function($) {
    'use strict';

    function openWindow(url) {
        window.open(url, 'share', 'scrollbars=true,width=800,height=600');
    }

    $('.a-js-text-block-tweet').on('click', function(e) {
        e.preventDefault();

        var text = $(this).data('tweet-text');

        if(text) {
            openWindow('https://twitter.com/intent/tweet?text=' + text);
        }
    });
})(jQuery);