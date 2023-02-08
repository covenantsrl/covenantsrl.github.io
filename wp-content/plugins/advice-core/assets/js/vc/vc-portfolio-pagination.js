(function($){
    'use strict';

    $(document).on('click', '.a-js-portfolio-load-more', function(e) {
        e.preventDefault();

        var $loadMore = $(this).addClass('button--hidden');
        var loadMoreParams = $loadMore.data('params');
        var $portfolioContainer = $loadMore.closest('.portfolio');
        var $portfolioRow = $portfolioContainer.find('.portfolio__row');
        var $portfolioFooter = $loadMore.closest('.portfolio__footer');
        var filters = $portfolioContainer.data('filters') || JSON.stringify({});

        var data = {
            action: 'advice_load_more_post_type',
            post_type: 'advice_portfolio',
            filters: filters
        };

        var $preloader = $('<svg class="a-preloader a-preloader--load-more a-preloader--pulsate a-js-preloader-pulsate" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">' +
            '<g fill-rule="evenodd" fill="none" stroke-width="2">' +
            '<circle cx="22" cy="22" r="0"></circle>' +
            '<circle cx="22" cy="22" r="0"></circle>' +
            '</g>' +
            '</svg>');

        data._wpnonce = $portfolioContainer.find('[name="' + data.action + '"]').val();

        if (typeof loadMoreParams === 'string') loadMoreParams = JSON.parse(loadMoreParams);

        if (loadMoreParams) {
            data.params = JSON.stringify(loadMoreParams);
        }

        $portfolioFooter.append($preloader);

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

                        var portfolioData = response['success'];
                        var showTimeout = 100;

                        portfolioData.map(function (portfolioItemData) {
                            if (portfolioItemData.thumbnailUrl) {
                                var portfolioItemClasses = ['portfolio__item', 'portfolio-item'];

                                if (portfolioItemData.thumbnailWidth) {
                                    portfolioItemClasses.push(portfolioItemData.thumbnailWidth);
                                }

                                var html = '<div class="' + portfolioItemClasses.join(' ') + '">';

                                html += '<div class="portfolio-item__inner">';

                                html += '<div class="portfolio-item__img-container a-object-fit-container">';
                                html += '<img class="portfolio-item__img a-js-has-object-fit" src="' + portfolioItemData.thumbnailUrl + '" alt="' + portfolioItemData.title + '">';
                                html += '</div>';

                                html += '<a class="portfolio-item__link" href="' + portfolioItemData.link + '" title="' + portfolioItemData.title + '"></a>';
                                html += '<div class="portfolio-item__details">';

                                if (portfolioItemData.experts) {
                                    var experts = [];

                                    $.each(portfolioItemData.experts, function (index, expert) {
                                        experts.push('<a class="portfolio-item__experts-link" href="' + expert.link + '">' + expert.name + '</a>');
                                    });

                                    html += '<div class="portfolio-item__experts">' + experts.join(', ') + '</div>';
                                }

                                html += '<h3 class="portfolio-item__title">' + portfolioItemData.title + '</h3>';

                                if (portfolioItemData.categories) {
                                    var categories = [];

                                    $.each(portfolioItemData.categories, function (index, category) {
                                        categories.push('<a href="' + category.link + '">' + category.name + '</a>');
                                    });

                                    html += '<div class="portfolio-item__categories">' + categories.join(', ') + '</div>';
                                }

                                html += '</div>';
                                html += '</div>';
                                html += '</div>';

                                var $html = $(html);

                                setTimeout(function () {
                                    $portfolioRow.append($html).masonry('appended', $html).masonry('layout');
                                }, showTimeout);

                                showTimeout += 100;
                            }
                        });

                        if (response['post_count']) {
                            loadMoreParams.post_count = response['post_count'];
                            $loadMore.data('params', JSON.stringify(loadMoreParams)).removeClass('button--hidden');
                        } else {
                            $portfolioFooter.addClass('portfolio__footer--hidden');
                        }
                    }
                }
            }
        });
    });
})(jQuery);