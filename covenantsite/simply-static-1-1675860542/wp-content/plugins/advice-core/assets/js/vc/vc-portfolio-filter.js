(function($) {
    'use strict';

    var filters = {};

    $('.a-js-portfolio-filter-select').select2({
        width: '100%'
    });

    function filterPortfolio($portfolioContainer) {
        $portfolioContainer.data('filters', JSON.stringify(filters));

        var data = {
            action: 'advice_filter_post_type',
            post_type: 'advice_portfolio',
            filters: JSON.stringify(filters),
            _wpnonce: $portfolioContainer.find('[name="advice_filter_post_type"]').val()
        };

        var portfolioParams = $portfolioContainer.data('params');
        var $filtersSelects = $portfolioContainer.find('.a-filter__select');
        var $portfolioRow = $portfolioContainer.find('.portfolio__row');
        var $portfolioItems = $portfolioRow.find('.portfolio__item');
        var $portfolioFooter = $portfolioContainer.find('.portfolio__footer');
        var $loadMore = $portfolioContainer.find('.portfolio__load-more');
        var $pagination = null;
        var hideTimeout = 400;

        if (typeof portfolioParams === 'string') portfolioParams = JSON.parse(portfolioParams);

        if (portfolioParams.pagination) {
            $pagination = $portfolioContainer.next('.pagination');
        }

        if (portfolioParams) {
            data.params = JSON.stringify(portfolioParams);
        }

        $filtersSelects.each(function() {
            $(this).prop('disabled', true);
        });

        if ($portfolioItems.length > 0) {
            hideTimeout = 0;

            $portfolioItems.each(function () {
                var portfolioItem = this;

                setTimeout(function () {
                    if (portfolioParams.display === 'masonry') {
                        $portfolioRow.masonry('remove', portfolioItem);
                    } else {
                        $(portfolioItem).addClass('portfolio__item--hidden');
                    }
                }, hideTimeout);

                hideTimeout += 100;
            });

            if (portfolioParams.pagination && $portfolioContainer.hasClass('portfolio--has-pagination')) {
                setTimeout(function () {
                    $portfolioContainer.removeClass('portfolio--has-pagination');
                    $pagination.addClass('pagination--hidden');
                }, hideTimeout);
            } else if ($portfolioFooter.length > 0 && !$portfolioFooter.hasClass('portfolio__footer--hidden')) {
                setTimeout(function () {
                    $portfolioFooter.addClass('portfolio__footer--hidden');
                    $loadMore.addClass('button--hidden');
                }, hideTimeout);
            }
        }

        setTimeout(function () {
            if (portfolioParams.display === 'masonry') {
                $portfolioRow.masonry('layout');
            }

            var $preloader = $('<svg class="portfolio__preloader a-preloader a-preloader--pulsate a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
                '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
                '<circle cx="22" cy="22" r="0"></circle>' +
                '<circle cx="22" cy="22" r="0"></circle>' +
                '</g>' +
                '</svg>');

            $portfolioRow.append($preloader).addClass('portfolio__row--loading');

            $(document).trigger('advice_preloader_activated');
        }, (hideTimeout += 100));

        setTimeout(function() {
            $.ajax({
                url: advice_core_js_variables.ajax_url,
                data: data,
                method: 'POST',
                dataType: 'json',
                success: function (response) {
                    if (response) {
                        $portfolioRow.removeClass('portfolio__row--loading');
                        $portfolioRow.empty();

                        if (response['success']) {
                            var showTimeout = 100;

                            response['success'].map(function (projectData) {
                                if (projectData.thumbnailUrl) {
                                    var projectClasses = ['portfolio__item', 'portfolio-item'];

                                    if (portfolioParams.display === 'grid') {
                                        projectClasses.push('portfolio__item--hidden');
                                    }

                                    if (projectData.thumbnailWidth) {
                                        projectClasses.push(projectData.thumbnailWidth);
                                    }

                                    var html = '<div class="' + projectClasses.join(' ') + '">';

                                    html += '<div class="portfolio-item__inner">';

                                    html += '<div class="portfolio-item__img-container a-object-fit-container">';
                                    html += '<img class="portfolio-item__img a-js-has-object-fit" src="' + projectData.thumbnailUrl + '" alt="' + projectData.title + '">';
                                    html += '</div>';

                                    html += '<a class="portfolio-item__link" href="' + projectData.link + '" title="' + projectData.title + '"></a>';
                                    html += '<div class="portfolio-item__details">';

                                    if (projectData.experts) {
                                        var experts = [];

                                        $.each(projectData.experts, function (index, expert) {
                                            experts.push('<a class="portfolio-item__experts-link" href="' + expert.link + '">' + expert.name + '</a>');
                                        });

                                        html += '<div class="portfolio-item__experts">' + experts.join(', ') + '</div>';
                                    }

                                    html += '<h3 class="portfolio-item__title">' + projectData.title + '</h3>';

                                    if (projectData.categories) {
                                        var categories = [];

                                        $.each(projectData.categories, function (index, category) {
                                            categories.push('<a href="' + category.link + '">' + category.name + '</a>');
                                        });

                                        html += '<div class="portfolio-item__categories">' + categories.join(', ') + '</div>';
                                    }

                                    html += '</div>';
                                    html += '</div>';
                                    html += '</div>';

                                    var $html = $(html);

                                    if (portfolioParams.display === 'grid') {
                                        $html.appendTo($portfolioRow);
                                    }

                                    setTimeout(function () {
                                        if (portfolioParams.display === 'masonry') {
                                            $portfolioRow.append($html).masonry('appended', $html).masonry('layout');
                                        } else {
                                            $html.removeClass('portfolio__item--hidden');
                                        }
                                    }, showTimeout);

                                    showTimeout += 100;
                                }
                            });

                            setTimeout(function() {
                                if (portfolioParams.pagination) {
                                    $pagination.remove();

                                    if (response['pagination_html']) {
                                        $portfolioContainer.addClass('portfolio--has-pagination');
                                        $portfolioContainer.after($(response['pagination_html']));
                                    }
                                } else if ($loadMore.length > 0) {
                                    if (response['post_count']) {
                                        var loadMoreParams = $loadMore.data('params');

                                        if (typeof loadMoreParams === 'string') loadMoreParams = JSON.parse(loadMoreParams);

                                        loadMoreParams.post_count = response['post_count'];

                                        $loadMore.data('params', JSON.stringify(loadMoreParams)).removeClass('button--hidden');

                                        $portfolioFooter.removeClass('portfolio__footer--hidden');
                                    } else {
                                        $loadMore.addClass('button--hidden');

                                        $portfolioFooter.addClass('portfolio__footer--hidden');
                                    }
                                }
                            }, (showTimeout + 100));
                        } else if( response['error'] ) {
                            var errorData = response['error'];
                            var html = '<div class="portfolio__error">';

                            html += '<h3 class="portfolio__error-title">' + errorData.title + '</h3>';
                            html += '<div class="portfolio__error-text">' + errorData.text + '</div>';
                            html += '</div>';

                            $(html).appendTo($portfolioRow);
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

    $(document).on('click', '.a-js-delete-portfolio-filters-tag', function (e) {
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

        filterPortfolio($tag.closest('.portfolio'));

        if ($otherTags.length < 1) {
            $tag.closest('.a-filters__tags').remove();
        } else {
            $tag.parent().remove();
        }
    });

    $(document).on('click', '.a-js-delete-portfolio-filters-tags', function(e) {
        e.preventDefault();

        var $actionDelete = $(this);

        $('.a-js-portfolio-filter-select').each(function() {
            $(this).val('').trigger('change');
        });

        filters = {};

        filterPortfolio($actionDelete.closest('.portfolio'));

        $actionDelete.closest('.a-filters__tags').remove();
    });

    $('.a-js-portfolio-filter-select').on('change', function () {
        var $select = $(this);
        var value = $select.val();
        var $portfolioContainer = $select.closest('.portfolio');
        var $filters = $portfolioContainer.find('.portfolio__filters');
        var $filtersTags = $portfolioContainer.find('.a-filters__tags');

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
                var filtersTagsHtml = '<div class="a-filters__tags a-tags a-tags--portfolio-filters-tags">';
                filtersTagsHtml += '<ul class="a-tags__list">';
                filtersTagsHtml += '<li class="a-tags__item">';
                filtersTagsHtml += '<a href="#" data-filter-name="' + filterName + '" data-filter-val="' + filterValue + '" class="a-tags__tag a-js-delete-portfolio-filters-tag">' + tagName + ' <span class=" a-tags__tag-icon mdi mdi-close"></span></a>';
                filtersTagsHtml += '</li>';
                filtersTagsHtml += '</ul>';
                filtersTagsHtml += '<a href="#" class="a-tags__delete a-js-delete-portfolio-filters-tags">' + deleteFiltersTagsTitle + '</a>';
                filtersTagsHtml += '</div>';

                $(filtersTagsHtml).appendTo($filters);
            } else {
                var $tagsList = $filtersTags.find('.a-tags__list');
                var tagsItemHtml = '<li class="a-tags__item"><a href="#" data-filter-name="' + filterName + '" data-filter-val="' + filterValue + '" class="a-tags__tag a-js-delete-portfolio-filters-tag">' + tagName + ' <span class=" a-tags__tag-icon mdi mdi-close"></span></a></li>';
                $(tagsItemHtml).appendTo($tagsList);

            }

            filterPortfolio($portfolioContainer);
        }
    });
})(jQuery);