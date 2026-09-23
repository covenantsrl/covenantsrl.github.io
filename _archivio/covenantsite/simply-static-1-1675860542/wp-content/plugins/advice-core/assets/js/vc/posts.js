(function($) {
    'use strict';

    var filters = {};

    $('.a-js-posts-filter-select').select2({
        width: '100%'
    });

    function filterPosts($postsContainer) {
        var data = {
            action: 'advice_filter_post_type',
            post_type: 'post',
            filters: JSON.stringify(filters)
        };

        data._wpnonce = $postsContainer.find('[name="' + data.action + '"]').val();

        var postsParams = $postsContainer.data('params');
        var $filtersSelects = $postsContainer.find('.a-filter__select');
        var $postsRow = $postsContainer.find('.posts__row');
        var $postsItems = $postsRow.find('.posts__item');
        var $postsFooter = $postsContainer.find('.posts__footer');
        var $loadMore = $postsContainer.find('.posts__load-more');

        if (typeof postsParams === 'string') postsParams = JSON.parse(postsParams);

        data.params = JSON.stringify(postsParams);

        $filtersSelects.each(function() {
            $(this).prop('disabled', true);
        });

        var hideTimeout = 400;

        if ($postsItems.length > 0) {
            hideTimeout = 0;

            $postsItems.each(function() {
                var $post = $(this);

                setTimeout(function() {
                    $post.addClass('posts__item--hidden');
                }, hideTimeout);

                hideTimeout += 100;
            });
        }

        setTimeout(function() {
            var $preloader = $('<svg class="posts__preloader a-preloader a-preloader--pulsate a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
                '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
                '<circle cx="22" cy="22" r="0"></circle>' +
                '<circle cx="22" cy="22" r="0"></circle>' +
                '</g>' +
                '</svg>');

            $postsRow.append($preloader).addClass('posts__row--loading');
            $(document).trigger('advice_preloader_activated');
        }, (hideTimeout += 100));

        setTimeout(function() {
            $.ajax({
                url: advice_core_js_variables.ajax_url,
                data: data,
                method: 'POST',
                dataType: 'json',
                success: function (response) {
                    if( response ) {
                        $postsRow.removeClass('posts__row--loading');
                        $postsRow.empty();

                        if (response['success']) {
                            var postsData = response['success'];
                            var showTimeout = 100;

                            postsData.map(function (postData) {
                                var html = '';

                                if (typeof postData.tweets !== 'undefined') {
                                    html += '<div class="posts__item posts__item--hidden">';
                                    html += '<div class="a-tweets a-tweets--card a-tweets--news">';
                                    html += '<div class="a-tweets__header">';
                                    html += '<div class="a-tweets__icon"><span class="mdi mdi-twitter"></span></div>';
                                    html += '<a href="https://twitter.com/' + postsParams.twitter.user_name + '" class="a-tweets__user-name font-family-heading" target="_blank">@' + postsParams.twitter.user_name + '</a>';
                                    html += '</div>';
                                    html += '<div class="a-tweets__slider a-slider a-slider--tweets a-js-slider-tweets">';

                                    if (typeof postData.tweets.error !== 'undefined') {
                                        html += '<div class="a-slider__item a-slider__item--error">' + postData.tweets.error + '</div>';
                                    } else {
                                        postData.tweets.map(function (text) {
                                            html += '<div class="a-slider__item">';
                                            html += '<div class="a-tweet a-tweet--slider-item">';
                                            html += '<div class="a-tweet__text">' + text + '</div>';
                                            html += '</div>';
                                            html += '</div>';
                                        });
                                    }

                                    html += '</div>';
                                    html += '</div>';
                                    html += '</div>';
                                } else {
                                    html += '<div class="posts__item posts__item--hidden post post--' + postsParams.items_style + '">';

                                    if (postData.thumbnailUrl) {
                                        html += '<div class="post__image-container a-object-fit-container">';
                                        html += '<a href="' + postData.link + '" class="post__link" title="' + postData.title + '">';
                                        html += '<img class="post__image a-js-has-object-fit" src="' + postData.thumbnailUrl + '" alt="' + postData.title + '">';
                                        html += '</a>';
                                        html += '</div>';
                                    }

                                    html += '<div class="post__body">';

                                    if (postData.meta) {
                                        html += '<div class="post__meta a-meta a-meta--list-inline">';
                                        $.each(postData.meta, function (index, meta) {
                                            html += '<li class="a-meta__item a-meta__item--' + index + '">';
                                            if (index === 'author') {
                                                html += meta.by;
                                                html += '<a class="a-meta__link" href="' + meta.url + '">' + meta.title + '</a>';
                                            } else {
                                                html += '<a class="a-meta__link" href="' + postData.link + '">';
                                                html += '<time class="a-meta__date" datetime="' + meta.datetime + '">' + meta.date + '</time>';
                                                html += '</a>';
                                            }
                                            html += '</li>';
                                        });
                                        html += '</div>';
                                    }

                                    if (postsParams.layout === 'list') {
                                        html += '<h3 class="post__title">';
                                        html += '<a href="' + postData.link + '" class="post__title-link" title="' + postData.title + '">' + postData.title + '</a>';
                                        html += '</h3>';
                                    } else {
                                        html += '<div class="post__title font-family-heading">';
                                        html += '<a href="' + postData.link + '" class="post__title-link" title="' + postData.title + '">' + postData.title + '</a>';
                                        html += '</div>';
                                    }

                                    if (postData.tags) {
                                        var tags = [];

                                        $.each(postData.tags, function (index, tag) {
                                            tags.push('<a href="' + tag.link + '" rel="' + tag.name + '">' + tag.name + '</a>');
                                        });

                                        html += '<div class="post__tags">' + tags.join(', ') + '</div>';
                                    }

                                    html += '</div>';
                                    html += '</div>';
                                }

                                var $html = $(html);

                                $html.appendTo($postsRow);

                                if (typeof postData.tweets !== 'undefined') {
                                    $(document).trigger('advice_loaded_tweets_slider');
                                }

                                setTimeout(function() {
                                    $html.removeClass('posts__item--hidden')
                                }, showTimeout);

                                showTimeout += 100;
                            });

                            setTimeout(function() {
                                if ($loadMore.length > 0) {
                                    if (response['post_count']) {
                                        var loadMoreParams = $loadMore.data('params');

                                        if (typeof loadMoreParams === 'string') loadMoreParams = JSON.parse(loadMoreParams);

                                        loadMoreParams.post_count = response['post_count'];

                                        $loadMore.data('params', JSON.stringify(loadMoreParams)).removeClass('button--hidden');

                                        $postsFooter.removeClass('posts__footer--hidden');
                                    } else {
                                        $loadMore.addClass('button--hidden');
                                        $postsFooter.addClass('posts__footer--hidden');
                                    }
                                }
                            }, (showTimeout + 100));
                        } else if( response['error'] ) {
                            var errorData = response['error'];
                            var html = '<div class="posts__error">';

                            html += '<h3 class="posts__error-title">' + errorData.title + '</h3>';
                            html += '<div class="posts__error-text">' + errorData.text + '</div>';
                            html += '</div>';

                            $(html).appendTo($postsRow);
                        }

                        $filtersSelects.each(function () {
                            var $select = $(this);
                            var filterName = $select.attr('name');

                            $select.prop('disabled', false);

                            var $options = $select.find('option');

                            $options.each(function () {
                                var $option = $(this);
                                var filterVal = $option.html();

                                if (!$option.data('label-is-value')) {
                                    filterVal = parseFloat($option.attr('value'));
                                }

                                if (typeof filters[filterName] !== 'undefined' && filters[filterName].value.indexOf(filterVal) !== -1) {
                                    $option.prop('disabled', true);
                                } else {
                                    $option.prop('disabled', false);
                                }
                            });

                            $filtersSelects.val('');
                            $filtersSelects.select2('destroy');
                            $filtersSelects.select2({
                                width: '100%'
                            });
                        });
                    }
                }
            });
        }, (hideTimeout += 100));
    }

    $(document).on('click', '.a-js-delete-posts-filters-tag', function (e) {
        e.preventDefault();

        var $tag = $(this);
        var filterName = $tag.data('filter-name');
        var filterVal = $tag.data('filter-val');

        if (typeof filterVal === 'string') {
            filterVal = $('<div>').text(filterVal).html();
        }

        var filterValIndex = filters[filterName].value.indexOf(filterVal);
        var $otherTags = $tag.closest('.a-tags__item').siblings();

        if (filterValIndex !== -1) {
            filters[filterName].value.splice(filterValIndex, 1);
        }

        filterPosts($tag.closest('.posts'));

        if ($otherTags.length < 1) {
            $tag.closest('.a-filters__tags').remove();
        } else {
            $tag.parent().remove();
        }
    });

    $(document).on('click', '.a-js-delete-posts-filters-tags', function(e) {
        e.preventDefault();

        var $actionDelete = $(this);

        $('.a-js-posts-filter-select').each(function() {
            $(this).val('').trigger('change');
        });

        filters = {};

        filterPosts($actionDelete.closest('.posts'));

        $actionDelete.closest('.a-filters__tags').remove();
    });

    $('.a-js-posts-filter-select').on('change', function () {
        var $select = $(this);
        var value = $select.val();
        var $postsContainer = $select.closest('.posts');
        var $filters = $postsContainer.find('.posts__filters');
        var $filtersTags = $postsContainer.find('.a-filters__tags');

        if (value) {
            var $selectOption = $select.find('[value="' + value + '"]');
            var filterName = $select.attr('name');
            var filterValue = $selectOption.html();

            if (!$selectOption.data('label-is-value')) {
                filterValue = parseFloat(value);
            }

            $selectOption.prop('disabled', true);

            if (typeof filters[filterName] === 'undefined') {
                filters[filterName] = {
                    'value': []
                };
            }

            filters[filterName].parameters = $select.data('parameters');
            filters[filterName].value.push(filterValue);

            var tagName = $selectOption.html();

            if ($filtersTags.length < 1) {
                var deleteFiltersTagsTitle = $filters.data('tags-delete-title');
                var filtersTagsHtml = '<div class="a-filters__tags a-tags a-tags--posts-filters-tags">';
                filtersTagsHtml += '<ul class="a-tags__list">';
                filtersTagsHtml += '<li class="a-tags__item">';
                filtersTagsHtml += '<a href="#" data-filter-name="' + filterName + '" data-filter-val="' + filterValue + '" class="a-tags__tag a-js-delete-posts-filters-tag">' + tagName + ' <span class=" a-tags__tag-icon mdi mdi-close"></span></a>';
                filtersTagsHtml += '</li>';
                filtersTagsHtml += '</ul>';
                filtersTagsHtml += '<a href="#" class="a-tags__delete a-js-delete-posts-filters-tags">' + deleteFiltersTagsTitle + '</a>';
                filtersTagsHtml += '</div>';

                $(filtersTagsHtml).appendTo($filters);
            } else {
                var $tagsList = $filtersTags.find('.a-tags__list');
                var tagsItemHtml = '<li class="a-tags__item"><a href="#" data-filter-name="' + filterName + '" data-filter-val="' + filterValue + '" class="a-tags__tag a-js-delete-posts-filters-tag">' + tagName + ' <span class=" a-tags__tag-icon mdi mdi-close"></span></a></li>';
                $(tagsItemHtml).appendTo($tagsList);

            }

            filterPosts($postsContainer);
        }
    });

    $('.posts').on('click', '.a-js-posts-load-more', function(e) {
        e.preventDefault();

        var $loadMore = $(this).addClass('button--hidden');
        var $postsFooter = $loadMore.closest('.posts__footer');
        var $preloader = $('<svg class="a-preloader a-preloader--load-more a-preloader--pulsate a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
            '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
            '<circle cx="22" cy="22" r="0"></circle>' +
            '<circle cx="22" cy="22" r="0"></circle>' +
            '</g>' +
            '</svg>');

        $postsFooter.append($preloader);

        $(document).trigger('advice_preloader_activated');

        var $postsContainer = $loadMore.closest('.posts');
        var $postsRow = $postsContainer.find('.posts__row');
        var postsParams = $postsContainer.data('params');

        var data = {
            action: 'advice_load_more_post_type',
            post_type: 'post',
            filters: JSON.stringify(filters)
        };

        data._wpnonce = $postsContainer.find('[name="' + data.action + '"]').val();

        var params = $loadMore.data('params');

        if (typeof params === 'string') params = JSON.parse(params);

        if (params) {
            data.params = JSON.stringify(params);
        }

        $.ajax({
            url: advice_core_js_variables.ajax_url,
            data: data,
            method: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response) {
                    if( response['success'] ) {
                        $preloader.remove();

                        var postsData = response['success'];
                        var showTimeout = 100;

                        postsData.map(function (postData) {
                            var html = '<div class="posts__item posts__item--hidden post post--' + postsParams.items_style + '">';

                            if (postData.thumbnailUrl) {
                                html += '<div class="post__image-container a-object-fit-container">';
                                html += '<a href="' + postData.link + '" class="post__link" title="' + postData.title + '">';
                                html += '<img class="post__image a-js-has-object-fit" src="' + postData.thumbnailUrl + '" alt="' + postData.title + '">';
                                html += '</a>';
                                html += '</div>';
                            }

                            html += '<div class="post__body">';

                            if (postData.meta) {
                                html += '<div class="post__meta a-meta a-meta--list-inline">';
                                $.each(postData.meta, function (index, meta) {
                                    html += '<li class="a-meta__item a-meta__item--' + index + '">';
                                    if (index === 'author') {
                                        html += meta.by;
                                        html += '<a class="a-meta__link" href="' + meta.url + '">' + meta.title + '</a>';
                                    } else {
                                        html += '<a class="a-meta__link" href="' + postData.link + '">';
                                        html += '<time class="a-meta__date" datetime="' + meta.datetime + '">' + meta.date + '</time>';
                                        html += '</a>';
                                    }
                                    html += '</li>';
                                });
                                html += '</div>';
                            }

                            if (postsParams.layout === 'list') {
                                html += '<h3 class="post__title">';
                                html += '<a href="' + postData.link + '" class="post__title-link" title="' + postData.title + '">' + postData.title + '</a>';
                                html += '</h3>';
                            } else {
                                html += '<div class="post__title font-family-heading">';
                                html += '<a href="' + postData.link + '" class="post__title-link" title="' + postData.title + '">' + postData.title + '</a>';
                                html += '</div>';
                            }

                            if (postData.tags) {
                                var tags = [];

                                $.each(postData.tags, function (index, tag) {
                                    tags.push('<a href="' + tag.link + '" rel="' + tag.name + '">' + tag.name + '</a>');
                                });

                                html += '<div class="post__tags">' + tags.join(', ') + '</div>';
                            }

                            html += '</div>';
                            html += '</div>';

                            var $html = $(html);

                            $html.appendTo($postsRow);

                            setTimeout(function() {
                                $html.removeClass('posts__item--hidden')
                            }, showTimeout);

                            showTimeout += 100;
                        });

                        if (response['post_count']) {
                            params.post_count = response['post_count'];
                            $loadMore.data('params', JSON.stringify(params)).removeClass('button--hidden');
                        } else {
                            $postsFooter.addClass('posts__footer--hidden');
                        }
                    }
                }
            }
        });
    });
})(jQuery);