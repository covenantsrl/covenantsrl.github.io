(function ($) {
    'use strict';

    $('.a-js-tabs-toggle').each(function () {
        var $this = $(this);

        if ($this.closest('.a-tabs-nav__item').hasClass('a-tabs-nav__item--active')) {
            $($this.attr('href')).addClass('a-tabs__section--active');
        }
    });

    $(document).on('click', '.a-js-tabs-toggle', function (e) {
        e.preventDefault();

        var $this = $(this);
        var $tab = $($this.attr('href'));

        if ($tab.length > 0) {
            $this.closest('.a-tabs-nav__item').addClass('a-tabs-nav__item--active').siblings().removeClass('a-tabs-nav__item--active');
            $tab.addClass('a-tabs__section--active').siblings('.a-tabs__section').removeClass('a-tabs__section--active');
        }
    });
})(jQuery);