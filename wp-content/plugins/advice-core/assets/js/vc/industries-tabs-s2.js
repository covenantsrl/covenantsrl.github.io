(function($) {
    var resizeTimer;
    var mdMedia = window.matchMedia('(max-width: 991px)');
    var smMedia = window.matchMedia('(max-width: 767px)');
    var xsMedia = window.matchMedia('(max-width: 480px)');
    
    function animateTabsStyle2CarouselItems($items) {
        var delay = 100;

        $items.each(function() {
            var $item = $(this);

            setTimeout(function() {
                $item.removeClass('a-carousel__item--hidden');
            }, delay);

            delay += 100;
        });
    }

    function initTabsStyle2Carousel($element, animate) {
        if (typeof animate === 'undefined') animate = false;

        if (!$element.hasClass('slick-initialized')) {
            var $items = $element.find('.a-carousel__item');

            if (animate) {
                $items.addClass('a-carousel__item--hidden');
            }

            $element
                .on('init', function (e, slick) {
                    var $self = slick.$slider;

                    $self.addClass('a-carousel--items-grouped');

                    if (animate) {
                        animateTabsStyle2CarouselItems($items);
                    }

                    setTimeout(function () {
                        $(document).trigger('advice_load_progressive_image');
                    }, (($items.length * 100) + 100));
                })
                .slick({
                    dots: true,
                    arrows: false,
                    rtl: $('html').is('[dir]'),
                    infinite: false
                });
        }
    }

    function updateTabsStyle2Carousel($element) {
        if ($element.hasClass('slick-initialized')) {
            $element.slick('unslick');

            var animate = true;

            if (smMedia.matches) {
                animate = false;
            }

            initTabsStyle2Carousel($element, animate);
        }
    }

    function groupTabsStyle2Carousel($element, groupNumberItems) {
        var $items = $element.find('.a-carousel__item');
        var $group;
        var numberItems = 1;

        if (typeof groupNumberItems === 'undefined') groupNumberItems = 4;

        $element.addClass('a-carousel--items-grouped');
        $element.data('group-number-items', groupNumberItems);

        if ($element.hasClass('slick-initialized')) {
            $element.slick('unslick');
        }

        $items.each(function () {
            var $item = $(this);

            if (numberItems === 1) {
                $group = $('<div>').appendTo($element).addClass('a-carousel__group');
            }

            $item.clone().appendTo($group);

            numberItems += 1;

            if (numberItems > groupNumberItems) {
                numberItems = 1;
            }

            $item.remove();
        });
    }

    function ungroupTabsStyle2Carousel($element) {
        if ($element.hasClass('slick-initialized') || $element.data('group-number-items') !== 0) {
            $element.data('group-number-items', 0).removeClass('a-carousel--items-grouped');

            if ($element.hasClass('slick-initialized')) {
                $element.slick('unslick');
            }

            var $groups = $element.find('.a-carousel__group');

            $groups.each(function () {
                var $group = $(this),
                    $items = $group.find('.a-carousel__item');

                $items.each(function () {
                    var $item = $(this);

                    $item.clone().appendTo($element);

                    $item.remove();
                });

                $group.remove();
            });
        }
    }

    $(document).on('ready', function() {
        var $carousel = $('.js-carousel-init');

        if ($carousel.length > 0) {
            $carousel.each(function () {
                var $self = $(this);
                var style = $self.data('carousel-style');

                if (style === 'industries-tabs-style-2') {
                    var groupNumberItems = $self.data('group-number-items');

                    if (xsMedia.matches) {
                        if (groupNumberItems !== 0) {
                            ungroupTabsStyle2Carousel($self);
                        }
                    } else if (mdMedia.matches) {
                        if (groupNumberItems !== 2) {
                            ungroupTabsStyle2Carousel($self);
                            groupTabsStyle2Carousel($self, 2);
                        }
                    } else if (groupNumberItems !== 4) {
                        ungroupTabsStyle2Carousel($self);
                        groupTabsStyle2Carousel($self);
                    }

                    initTabsStyle2Carousel($self);
                }
            });
        }
    });

    $(window).on('resize', function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            var $carousel = $('.js-carousel-init');

            if($carousel.length > 0) {
                $carousel.each(function() {
                    var $self = $(this);
                    var style = $self.data('carousel-style');

                    if (style === 'industries-tabs-style-2') {
                        var groupNumberItems = $self.data('group-number-items');

                        if (xsMedia.matches) {
                            if (groupNumberItems !== 0) {
                                ungroupTabsStyle2Carousel($self);
                            }
                        } else if (mdMedia.matches) {
                            if (groupNumberItems !== 2) {
                                ungroupTabsStyle2Carousel($self);
                                groupTabsStyle2Carousel($self, 2);
                            }
                        } else if (groupNumberItems !== 4) {
                            ungroupTabsStyle2Carousel($self);
                            groupTabsStyle2Carousel($self);
                        }

                        initTabsStyle2Carousel($self);
                    }
                });
            }
        }, 250);
    });

    $(document).on('click', '.js-industries-tabs-style-2-toggle, .js-mobile-industries-tabs-styles-2-toggle', function(e) {
        e.preventDefault();

        var $self = $(this);
        var $pane = $($self.attr('href'));

        if ($pane.length > 0) {
            if ($self.hasClass('js-mobile-industries-tabs-styles-2-toggle')) {
                $self.closest('.a-tab').addClass('a-tab--active').siblings('.a-tab').removeClass('a-tab--active');
                $pane.siblings('.a-industries__pane').slideUp(300);
                $pane.slideDown(300);
            } else {
                $self.closest('.tabs__tab').addClass('tabs__tab--active').siblings().removeClass('tabs__tab--active');
                $pane.addClass('a-industries__pane--active').siblings('.a-industries__pane').removeClass('a-industries__pane--active');
            }

            updateTabsStyle2Carousel($pane.find('.a-carousel'));
        }
    });

    $(document).on('ready', function () {
        var $tabsStyle2CustomScroll = $('.js-industries-tabs-style-2-tabs-scroll-init');

        if ($tabsStyle2CustomScroll.length > 0) {
            $tabsStyle2CustomScroll.mCustomScrollbar({
                theme: 'minimal-dark',
                scrollbarPosition: 'outside'
            });
        }
    });
})(jQuery);