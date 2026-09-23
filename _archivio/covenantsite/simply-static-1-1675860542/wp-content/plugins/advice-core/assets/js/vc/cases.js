(function($) {
    'use strict';

    var filters = {};

    $('.a-js-cases-filter-select').select2({
        width: '100%'
    });

    function filterCases($casesContainer) {
        var data = {
            action: 'advice_filter_post_type',
            post_type: 'advice_case',
            filters: JSON.stringify(filters)
        };

        var casesParams = $casesContainer.data('params');
        var $filtersSelects = $casesContainer.find('.a-filter__select');
        var $casesRow = $casesContainer.find('.cases__row');
        var $casesItems = $casesRow.find('.cases__item');
        var $casesFooter = $casesContainer.find('.cases__footer');
        var $loadMore = $casesContainer.find('.cases__load-more');
        var hideTimeout = 400;

        data._wpnonce = $casesContainer.find('[name="' + data.action + '"]').val();

        if (typeof casesParams === 'string') casesParams = JSON.parse(casesParams);

        if (casesParams) {
            data.params = JSON.stringify(casesParams);
        }

        $filtersSelects.each(function() {
            $(this).prop('disabled', true);
        });

        if( $casesItems.length > 0 ) {
            hideTimeout = 0;

            $casesItems.each(function() {
                var $service = $(this);

                setTimeout(function() {
                    $service.addClass('cases__item--hidden');
                }, hideTimeout);

                hideTimeout += 100;
            });
        }

        setTimeout(function() {
            var $preloader = $('<svg class="cases__preloader a-preloader a-preloader--pulsate a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
                '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
                '<circle cx="22" cy="22" r="0"></circle>' +
                '<circle cx="22" cy="22" r="0"></circle>' +
                '</g>' +
                '</svg>');

            $casesRow.append($preloader).addClass('cases__row--loading');
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
                        $casesRow.removeClass('cases__row--loading');
                        $casesRow.empty();

                        if (response['success']) {
                            var casesData = response['success'];
                            var showTimeout = 100;

                            casesData.map(function (caseData) {
                                var caseClasses = ['cases__item', 'cases__item--hidden', 'case', 'case--' + casesParams.items_style];

                                if (!caseData.thumbnailUrl) {
                                    caseClasses.push('case--has-not-image')
                                }

                                var html = '<div class="' + caseClasses.join(' ') + '">';

                                html += '<div class="case__image-container a-object-fit-container">';
                                html += '<a href="' + caseData.link + '" class="case__link" title="' + caseData.title + '">';

                                if (caseData.thumbnailUrl) {
                                    html += '<img class="case__image a-js-has-object-fit" src="' + caseData.thumbnailUrl + '">';
                                }

                                html += '</a>';
                                html += '<h4 class="case__title case__title--style-1">';
                                html += '<a href="' + caseData.link + '" class="case__title-link" title="' + caseData.title + '">' + caseData.title + '</a>';
                                html += '</h4>';
                                html += '</div>';

                                html += '<div class="case__details">';

                                if (caseData.excerpt) {
                                    html += '<div class="case__excerpt">' + caseData.excerpt + '</div>';
                                }

                                if(caseData.tags) {
                                    var tags = [];

                                    $.each(caseData.tags, function(index, tag) {
                                        tags.push('<a href="' + tag.link + '" rel="' + tag.name + '">' + tag.name + '</a>');
                                    });

                                    html += '<div class="case__tags">' + tags.join(', ') + '</div>';
                                }
                                html += '</div>';
                                html += '</div>';

                                var $html = $(html);

                                $html.appendTo($casesRow);

                                setTimeout(function() {
                                    $html.removeClass('cases__item--hidden')
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

                                        $casesFooter.removeClass('cases__footer--hidden');
                                    } else {
                                        $loadMore.addClass('button--hidden');
                                        $casesFooter.addClass('cases__footer--hidden');
                                    }
                                }
                            }, (showTimeout + 100));
                        } else if( response['error'] ) {
                            var errorData = response['error'];
                            var html = '<div class="cases__error">';
                            html += '<h3 class="cases__error-title">' + errorData.title + '</h3>';
                            html += '<div class="cases__error-text">' + errorData.text + '</div>';
                            html += '</div>';

                            $(html).appendTo($casesRow);
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
        }, (hideTimeout + 100));
    }

    $(document).on('click', '.a-js-delete-cases-filters-tag', function (e) {
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

        filterCases($tag.closest('.cases'));

        if ($otherTags.length < 1) {
            $tag.closest('.a-filters__tags').remove();
        } else {
            $tag.parent().remove();
        }
    });

    $(document).on('click', '.a-js-delete-cases-filters-tags', function(e) {
        e.preventDefault();

        var $actionDelete = $(this);

        $('.a-js-cases-filter-select').each(function() {
            $(this).val('').trigger('change');
        });

        filters = {};

        filterCases($actionDelete.closest('.cases'));

        $actionDelete.closest('.a-filters__tags').remove();
    });

    $('.a-js-cases-filter-select').on('change', function () {
        var $select = $(this);
        var value = $select.val();
        var $casesContainer = $select.closest('.cases');
        var $filters = $casesContainer.find('.cases__filters');
        var $filtersTags = $casesContainer.find('.a-filters__tags');

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
                var filtersTagsHtml = '<div class="a-filters__tags a-tags a-tags--cases-filters-tags">';
                filtersTagsHtml += '<ul class="a-tags__list">';
                filtersTagsHtml += '<li class="a-tags__item">';
                filtersTagsHtml += '<a href="#" data-filter-name="' + filterName + '" data-filter-val="' + filterValue + '" class="a-tags__tag a-js-delete-cases-filters-tag">' + tagName + ' <span class=" a-tags__tag-icon mdi mdi-close"></span></a>';
                filtersTagsHtml += '</li>';
                filtersTagsHtml += '</ul>';
                filtersTagsHtml += '<a href="#" class="a-tags__delete a-js-delete-cases-filters-tags">' + deleteFiltersTagsTitle + '</a>';
                filtersTagsHtml += '</div>';

                $(filtersTagsHtml).appendTo($filters);
            } else {
                var $tagsList = $filtersTags.find('.a-tags__list');
                var tagsItemHtml = '<li class="a-tags__item"><a href="#" data-filter-name="' + filterName + '" data-filter-val="' + filterValue + '" class="a-tags__tag a-js-delete-cases-filters-tag">' + tagName + ' <span class=" a-tags__tag-icon mdi mdi-close"></span></a></li>';
                $(tagsItemHtml).appendTo($tagsList);

            }

            filterCases($casesContainer);
        }
    });

    $('.cases').on('click', '.a-js-cases-grid-load-more', function(e) {
        e.preventDefault();

        var $loadMore = $(this).addClass('button--hidden');
        var $casesContainer = $loadMore.closest('.cases');
        var casesParams = $casesContainer.data('params');
        var $casesRow = $casesContainer.find('.cases__row');
        var $casesFooter = $loadMore.closest('.cases__footer');
        var $preloader = $('<svg class="a-preloader a-preloader--load-more a-preloader--pulsate a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
            '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
            '<circle cx="22" cy="22" r="0"></circle>' +
            '<circle cx="22" cy="22" r="0"></circle>' +
            '</g>' +
            '</svg>');
        var params = $loadMore.data('params');
        var data = {
            action: 'advice_load_more_post_type',
            post_type: 'advice_case',
            filters: JSON.stringify(filters)
        };

        data._wpnonce = $casesContainer.find('[name="' + data.action + '"]').val();

        if (typeof params === 'string') params = JSON.parse(params);

        if (params) {
            data.params = JSON.stringify(params);
        }

        $casesFooter.append($preloader);

        $(document).trigger('advice_preloader_activated');

        $.ajax({
            url: advice_core_js_variables.ajax_url,
            data: data,
            method: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response) {
                    if( response['success'] ) {
                        $preloader.remove();

                        var casesData = response['success'];
                        var showTimeout = 100;

                        casesData.map(function (caseData) {
                            var caseClasses = ['cases__item', 'cases__item--hidden', 'case', 'case--' + casesParams.items_style];

                            if (!caseData.thumbnailUrl) {
                                caseClasses.push('case--has-not-image')
                            }

                            var html = '<div class="' + caseClasses.join(' ') + '">';

                            html += '<div class="case__image-container a-object-fit-container">';
                            html += '<a href="' + caseData.link + '" class="case__link" title="' + caseData.title + '">';

                            if (caseData.thumbnailUrl) {
                                html += '<img class="case__image a-js-has-object-fit" src="' + caseData.thumbnailUrl + '">';
                            }

                            html += '</a>';
                            html += '<h4 class="case__title case__title--style-1">';
                            html += '<a href="' + caseData.link + '" class="case__title-link" title="' + caseData.title + '">' + caseData.title + '</a>';
                            html += '</h4>';
                            html += '</div>';

                            html += '<div class="case__details">';

                            if (caseData.excerpt) {
                                html += '<div class="case__excerpt">' + caseData.excerpt + '</div>';
                            }

                            if(caseData.tags) {
                                var tags = [];

                                $.each(caseData.tags, function(index, tag) {
                                    tags.push('<a href="' + tag.link + '" rel="' + tag.name + '">' + tag.name + '</a>');
                                });

                                html += '<div class="case__tags">' + tags.join(', ') + '</div>';
                            }
                            html += '</div>';
                            html += '</div>';

                            var $html = $(html);

                            $html.appendTo($casesRow);

                            setTimeout(function() {
                                $html.removeClass('cases__item--hidden')
                            }, showTimeout);

                            showTimeout += 100;
                        });

                        if (response['post_count']) {
                            params.post_count = response['post_count'];
                            $loadMore.data('params', JSON.stringify(params)).removeClass('button--hidden');
                        } else {
                            $casesFooter.addClass('cases__footer--hidden');
                        }
                    }
                }
            }
        });
    });
})(jQuery);