(function ($) {
    'use strict';

    function getTranslateX(element) {
        var style = window.getComputedStyle(element);
        var matrix = new WebKitCSSMatrix(style.webkitTransform);
        return matrix.m41;
    }

    var mdMedia = window.matchMedia('(max-width: 991px)');
    var navItemWidth;

    function initNavCarousel() {
        var $nav = $('.a-timeline__nav');

        if ($nav.length > 0) {
            var $navListContainer = $nav.find('.a-nav__list-container');
            var $navList = $navListContainer.find('.a-nav__list');
            var $navItems = $navList.find('.a-nav__item');
            var $lastActiveNavItem = $nav.find('.a-nav__item--active').last();
            var $line = $nav.find('.a-nav__line').removeClass('a-nav__line--horizontal a-nav__line--vertical');

            if (mdMedia.matches) {
                $nav.addClass('a-nav--timeline-carousel');

                var smMedia = window.matchMedia('(max-width: 767px)');
                var xsMedia = window.matchMedia('(max-width: 480px)');
                var visibleItemsCount = 4;

                if (xsMedia.matches) {
                    visibleItemsCount = 2;
                } else if (smMedia.matches) {
                    visibleItemsCount = 3;
                }

                setTimeout(function () {
                    navItemWidth = $navListContainer.width() / visibleItemsCount;

                    var navListOffset = (navItemWidth / 2) - 8;
                    var navListWidth = $navItems.length * navItemWidth;

                    $navItems.width(navItemWidth);

                    $navList.css({
                        width: navListWidth + 'px',
                        left: navListOffset + 'px'
                    });

                    if ($lastActiveNavItem.length > 0) {
                        $line.css('height', '').width($lastActiveNavItem.position().left + 'px').addClass('a-nav__line--horizontal');
                    }
                }, 100);
            } else {
                $nav.removeClass('a-nav--timeline-carousel');
                $navItems.css('width', '');
                $navList.removeAttr('style');

                if ($lastActiveNavItem.length > 0) {
                    $line.css('width', '').height($lastActiveNavItem.position().top + 'px').addClass('a-nav__line--vertical');
                }
            }
        }
    }

    $(document).on('ready', initNavCarousel);

    var resizeTimer;

    $(window).on('resize', function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            initNavCarousel();
        }, 250);
    });

    var scrollEnd = true;

    $('.a-js-timeline-next-nav, .a-js-timeline-prev-nav').on('click', function (e) {
        e.preventDefault();

        if (scrollEnd) {
            var $this = $(this);
            var next = ($this.hasClass('a-js-timeline-next-nav'));
            var $navList = $this.closest('.a-nav').find('.a-nav__list');
            var scrollMaxDistance = $navList.width() - $navList.closest('.a-nav__list-container').width();
            var scrollDistance = Math.abs(getTranslateX($navList[0]));

            if (next && scrollMaxDistance > scrollDistance || !next && scrollDistance > 1) {
                if (next) {
                    scrollDistance += navItemWidth;
                } else {
                    scrollDistance -= navItemWidth;
                }

                scrollDistance *= -1;

                scrollEnd = false;

                $navList
                    .css({
                        transform: 'translateX(' + scrollDistance + 'px) translateY(-50%)'
                    })
                    .on('transitionend', function () {
                        scrollEnd = true;
                    });
            }
        }
    });

    $('.a-js-timeline-event-switch').on('click', function () {
        var $switch = $(this);
        var $event = $('#' + $switch.data('event-id'));

        if (!$event.hasClass('a-timeline-events__item--active')) {
            var $timeline = $switch.closest('.a-timeline');
            var $switchPosition = $switch.position();
            var $line = $switch.parent().find('.a-nav__line');
            var $activeEvent = $timeline.find('.a-timeline-events__item--active');

            if (mdMedia.matches) {
                $line.width($switchPosition.left + 'px');
            } else {
                $line.height($switchPosition.top + 'px');
            }

            $switch.prevAll(':not(.a-nav__line)').addClass('a-nav__item--active');
            $switch.nextAll().removeClass('a-nav__item--active');
            $switch.addClass('a-nav__item--active');

            if ($event.length > 0) {
                if ($activeEvent.length > 0) {
                    $activeEvent.addClass('a-timeline-events__item--hide');
                }

                $event
                    .addClass('a-timeline-events__item--active a-timeline-event--active')
                    .siblings()
                    .removeClass('a-timeline-events__item--active a-timeline-event--active');

                setTimeout(function () {
                    $event.removeClass('a-timeline-events__item--hide').siblings().removeClass('a-timeline-events__item--hide');
                }, 300);
            }
        }
    });
})(jQuery);