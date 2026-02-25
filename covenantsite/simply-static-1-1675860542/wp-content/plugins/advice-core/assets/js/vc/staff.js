;(function ($) {
    'use strict';

    var filters = {};

    $('.a-js-staff-filter-select').select2({
        width: '100%'
    });

    function filterStaff($staff) {
        var data = {
            action: 'advice_filter_post_type',
            post_type: 'advice_staff',
            filters: JSON.stringify(filters)
        };

        data._wpnonce = $staff.find('[name="' + data.action + '"]').val();

        var $filtersSelects = $staff.find('.a-filter__select');
        var $staffGrid = $staff.find('.a-staff__grid');
        var staffParams = $staff.data('params');
        var $staffGridItems = $staffGrid.find('.a-staff__item');
        var $staffFooter = $staff.find('.a-staff__footer');
        var $loadMore = $staff.find('.a-staff__load-more');
        var hideTimeout = 400;

        if (typeof staffParams === 'string') staffParams = JSON.parse(staffParams);

        if (staffParams) {
            data.params = JSON.stringify(staffParams);
        }

        $filtersSelects.each(function() {
            $(this).prop('disabled', true);
        });

        if ($staffGridItems.length > 0) {
            hideTimeout = 0;

            $staffGridItems.each(function () {
                var $staffGridItem = $(this);

                setTimeout(function () {
                    $staffGridItem.addClass('a-staff__item--hidden');
                }, hideTimeout);

                hideTimeout += 100;
            });
        }

        setTimeout(function() {
            var $preloader = $('<svg class="a-staff__preloader a-preloader a-preloader--pulsate a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
                '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
                '<circle cx="22" cy="22" r="0"></circle>' +
                '<circle cx="22" cy="22" r="0"></circle>' +
                '</g>' +
                '</svg>');

            $staffGrid.append($preloader).addClass('a-staff__grid--loading');
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
                        $staffGrid.removeClass('a-staff__grid--loading');
                        $staffGrid.empty();

                        if (response['success']) {
                            var staffData = response['success'];
                            var showTimeout = 100;

                            staffData.map(function (employee) {
                                var employeeClasses = ['a-staff__item', 'a-staff__item--hidden', 'a-employee', 'a-employee--' + staffParams.items_style];

                                if (!employee.imgUrl) {
                                    employeeClasses.push('a-employee--has-not-image');
                                }

                                var html = '<div class="' + employeeClasses.join(' ') + '">';
                                html += '<div class="a-employee__wrap">';
                                html += '<div class="a-employee__image-container a-object-fit-container">';
                                html += '<a href="' + employee.link + '" class="a-employee__link" title="' + employee.title + '">';
                                if (employee.imgUrl) {
                                    html += '<img class="a-employee__image a-js-has-object-fit" src="' + employee.imgUrl + '" alt="' + employee.title + '">';
                                }
                                html += '</a>';
                                html += '<ul class="a-employee__socials a-socials a-socials--circle-flat a-socials--card-employee">';
                                $.each(employee.socials, function(index, social) {
                                    if(social.link) {
                                        html += '<li class="a-socials__item">';
                                        html += '<a href="' + social.link + '" class="a-socials__link a-socials__link--' + social.icon.replace(/ /g, '-') + '" target="_blank"><span class="' + social.icon + '"></span></a>';
                                        html += '</li>';
                                    }
                                });
                                html += '</ul>';
                                html += '</div>';
                                html += '<div class="a-employee__details">';
                                html += '<div class="a-employee__header">';
                                html += '<h4 class="a-employee__title"><a href="' + employee.link + '" class="a-employee__title-link" title="' + employee.title + '">' + employee.title + '</a></h4>';
                                if(employee.position) {
                                    html += '<div class="a-employee__position">' + employee.position + '</div>';
                                }
                                html += '</div>';
                                if(employee.officeLocation) {
                                    if(employee.officeAddress) {
                                        html += '<a href="https://www.google.com/maps/place/' + employee.officeAddress + '" class="a-employee__office" target="_blank"><span class="a-employee__office-icon mdi mdi-map-marker"></span>' + employee.officeLocation + '</a>';
                                    } else {
                                        html += '<span class="a-employee__office"><span class="a-employee__office-icon mdi mdi-map-marker"></span>' + employee.officeLocation + '</span>';
                                    }
                                }
                                if(employee.summary) {
                                    html += '<p class="a-employee__summary">' + employee.summary + '</p>';
                                }
                                if(employee.tags) {
                                    var tags = [];
                                    $.each(employee.tags, function(index, tag) {
                                        tags.push('<a href="' + tag.link + '" rel="' + tag.name + '">' + tag.name + '</a>');
                                    });
                                    html += '<div class="a-employee__tags">' + tags.join(', ') + '</div>';
                                }
                                html += '</div>';
                                html += '</div>';
                                html += '</div>';

                                var $html = $(html);

                                $html.appendTo($staffGrid);

                                setTimeout(function() {
                                    $html.removeClass('a-staff__item--hidden')
                                }, showTimeout);

                                showTimeout += 100;
                            });

                            setTimeout(function () {
                                if ($loadMore.length > 0) {
                                    if (response['post_count']) {
                                        var loadMoreParams = $loadMore.data('params');

                                        if (typeof loadMoreParams === 'string') loadMoreParams = JSON.parse(loadMoreParams);

                                        loadMoreParams.post_count = response['post_count'];

                                        $loadMore.data('params', JSON.stringify(loadMoreParams)).removeClass('button--hidden');

                                        $staffFooter.removeClass('a-staff__footer--hidden');
                                    } else {
                                        $loadMore.addClass('button--hidden');
                                        $staffFooter.addClass('a-staff__footer--hidden');
                                    }
                                }
                            }, (showTimeout + 100));
                        } else if( response['error'] ) {
                            var errorData = response['error'];
                            var html = '<div class="a-staff__error">';
                            html += '<h3 class="a-staff__error-title">' + errorData.title + '</h3>';
                            html += '<div class="a-staff__error-text">' + errorData.text + '</div>';
                            html += '</div>';

                            $(html).appendTo($staffGrid);
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

    $(document).on('click', '.a-js-delete-staff-filters-tag', function(e) {
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

        filterStaff($tag.closest('.a-staff'));

        if ($otherTags.length < 1) {
            $tag.closest('.a-filters__tags').remove();
        } else {
            $tag.parent().remove();
        }
    });

    $(document).on('click', '.a-js-delete-staff-filters-tags', function(e) {
        e.preventDefault();

        var $actionDelete = $(this);

        $('.a-js-staff-filter-select').each(function() {
            $(this).val('').trigger('change');
        });

        filters = {};

        filterStaff($actionDelete.closest('.a-staff'));

        $actionDelete.closest('.a-filters__tags').remove();
    });

    $('.a-js-staff-filter-select').on('change', function () {
        var $select = $(this);
        var value = $select.val();
        var $staff = $select.closest('.a-staff');
        var $filters = $staff.find('.a-staff__filters');
        var $filtersTags = $staff.find('.a-filters__tags');

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
                var filtersTagsHtml = '<div class="a-filters__tags a-tags a-tags--staff-filters-tags">';
                filtersTagsHtml += '<ul class="a-tags__list">';
                filtersTagsHtml += '<li class="a-tags__item">';
                filtersTagsHtml += '<a href="#" data-filter-name="' + filterName + '" data-filter-val="' + filterValue + '" class="a-tags__tag a-js-delete-staff-filters-tag">' + tagName + ' <span class=" a-tags__tag-icon mdi mdi-close"></span></a>';
                filtersTagsHtml += '</li>';
                filtersTagsHtml += '</ul>';
                filtersTagsHtml += '<a href="#" class="a-tags__delete a-js-delete-staff-filters-tags">' + deleteFiltersTagsTitle + '</a>';
                filtersTagsHtml += '</div>';

                $(filtersTagsHtml).appendTo($filters);
            } else {
                var $tagsList = $filtersTags.find('.a-tags__list');
                var tagsItemHtml = '<li class="a-tags__item"><a href="#" data-filter-name="' + filterName + '" data-filter-val="' + filterValue + '" class="a-tags__tag a-js-delete-staff-filters-tag">' + tagName + ' <span class=" a-tags__tag-icon mdi mdi-close"></span></a></li>';
                $(tagsItemHtml).appendTo($tagsList);

            }

            filterStaff($staff);
        }
    });

    $('.a-staff').on('click', '.a-js-staff-load-more', function(e) {
        e.preventDefault();

        var $loadMore = $(this).addClass('button--hidden');
        var $staff = $loadMore.closest('.a-staff');
        var $staffGrid = $staff.find('.a-staff__grid');
        var staffParams = $staff.data('params');
        var $staffFooter = $loadMore.closest('.a-staff__footer');
        var params = $loadMore.data('params');

        var data = {
            action: 'advice_load_more_post_type',
            post_type: 'advice_staff',
            filters: JSON.stringify(filters)
        };

        var $preloader = $('<svg class="a-preloader a-preloader--load-more a-preloader--pulsate a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
            '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
            '<circle cx="22" cy="22" r="0"></circle>' +
            '<circle cx="22" cy="22" r="0"></circle>' +
            '</g>' +
            '</svg>');

        data._wpnonce = $staff.find('[name="' + data.action + '"]').val();

        if(typeof params === 'string') params = JSON.parse(params);

        if(params) {
            data.params = JSON.stringify(params);
        }

        $staffFooter.append($preloader);

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

                        var staffData = response['success'];
                        var showTimeout = 100;

                        staffData.map(function (employee) {
                            var employeeClasses = ['a-staff__item', 'a-staff__item--hidden', 'a-employee', 'a-employee--' + staffParams.items_style];

                            if (!employee.imgUrl) {
                                employeeClasses.push('a-employee--has-not-image');
                            }

                            var html = '<div class="' + employeeClasses.join(' ') + '">';
                            html += '<div class="a-employee__wrap">';
                            html += '<div class="a-employee__image-container a-object-fit-container">';
                            html += '<a href="' + employee.link + '" class="a-employee__link" title="' + employee.title + '">';
                            if (employee.imgUrl) {
                                html += '<img class="a-employee__image a-js-has-object-fit" src="' + employee.imgUrl + '" alt="' + employee.title + '">';
                            }
                            html += '</a>';
                            html += '<ul class="a-employee__socials a-socials a-socials--circle-flat a-socials--card-employee">';
                            $.each(employee.socials, function(index, social) {
                                if(social.link) {
                                    html += '<li class="a-socials__item">';
                                    html += '<a href="' + social.link + '" class="a-socials__link a-socials__link--' + social.icon.replace(/ /g, '-') + '" target="_blank"><span class="' + social.icon + '"></span></a>';
                                    html += '</li>';
                                }
                            });
                            html += '</ul>';
                            html += '</div>';
                            html += '<div class="a-employee__details">';
                            html += '<div class="a-employee__header">';
                            html += '<h4 class="a-employee__title"><a href="' + employee.link + '" class="a-employee__title-link" title="' + employee.title + '">' + employee.title + '</a></h4>';
                            if(employee.position) {
                                html += '<div class="a-employee__position">' + employee.position + '</div>';
                            }
                            html += '</div>';
                            if(employee.officeLocation) {
                                if(employee.officeAddress) {
                                    html += '<a href="https://www.google.com/maps/place/' + employee.officeAddress + '" class="a-employee__office" target="_blank"><span class="a-employee__office-icon mdi mdi-map-marker"></span>' + employee.officeLocation + '</a>';
                                } else {
                                    html += '<span class="a-employee__office"><span class="a-employee__office-icon mdi mdi-map-marker"></span>' + employee.officeLocation + '</span>';
                                }
                            }
                            if(employee.summary) {
                                html += '<p class="a-employee__summary">' + employee.summary + '</p>';
                            }
                            if(employee.tags) {
                                var tags = [];
                                $.each(employee.tags, function(index, tag) {
                                    tags.push('<a href="' + tag.link + '" rel="' + tag.name + '">' + tag.name + '</a>');
                                });
                                html += '<div class="a-employee__tags">' + tags.join(', ') + '</div>';
                            }
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';

                            var $html = $(html);

                            $html.appendTo($staffGrid);

                            setTimeout(function() {
                                $html.removeClass('a-staff__item--hidden')
                            }, showTimeout);

                            showTimeout += 100;
                        });

                        if (response['post_count']) {
                            params.post_count = response['post_count'];
                            $loadMore.data('params', JSON.stringify(params)).removeClass('button--hidden');
                        } else {
                            $staffFooter.addClass('a-staff__footer--hidden');
                        }
                    }
                }
            }
        });
    });

})(jQuery);