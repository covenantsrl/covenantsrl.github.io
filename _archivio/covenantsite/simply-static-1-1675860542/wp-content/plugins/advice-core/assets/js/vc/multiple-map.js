;(function ($) {
    'use strict';

    var maps = {},
        locationsData = {};

    function updateMapHeight(id) {
        var $map = $('#' + id);

        if ($map.length > 0) {
            var $mapContainer = $map.closest('.a-map'),
                $footer = $mapContainer.find('.footer');

            if ($footer.length > 0 && $footer.hasClass('footer--map-overlay')) {
                var $panel = $mapContainer.find('.a-map__panel'),
                    mapOffsetY = 480,
                    offset = $footer.position(),
                    offsetTop = offset.top - $panel.height();

                if (offsetTop < mapOffsetY || offsetTop > mapOffsetY) {
                    var mapHeight = $footer.height() + mapOffsetY;
                    $map.height(mapHeight);
                }
            }
        }
    }

    function getLocationsData($slides) {
        $.each($slides, function (id, slide) {
            var $location = $(slide).find('.a-map-item');
            var locationData = $location.data('location-data');
            var locationId = $location.data('location-id');

            if (locationData) {
                locationsData[locationId] = locationData;
            }
        });
    }

    function setContactDetails(locationId, $carousel) {
        var locationData = locationsData[locationId];

        if (locationData) {
            var $contactDetailsList = $carousel.closest('.a-map__panel').find('.contact-details__list').removeClass('contact-details__list--not-all');
            var $contactDetailsItem = $contactDetailsList.find('.contact-details__contact');

            if (!locationData.hasOwnProperty('phone') || !locationData.hasOwnProperty('email') || !locationData.hasOwnProperty('address')) {
                $contactDetailsList.addClass('contact-details__list--not-all');
            }

            if ($contactDetailsItem.length) {
                $contactDetailsItem.removeClass('a-fade-in').addClass('a-fade-out');
                $contactDetailsItem.find('.contact-details__contact-inner').html('');
            }

            $.each(locationData, function (type, value) {
                if (value && type !== 'lat' && type !== 'lng') {
                    var $contact = $contactDetailsList.find('.contact-details__contact--' + type),
                        $contactInner;

                    if ($contact.length > 0) {
                        var $contactClone = $contact.clone();
                        $contact.remove();
                        $contact = $contactClone;
                        $contactInner = $contact.find('.contact-details__contact-inner');
                    } else {
                        $contact = $('<li>')
                            .addClass('contact-details__contact contact-details__contact--' + type + ' a-animated');
                        $contactInner = $('<div>').appendTo($contact).addClass('contact-details__contact-inner');
                    }

                    switch (type) {
                        case 'phone':
                        case 'email':
                            var valPrefix = 'tel';
                            if (type === 'email') valPrefix = 'mailto';
                            var valArr = value.split(';');

                            $.each(valArr, function (index, val) {
                                var linkText = val;
                                if (type === 'phone') val = val.replace(/\s/g, '');
                                $('<a>')
                                    .appendTo($contactInner)
                                    .html(linkText).attr('href', valPrefix + ':' + val)
                                    .addClass('contact-details__contact-link');
                            });
                            break;
                        default:
                            $('<p>')
                                .appendTo($contactInner)
                                .html(value)
                                .addClass('contact-details__contact-text');
                            break;
                    }

                    $contact.appendTo($contactDetailsList);
                }
            });

            $contactDetailsItem = $contactDetailsList.find('.contact-details__contact').removeClass('a-fade-out');

            setTimeout(function () {
                $contactDetailsItem.each(function () {
                    var $item = $(this),
                        $itemInner = $item.find('.contact-details__contact-inner');

                    if ($itemInner.is(':empty')) {
                        $item.remove();
                    }
                });

                $contactDetailsItem.addClass('a-fade-in');
            }, 200);
        }
    }

    /* OverlayView Marker */
    MarkerOverlay.prototype = new google.maps.OverlayView();

    function MarkerOverlay(pos, map, active) {
        this.pos_ = pos;
        this.div_ = null;
        this.active_ = active;

        this.setMap(map);
    }

    MarkerOverlay.prototype.onAdd = function () {
        var div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = '20px';
        div.style.height = '20px';

        if (this.active_) {
            div.className = 'a-map__marker a-map__marker--active';
        } else {
            div.className = 'a-map__marker';
        }

        this.div_ = div;

        var panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
    };

    MarkerOverlay.prototype.activeMarker = function (active) {
        if (this.div_) {
            if (active) {
                this.div_.classList.add('a-map__marker--active');
            } else {
                this.div_.classList.remove('a-map__marker--active');
            }
        }
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
            data = maps[id].data,
            locationData = locationsData[data.currentLocationId],
            latLng = new google.maps.LatLng(
                locationData.lat,
                locationData.lng
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
        var markers = {};

        $.each(locationsData, function (key, val) {
            var pos = new google.maps.LatLng(val.lat, val.lng);

            if (data.customMarkerUrl) {
                markers[key] = new google.maps.Marker({
                    position: pos,
                    icon: data.customMarkerUrl,
                    map: map
                });
            } else {
                var active = false;

                if (key === data.currentLocationId) {
                    active = true;
                }

                markers[key] = new MarkerOverlay(pos, map, active);
            }
        });

        maps[id].markers = markers;
        maps[id].map = map;
    }

    /* Change Map Center */
    function changeMapCenter(id, locationId) {
        var mapsItem = maps[id],
            locationData = locationsData[locationId],
            centerOffsetY = getCenterOffsetY(id),
            latLng = new google.maps.LatLng(
                locationData.lat,
                locationData.lng
            );

        if (centerOffsetY) {
            mapsItem.map.setCenterWithOffset(latLng, 0, centerOffsetY);
        } else {
            mapsItem.map.setCenter(latLng);
        }
    }

    /* Update Clock */
    function updateClock($clock) {
        var timeZoneId = $clock.data('timezone-id'),
            sunrise = $clock.data('sunrise'),
            sunset = $clock.data('sunset'),
            now = moment().tz(timeZoneId),
            nowTimestamp = now.unix(),
            $meridiem = $clock.find('.a-clock__meridiem'),
            meridiem = now.format('a'),
            second = now.seconds() * 6,
            minute = now.minutes() * 6 + second / 60,
            hour = ((now.hours() % 12) / 12) * 360 + 90 + minute / 12;

        if (nowTimestamp >= sunset || nowTimestamp <= sunrise) {
            if (!$clock.hasClass('a-clock--night')) {
                $clock.addClass('a-clock--night');
            }
        } else if ($clock.hasClass('a-clock--night')) {
            $clock.removeClass('a-clock--night');
        }

        if ($meridiem.text() !== meridiem) {
            $meridiem.text(meridiem);
        }

        $clock.find('.a-clock__hour').css("transform", "rotate(" + hour + "deg)");
        $clock.find('.a-clock__minute').css("transform", "rotate(" + minute + "deg)");
        $clock.find('.a-clock__second').css("transform", "rotate(" + second + "deg)");
    }

    /* Get Center Offset-Y */
    function getCenterOffsetY(id) {
        var ratio = maps[id].data.centerOffsetYRatio,
            offsetY = 0,
            mdMedia = window.matchMedia('(max-width: 991px)');

        if (ratio) {
            var $map = $('#' + id);

            if ($map.length) {
                if (mdMedia.matches) ratio += 5;
                offsetY = (($map.height() * ratio) / 100);
            }
        }

        return offsetY;
    }

    /* Clock Update Time */
    function timedUpdate() {
        var $clock = $('.a-clock');
        if ($clock.length) {
            $clock.each(function () {
                updateClock($(this));
            });
        }

        setTimeout(timedUpdate, 1000);
    }

    $(document).on('ready', function () {
        /* Init Carousel Locations */
        var $carousel = $('.a-js-carousel-map-locations');

        if ($carousel.length > 0) {
            $carousel.each(function () {
                var $this = $(this);
                var carouselSettings = $this.data('settings');

                $this
                    .on('init', function (e, slick) {
                        var $map = $this.closest('.a-map').find('.a-map__map');
                        var $currentLocation = $(slick.$slides[slick.currentSlide]).find('.a-map-item');
                        var map = {
                            data: {
                                id: $map.attr('id'),
                                currentLocationId: $currentLocation.data('location-id')
                            }
                        };

                        getLocationsData(slick.$slides);

                        if ($map.length > 0) {
                            if ($map.data('custom-marker-url')) {
                                map.data.customMarkerUrl = $map.data('custom-marker-url');
                            }

                            if ($map.data('style')) {
                                map.data.style = $map.data('style');
                            }

                            if ($map.data('zoom')) {
                                map.data.zoom = $map.data('zoom');
                            }

                            if ($map.data('center-offset-y')) {
                                var mapHeight = $map.height();

                                map.data.centerOffsetYRatio = (($map.data('center-offset-y') / mapHeight) * 100);
                            }

                            maps[map.data.id] = map;

                            initMap(map.data.id);
                        }

                        $currentLocation.addClass('a-map-item--active');

                        setContactDetails(map.data.currentLocationId, $this);
                    })
                    .slick({
                        slidesToShow: carouselSettings['xl_number_slides'],
                        slidesToScroll: 1,
                        prevArrow: '<button type="button" class="slick-prev"><span class="ai ai-arrow-left"></span></button>',
                        nextArrow: '<button type="button" class="slick-next"><span class="ai ai-arrow-right"></span></button>',
                        swipe: false,
                        infinite: false,
                        rtl: $('html').is('[dir]'),
                        responsive: [
                            {
                                breakpoint: 1200,
                                settings: {
                                    slidesToShow: carouselSettings['lg_number_slides']
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: carouselSettings['md_number_slides']
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: carouselSettings['sm_number_slides'],
                                    swipe: true
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: carouselSettings['xs_number_slides'],
                                    swipe: true
                                }
                            }
                        ]
                    });
            });
        }

        /* Clock Update Time */
        timedUpdate();
    });

    /* Change Map Location */
    $(document).on('click', '.a-js-change-map-location', function (e) {
        e.preventDefault();

        var $this = $(this);
        var $map = $this.closest('.a-map').find('.a-map__map');
        var locationId = $this.data('location-id');

        if ($map.length > 0) {
            var mapId = $map.attr('id');
            var markers = maps[mapId].markers;

            if (!maps[mapId].data.customMarkerUrl) {
                $.each(markers, function (id, marker) {
                    if (id === locationId) {
                        marker.activeMarker(true);
                    } else {
                        marker.activeMarker(false);
                    }
                });
            }

            changeMapCenter(mapId, locationId);
        }

        setContactDetails(locationId, $this.closest('.a-carousel'));

        $this.addClass('a-map-item--active');
        $this
            .closest('.a-carousel__item')
            .siblings()
            .find('.a-map-item')
            .removeClass('a-map-item--active');
    });

    google.maps.event.addDomListener(window, 'resize', function () {
        var $map = $('.a-js-map-init');

        if ($map.length > 0) {
            $map.each(function () {
                var $this = $(this),
                    $location = $this.closest('.a-map').find('.a-carousel').find('.a-map-item--active'),
                    mapId = $this.attr('id');

                updateMapHeight(mapId);

                if ($location.length > 0) {
                    changeMapCenter(mapId, $location.data('location-id'));
                }
            });
        }
    });

})(jQuery);