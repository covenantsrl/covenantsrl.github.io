(function ($) {
    'use strict';

    $(document).on('ready', function () {
        $('.a-js-icon-box-draw-svg').each(function () {
            var icon = this;
            var $icon = $(icon);
            var settings = $icon.data('svg-settings');

            if (settings['url']) {
                var vivusOptions = {
                    pathTimingFunction: Vivus.EASE_OUT,
                    animTimingFunction: Vivus.EASE_OUT,
                    file: settings['url'],
                    onReady: function (data) {
                        var $svg = $(data.el);

                        if (settings['width']) {
                            $svg.attr('width', settings['width']);
                        }

                        if (settings['stroke']) {
                            $svg.css('stroke', settings['stroke']);
                        }

                        if (settings['stroke-class']) {
                            $svg.addClass(settings['stroke-class']);
                        }
                    }
                };

                if (settings['type']) {
                    vivusOptions.type = settings['type'];
                }

                if (settings['duration']) {
                    vivusOptions.duration = settings['duration'];
                }

                new Vivus(icon, vivusOptions);
            }
        });
    });
})(jQuery);