(function ($) {
    'use strict';

    var $headings = $('.a-heading');
    var resizeTimer;
    var xlMedia = window.matchMedia('(min-width: 1200px)');
    var lgMedia = window.matchMedia('(min-width: 992px) and (max-width: 1199px)');
    var mdMedia = window.matchMedia('(min-width: 768px) and (max-width: 991px)');
    var smMedia = window.matchMedia('(min-width: 576px) and (max-width: 767px)');
    var xsMedia = window.matchMedia('(max-width: 575px)');

    function getMediaQuery() {
        var mediaQuery;

        switch (true) {
            case xlMedia.matches:
                mediaQuery = 'xl';
                break;
            case lgMedia.matches:
                mediaQuery = 'lg';
                break;
            case mdMedia.matches:
                mediaQuery = 'md';
                break;
            case smMedia.matches:
                mediaQuery = 'sm';
                break;
            case xsMedia.matches:
                mediaQuery = 'xs';
                break;
        }

        return mediaQuery;
    }

    function responsiveFontSize() {
        if ($headings.length > 0) {
            var mediaQuery = getMediaQuery();

            $headings.each(function () {
                var $heading = $(this);
                var params = $heading.data('params');

                if (typeof params !== 'undefined' && typeof params.responsive !== 'undefined') {
                    var $title = $heading.find('.a-heading__title').css('font-size', '');

                    if (typeof params.responsive[mediaQuery] !== 'undefined') {
                        $title.css('font-size', params.responsive[mediaQuery]);
                    }
                }
            })
        }
    }

    $(document).on('ready', responsiveFontSize);
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(responsiveFontSize, 250);
    });
})(jQuery);