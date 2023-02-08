;(function($) {
    'use strict';

    $.fn.isElementInViewport = function () {
        var win = $(window);

        var viewport = {
            top: win.scrollTop(),
            left: win.scrollLeft()
        };

        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = this.offset();
        bounds.right = bounds.left + this.outerWidth();
        bounds.bottom = bounds.top + this.outerHeight();

        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    };

    var $counters = $('.js-counter-init');
    var counters = {};
    var countersId = [];

    function start_counters( countersId ) {
        $.each(countersId, function(index, id) {
            var $counter = $('#' + id);

            if( $counter.length && $counter.isElementInViewport() ) {
                counters[id].start();
            }
        });
    }

    if( $counters.length > 0 ) {
        $counters.each(function () {
            var $this = $(this);
            var id = $this.attr('id');
            var counterEnd = $this.data('counter-end');
            var counterDuration = $this.data('counter-duration') || 2.5;
            var counterSuffix = $this.data('counter-suffix');

            var options = {
                useEasing: true,
                useGrouping: true,
                separator: $this.data('counter-separator') || '',
                prefix: $this.data('counter-prefix') || '',
                suffix: ''
            };

            if (counterSuffix) {
                var suffixClasses = ['a-counter__number-suffix'];

                if ( $this.data('counter-suffix-style') ) {
                    suffixClasses.push('a-counter__number-suffix--' + $this.data('counter-suffix-style'));
                }

                options.suffix = '<span class="' + suffixClasses.join( ' ' ) + '">' + counterSuffix + '</span>';
            }

            counters[id] = new CountUp(id, 0, counterEnd, 0, counterDuration, options);

            countersId.push(id);
        });
    }

    if( countersId.length > 0 ) {
        $(window).on('scroll load', function() {
            start_counters( countersId );
        });
    }

})(jQuery);