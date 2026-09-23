;(function ($) {
    'use strict';

    var $chartsCanvas = $('.a-js-chart-bar-canvas');
    var fontFamily = $('body').css('font-family');
    var charts = {};

    function yValueFormatting(value, config) {
        var isNegativeNumber = (value < 0);

        if (isNegativeNumber) {
            value *= -1;
        }

        value = value.toString();
        value = value.split(/(?=(?:...)*$)/);
        value = value.join(' ');

        if (config.adviceOptions.yAxisValuesPrefix) {
            if (isNegativeNumber) {
                value = '-' + config.adviceOptions.yAxisValuesPrefix + value;
            } else {
                value = config.adviceOptions.yAxisValuesPrefix + value;
            }

        }

        return value;
    }

    function xValueFormatting(value, config) {
        var isNegativeNumber = (value < 0);

        if (isNegativeNumber) {
            value *= -1;
        }

        value = value.toString();
        value = value.split(/(?=(?:...)*$)/);
        value = value.join(' ');

        if (config.adviceOptions.xAxisValuesPrefix) {
            if (isNegativeNumber) {
                value = '-' + config.adviceOptions.xAxisValuesPrefix + value;
            } else {
                value = config.adviceOptions.xAxisValuesPrefix + value;
            }
        }

        return value;
    }

    function toggleDataset(chartId, index) {
        var ci = charts[chartId];
        var meta = ci.getDatasetMeta(index);

        meta.hidden = meta.hidden === null? !ci.data.datasets[index].hidden : null;

        ci.update();
    }

    $(document).on('click', '.a-js-chart-bar-legend-toggle', function() {
        var $this = $(this);

        $this.toggleClass('a-chart-legend__item--disabled');

        toggleDataset($this.data('chart-id'), $this.data('dataset-index'));
    });

    if ($chartsCanvas.length > 0) {
        Chart.elements.Rectangle.prototype.draw = function() {
            var ctx = this._chart.ctx;
            var vm = this._view;
            var left, right, top, bottom, signX, signY, borderSkipped;
            var borderWidth = vm.borderWidth;

            if (!vm.horizontal) {
                // bar
                left = vm.x - vm.width / 2;
                right = vm.x + vm.width / 2;
                top = vm.y;
                bottom = vm.base;
                signX = 1;
                signY = bottom > top ? 1 : -1;
                borderSkipped = vm.borderSkipped || 'bottom';
            } else {
                // horizontal bar
                left = vm.base;
                right = vm.x;
                top = vm.y - vm.height / 2;
                bottom = vm.y + vm.height / 2;
                signX = right > left ? 1 : -1;
                signY = 1;
                borderSkipped = vm.borderSkipped || 'left';
            }

            // Canvas doesn't allow us to stroke inside the width so we can
            // adjust the sizes to fit if we're setting a stroke on the line
            if (borderWidth) {
                // borderWidth shold be less than bar width and bar height.
                var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
                borderWidth = borderWidth > barSize ? barSize : borderWidth;
                var halfStroke = borderWidth / 2;
                // Adjust borderWidth when bar top position is near vm.base(zero).
                var borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
                var borderRight = right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
                var borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
                var borderBottom = bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);
                // not become a vertical line?
                if (borderLeft !== borderRight) {
                    top = borderTop;
                    bottom = borderBottom;
                }
                // not become a horizontal line?
                if (borderTop !== borderBottom) {
                    left = borderLeft;
                    right = borderRight;
                }
            }

            ctx.beginPath();
            ctx.fillStyle = vm.backgroundColor;
            ctx.strokeStyle = vm.borderColor;
            ctx.lineWidth = borderWidth;

            // Corner points, from bottom-left to bottom-right clockwise
            // | 1 2 |
            // | 0 3 |
            var corners = [
                [left, bottom],
                [left, top],
                [right, top],
                [right, bottom]
            ];

            // Find first (starting) corner with fallback to 'bottom'
            var borders = ['bottom', 'left', 'top', 'right'];
            var startCorner = borders.indexOf(borderSkipped, 0);
            if (startCorner === -1) {
                startCorner = 0;
            }

            function cornerAt(index) {
                return corners[(startCorner + index) % 4];
            }

            // Draw rectangle from 'startCorner'
            var corner = cornerAt(0);
            ctx.moveTo(corner[0], corner[1]);

            var cornerRadius = 5;
            var radius;

            for (var i = 1; i < 4; i++) {
                corner = cornerAt(i);

                var nextCornerId = i+1;

                if(nextCornerId === 4){
                    nextCornerId = 0
                }

                var nextCorner = cornerAt(nextCornerId);

                var x = corners[1][0];
                var y = corners[1][1];

                var width = corners[2][0] - corners[1][0];
                var height = corners[0][1] - corners[1][1];

                if (width < 0) {
                    width = corners[1][0] - corners[2][0];
                    x = corners[2][0];
                }

                if (height < 0) {
                    height = corners[1][1] - corners[0][1];
                    y = corners[0][1];
                }

                radius = cornerRadius;

                if (radius > height / 2) {
                    radius = height / 2;
                }
                if (radius > width / 2) {
                    radius = width / 2;
                }

                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
            }

            ctx.fill();

            if (borderWidth) {
                ctx.stroke();
            }
        };

        Chart.defaults.global.defaultFontColor = '#7e7f80';
        Chart.defaults.global.defaultFontSize = 14;
        Chart.defaults.global.defaultFontFamily = fontFamily;

        $chartsCanvas.each(function() {
            var $chartCanvas = $(this);
            var chartCanvas = this.getContext('2d');
            var $chart = $chartCanvas.closest('.a-chart-bar');
            var chartId = $chart.attr('id').replace(/-/g, '');
            var config = $chartCanvas.data('config');

            config.options.legendCallback = function(chart) {
                var text = [];
                var offsetLeft = chart.chartArea.left - config.options.scales.yAxes[0].ticks.padding;

                text.push('<ul class="a-chart-bar__legend a-chart-legend a-chart-legend--bar" style="margin-left:' + offsetLeft + 'px">');

                for (var i = 0; i < chart.data.datasets.length; i++) {
                    text.push('<li class="a-chart-legend__item a-js-chart-bar-legend-toggle" data-chart-id="' + chartId + '" data-dataset-index="' + chart.legend.legendItems[i].datasetIndex + '"><span class="a-chart-legend__item-point" style="background-color:' + chart.data.datasets[i].backgroundColor[0] + '"></span>');

                    if (chart.data.datasets[i].label) {
                        text.push(chart.data.datasets[i].label);
                    }

                    text.push('</li>');
                }

                text.push('</ul>');

                return text.join('');
            };

            if (config.type === 'bar') {
                config.options.scales.yAxes[0].ticks.callback = function(value) {
                    return yValueFormatting(value, config);
                };
            } else {
                config.options.scales.xAxes[0].ticks.callback = function(value) {
                    return xValueFormatting(value, config);
                };
            }

            config.options.tooltips.callbacks = {
                title: function() {
                    return "";
                },
                label: function(tooltipItem) {
                    if (config.type === 'bar') {
                        return yValueFormatting(tooltipItem.yLabel, config);
                    } else {
                        return xValueFormatting(tooltipItem.xLabel, config);
                    }
                }
            };

            charts[chartId] = new Chart(chartCanvas, config);

            $chart.prepend(charts[chartId].generateLegend());
        });
    }

})(jQuery);