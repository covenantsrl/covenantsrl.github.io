(function($) {
    'use strict';

    // Visual Composer Shortcode Space
    function shortcodeSpace() {
        if( $('.a-js-space').length > 0 ) {
            $('.a-js-space').each(function() {
                var $this = $(this),
                    xlMedia = window.matchMedia('(min-width: 1200px)'),
                    lgMedia = window.matchMedia('(min-width: 992px) and (max-width: 1199px)'),
                    mdMedia = window.matchMedia('(min-width: 768px) and (max-width: 991px)'),
                    smMedia = window.matchMedia('(min-width: 576px) and (max-width: 767px)'),
                    xsMedia = window.matchMedia('(max-width: 575px)');

                $this.css('height', '');

                switch ( true ) {
                    case xlMedia.matches:
                        if( $this.data('xl') ) {
                            $this.height( $this.data('xl') + 'px' );
                        }
                        break;
                    case lgMedia.matches:
                        if( $this.data('lg') ) {
                            $this.height( $this.data('lg') + 'px' );
                        }
                        break;
                    case mdMedia.matches:
                        if( $this.data('md') ) {
                            $this.height( $this.data('md') + 'px' );
                        }
                        break;
                    case smMedia.matches:
                        if( $this.data('sm') ) {
                            $this.height( $this.data('sm') + 'px' );
                        }
                        break;
                    case xsMedia.matches:
                        if( $this.data('xs') ) {
                            $this.height( $this.data('xs') + 'px' );
                        }
                        break;
                }
            });
        }
    }

    var resizeTimer;

    $(window).on('resize', function() {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            shortcodeSpace();
        }, 250);
    });

    $(document).on('ready', function() {
        shortcodeSpace();
    });
})(jQuery);