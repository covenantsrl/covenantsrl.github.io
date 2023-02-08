;(function ($) {
    'use strict';

    var filters = {};

    $('.a-js-jobs-filter-select').select2({
        width: '100%'
    });

    function filterJobs($jobs) {
        var data = {
            action: 'advice_filter_post_type',
            post_type: 'advice_job',
            filters: JSON.stringify(filters)
        };

        data._wpnonce = $jobs.find('[name="' + data.action + '"]').val();

        var jobsParams = $jobs.data('params');
        var $filtersSelects = $jobs.find('.a-filter__select');
        var $jobsList = $jobs.find('.a-jobs__list');
        var $jobsListItems = $jobsList.find('.a-jobs__item');
        var $jobsFooter = $jobs.find('.a-jobs__footer');
        var $loadMore = $jobs.find('.a-jobs__load-more');

        if (typeof jobsParams === 'string') jobsParams = JSON.parse(jobsParams);

        if (jobsParams) {
            data.params = JSON.stringify(jobsParams);
        }

        $filtersSelects.each(function() {
            $(this).prop('disabled', true);
        });

        var hideTimeout = 400;

        if ($jobsListItems.length > 0) {
            hideTimeout = 0;

            $jobsListItems.each(function() {
                var $jobsListItem = $(this);

                setTimeout(function() {
                    $jobsListItem.addClass('a-jobs__item--hidden');
                }, hideTimeout);

                hideTimeout += 100;
            });
        }

        setTimeout(function() {
            var $preloader = $('<svg class="a-jobs__preloader a-preloader a-preloader--pulsate a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
                '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
                '<circle cx="22" cy="22" r="0"></circle>' +
                '<circle cx="22" cy="22" r="0"></circle>' +
                '</g>' +
                '</svg>');

            $jobsList.append($preloader).addClass('a-jobs__list--loading');
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
                        $jobsList.empty();
                        $jobsList.removeClass('a-jobs__list--loading');

                        if (response['success']) {
                            var jobsData = response['success'];
                            var showTimeout = 100;

                            jobsData.map(function (job) {
                                var html = '<li class="a-jobs__item a-jobs__item--hidden a-job a-job--list-view">';
                                html += '<h3 class="a-job__title">';
                                html += '<a href="' + job.link + '" class="a-job__title-link">' + job.title + '</a>';
                                html += '</h3>';
                                if (job.department) {
                                    html += '<div class="a-job__department">' + job.department + '</div>';
                                }
                                if (job.excerpt) {
                                    html += '<div class="a-job__excerpt">' + job.excerpt + '</div>';
                                }
                                if (job.location) {
                                    html += '<div class="a-job__location"><span class="a-job__location-icon mdi mdi-map-marker"></span>' + job.location + '</div>';
                                }
                                html += '</li>';

                                var $html = $(html);

                                $html.appendTo($jobsList);

                                setTimeout(function() {
                                    $html.removeClass('a-jobs__item--hidden')
                                }, showTimeout);

                                showTimeout += 100;
                            });

                            setTimeout(function() {
                                if ($loadMore.length > 0) {
                                    if (response['post_count']) {
                                        var loadMoreParams = $loadMore.data('params');

                                        if (typeof loadMoreParams === 'string') {
                                            loadMoreParams = JSON.parse(loadMoreParams);
                                        }

                                        loadMoreParams.post_count = response['post_count'];

                                        $loadMore.data('params', JSON.stringify(loadMoreParams)).removeClass('button--hidden');

                                        $jobsFooter.removeClass('a-jobs__footer--hidden');
                                    } else {
                                        $loadMore.addClass('button--hidden');
                                        $jobsFooter.addClass('a-jobs__footer--hidden');
                                    }
                                }
                            }, (showTimeout + 100));
                        } else if( response['error'] ) {
                            var errorData = response['error'];
                            var html = '<li class="a-jobs__error">';
                            html += '<h3 class="a-jobs__error-title">' + errorData.title + '</h3>';
                            html += '<div class="a-jobs__error-text">' + errorData.text + '</div>';
                            html += '</li>';

                            $(html).appendTo($jobsList);
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

    $(document).on('click', '.a-js-delete-jobs-filters-tag', function(e) {
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

        filterJobs($tag.closest('.a-jobs'));

        if ($otherTags.length < 1) {
            $tag.closest('.a-filters__tags').remove();
        } else {
            $tag.parent().remove();
        }
    });

    $(document).on('click', '.a-js-delete-jobs-filters-tags', function(e) {
       e.preventDefault();

        var $actionDelete = $(this);

        $('.a-js-jobs-filter-select').each(function() {
            $(this).val('').trigger('change');
        });

       filters = {};

       filterJobs($actionDelete.closest('.a-jobs'));

       $actionDelete.closest('.a-filters__tags').remove();
    });

    $('.a-js-jobs-filter-select').on('change', function () {
        var $select = $(this);
        var value = $select.val();
        var $jobs = $select.closest('.a-jobs');
        var $filters = $jobs.find('.a-jobs__filters');
        var $filtersTags = $jobs.find('.a-filters__tags');

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
                var filtersTagsHtml = '<div class="a-filters__tags a-tags a-tags--jobs-filters-tags">';
                filtersTagsHtml += '<ul class="a-tags__list">';
                filtersTagsHtml += '<li class="a-tags__item">';
                filtersTagsHtml += '<a href="#" data-filter-name="' + filterName + '" data-filter-val="' + filterValue + '" class="a-tags__tag a-js-delete-jobs-filters-tag">' + tagName + ' <span class=" a-tags__tag-icon mdi mdi-close"></span></a>';
                filtersTagsHtml += '</li>';
                filtersTagsHtml += '</ul>';
                filtersTagsHtml += '<a href="#" class="a-tags__delete a-js-delete-jobs-filters-tags">' + deleteFiltersTagsTitle + '</a>';
                filtersTagsHtml += '</div>';

                $(filtersTagsHtml).appendTo($filters);
            } else {
                var $tagsList = $filtersTags.find('.a-tags__list');
                var tagsItemHtml = '<li class="a-tags__item"><a href="#" data-filter-name="' + filterName + '" data-filter-val="' + filterValue + '" class="a-tags__tag a-js-delete-jobs-filters-tag">' + tagName + ' <span class=" a-tags__tag-icon mdi mdi-close"></span></a></li>';

                $(tagsItemHtml).appendTo($tagsList);
            }

            filterJobs($jobs);
        }
    });

    $('.a-jobs').on('click', '.a-js-jobs-load-more', function(e) {
        e.preventDefault();

        var $loadMore = $(this).addClass('button--hidden');
        var loadMoreParams = $loadMore.data('params');
        var $jobs = $loadMore.closest('.a-jobs');
        var $jobsList = $jobs.find('.a-jobs__list');
        var $jobsFooter = $loadMore.closest('.a-jobs__footer');

        var data = {
            action: 'advice_load_more_post_type',
            post_type: 'advice_job',
            filters: JSON.stringify(filters)
        };

        var $preloader = $('<svg class="a-preloader a-preloader--load-more a-preloader--pulsate a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
            '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
            '<circle cx="22" cy="22" r="0"></circle>' +
            '<circle cx="22" cy="22" r="0"></circle>' +
            '</g>' +
            '</svg>');

        data._wpnonce = $jobs.find('[name="' + data.action + '"]').val();

        if (typeof loadMoreParams === 'string') loadMoreParams = JSON.parse(loadMoreParams);

        if (loadMoreParams) {
            data.params = JSON.stringify(loadMoreParams);
        }

        $jobsFooter.append($preloader);

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

                        var jobsData = response['success'];
                        var showTimeout = 100;

                        jobsData.map(function (job) {
                            var html = '<li class="a-jobs__item a-jobs__item--hidden a-job a-job--list-view">';
                            html += '<h3 class="a-job__title">';
                            html += '<a href="' + job.link + '" class="a-job__title-link">' + job.title + '</a>';
                            html += '</h3>';
                            if (job.department) {
                                html += '<div class="a-job__department">' + job.department + '</div>';
                            }
                            if (job.excerpt) {
                                html += '<div class="a-job__excerpt">' + job.excerpt + '</div>';
                            }
                            if (job.location) {
                                html += '<div class="a-job__location"><span class="a-job__location-icon mdi mdi-map-marker"></span>' + job.location + '</div>';
                            }
                            html += '</li>';

                            var $html = $(html);

                            $html.appendTo($jobsList);

                            setTimeout(function() {
                                $html.removeClass('a-jobs__item--hidden')
                            }, showTimeout);

                            showTimeout += 100;
                        });

                        if (response['post_count']) {
                            loadMoreParams.post_count = response['post_count'];
                            $loadMore.data('params', JSON.stringify(loadMoreParams)).removeClass('button--hidden');
                        } else {
                            $jobsFooter.addClass('a-jobs__footer--hidden');
                        }
                    }
                }
            }
        });
    });

})(jQuery);