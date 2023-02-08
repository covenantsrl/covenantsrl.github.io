(function($) {
    'use strict';

    /* OverlayView Marker */
    MarkerOverlay.prototype = new google.maps.OverlayView();

    function MarkerOverlay(pos, map) {
        this.pos_ = pos;
        this.div_ = null;

        this.setMap(map);
    }

    MarkerOverlay.prototype.onAdd = function () {
        var div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = '20px';
        div.style.height = '20px';
        div.className = 'a-map__marker a-map__marker--active';

        this.div_ = div;

        var panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
    };

    MarkerOverlay.prototype.draw = function () {
        var overlayProjection = this.getProjection();
        var position = overlayProjection.fromLatLngToDivPixel(this.pos_);

        var div = this.div_;
        div.style.left = (position.x - 10) + 'px';
        div.style.top = (position.y - 10) + 'px';
    };

    google.maps.Map.prototype.setCenterWithOffset = function (latlng, offsetX, offsetY) {
        var map = this;
        var ov = new google.maps.OverlayView();

        ov.onAdd = function () {
            var proj = this.getProjection();
            var aPoint = proj.fromLatLngToContainerPixel(latlng);
            aPoint.x = aPoint.x + offsetX;
            aPoint.y = aPoint.y + offsetY;
            map.setCenter(proj.fromContainerPixelToLatLng(aPoint));
        };
        ov.draw = function () {};
        ov.setMap(this);
    };

    /* Init Map */
    var map;
    var $map = $('.a-js-contact-form-map');
    var mdMedia = window.matchMedia('(max-width: 991px)');
    var mapProperties;

    $(document).on('ready', function() {
        if($map.length > 0) {
            var mapHeight = $map.height();
            var mapSettings = $map.data('settings');
            mapProperties = {
                zoom: 13,
                disableDefaultUI: true,
                scrollwheel: false,
                centerOffsetY: (0.2125 * mapHeight * -1)
            };

            if(mapSettings.lat) {
                mapProperties.center = new google.maps.LatLng(mapSettings.lat, mapSettings.lng);
            }

            if (mapSettings.style) {
                mapProperties.styles = JSON.parse(mapSettings.style);
            }

            if (mapSettings.zoom && mapSettings.zoom !== mapProperties.zoom) {
                mapProperties.zoom = mapSettings.zoom;
            }

            map = new google.maps.Map($map[0], mapProperties);

            if (mapProperties.centerOffsetY && !mdMedia.matches) {
                map.setCenterWithOffset(mapProperties.center, 0, mapProperties.centerOffsetY);
            }

            new MarkerOverlay(mapProperties.center, map);
        }
    });

    var resizeTimer;

    $(window).on('resize', function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            if ($map.length > 0) {
                if (mapProperties.centerOffsetY) {
                    if (!mdMedia.matches) {
                        map.setCenterWithOffset(mapProperties.center, 0, mapProperties.centerOffsetY);
                    } else {
                        map.setCenterWithOffset(mapProperties.center, 0, 0);
                    }
                }
            }
        }, 250);
    });

})(jQuery);