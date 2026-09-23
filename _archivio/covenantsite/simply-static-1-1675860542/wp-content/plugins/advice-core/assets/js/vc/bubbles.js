(function ($) {
    'use strict';

    var bubblesData = {};
    var smMedia = window.matchMedia('(max-width: 767px)');

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min)) + min;
    }

    function hypot(x, y, z) {
        if (typeof Math.hypot === 'function') {
            return Math.hypot.apply(null, arguments);
        }

        var length = arguments.length;
        var args = [];
        var max = 0;

        for (var i = 0; i < length; i++) {
            var n = arguments[i];
            n = +n;

            if (n === Infinity || n === -Infinity) {
                return Infinity;
            }

            n = Math.abs(n);

            if (n > max) {
                max = n;
            }

            args[i] = n;
        }

        if (max === 0) {
            max = 1;
        }

        var sum = 0;
        var compensation = 0;

        for (var j = 0; j < length; j++) {
            var m = args[j] / max;
            var summand = m * m - compensation;
            var preliminary = sum + summand;
            compensation = (preliminary - sum) - summand;
            sum = preliminary;
        }

        return Math.sqrt(sum) * max;
    }

    function cloningData(data) {
        var originalNumber = data.length;
        var cloneNumber = 30 - originalNumber;
        var clonedNumber = 0;

        for (var i = 0; cloneNumber > i; i++) {

            data.push(data[clonedNumber]);

            if (clonedNumber === originalNumber) {
                clonedNumber = 0;
            } else {
                clonedNumber++;
            }
        }

        return data;
    }

    function getHeight($container, data) {
        var height = $container.height();

        if (!smMedia.matches) {
            $container.css('height', 'auto').addClass('clearfix');

            for (var i = 0; data.length > i; i++) {
                $('<div>').css({
                    'width': '60px',
                    'height': '60px',
                    'float': 'left',
                    'margin': '10px'
                }).appendTo($container);
            }

            if (height < $container.height()) {
                height = $container.height();
            }

            $container.empty().css('height', '').removeClass('clearfix');
        }

        return height;
    }

    function fadeInElements($elements) {
        var delay = 10;

        $elements.each(function () {
            var $this = $(this);

            setTimeout(function () {
                $this.addClass('a-bubbles__bubble--fade');
            }, delay);

            delay += 10;
        });
    }

    function fadeOutElements($elements) {
        var delay = 10;

        $elements.each(function () {
            var $this = $(this);

            setTimeout(function () {
                $this.removeClass('a-bubbles__bubble--fade');
            }, delay);

            delay += 10;
        });
    }

    var fadeOutTimer;

    function initTooltip($element, id) {
        $element.on('mouseenter mouseleave', function (event) {
            var $tooltip = $('.a-js-bubbles-tooltip');
            var linkTransform = $element.find('.a-bubbles__bubble-link').css('transform');
            var linkScale = '1';

            if (linkTransform !== 'none' && typeof linkTransform.split(/[()]/)[1] !== 'undefined') {
                linkScale = linkTransform.split(/[()]/)[1].split(',')[0]
            }

            if (event.type === 'mouseenter' && linkScale === '1') {
                clearTimeout(fadeOutTimer);

                var position = $element.offset();

                if ($tooltip.length < 1) {
                    $tooltip = $('<div>').addClass('a-bubbles__bubble-tooltip a-tooltip a-tooltip--bubbles a-js-bubbles-tooltip');

                    $('<div>').appendTo($tooltip).addClass('a-tooltip__title a-font-family-heading');

                    if ($element.data('tooltip-subtitle') !== '') {
                        $('<div>').appendTo($tooltip).addClass('a-tooltip__subtitle');
                        $tooltip.addClass('a-tooltip--has-subtitle');
                    }

                    $('<div>').appendTo($tooltip).addClass('a-tooltip__description');

                    $('body').append($tooltip);
                }

                $tooltip.find('.a-tooltip__title').html($element.data('tooltip-title'));

                var $tooltipSubtitle = $tooltip.find('.a-tooltip__subtitle');

                if ($tooltipSubtitle.length > 0 && $element.data('tooltip-subtitle') === '') {
                    $tooltip.removeClass('a-tooltip--has-subtitle');
                    $tooltipSubtitle.remove();
                } else if ($tooltipSubtitle.length < 1 && $element.data('tooltip-subtitle') !== '') {
                    $tooltipSubtitle = $('<div>').insertAfter($tooltip.find('.a-tooltip__title')).addClass('a-tooltip__subtitle');
                }

                if ($tooltipSubtitle.length > 0) {
                    $tooltipSubtitle.html($element.data('tooltip-subtitle'));
                }

                $tooltip.find('.a-tooltip__description').html($element.data('tooltip-description'));

                var tooltipPositionY = (position.top - (($tooltip.outerHeight() - $element.height()) / 2));
                var tooltipPositionX = position.left + $element.width();

                if ((tooltipPositionX + $tooltip.outerWidth() + 40) > $(window).width()) {
                    tooltipPositionX = position.left - $tooltip.outerWidth();
                    $tooltip.addClass('a-tooltip--left');
                } else if ($tooltip.hasClass('a-tooltip--left')) {
                    $tooltip.removeClass('a-tooltip--left');
                }

                $tooltip.css({
                    top: tooltipPositionY + 'px',
                    left: tooltipPositionX + 'px'
                }).addClass('a-tooltip--active');

                $element.removeClass('a-bubbles__bubble--fade').addClass('a-bubbles__bubble--active');

                fadeInElements($element.siblings());

                if (bubblesData[id].settings.animate) {
                    bubblesData[id].bubblesAnimation = cancelAnimationFrame(bubblesData[id].bubblesAnimation);
                }
            } else if (event.type === 'mouseleave' && linkScale === '1') {
                $tooltip.removeClass('a-tooltip--active');
                $element.removeClass('a-bubbles__bubble--active');
                fadeInElements($element);

                fadeOutTimer = setTimeout(function () {
                    fadeOutElements($element);
                    fadeOutElements($element.siblings());

                    if (bubblesData[id].settings.animate) {
                        bubblesData[id].bubblesAnimation = requestAnimationFrame(animateBubbles);
                    }
                }, 600);
            }
        });
    }

    function addBubble(options, data, id) {
        if (typeof data.title === 'undefined') data.title = '';
        if (typeof data.subtitle === 'undefined') data.subtitle = '';
        if (typeof data.description === 'undefined') data.description = '';
        if (typeof data.link === 'undefined') data.link = '#';
        if (typeof data.img === 'undefined') data.img = '';

        var $element = $('<div>').css({
            left: options.x + 'px',
            top: options.y + 'px',
            width: options.size + 'px',
            height: options.size + 'px'
        })
            .data('tooltip-title', data.title)
            .data('tooltip-description', data.description)
            .data('tooltip-subtitle', data.subtitle)
            .addClass('a-bubbles__bubble');

        var $link = $('<a>')
            .attr('href', data.link)
            .css('background-image', 'url(' + data.img + ')')
            .addClass('a-bubbles__bubble-link');

        if (data.link === '#') {
            $link.addClass('a-bubbles__bubble-link--disabled');
        }

        $link.appendTo($element);

        bubblesData[id].$container.append($element);

        if (!smMedia.matches) {
            initTooltip($element, id);
        }
    }

    function animateBubble($bubble, id) {
        var viewportHeight = bubblesData[id].$container.height();
        var bubbleHeight = $bubble.height();
        var $bubbleLink = $bubble.find('.a-bubbles__bubble-link');
        var position = $bubble.position();
        var positionY = position.top;
        var transform = $bubble.css('transform');
        var translateY = 0;
        var scale = 1;

        if (transform !== 'none') {
            translateY = transform.split(/[()]/)[1].split(',')[5];
        }

        if (positionY > 0) {
            translateY -= .2;
        } else {
            translateY = $bubble.parent().data('height') - parseFloat($bubble.css('top'));
        }

        if (positionY <= 5) {
            scale = 0;
        } else if ((positionY + bubbleHeight) <= viewportHeight) {
            scale = ((positionY + bubbleHeight) - positionY) / bubbleHeight;
            scale = +scale.toFixed(2);
        } else {
            scale = 0;
        }

        $bubbleLink.css('transform', 'scale(' + scale + ')');

        $bubble.css('transform', 'translateY(' + translateY + 'px)');
    }

    function animateBubbles() {
        $.each(bubblesData, function (id, data) {
            data.$container.find('.a-bubbles__bubble').each(function () {
                animateBubble($(this), id);
            });

            bubblesData[id].bubblesAnimation = requestAnimationFrame(animateBubbles);
        });
    }

    function addBubbles($container, id) {
        var loopLimit = 0;
        var width = $container.width();
        var height = getHeight($container, bubblesData[id].data);
        var data = bubblesData[id].data;

        $container.data('height', height);

        bubblesData[id].bubbles = [];

        while (bubblesData[id].bubbles.length < data.length) {
            var bubble = {
                size: getRandomInt(29, 90)
            };

            bubble.x = getRandomInt(0, (width - bubble.size));
            bubble.y = getRandomInt(0, (height - bubble.size));

            var overlapping = false;

            for (var i = 0; bubblesData[id].bubbles.length > i; i++) {
                var other = bubblesData[id].bubbles[i];
                var dist = hypot((other.x - bubble.x), (other.y - bubble.y));

                if (dist < bubble.size + other.size) {
                    overlapping = true;
                    break;
                }
            }

            if (!overlapping) {
                addBubble(bubble, data[bubblesData[id].bubbles.length], id);

                bubblesData[id].bubbles.push(bubble);
            }

            loopLimit++;

            if (loopLimit > 10000) {
                break;
            }
        }
    }

    function createBubbles() {
        $.each(bubblesData, function (id, data) {
            addBubbles(data.$container, id);

            if (bubblesData[id].settings.animate && !smMedia.matches) {
                bubblesData[id].bubblesAnimation = requestAnimationFrame(animateBubbles);
            }
        });
    }

    function initBubbles() {
        var $bubbles = $('.a-js-bubbles-init');

        if ($bubbles.length > 0) {
            $bubbles.each(function () {
                var $self = $(this);
                var bubblesDataItem = {
                    $container: $self,
                    data: $self.data('data'),
                    settings: $self.data('settings')
                };

                if (bubblesDataItem.settings.duplicate && bubblesDataItem.data.length < 30) {
                    bubblesDataItem.data = cloningData(bubblesDataItem.data);
                }

                bubblesData[$self.attr('id')] = bubblesDataItem;
            });

            createBubbles();
        }
    }

    function updateBubbles() {
        if (Object.keys(bubblesData).length > 0) {
            $.each(bubblesData, function (id, data) {
                if (bubblesData[id].settings.animate && typeof bubblesData[id].bubblesAnimation !== 'undefined') {
                    bubblesData[id].bubblesAnimation = cancelAnimationFrame(bubblesData[id].bubblesAnimation);
                }

                data.$container.empty();

                addBubbles(data.$container, id);

                if (bubblesData[id].settings.animate && !smMedia.matches && typeof bubblesData[id].bubblesAnimation === 'undefined') {
                    bubblesData[id].bubblesAnimation = requestAnimationFrame(animateBubbles);
                }
            });
        }
    }

    $(document).on('ready', initBubbles);

    var resizeTimer;

    $(window).on('resize', function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            updateBubbles();
        }, 250);
    });
})(jQuery);