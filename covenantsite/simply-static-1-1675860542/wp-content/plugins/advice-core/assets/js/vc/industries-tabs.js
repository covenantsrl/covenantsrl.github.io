(function ($) {
    'use strict';

    var resizeTimer;
    var xsMedia = window.matchMedia('(max-width: 575px)');

    function setActivePointerPosition($tab) {
        var $tabs = $tab.closest('.a-tabs'),
            $activePointer = $tabs.find('.a-active-pointer'),
            activePointerPosition = 0,
            $carouselList = $tabs.find('.slick-list'),
            minPosition = $carouselList.offset().left,
            maxPosition = minPosition + $carouselList.width();

        if ($activePointer.length > 0) {
            var currentDistance = $tab.offset().left,
                $tabIcon = $tab.find('.a-tabs__tab-icon'),
                $activePointerMiddle = $activePointer.find('.a-active-pointer__item--middle');

            if ($tabIcon.length > 0) {
                currentDistance = $tab.find('.a-tabs__tab-icon').offset().left;

                activePointerPosition = currentDistance;

                var tabIconWidth = $tabIcon.outerWidth(),
                    activePointerMiddleWidth = $activePointerMiddle.width();

                if (tabIconWidth > activePointerMiddleWidth) {
                    activePointerPosition = currentDistance + ((tabIconWidth - activePointerMiddleWidth) / 2);
                } else {
                    activePointerPosition = currentDistance - ((activePointerMiddleWidth - tabIconWidth) / 2);
                }
            } else {
                activePointerPosition = currentDistance + ($activePointerMiddle.width() / 2);
            }

            if (minPosition > currentDistance || maxPosition <= currentDistance) {
                $activePointer.removeClass('a-active-pointer--visible');
            } else {
                $activePointer.find('.a-active-pointer__item--left').css('width', activePointerPosition + 'px');

                if (!$activePointer.hasClass('a-active-pointer--visible')) {
                    $activePointer.addClass('a-active-pointer--visible');
                }
            }
        }
    }

    function initServicesCarousel($element) {
        if (!$element.hasClass('slick-initialized')) {
            $element.slick({
                dots: true,
                arrows: false,
                infinite: false,
                fade: true,
                rtl: $('html').is('[dir]'),
                cssEase: 'ease'
            });
        }
    }

    function reinitServicesCarousel($element) {
        if ($element.hasClass('slick-initialized')) {
            $element.slick('unslick');
        }

        initServicesCarousel($element);
    }

    function ungroupServicesCarousel($element) {
        $element.removeClass('a-carousel--items-grouped');

        if ($element.hasClass('slick-initialized')) {
            $element.slick('unslick');
        }

        $element.find('.a-carousel__group').each(function () {
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

    function groupServicesCarousel($element) {
        $element.addClass('a-carousel--items-grouped');

        if ($element.hasClass('slick-initialized')) {
            $element.slick('unslick');
        }

        var $items = $element.find('.a-carousel__item'),
            $group,
            numberItems = 1;

        $items.each(function () {
            var $item = $(this);

            if (numberItems === 1) {
                $group = $('<div>').appendTo($element).addClass('a-carousel__group');
            }

            $item.clone().appendTo($group);

            numberItems += 1;

            if (numberItems > 4) {
                numberItems = 1;
            }

            $item.remove();
        });
    }

    $(document).on('ready', function () {
        var $tabsCarousel = $('.js-industries-tabs-carousel-init');

        if ($tabsCarousel.length > 0) {
            $tabsCarousel
                .on('init', function (e, slick) {
                    var $activeTab = slick.$slider.find('.a-tabs__tab--active');

                    if ($activeTab.length > 0) {
                        setActivePointerPosition($activeTab);
                    }
                })
                .slick({
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: false,
                    swipe: false,
                    prevArrow: '<button type="button" class="slick-prev"><span class="ai ai-arrow-left"></span></button>',
                    nextArrow: '<button type="button" class="slick-next"><span class="ai ai-arrow-right"></span></button>',
                    rtl: $('html').is('[dir]'),
                    responsive: [
                        {
                            breakpoint: 1200,
                            settings: {
                                slidesToShow: 3
                            }
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 2
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 1
                            }
                        }
                    ]
                })
                .on('beforeChange', function (e, slick) {
                    slick.$slider.closest('.a-tabs').find('.a-active-pointer').removeClass('a-active-pointer--visible');
                })
                .on('afterChange', function (e, slick) {
                    var $activeTab = slick.$slider.find('.a-tabs__tab--active');

                    if ($activeTab.length > 0) {
                        setActivePointerPosition($activeTab);
                    }
                });
        }

        var $carousel = $('.js-industries-tabs-services-carousel-init');

        $carousel.each(function () {
            var $self = $(this);

            if (xsMedia.matches && $self.hasClass('a-carousel--items-grouped')) {
                ungroupServicesCarousel($self);
            }

            if ($self.is(':visible')) {
                initServicesCarousel($self);
            }
        });
    });

    $(window).on('resize', function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            var $navIndustryTabs = $('.a-tabs--industries-tabs');

            if ($navIndustryTabs.find('.a-active-pointer').length > 0) {
                var $activeTab = $navIndustryTabs.find('.a-tabs__tab--active');

                if ($activeTab.length > 0) {
                    setActivePointerPosition($activeTab);
                }
            }

            var $carousel = $('.js-industries-tabs-services-carousel-init');

            $carousel.each(function () {
                var $self = $(this);

                if (xsMedia.matches && $self.hasClass('a-carousel--items-grouped')) {
                    ungroupServicesCarousel($self);
                } else if (!xsMedia.matches && !$self.hasClass('a-carousel--items-grouped')) {
                    groupServicesCarousel($self);
                }

                if ($self.is(':visible')) {
                    initServicesCarousel($self);
                }
            });
        }, 250);
    });

    $('.js-industries-tabs-toggle').on('click', function (e) {
        e.preventDefault();

        var $tab = $(this);

        if (!$tab.hasClass('a-tabs__tab--active')) {
            var tabId = $tab.data('tab-id');
            var $tabsContent = $tab.closest('.a-industries').find('.a-industries__content');

            if ($tabsContent.find('[data-pane-id="' + tabId + '"]').length > 0) {
                var $pane = $tabsContent.find('[data-pane-id="' + tabId + '"]');

                $tab.addClass('a-tabs__tab--active').siblings().removeClass('a-tabs__tab--active');

                setActivePointerPosition($tab);

                $pane.addClass('a-industries__pane--active').siblings().removeClass('a-industries__pane--active');

                reinitServicesCarousel($pane.find('.a-carousel'));
            }
        }
    });

})(jQuery);