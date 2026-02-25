(function($) {
    'use strict';

    var filters = {};

    $('.a-js-services-filter-select').select2({
        width: '100%'
    });

    function filterServices($servicesContainer) {
        var data = {
            action: 'advice_filter_post_type',
            post_type: 'advice_service',
            filters: JSON.stringify(filters)
        };

        data._wpnonce = $servicesContainer.find('[name="advice_filter_post_type"]').val();

        var servicesParams = $servicesContainer.data('params');
        var $filtersSelects = $servicesContainer.find('.a-filter__select');
        var $servicesRow = $servicesContainer.find('.services__row');
        var $servicesItems = $servicesRow.find('.services__item');
        var $servicesFooter = $servicesContainer.find('.services__footer');
        var $loadMore = $servicesContainer.find('.services__load-more');
        var hideTimeout = 400;

        if (typeof servicesParams === 'string') servicesParams = JSON.parse(servicesParams);

        if (servicesParams) {
            data.params = JSON.stringify(servicesParams);
        }

        $filtersSelects.each(function() {
            $(this).prop('disabled', true);
        });

        if( $servicesItems.length > 0 ) {
            hideTimeout = 0;

            $servicesItems.each(function() {
                var $service = $(this);

                setTimeout(function() {
                    $service.addClass('services__item--hidden');
                }, hideTimeout);

                hideTimeout += 100;
            });
        }

        setTimeout(function() {
            var $preloader = $('<svg class="services__preloader a-preloader a-preloader--pulsate a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
                '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
                '<circle cx="22" cy="22" r="0"></circle>' +
                '<circle cx="22" cy="22" r="0"></circle>' +
                '</g>' +
                '</svg>');

            $servicesRow.append($preloader).addClass('services__row--loading');
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
                        $servicesRow.removeClass('services__row--loading');
                        $servicesRow.empty();

                        if (response['success']) {
                            var servicesData = response['success'];
                            var showTimeout = 100;

                            servicesData.map(function (service) {
                                var html = '<div class="services__item services__item--hidden">';
                                html += '<div class="service service--' + servicesParams.items_style + '">';
                                html += '<a href="' + service.link + '" class="service__image-container a-object-fit-container" title="' + service.title + '">';
                                if (service.thumbnailUrl) {
                                    html += '<img class="service__image a-js-has-object-fit" src="' + service.thumbnailUrl + '" alt="' + service.title + '">';
                                }
                                html += '</a>';
                                html += '<div class="service__details">';
                                html += '<div class="service__details-wrap">';
                                html += '<div class="service__details-inner">';
                                html += '<div class="service__title a-font-family-heading">';
                                html += '<a href="' + service.link + '" class="service__title-link">' + service.title + '</a>';
                                html += '</div>';
                                if (service.tags) {
                                    var tags = [];

                                    $.each(service.tags, function(index, tag) {
                                        tags.push('<a href="' + tag.link + '" rel="' + tag.name + '">' + tag.name + '</a>');
                                    });

                                    html += '<div class="service__tags">' + tags.join(', ') + '</div>';
                                }
                                html += '</div>';
                                html += '</div>';
                                html += '</div>';
                                html += '</div>';
                                html += '</div>';

                                var $html = $(html);

                                $html.appendTo($servicesRow);

                                setTimeout(function() {
                                    $html.removeClass('services__item--hidden')
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

                                        $servicesFooter.removeClass('services__footer--hidden');
                                    } else {
                                        $loadMore.addClass('button--hidden');
                                        $servicesFooter.addClass('services__footer--hidden');
                                    }
                                }
                            }, (showTimeout + 100));
                        } else if (response['error']) {
                            var errorData = response['error'];
                            var html = '<div class="services__error">';
                            html += '<h3 class="services__error-title">' + errorData.title + '</h3>';
                            html += '<div class="services__error-text">' + errorData.text + '</div>';
                            html += '</div>';

                            $(html).appendTo($servicesRow);
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

    $(document).on('click', '.a-js-delete-services-filters-tag', function (e) {
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

        filterServices($tag.closest('.services'));

        if ($otherTags.length < 1) {
            $tag.closest('.a-filters__tags').remove();
        } else {
            $tag.parent().remove();
        }
    });

    $(document).on('click', '.a-js-delete-services-filters-tags', function(e) {
        e.preventDefault();

        var $actionDelete = $(this);

        $('.a-js-services-filter-select').each(function() {
            $(this).val('').trigger('change');
        });

        filters = {};

        filterServices($actionDelete.closest('.services'));

        $actionDelete.closest('.a-filters__tags').remove();
    });

    $('.a-js-services-filter-select').on('change', function () {
        var $select = $(this);
        var value = $select.val();
        var $servicesContainer = $select.closest('.services');
        var $filters = $servicesContainer.find('.services__filters');
        var $filtersTags = $servicesContainer.find('.a-filters__tags');

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
                var filtersTagsHtml = '<div class="a-filters__tags a-tags a-tags--services-filters-tags">';
                filtersTagsHtml += '<ul class="a-tags__list">';
                filtersTagsHtml += '<li class="a-tags__item">';
                filtersTagsHtml += '<a href="#" data-filter-name="' + filterName + '" data-filter-val="' + filterValue + '" class="a-tags__tag a-js-delete-services-filters-tag">' + tagName + ' <span class=" a-tags__tag-icon mdi mdi-close"></span></a>';
                filtersTagsHtml += '</li>';
                filtersTagsHtml += '</ul>';
                filtersTagsHtml += '<a href="#" class="a-tags__delete a-js-delete-services-filters-tags">' + deleteFiltersTagsTitle + '</a>';
                filtersTagsHtml += '</div>';

                $(filtersTagsHtml).appendTo($filters);
            } else {
                var $tagsList = $filtersTags.find('.a-tags__list');
                var tagsItemHtml = '<li class="a-tags__item"><a href="#" data-filter-name="' + filterName + '" data-filter-val="' + filterValue + '" class="a-tags__tag a-js-delete-services-filters-tag">' + tagName + ' <span class=" a-tags__tag-icon mdi mdi-close"></span></a></li>';
                $(tagsItemHtml).appendTo($tagsList);

            }

            filterServices($servicesContainer);
        }
    });

    $('.services').on('click', '.a-js-services-load-more', function(e) {
        e.preventDefault();

        var $loadMore = $(this).addClass('button--hidden');
        var $servicesContainer = $loadMore.closest('.services');
        var servicesParams = $servicesContainer.data('params');
        var $servicesRow = $servicesContainer.find('.services__row');
        var $servicesFooter = $loadMore.closest('.services__footer');
        var params = $loadMore.data('params');

        var data = {
            action: 'advice_load_more_post_type',
            post_type: 'advice_service',
            filters: JSON.stringify(filters)
        };

        var $preloader = $('<svg class="a-preloader a-preloader--load-more a-preloader--pulsate a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
            '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
            '<circle cx="22" cy="22" r="0"></circle>' +
            '<circle cx="22" cy="22" r="0"></circle>' +
            '</g>' +
            '</svg>');

        data._wpnonce = $servicesContainer.find('[name="' + data.action + '"]').val();

        if (typeof params === 'string') params = JSON.parse(params);

        if(params) {
            data.params = JSON.stringify(params);
        }

        $servicesFooter.append($preloader);

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

                        var servicesData = response['success'];
                        var showTimeout = 100;

                        servicesData.map(function (service) {
                            var html = '<div class="services__item services__item--hidden">';
                            html += '<div class="service service--' + servicesParams.items_style + '">';
                            html += '<a href="' + service.link + '" class="service__image-container a-object-fit-container" title="' + service.title + '">';
                            if (service.thumbnailUrl) {
                                html += '<img class="service__image a-js-has-object-fit" src="' + service.thumbnailUrl + '" alt="' + service.title + '">';
                            }
                            html += '</a>';
                            html += '<div class="service__details">';
                            html += '<div class="service__details-wrap">';
                            html += '<div class="service__details-inner">';
                            html += '<h4 class="service__title">';
                            html += '<a href="' + service.link + '" class="service__title-link">' + service.title + '</a>';
                            html += '</h4>';
                            if (service.tags) {
                                var tags = [];

                                $.each(service.tags, function(index, tag) {
                                    tags.push('<a href="' + tag.link + '" rel="' + tag.name + '">' + tag.name + '</a>');
                                });

                                html += '<div class="service__tags">' + tags.join(', ') + '</div>';
                            }
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';

                            var $html = $(html);

                            $html.appendTo($servicesRow);

                            setTimeout(function() {
                                $html.removeClass('services__item--hidden')
                            }, showTimeout);

                            showTimeout += 100;
                        });

                        if (response['post_count']) {
                            params.post_count = response['post_count'];
                            $loadMore.data('params', JSON.stringify(params)).removeClass('button--hidden');
                        } else {
                            $servicesFooter.addClass('services__footer--hidden');
                        }
                    }
                }
            }
        });
    });
})(jQuery);