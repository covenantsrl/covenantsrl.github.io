(function($) {
    'use strict';

    $(document).on('ready', function() {
        var $body = $('body');

        if ($body.hasClass('a-enabled-text-social-share')) {
            var selector = 'body';

            if (typeof tc_selection_sharer_variables !== 'undefined') {
                selector = tc_selection_sharer_variables.selector;
            }

            $(selector).selectionSharer();
        }
    });
})(jQuery);