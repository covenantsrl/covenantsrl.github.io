;(function ($) {
    'use strict';

    $(document).on('ready', function () {
        var sliderOptions = {
                dots: true,
                arrows: false,
                speed: 700,
                autoplay: true,
                rtl: $('html').is('[dir]'),
                fade: true,
                cssEase: 'ease'
            },
            $sliderTweets = $('.a-js-slider-tweets');

        if ($sliderTweets.length > 0) {
            $sliderTweets.slick(sliderOptions);
        }

        $('.js-filter-publications').on('click', function (e) {
            e.preventDefault();

            var $filter = $(this),
                $filterParent = $filter.closest('.publications__filter-item');

            if (!$filterParent.hasClass('publications__filter-item--active')) {
                var filterVal = $filter.data('filter'),
                    $publications = $filter.closest('.publications'),
                    $publicationsRow = $publications.find('.publications__row'),
                    timeOut = 0;

                $filterParent
                    .addClass('publications__filter-item--active')
                    .siblings()
                    .removeClass('publications__filter-item--active');

                $publicationsRow.find('.publication').each(function () {
                    var $publication = $(this);

                    setTimeout(function () {
                        $publication.addClass('publication--hidden');
                    }, timeOut);

                    timeOut += 100;
                });

                setTimeout(function () {
                    var $preloader = $('<svg class="publications__preloader a-preloader a-preloader--pulsate a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
                        '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
                        '<circle cx="22" cy="22" r="0"></circle>' +
                        '<circle cx="22" cy="22" r="0"></circle>' +
                        '</g>' +
                        '</svg>');

                    $publicationsRow.append($preloader).addClass('publications__row--loading');

                    $(document).trigger('advice_preloader_activated');
                }, (timeOut += 100));

                var data = {
                    action: 'advice_filter_publications',
                    filter_value: filterVal,
                    params: $publications.data('params'),
                    _wpnonce: $publications.find('[name="advice_filter_publications"]').val()
                };

                setTimeout(function() {
                    $.ajax({
                        url: advice_core_js_variables.ajax_url,
                        data: data,
                        method: 'POST',
                        dataType: 'json',
                        success: function (response) {
                            if (response['success']) {
                                var showTimeout = 0;

                                $publicationsRow.removeClass('publications__row--loading');
                                $publicationsRow.empty();

                                response['success'].map(function (publication) {
                                    var publicationClasses = ['publications__item', 'publication', 'publication--' + publication.style, 'publication--hidden', 'publication--type-' + publication.type];

                                    if (publication.type !== 'tweets') {
                                        if (publication.imgSrc) {
                                            publicationClasses.push('publication--has-image');
                                        } else {
                                            publicationClasses.push('publication--has-not-image');
                                        }
                                    }

                                    if (publication.large) {
                                        publicationClasses.push('publications__item--large');
                                        publicationClasses.push('publication--large');
                                    }

                                    var html = '<div class="' + publicationClasses.join(' ') + '">';

                                    if (publication.type === 'tweets') {
                                        var tweetsClasses = ['a-tweets', 'a-tweets--card', 'a-tweets--publication'];

                                        if (publication.large) {
                                            tweetsClasses.push('a-tweets--large');
                                        }

                                        html += '<div class="' + tweetsClasses.join(' ') + '">';
                                        html += '<div class="a-tweets__header">';
                                        html += '<div class="a-tweets__icon"><span class="mdi mdi-twitter"></span></div>';
                                        html += '<a href="https://twitter.com/' + publication.userName + '" class="a-tweets__user-name font-family-heading" target="_blank">@' + publication.userName + '</a>';
                                        html += '</div>';
                                        html += '<div class="a-tweets__slider a-slider a-slider--tweets a-js-slider-tweets">';
                                        if (publication.error) {
                                            html += '<div class="a-slider__item a-slider__item--error">' + publication.error + '</div>';
                                        } else {
                                            var tweetClasses = ['a-tweet', 'a-tweet--slider-item'];

                                            if (publication.large) {
                                                tweetClasses.push('a-tweet--large');
                                            }

                                            $.each(publication.tweets, function(index, tweet) {
                                                html += '<div class="a-slider__item">';
                                                html += '<div class="' + tweetClasses.join(' ') + '">';
                                                html += '<div class="a-tweet__text">' + tweet + '</div>';
                                                html += '</div>';
                                                html += '</div>';
                                            });
                                        }
                                        html += '</div>';
                                        html += '</div>';
                                    } else {
                                        html += '<div class="publication__inner">';
                                        
                                        if (publication.imgSrc) {
                                            html += '<div class="publication__image-container a-object-fit-container">';
                                            html += '<span class="publication__type">' + publication.name + '</span>';
                                            html += '<a href="' + publication.link + '" class="publication__link">';
                                            html += '<img class="publication__image a-js-has-object-fit" src="' + publication.imgSrc + '" alt="' + publication.title.full + '">';
                                            html += '</a>';
                                            html += '</div>';
                                        }

                                        html += '<div class="publication__details">';

                                        if (!publication.imgSrc) {
                                            html += '<span class="publication__type">' + publication.name + '</span>';
                                        }

                                        html += '<ul class="publication__meta a-meta a-meta--list-inline">';

                                        $.each(publication.meta, function(index, meta) {
                                            if (index === 'author') {
                                                html += '<li class="a-meta__item a-meta__item--' + index + '">';
                                                html += meta.by;

                                                if (typeof meta.authors !== 'undefined') {
                                                    var authors = [];

                                                    $.each(meta.authors, function (index, author) {
                                                        authors.push('<a class="a-meta__link" href="' + author.url + '">' + author.name + '</a>');
                                                    });

                                                    html += authors.join(', ');
                                                } else {
                                                    html += '<a class="a-meta__link" href="' + meta.authorUrl + '">' + meta.authorName + '</a>';
                                                }

                                                html += '</li>';
                                            } else {
                                                html += '<li class="a-meta__item a-meta__item--' + index + '">';
                                                html += '<a class="a-meta__link" href="' + publication.link + '">';
                                                html += '<time class="a-meta__date" datetime="' + meta.datetime + '">' + meta.date + '</time>';
                                                html += '</a>';
                                                html += '</li>';
                                            }
                                        });

                                        html += '</ul>';
                                        html += '<div class="publication__title a-font-family-heading">';

                                        var publicationTitle = publication.title.default;

                                        if (publication.large) {
                                            publicationTitle = publication.title.large;
                                        }

                                        html += '<a class="publication__title-link" href="' + publication.link + '" rel="bookmark" title="' + publication.title.full + '">' + publicationTitle + '</a>';
                                        html += '</div>';

                                        if (publication.tags) {
                                            var tags = [];

                                            $.each(publication.tags, function (index, tag) {
                                                tags.push('<a href="' + tag.link + '">' + tag.name + '</a>');
                                            });

                                            html += '<div class="publication__tags">' + tags.join(', ') + '</div>';
                                        }

                                        html += '</div>';
                                        html += '</div>';
                                    }

                                    html += '</div>';

                                    var $html = $(html);

                                    $publicationsRow.append($html);

                                    if ($html.hasClass('publication--type-tweets')) {
                                        var $slider = $html.find('.a-js-slider-tweets');

                                        if ($slider.length > 0) {
                                            $slider.slick(sliderOptions);
                                        }
                                    }

                                    setTimeout(function () {
                                        $html.removeClass('publication--hidden');
                                    }, (showTimeout += 100));
                                });
                            }
                        }
                    });
                }, (timeOut + 100));
            }

        });

    });

})(jQuery);