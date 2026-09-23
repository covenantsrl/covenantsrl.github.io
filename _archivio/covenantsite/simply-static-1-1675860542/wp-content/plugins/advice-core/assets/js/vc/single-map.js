;(function ($) {
    'use strict';

    var maps = {};
    var $maps = $('.a-js-single-map-init');

    function updateMapHeight(id) {
        var $map = $('#' + id);

        if ($map.length > 0) {
            var $mapContainer = $map.closest('.a-map-container'),
                $footer = $mapContainer.find('.footer');

            if ($footer.length > 0 && $footer.hasClass('footer--map-overlay')) {
                var mapOffsetY = 480,
                    offset = $footer.position(),
                    offsetTop = offset.top;

                if (offsetTop < mapOffsetY || offsetTop > mapOffsetY) {
                    var mapHeight = $footer.height() + mapOffsetY;
                    $map.height(mapHeight);
                }
            }
        }
    }

    /* OverlayView Marker */
    MarkerOverlay.prototype = new google.maps.OverlayView();

    function MarkerOverlay(pos, map) {
        this.pos_ = pos;
        this.div_ = null;

        this.setMap(map);
    }

    MarkerOverlay.prototype.onAdd = function () {
        var div = document.createElement('div');
        div.className = 'a-map__marker a-map__marker--active';
        div.style.position = 'absolute';
        div.style.width = '20px';
        div.style.height = '20px';

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
        ov.draw = function () {
        };
        ov.setMap(this);
    };

    /* Init Map */
    function initMap(id) {
        var map,
            data = maps[id],
            latLng = new google.maps.LatLng(
                data.lat,
                data.lng
            ),
            properties = {
                center: latLng,
                zoom: 13,
                disableDefaultUI: true,
                scrollwheel: false
            };

        if (data.style) {
            properties.styles = data.style;
        }

        if (data.zoom && properties.zoom !== data.zoom) {
            properties.zoom = data.zoom;
        }

        map = new google.maps.Map(document.getElementById(id), properties);

        /* Update Height */
        updateMapHeight(id);

        /* Center Offset-Y */
        var centerOffsetY = getCenterOffsetY(id);
        if (centerOffsetY) {
            map.setCenterWithOffset(latLng, 0, centerOffsetY);
        }

        /* Markers */
        if (data.customMarkerUrl) {
            maps[id].marker = new google.maps.Marker({
                position: latLng,
                icon: data.customMarkerUrl,
                map: map
            });
        } else {
            maps[id].marker = new MarkerOverlay(latLng, map);
        }

        maps[id].map = map;
    }

    /* Change Map Center */
    function changeMapCenter(id) {
        var data = maps[id],
            centerOffsetY = getCenterOffsetY(id),
            latLng = new google.maps.LatLng(
                data.lat,
                data.lng
            );

        if (centerOffsetY) {
            data.map.setCenterWithOffset(latLng, 0, centerOffsetY);
        } else {
            data.map.setCenter(latLng);
        }
    }

    /* Get Center Offset-Y */
    function getCenterOffsetY(id) {
        var ratio = maps[id].centerOffsetYRatio,
            offsetY = 0,
            mdMedia = window.matchMedia('(max-width: 991px)');

        if (ratio) {
            var $map = $('#' + id);

            if ($map.length > 0) {
                if (mdMedia.matches) ratio += 5;
                offsetY = (($map.height() * ratio) / 100);
            }
        }

        return offsetY;
    }

    $(document).on('ready', function () {
        if ($maps.length > 0) {
            $maps.each(function () {
                var $map = $(this);
                var map = {
                    id: $map.attr('id')
                };

                if ($map.data('lat') && $map.data('lng')) {
                    map.lat = $map.data('lat');
                    map.lng = $map.data('lng');
                }

                if ($map.data('custom-marker-url')) {
                    map.customMarkerUrl = $map.data('custom-marker-url');
                }

                if ($map.data('style')) {
                    map.style = $map.data('style');
                }

                if ($map.data('zoom')) {
                    map.zoom = $map.data('zoom');
                }

                if ($map.data('center-offset')) {
                    var mapHeight = $map.height();

                    map.centerOffsetYRatio = (($map.data('center-offset') / mapHeight) * 100);
                }

                maps[map.id] = map;

                initMap(map.id);
            });
        }
    });

    google.maps.event.addDomListener(window, 'resize', function () {
        if ($maps.length > 0) {
            $maps.each(function () {
                var $map = $(this),
                    mapId = $map.attr('id');

                updateMapHeight(mapId);
                changeMapCenter(mapId);
            });
        }
    });

})(jQuery);