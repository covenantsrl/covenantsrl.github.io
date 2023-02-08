(function ($) {
    'use strict';

    $('.a-js-video-open-modal').on('click', function (e) {
        e.preventDefault();

        var $this = $(this),
            templateId = $this.data('modal-template-id'),
            $modal = $('[data-modal-id="' + templateId + '"]'),
            videoSrc = $this.data('video-src'),
            loadTemplate = false;

        if ($modal.length < 1) {
            var $template = $('#' + templateId);

            if ($template.length > 0) {
                $modal = $(JSON.parse($template.html())).appendTo('body');
            }

            loadTemplate = true;
        }

        var modalW = parseFloat($modal.find('.a-modal__content').css('max-width')) + 65,
            windowW = $(window).width();

        if (modalW > windowW) {
            $modal.addClass('a-modal--close-button-top');
        }

        var $iframe = $modal.find('iframe');

        if (videoSrc) {
            $iframe.attr('src', videoSrc);
        }

        if (loadTemplate) {
            setTimeout(function () {
                $modal.addClass('a-modal--visible');
            }, 100);

            loadTemplate = false;
        } else {
            $modal.addClass('a-modal--visible');
        }

        var preloader = '<svg class="a-modal__preloader a-preloader a-preloader--pulsate a-preloader--center a-preloader--light a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
            '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
            '<circle cx="22" cy="22" r="0"></circle>' +
            '<circle cx="22" cy="22" r="0"></circle>' +
            '</g>' +
            '</svg>';

        var $preloader = $(preloader);

        $modal.find('.a-modal__content').append($preloader);

        $(document).trigger('advice_preloader_activated');

        $iframe.on('load', function () {
            if ($iframe.attr('src')) {
                setTimeout(function() {
                    $modal.addClass('a-modal--video-loaded');
                    $preloader.remove();
                }, 1000);
            }
        });

        $modal.on('click', function (e) {
            var $target = $(e.target);

            if ($target.closest('.a-modal__content').length === 0 || $target.closest('.a-js-modal-close').length > 0) {
                if ($target.closest('.a-js-modal-close').length > 0) {
                    e.preventDefault();
                }

                $modal.removeClass('a-modal--visible a-modal--video-loaded a-modal--close-button-top');

                $iframe.attr('src', '');
            }
        });
    });

    $('.a-js-video-play').on('click', function (e) {
        e.preventDefault();

        var $action = $(this);
        var videoSrc = $action.data('video-src');
        var $videoContainer = $action.closest('.a-video');
        var $videoIframe = $videoContainer.find('iframe');

        if ($videoIframe.length > 0 && videoSrc) {
            var preloader = '<svg class="a-video__preloader a-preloader a-preloader--center a-preloader--pulsate a-preloader--light a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
                '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
                '<circle cx="22" cy="22" r="0"></circle>' +
                '<circle cx="22" cy="22" r="0"></circle>' +
                '</g>' +
                '</svg>';

            var $preloader = $(preloader);

            $action.append($preloader);
            $(document).trigger('advice_preloader_activated');

            $videoContainer.addClass('a-video--load');
            $videoIframe.attr('src', videoSrc);

            $videoIframe.on('load', function () {
                setTimeout(function() {
                    $preloader.remove();
                    $videoContainer.removeClass('a-video--load').addClass('a-video--play');
                }, 1000);
            });
        }
    });

    var resizeTimer;

    $(window).on('resize', function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            var $modalVisible = $('.a-modal--visible');

            if ($modalVisible.length > 0) {
                var windowW = $(window).width();
                var modalW = parseFloat($modalVisible.find('.a-modal__content').css('max-width')) + 65;

                if (modalW > windowW) {
                    $modalVisible.addClass('a-modal--close-button-top');
                } else {
                    $modalVisible.removeClass('a-modal--close-button-top');
                }
            }
        }, 250);
    });

})(jQuery);