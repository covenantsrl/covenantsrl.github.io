(function ($) {
    'use strict';

    var $customButton = $('.a-js-custom-button');

    if ($customButton.length > 0) {
        $customButton.each(function () {
            var $self = $(this);
            var selector = '#' + $self.attr('id');
            var styles = '';

            styles += selector + ' {';

            if ($self.data('bg-custom-color')) {
                styles += 'background-color:' + $self.data('bg-custom-color') + ';';
            }

            if ($self.data('border-custom-color')) {
                styles += 'border-color:' + $self.data('border-custom-color') + ';';
            }

            if ($self.data('text-custom-color')) {
                styles += 'color:' + $self.data('text-custom-color') + ';';
            }

            styles += '}';

            styles += selector + ':hover {';

            if ($self.data('bg-hover-custom-color')) {
                styles += 'background-color:' + $self.data('bg-hover-custom-color') + ';';
            }

            if ($self.data('border-hover-custom-color')) {
                styles += 'border-color:' + $self.data('border-hover-custom-color') + ';';
            }

            if ($self.data('text-hover-custom-color')) {
                styles += 'color:' + $self.data('text-hover-custom-color') + ';';
            }

            styles += '}';

            var $customStyleTag = $('.a-button-custom-style');

            if ($customStyleTag.length > 0) {
                $customStyleTag.append(styles);
            } else {
                $('head').append('<style class="a-button-custom-style">' + styles + '</style>');
            }
        });
    }
})(jQuery);