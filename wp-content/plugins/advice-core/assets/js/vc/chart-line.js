;(function ($) {
    'use strict';

    var $allChartCanvas = $('.a-js-chart-line-canvas');
    var fontFamily = $('body').css('font-family');
    var charts = {};

    function formattingValue(value, config) {
        value = value.toString();
        value = value.split(/(?=(?:...)*$)/);
        value = value.join(' ');

        if( config.adviceOptions.yAxisValuesPrefix ) {
            value = config.adviceOptions.yAxisValuesPrefix + value;
        }

        return value;
    }

    function toggleDataset(chartId, index) {
        var ci = charts[chartId];
        var meta = ci.getDatasetMeta(index);

        meta.hidden = meta.hidden === null? !ci.data.datasets[index].hidden : null;

        ci.update();
    }

    $(document).on('click', '.a-js-chart-line-legend-toggle', function() {
        var $this = $(this);

        $this.toggleClass('a-chart-legend__item--disabled');

        console.log($this);

        toggleDataset($this.data('chart-id'), $this.data('dataset-index'));
    });

    if ($allChartCanvas.length > 0) {
        Chart.defaults.global.defaultFontColor = '#7e7f80';
        Chart.defaults.global.defaultFontSize = 14;
        Chart.defaults.global.defaultFontFamily = fontFamily;

        $allChartCanvas.each(function() {
            var $chartCanvas = $(this);
            var chartCanvas = this.getContext('2d');
            var $chart = $chartCanvas.closest('.a-chart-line');
            var chartId = $chart.attr('id').replace(/-/g, '');
            var config = $chartCanvas.data('config');

            var legendPointsBg = {};

            for (var i = 0; i < config.data.datasets.length; i++) {
                if (typeof config.data.datasets[i].backgroundColor !== 'undefined') {
                    legendPointsBg[i] = config.data.datasets[i].backgroundColor;

                    var gradient = chartCanvas.createLinearGradient(0, 0, 0, 270);

                    gradient.addColorStop(0, config.data.datasets[i].backgroundColor);
                    gradient.addColorStop(1, 'rgba(255,255,255,0)');

                    config.data.datasets[i].backgroundColor = gradient;
                } else {
                    legendPointsBg[i] = config.data.datasets[i].borderColor;

                    if (config.data.datasets[i].fill) {
                        config.data.datasets[i].backgroundColor = config.data.datasets[i].borderColor;
                    }
                }
            }

            config.options.legendCallback = function(chart) {
                var text = [];

                if( chart.data.datasets.length > 1 ) {
                    text.push('<ul class="a-chart-line__legend a-chart-legend a-chart-legend--line">');
                    for (var i = 0; i < chart.data.datasets.length; i++) {
                        text.push('<li class="a-chart-legend__item a-js-chart-line-legend-toggle" data-chart-id="' + chartId + '" data-dataset-index="' + chart.legend.legendItems[i].datasetIndex + '"><span class="a-chart-legend__item-point" style="background-color:' + legendPointsBg[i] + '"></span>');
                        if (chart.data.datasets[i].label) {
                            text.push(chart.data.datasets[i].label);
                        }
                        text.push('</li>');
                    }
                    text.push('</ul>');
                }

                return text.join('');
            };

            config.options.scales.yAxes[0].ticks.callback = function(value) {
                return formattingValue(value, config);
            };

            config.options.tooltips.callbacks = {
                title: function() {
                    return "";
                },
                label: function(tooltipItem) {
                    return formattingValue(tooltipItem.yLabel, config);
                }
            };

            charts[chartId] = new Chart(chartCanvas, config);

            $chart.prepend(charts[chartId].generateLegend());
        });
    }

})(jQuery);