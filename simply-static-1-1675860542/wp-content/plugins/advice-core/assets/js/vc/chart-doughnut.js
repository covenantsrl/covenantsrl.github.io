;(function ($) {
    'use strict';

    var $allChartCanvas = $('.a-js-chart-doughnut-canvas');
    var fontFamily = $('body').css('font-family');
    var charts = {};

    function valueFormatting(value, config) {
        value = value.toString();
        value = value.split(/(?=(?:...)*$)/);
        value = value.join(' ');

        if( config.adviceOptions.valuesPrefix ) {
            value = config.adviceOptions.valuesPrefix + value;
        } else if( config.adviceOptions.valuesSuffix ) {
            value = value + config.adviceOptions.valuesSuffix;
        }

        return value;
    }

    if ($allChartCanvas.length) {
        Chart.defaults.global.defaultFontColor = '#7e7f80';
        Chart.defaults.global.defaultFontSize = 14;
        Chart.defaults.global.defaultFontFamily = fontFamily;

        $allChartCanvas.each(function() {
            var $chartCanvas = $(this);
            var chartCanvas = this.getContext('2d');
            var $chart = $chartCanvas.closest('.a-chart-doughnut');
            var chartId = $chart.attr('id').replace(/-/g, '');
            var config = $chartCanvas.data('config');

            config.options.legendCallback = function(chart) {
                var text = [];
                text.push('<ul class="a-chart-doughnut__legend a-chart-legend a-chart-legend--doughnut">');
                for (var i = 0; i < chart.data.labels.length; i++) {
                    text.push('<li class="a-chart-legend__item"><span class="a-chart-legend__item-point" style="background-color:' + chart.data.datasets[0].backgroundColor[i] + '"></span>');
                    if (chart.data.labels[i]) {
                        text.push(chart.data.labels[i]);
                    }
                    text.push('</li>');
                }
                text.push('</ul>');

                return text.join('');
            };

            config.options.tooltips.callbacks = {
                label: function(tooltipItem, data) {
                    var dataLabel = data.labels[tooltipItem.index];
                    var value = ': ' + valueFormatting( data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index], config );

                    if (Chart.helpers.isArray(dataLabel)) {
                        dataLabel = dataLabel.slice();
                        dataLabel[0] += value;
                    } else {
                        dataLabel += value;
                    }

                    return dataLabel;
                }
            };

            charts[chartId] = new Chart(chartCanvas, config);

            $chart.prepend(charts[chartId].generateLegend());
        });
    }

})(jQuery);