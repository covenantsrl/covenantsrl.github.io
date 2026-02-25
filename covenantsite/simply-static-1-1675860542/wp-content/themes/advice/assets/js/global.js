(function ($) {
    'use strict';

    /* Animate Scroll */
    function animateScroll(el, offset, speed) {
        if (typeof( offset ) === 'undefined') offset = 0;
        if (typeof( speed ) === 'undefined') speed = 500;

        $('html, body').animate({
            scrollTop: el.offset().top - offset
        }, speed);
    }

    /* Add Comment */
    $(document).on("click", '.js-comments-add-comment[href^="#"]', function (e) {
        e.preventDefault();

        var $el = $(this.hash);

        if ($el.length > 0) {
            animateScroll($el, 70);
        }
    });

})(jQuery);
(function ($) {
    'use strict';

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('body').addClass('a-is-not-desktop');
    }
})(jQuery);
(function ($) {
    'use strict';

    $('.a-js-field-attach-file').on('change', function () {
        var $attachAction = $(this);
        var $value = $attachAction.closest(".a-field").find(".a-field__value");
        var value = $attachAction.val();

        if (value) {
            $value.html(value).removeClass('a-field__value--placeholder');
        } else {
            $value.html($value.data('placeholder')).addClass('a-field__value--placeholder');
        }
    });

    $('.wpcf7').on('submit wpcf7invalid wpcf7mailsent wpcf7mailfailed', function(e) {
        var $form = $(this);
        var $submitButton = $form.find('[type="submit"]');

        if($submitButton.length > 0 && $submitButton.is('button')) {
            var $submitButtonIcon = $submitButton.find('.button__icon');

            if($submitButtonIcon.length > 0) {
                if(e.type === 'submit') {
                    $submitButton.addClass('button--loading');
                } else if(e.type === 'wpcf7mailsent' || e.type === 'wpcf7invalid' || e.type === 'wpcf7mailfailed') {
                    $submitButton.removeClass('button--loading');

                    if(e.type === 'wpcf7mailsent') {
                        $submitButton.addClass('button--success');
                    }
                }
            }
        }
    });

    function initSelect2() {
        var $select = $('select');

        if ($select.length > 0) {
            $select.select2({
                width: '100%',
                containerCssClass: 'select2-container--style-1'
            });
        }
    }

    $(document).on('ready', function() {
        initSelect2();
    });
    
})(jQuery);
(function ($) {
    'use strict';

    var $wrapper = $('.main-wrapper');
    var $header = $('.header');
    var $topBar = $('.top-bar');
    var $logo = $header.find('.header__logo-holder');
    var $headerSearch = $('.search--header');
    var $sideNavControl = $header.find('.header__action--side-nav-open');

    function searchPaddingLeft($el) {
        var $search = $el;

        if ($search.length > 0 && $search.hasClass('search--visible')) {
            var searchOffset = $search.offset();
            var leftOffset = 0;

            if ($sideNavControl.length > 0 && $sideNavControl.is(':visible')) {
                leftOffset = $sideNavControl.outerWidth(true);
            }

            if ($logo.length > 0 && !$logo.is(':hidden')) {
                leftOffset += $logo.outerWidth(true);
            }

            if ($('body').hasClass('a-layout-boxed')) {
                var mainWrapperOffset = $wrapper.offset();

                if (mainWrapperOffset.left <= searchOffset.left) {
                    searchOffset.left -= mainWrapperOffset.left;
                }
            }

            if (searchOffset.left < (leftOffset - 15)) {
                var paddingLeft = (leftOffset - searchOffset.left);

                $search.css('padding-left', paddingLeft + 'px');
            } else {
                $search.css('padding-left', '');
            }
        }
    }

    var resizeTimer;

    $(window).on('resize', function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            if ($headerSearch.length > 0 && $headerSearch.hasClass('search--visible')) {
                searchPaddingLeft($headerSearch);
            }
        }, 250);
    });

    /* Sticky */
    function activateStickyHeader() {
        var scrollY = $(window).scrollTop(),
            offsetTop = 0;

        if ($header.length > 0 && $header.hasClass('header--sticky')) {
            if ($topBar.length > 0) {
                offsetTop = $topBar.outerHeight();
            } else {
                if ($header.hasClass('header--style-3') || $header.hasClass('header--style-5')) {
                    if ($header.hasClass('header--sticky-active')) {
                        offsetTop = 0;
                    } else {
                        offsetTop = $header.height() * 3;
                    }
                }
            }

            if ($header.hasClass('header--sticky-active') && scrollY === offsetTop) {
                $header.removeClass('header--sticky-active');
            } else if (offsetTop <= scrollY) {
                $header.addClass('header--sticky-active');
            } else {
                $header.removeClass('header--sticky-active');
            }

            if ($headerSearch.length > 0 && $headerSearch.hasClass('search--visible')) {
                searchPaddingLeft($headerSearch);
            }
        }
    }

    $(window).on('scroll', function () {
        activateStickyHeader();
    });

    $(document).on('ready', function () {
        activateStickyHeader()
    });


    /* Search */
    $(document).on('click', '.js-header-search-show, .js-header-search-hide', function (e) {
        e.preventDefault();

        var $this = $(this),
            $header = $this.closest('.header'),
            $search = $header.find('.search');

        if (!$search.hasClass('search--visible')) {
            $header.addClass('header--search-visible');

            setTimeout(function () {
                $search.addClass('search--visible');

                searchPaddingLeft($search);
            }, 200);

            setTimeout(function () {
                $search.find('.search__form-field').trigger('focus');
            }, 300);
        } else {
            var $searchResults = $('.search-results--header');
            var $searchResultsList = $searchResults.find('.search-results__list');

            $search.find('.search__form-field').val('');
            $search.removeClass('search--visible');

            $searchResults.removeClass('search-results--visible');

            if ($searchResultsList.hasClass('mCustomScrollbar')) {
                $searchResultsList.mCustomScrollbar('destroy');
            }

            $searchResults.find('.search-results__list').empty();

            $header.removeClass('header--search-visible');
        }
    });

    $(document).on('click', function (e) {
        var $target = $(e.target);

        if ($target.closest('.search--header').length < 1 && $target.closest('.js-header-search-show').length < 1 && $target.closest('.search-results--header').length < 1) {
            var $header = $('.header');
            var $search = $header.find('.search--header');
            var $searchResults = $('.search-results--header');
            var $searchResultsList = $searchResults.find('.search-results__list');

            $search.find('.search__form-field').val('');
            $search.removeClass('search--visible');

            $searchResults.removeClass('search-results--visible');

            if ($searchResultsList.hasClass('mCustomScrollbar')) {
                $searchResultsList.mCustomScrollbar('destroy');
            }

            $searchResultsList.empty();

            $header.removeClass('header--search-visible');
        }
    });

    /* Preview Search Results */
    var searchTimeout;

    $headerSearch.on('input', '.search__form-field', function () {
        var windowHeight = $(window).height();

        var $field = $(this);
        var $fieldContainer = $field.closest('.search__form-group');

        var keyword = $field.val();

        var $resultsContainer = $('.search-results--header');
        var $resultsList = $resultsContainer.find('.search-results__list');
        var resultsListMaxHeight = ( windowHeight * 50 ) / 100;

        $resultsContainer.removeClass('search-results--visible');

        if ($resultsList.hasClass('mCustomScrollbar')) {
            $resultsList.mCustomScrollbar('destroy');
        }

        $resultsList.empty();
        $fieldContainer.removeClass('search__form-group--searching');

        if (keyword !== '') {
            var security = $fieldContainer.find('input[name="security"]').val();

            $resultsList.css('max-height', resultsListMaxHeight + 'px');

            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(function () {
                $fieldContainer.addClass('search__form-group--searching');

                $.post(
                    advice_js_variables.ajax_url,
                    {
                        'action': 'preview_search',
                        'security': security,
                        'keyword': keyword
                    },
                    function (data) {
                        var results = data;
                        $fieldContainer.removeClass('search__form-group--searching');

                        if (results.found > 0) {
                            for (var key in results) {
                                if (key !== 'found' && results[key]) {
                                    var $group = $('<li>').addClass('search-results__group');
                                    var $groupHeading = $('<div>').addClass('search-results__group-heading').html(key);
                                    var $groupList = $('<ul>').addClass('search-results__group-list');

                                    $.each(results[key], function (index, data) {
                                        var $groupItem = $('<li>').addClass('search-results__group-item');
                                        var keywordRegExp = new RegExp(data.keyword, 'gi');

                                        if (data.title) {
                                            var title = data.title.replace(keywordRegExp, '<strong>$&</strong>');
                                            var $groupItemTitle = $('<a>').addClass('search-results__group-item-title').attr('href', data.link).html(title);

                                            $groupItem.append($groupItemTitle);
                                        }

                                        if (data.text) {
                                            var text = data.text.replace(keywordRegExp, '<span>$&</span>');
                                            var $groupItemText = $('<p>').addClass('search-results__group-item-text').html(text);

                                            $groupItem.append($groupItemText);
                                        }

                                        $groupList.append($groupItem);
                                    });

                                    $group.append($groupHeading);
                                    $group.append($groupList);
                                    $resultsList.append($group);
                                }
                            }
                        } else {
                            var $group = $('<li>').addClass('search-results__group search-results__group--no-results');

                            $('<div>').addClass('search-results__group-title').appendTo($group).html(results.title);
                            $('<div>').addClass('search-results__group-text').appendTo($group).html(results.text);

                            $resultsList.append($group);
                        }

                        $resultsList.mCustomScrollbar({
                            theme: 'dark-thin'
                        });

                        if (!$resultsContainer.hasClass('search-results--visible')) {
                            $resultsContainer.addClass('search-results--visible');
                        }
                    }
                );
            }, 500);
        }
    });

    /* Mobile */
    $('.a-js-mobile-header-toggle-search').on('click', function (e) {
        e.preventDefault();

        var $searchToggle = $(this);
        var $search = $searchToggle.closest('.search');

        if (!$search.hasClass('search--visible')) {
            $searchToggle.closest('.mobile-header').toggleClass('mobile-header--search-visible');
            $search.toggleClass('search--visible');

            setTimeout(function () {
                $searchToggle.toggleClass('search__action--hide');
                $search.find('.search__form-field').focus();
            }, 300);
        } else {
            $searchToggle.toggleClass('search__action--hide');

            setTimeout(function () {
                $searchToggle.closest('.mobile-header').toggleClass('mobile-header--search-visible');
                $search.toggleClass('search--visible');
            }, 300);
        }
    });

})(jQuery);
;(function ($) {
    'use strict';

    $(document).on('click', '.a-js-helper-panel-toggle', function (e) {
        e.preventDefault();

        $(this).closest('.a-helper-panel').toggleClass('a-helper-panel--opened');
    });

    $(document).on('click', function (e) {
        if ($(e.target).closest('.a-helper-panel').length < 1) {
            $('.a-helper-panel').removeClass('a-helper-panel--opened');
        }
    });
})(jQuery);
(function ($) {
    'use strict';

    if ('objectFit' in document.documentElement.style === false) {
        var $images = $('.a-js-has-object-fit');

        if ($images.length > 0) {
            $images.each(function () {
                var $image = $(this);
                var imageSrc = $image.attr('src');

                if ($image.hasClass('a-js-progressive-image')) {
                    imageSrc = $image.data('progressive-image-src');
                }

                if (imageSrc) {
                    $image.closest('.a-object-fit-container').css({
                        'background-image': 'url(' + imageSrc + ')',
                        height: $image.css('height')
                    }).addClass('a-object-fit-container--compat');

                    $image.remove();
                }
            });
        }
    }
})(jQuery);
(function ($) {
    'use strict';

    $('.a-js-send-job-application').ajaxForm({
        url: advice_js_variables.ajax_url,
        dataType: 'json',
        beforeSubmit: function(arr, $form) {
            var $submitButton = $form.find('.a-form__submit');

            $submitButton.addClass('a-form__submit--loading');

            var $fields = $form.find('.a-field');

            if ($fields.length) {
                $fields.each(function () {
                    var $field = $(this);

                    $field.removeClass('a-field--error');
                    $field.find('.a-field__error-text').remove();
                });
            }
        },
        success: function (response, statusText, xhr, $form) {
            var $submitButton = $form.find('.a-form__submit');

            $submitButton.removeClass('a-form__submit--loading');

            if (response['success']) {
                if( $submitButton.length ) {
                    $submitButton.html(response['success']);
                }

                var $fields = $form.find('.a-field');

                if($fields.length) {
                    $fields.each(function() {
                        var $field = $(this);

                        $field.addClass('a-field--disabled');
                        $field.find('.a-field__input, .a-field__textarea').prop('disabled', true);
                    });
                }
            } else if (response['error']) {
                if ($.isArray(response['error']) || typeof response['error'] === 'object') {
                    $.each(response['error'], function (fieldName, errorText) {
                        var $fieldInput = $form.find('[name="' + fieldName + '"]');

                        if($fieldInput.length > 0) {
                            var $field = $fieldInput.closest('.a-field');

                            $('<div>').appendTo($field).html(errorText).addClass('a-field__error-text');

                            $field.addClass('a-field--error');
                        }
                    });
                }
            }
        }
    });
})(jQuery);
(function ($) {
    'use strict';

    $('.a-js-open-modal').on('click', function (e) {
        e.preventDefault();

        var $modal = $($(this).data('target'));

        if ($modal.length) {
            $modal.addClass('a-modal--visible');
            $('body').addClass('a-modal-open');
        }
    });

    $(document).on('click', function (e) {
        var $target = $(e.target);

        if (
            $target.closest('.a-js-close-modal').length
            || $target.closest('.a-modal__content').length < 1
            && $target.closest('.a-js-open-modal').length < 1
        ) {
            if ($target.closest('.a-js-close-modal').length) {
                e.preventDefault();
            }

            $('body').removeClass('a-modal-open');
            $('.a-modal:not(.a-modal--video)').removeClass('a-modal--visible');
        }
    });
})(jQuery);
(function ($) {
    'use strict';

    function updateArrows(api, pageX, pageY) {
        if (navHovered) return;

        var posX = pageX - offset.left,
            posY = pageY - offset.top;

        $arrow.addClass('tparrows--visible');

        if (posX > center) {
            nextSlide = true;
            $arrow.removeClass('tparrows--prev');
            $arrow.addClass('tparrows--next');
        } else {
            nextSlide = false;
            $arrow.addClass('tparrows--prev');
            $arrow.removeClass('tparrows--next');
        }

        api.addClass('revslider--arrow-visible');

        $arrow.css({
            left: (posX - arrowW) + 'px',
            top: (posY - arrowH) + 'px'
        });

        prevX = pageX;
        prevY = pageY;
    }

    var onTouchend = 'ontouchend' in document;

    if (!onTouchend) {
        var $arrow,
            prevX,
            prevY,
            offset,
            arrowW,
            arrowH,
            entered,
            fromClick,
            nextSlide,
            navHovered,
            center;

        var $revSlider = $('rs-module[id^="rev_slider"]');

        if ($revSlider.length > 0) {
            $revSlider.each(function () {
                $revSlider.on('revolution.slide.onloaded', function () {
                    if ($revSlider.find('.tparrows.advice-style-1').length > 0) {
                        var api = $(this).addClass('revslider--style-1');

                        $arrow = api.find('.tp-rightarrow').off('click').removeClass('tparrows--visible');

                        arrowW = $arrow.outerWidth(true) >> 1;
                        arrowH = $arrow.outerHeight(true) >> 1;

                        api.on('mouseenter mouseleave mousemove click', function (e) {
                            switch (e.type) {
                                case 'mouseenter':
                                    center = api.width() >> 1;
                                    offset = api.offset();
                                    entered = true;

                                    updateArrows(api, e.pageX, e.pageY);
                                    break;
                                case 'mouseleave':
                                    entered = false;
                                    $arrow.removeClass('tparrows--visible');
                                    api.removeClass('revslider--arrow-visible');
                                    break;
                                case 'mousemove':
                                    if (!entered) api.trigger('mouseenter');
                                    updateArrows(api, e.pageX, e.pageY);
                                    break;
                                case 'click':
                                    if (api.hasClass('revslider--arrow-visible')) {
                                        fromClick = true;
                                        api[nextSlide ? 'revnext' : 'revprev']();
                                    }
                                    break;
                            }
                        }).on('revolution.slide.onbeforeswap', function () {
                            if (fromClick) {
                                fromClick = false;
                                updateArrows(api, prevX, prevY);
                            }
                        }).find('.tp-bullets, .tp-tabs, .tp-thumbs, .tp-videolayer, .button, a, form > *').on('mouseover mouseout click', function (e) {
                            switch (e.type) {
                                case 'mouseover':
                                    navHovered = true;
                                    $arrow.removeClass('tparrows--visible');
                                    api.removeClass('revslider--arrow-visible');
                                    break;
                                case 'mouseout':
                                    navHovered = false;

                                    updateArrows(api, e.pageX, e.pageY);
                                    break;
                                case 'click':
                                    e.stopPropagation();
                                    break;
                            }
                        });
                    }
                });
            });
        }
    }
})(jQuery);
(function ($) {
    'use strict';

    var $header = $('.header');
    var $progressBar = $('.js-header-page-scroll-progress-bar');

    function headerPageScrollProgress() {
        if ($progressBar.length > 0) {
            var $progressBarLine = $progressBar.find('.progress-bar__line'),
                pageHeight = $('body').outerHeight() - $(window).outerHeight(),
                scrollY = $(window).scrollTop(),
                barWidth = (scrollY / pageHeight * 100);

            $progressBarLine.css('width', barWidth + '%');
        }
    }

    function headerPageScrollProgressWidth() {
        if ($progressBar.length > 0) {
            var $button = $header.find('.header__button');

            if ($button.length > 0 && $button.is(':visible')) {
                $progressBar.css('width', 'calc(100% - ' + $button.outerWidth() + 'px)');
            }
        }
    }

    $(window).on('scroll', function () {
        headerPageScrollProgress();
    });

    $(document).on('ready', function () {
        headerPageScrollProgress();
        headerPageScrollProgressWidth();
    });
})(jQuery);
(function ($) {
    'use strict';

    /* Side Nav */
    $(document).on('click', '.js-side-nav-open-action', function (e) {
        e.preventDefault();

        var $this = $(this);
        var sideNavSelector = $this.data('target');

        if ($(sideNavSelector).length > 0) {
            $(sideNavSelector).addClass('side-nav--visible');
        }
    });

    $(document).on('click', function (e) {
        var $target = $(e.target),
            $sideNav = $('.side-nav');

        if ($target.closest('.side-nav').length < 1 && $target.closest('.js-side-nav-open-action').length < 1 || $target.closest('.js-side-nav-hide-action').length > 0) {
            if ($target.closest('.js-side-nav-hide-action').length > 0) {
                e.preventDefault();
            }

            $sideNav.removeClass('side-nav--visible');
        }
    });


    /* Side Nav Menu */
    $('.side-nav').on('click', '.menu-item-has-children > a[href^="#"], .js-side-nav-open-sub-menu', function (e) {
        e.preventDefault();

        var $this = $(this);

        if($this.hasClass('menu-item-action')) {
            $this = $this.parent();
        }

        var $subMenu = $this.next('.sub-menu');
        var depth = $this.data('depth');
        var $menu = $this.closest('.nav-menu');
        var $sideNav = $this.closest('.side-nav');
        var $titleText = $sideNav.find('.side-nav__title-text');
        var menuItemIds = {};

        $this.closest('.menu-item').addClass('menu-item--visible').siblings().removeClass('menu-item--visible');

        $menu.css('transform', 'translateX(-' + ( 100 * depth ) + '%)');

        $sideNav.find('.side-nav__header').addClass('side-nav__header--title-visible');
        $sideNav.find('.side-nav__sub-menu-hide').attr('depth', depth);

        if ($this.text()) {
            $titleText.html($this.text());
        }

        if ($titleText.attr('menu-item-ids')) {
            menuItemIds = JSON.parse($titleText.attr('menu-item-ids'));
        }
        menuItemIds[depth] = '#' + $this.parent().attr('id');
        $titleText.attr('menu-item-ids', JSON.stringify(menuItemIds));

        if ($subMenu.length > 0) {
            $this.closest('.side-nav__nav-menu-holder').outerHeight($subMenu.outerHeight());
        }
    });

    $(document).on('click', '.js-side-nav-hide-sub-menu', function (e) {
        e.preventDefault();

        var $this = $(this);
        var depth = $this.attr('depth');
        var $sideNav = $this.closest('.side-nav');
        var $menu = $sideNav.find('.nav-menu');
        var $menuHolder = $sideNav.find('.side-nav__nav-menu-holder');
        var $titleText = $sideNav.find('.side-nav__title-text');
        var $subMenuHide = $sideNav.find('.side-nav__sub-menu-hide');

        if (depth > 1) {
            var nextDepth = depth - 1;
            var menuItemIds = JSON.parse($titleText.attr('menu-item-ids'));
            var $menuItem = $(menuItemIds[nextDepth]);
            var subMenuHeight = $menuItem.find('> .sub-menu').outerHeight();
            var title = $menuItem.find('> a').text();

            $menu.css('transform', 'translateX(-' + ( 100 * ( nextDepth ) ) + '%)');
            $subMenuHide.attr('depth', nextDepth);
            $menuHolder.outerHeight(subMenuHeight);
            $titleText.html(title);
        } else {
            $menu.css('transform', '');
            $menuHolder.css('height', '');
            $sideNav.find('.side-nav__header').removeClass('side-nav__header--title-visible');
            $subMenuHide.removeAttr('depth');
            $titleText
                .empty()
                .removeAttr('menu-item-ids');
        }
    });
})(jQuery);
(function($) {
    'use strict';

    /* Widget Categories */
    var $widgetCategories = $('.widget_categories, .widget_product_categories, .a-widget-categories');

    if( $widgetCategories.length ) {
        $widgetCategories.each(function() {
            var $widget = $(this),
                $widgetSelect = $widget.find('select');

            if ($widgetSelect.length) {
                $widgetSelect.select2({
                    width: '100%',
                    minimumResultsForSearch: Infinity
                });
            }

            $widget.find('.cat-item').each(function() {
                var $cat = $(this);
                if( $cat.find(' > .children').length ) {
                    $cat.addClass('cat-item-has-children');
                    if( $cat.hasClass('current-cat-parent') ) {
                        $cat.addClass('cat-item-visible-children');
                    }

                    $cat.on('click', function(e) {
                        var $clickedCat = $(this);

                        if( $(e.target).is('li') && $(e.target).is($clickedCat) ) {
                            $clickedCat.toggleClass('cat-item-visible-children');
                            $clickedCat.find(' > .children').slideToggle(300);
                        }
                    });
                }
            });
        });
    }

    /* Widget Archive */
    var $widgetArchive = $('.widget_archive');

    if ($widgetArchive.length) {
        $widgetArchive.each(function () {
            var $widget = $(this),
                $widgetSelect = $widget.find('select');

            if ($widgetSelect.length) {
                $widget.addClass('widget_archive-dropdown');

                $widgetSelect.select2({
                    width: '100%',
                    minimumResultsForSearch: Infinity
                });
            }
        });
    }

    /* Widget Text */
    var $widgetText = $('.widget_text');
    if ($widgetText.length && $widgetText.find('select').length > 0) {
        $widgetText.find('select').select2({
            width: '100%',
            minimumResultsForSearch: Infinity
        });
    }

})(jQuery);
(function($) {
    'use strict';

    $(document).on('click', '.wc-js-quantity-minus', function (e) {
        e.preventDefault();

        var $self = $(this);
        var $container = $self.closest('.woocommerce-quantity');
        var $input = $container.find('.wc-js-quantity-input');

        var step = parseFloat($input.data('step'));

        var oldQty = parseFloat($input.val());
        var newQty = 0;

        if (oldQty > step) {
            newQty = oldQty - step;
        }

        if (newQty > 0) {
            $input.val(newQty).trigger('change');
        }
    });

    $(document).on('click', '.wc-js-quantity-plus', function (e) {
        e.preventDefault();

        var $self = $(this);
        var $container = $self.closest('.woocommerce-quantity');
        var $input = $container.find('.wc-js-quantity-input');

        var step = parseFloat($input.data('step'));
        var max = ( $input.data('max') !== '' ) ? parseFloat($input.data('max')) : 0;

        var oldQty = parseFloat($input.val());
        var newQty = 0;

        if (max > 0 && oldQty !== max) {
            newQty = oldQty + step;
        } else if (max < 1) {
            newQty = oldQty + step;
        }

        if (newQty > 0) {
            $input.val(newQty).trigger('change');
        }
    });
})(jQuery);