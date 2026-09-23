var helpers = Chart.helpers;

function mergeOpacity(colorString, opacity) {
    var color = helpers.color(colorString);

    return color.alpha(opacity * color.alpha()).rgbaString();
}

Chart.Tooltip.prototype.drawBody = function(pt, vm, ctx, opacity) {
    var bodyFontSize = vm.bodyFontSize;
    var bodySpacing = vm.bodySpacing;
    var body = vm.body;

    ctx.textAlign = vm._bodyAlign;
    ctx.textBaseline = 'top';

    var textColor = mergeOpacity(vm.bodyFontColor, opacity);
    ctx.fillStyle = textColor;
    ctx.font = helpers.fontString(bodyFontSize, vm._bodyFontStyle, vm._bodyFontFamily);

    // Before Body
    var xLinePadding = 0;
    var fillLineOfText = function(line) {
        ctx.fillText(line, pt.x + xLinePadding, pt.y);
        pt.y += bodyFontSize + bodySpacing;
    };

    // Before body lines
    helpers.each(vm.beforeBody, fillLineOfText);

    var drawColorBoxes = vm.displayColors;
    xLinePadding = drawColorBoxes ? (bodyFontSize + 2) : 0;

    // Draw body lines now
    helpers.each(body, function(bodyItem, i) {
        helpers.each(bodyItem.before, fillLineOfText);

        helpers.each(bodyItem.lines, function(line) {
            // Draw Legend-like boxes if needed
            if (drawColorBoxes) {
                ctx.beginPath();
                ctx.arc(pt.x + 4, pt.y + 8, 8, 0, 2 * Math.PI, false);
                ctx.fillStyle = mergeOpacity(vm.labelColors[i].backgroundColor, opacity);
                ctx.fill();

                ctx.fillStyle = textColor;
            }

            fillLineOfText(line);
        });

        helpers.each(bodyItem.after, fillLineOfText);
    });

    // Reset back to 0 for after body
    xLinePadding = 0;

    // After body lines
    helpers.each(vm.afterBody, fillLineOfText);
    pt.y -= bodySpacing; // Remove last body spacing
};