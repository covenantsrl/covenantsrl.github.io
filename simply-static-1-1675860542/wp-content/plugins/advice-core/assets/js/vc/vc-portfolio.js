(function ($) {
    'use strict';

    var masonryOptions = {
        itemSelector: '.portfolio__item',
        percentPosition: true,
        hiddenStyle: {
            opacity: 0
        },
        visibleStyle: {
            opacity: 1
        }
    };
    var $masonry;

    function init() {
        $masonry = $('.a-js-portfolio-init-masonry').masonry(masonryOptions)
    }

    function destory() {
        $masonry.masonry('destroy');
    }

    $(document).on('a-portfolio-masonry-destroy', destory);
    $(document).on('a-portfolio-masonry-init ready', init);
})(jQuery);