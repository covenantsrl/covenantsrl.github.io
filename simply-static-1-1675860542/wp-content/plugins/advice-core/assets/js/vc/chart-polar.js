;(function ($) {
    'use strict';

    var $allChartCanvas = $('.a-js-chart-polar-canvas');
    var fontFamily = $('body').css('font-family');
    var charts = {};

    function valueFormatting(value, config) {
        value = value.toString();
        value = value.split(/(?=(?:...)*$)/);
        value = value.join(' ');

        if( config.adviceOptions.valuePrefix ) {
            value = config.adviceOptions.valuePrefix + value;
        } else if( config.adviceOptions.valueSuffix ) {
            value = value + config.adviceOptions.valueSuffix;
        }

        return value;
    }

    function toggleDataset(chartId, index) {
        var ci = charts[chartId];
        var meta = ci.getDatasetMeta(index);

        meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

        ci.update();
    }

    $(document).on('click', '.a-js-chart-polar-legend-toggle', function () {
        var $this = $(this);

        $this.toggleClass('a-chart-legend__item--disabled');

        toggleDataset($this.data('chart-id'), $this.data('dataset-index'));
    });

    if ($allChartCanvas.length) {
        Chart.defaults.global.defaultFontColor = '#7e7f80';
        Chart.defaults.global.defaultFontSize = 14;
        Chart.defaults.global.defaultFontFamily = fontFamily;

        $allChartCanvas.each(function() {
            var $chartCanvas = $(this);
            var chartCanvas = this.getContext('2d');
            var $chart = $chartCanvas.closest('.a-chart-polar');
            var chartId = $chart.attr('id').replace(/-/g, '');
            var config = $chartCanvas.data('config');

            config.options.legendCallback = function(chart) {
                var text = [];

                text.push('<ul class="a-chart-polar__legend a-chart-legend a-chart-legend--polar">');

                for (var i = 0; i < chart.data.datasets.length; i++) {
                    text.push('<li class="a-chart-legend__item a-js-chart-polar-legend-toggle" data-chart-id="' + chartId + '" data-dataset-index="' + chart.legend.legendItems[i].datasetIndex + '"><span class="a-chart-legend__item-point" style="background-color:' + chart.data.datasets[i].borderColor + '"></span>');

                    if (chart.data.datasets[i].label) {
                        text.push(chart.data.datasets[i].label);
                    }

                    text.push('</li>');
                }

                text.push('</ul>');

                return text.join('');
            };

            config.options.tooltips.callbacks = {
                title: function() {
                    return "";
                },
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

            if (config.type === 'radar') {
                config.options.scale.pointLabels = {
                    callback: function (label, i, labels) {
                        return label;
                    }
                };
            }

            charts[chartId] = new Chart(chartCanvas, config);

            if (config.type === 'radar') {
                $chart.prepend(charts[chartId].generateLegend());
            }
        });
    }

})(jQuery);