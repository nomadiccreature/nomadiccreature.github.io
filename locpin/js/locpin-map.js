define( ['async!https://maps.googleapis.com/maps/api/js?key=AIzaSyA4DfuCpwwnP6HGi40sCaWwzuj5XQwdGeQ&libraries=places&language=EN'], function () {
    
    if (typeof google !== 'undefined') {
        Map.defaults = {
            center: { lat: 51.4778, lng: 0.0015 },
            zoom: 12,
            streetViewControl: false,
            panControl: false,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };
    }

    function getStreetViewButton() {
        var buttonNode = document.createElement("button");
        buttonNode.type = "button";
        buttonNode.textContent = "street view";
        buttonNode.style.position = "absolute";
        buttonNode.style.zIndex = 100;
        buttonNode.style.bottom = "20px";
        buttonNode.style.right = "50px";
        buttonNode.style.minWidth = "70px";
        buttonNode.style.margin = "0";
        buttonNode.style.padding = "0 5px";
        buttonNode.style.fontSize = "12px";

        return buttonNode;
    }

    function Map(selector, mapOptions) {
        // gMap is a reference to the actual google map object
        this.element = document.querySelector(selector);
        this.gMap = new google.maps.Map(this.element, mapOptions || Map.defaults);
        this.pins = [];
        this._addStreetView();

        //Adds a simple geoJson file which contains (very approximate) boundaries for France, in case you want to do the "Google Maps first" approach

        this.gMap.data.loadGeoJson('/Content/france.json');
        //Fills the loaded geometry with green color for debug purpose
        //this.gMap.data.setStyle({
        //    fillColor: 'green',
        //    strokeWeight: 1
        //});

    }

    // Binds the latitude/longitude hidden fields so they are updated when the map center changes
    Map.prototype.bindHiddenFields = function () {
        var me = this;
        function bindZoomField() {
            var zoomLevelField = document.querySelector("[id*='hfZoomLevel']");

            function setZoomLevelField() {
                zoomLevelField.value = me.gMap.getZoom();
            }

            me.gMap.addListener("zoom_changed", setZoomLevelField);
            setZoomLevelField();
        }

        function bindGeolocationFields() {
            var latitudeField = document.querySelector("[id*='hfLatitude']");
            var longitudeField = document.querySelector("[id*='hfLongitude']");

            function setGeolocationFields() {
                latitudeField.value = me.gMap.getCenter().lat();
                longitudeField.value = me.gMap.getCenter().lng();

            }

            me.gMap.addListener("center_changed", setGeolocationFields);
            setGeolocationFields();
        }

        bindGeolocationFields();
        bindZoomField();

        return this;
    }

    // Adds a pin to the center of the map (note - this is not a marker)
    Map.prototype.addCenterPin = function (cssClass) {
        var center = document.createElement("div");
        center.setAttribute("class", "center-marker " + cssClass || "");
        this.gMap.getDiv().appendChild(center);

        return this;
    }

    // Recenters the map on the given position
    Map.prototype.goTo = function (position) {
        var me = this;
        // allow for both LatLng input and string address
        this.parsePosition(position, function (pos, bounds) {
            me.gMap.setCenter(pos);
            if (bounds)
                me.gMap.fitBounds(bounds);
        });

        return this;
    }

    // Attempts to use HTML5 geolocation to go to the current position
    Map.prototype.goToMyLocation = function () {
        var me = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function useCurrentPosition(position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                me.goTo(pos);
            }, null, { enableHighAccuracy: true });
        }
        return this;
    }

    // Converts a string or object position into a LatLng that can be used by google maps
    Map.prototype.parsePosition = function (position, callback) {
        me = this;

        if (typeof position === "string") {
            if (position.length === 0) {
                return;
            }

            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({ address: position }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {

                    var geoData = results[0].geometry;

                    if (findCountryName(results[0]) === "FR") {
                        callSercaMap(position, geoData, callback);
                    }
                    else {
                        callback(geoData.location, geoData.bounds);
                    }
                } else {
                    alert("The address you entered could not be found, please check and try again.");
                }
            });
        } else {
            if (position instanceof google.maps.LatLng) {
                callback(position);
            } else {
                callback(this.convertToLatLng(position));
            }
        }
    }

    function findCountryName(geoData) {
        var result = '';

        for (var i = 0; i < geoData.address_components.length; i++) {
            if (geoData.address_components[i].types[0] === "country") {
                result = geoData.address_components[i].short_name;
                break;
            }
        }

        return result;
    }

    function callSercaMap(position, geoData, callback) {
        $.getJSON("api/SercaMap/GetLocation?position=" + position, function (data) {

                data = JSON.parse(data);

                if (data.reponse.numFound > 0) {

                    var lat = parseFloat(data.reponse.adresse[0].latitudeWGS84);
                    var lng = parseFloat(data.reponse.adresse[0].longitudeWGS84);
                    var secraGeoData = new google.maps.LatLng(lat, lng);

                    callback(secraGeoData, null);
                }
            })
            .fail(function () {
                callback(geoData.location, geoData.bounds);
            });
    }

    // Converts standard position JSON ({ Latitude: ..., Longitude: ... }) from server into a google.gMaps.LatLng
    Map.prototype.convertToLatLng = function (position) {
        return new google.maps.LatLng(position.Latitude, position.Longitude);
    }

    // Centers the map on the given position of a locpin
    Map.prototype.loadPin = function (pin) {
        if (pin) {
            this.addPin(pin);
            this.centerAndZoomTo(pin);
        } else {
            this.goToMyLocation();
        }

        return this;
    }

    Map.prototype.centerAndZoomTo = function (pin) {
        this.goTo(pin.position);
        this.gMap.setZoom(pin.zoomLevel);
    }

    // Adds a marker to the map
    Map.prototype.addPin = function (info) {
        var me = this;
        this.parsePosition(info.position, function (pos) {
            info.position = pos;
        });

        me.pins.push(new Pin(info, this));

        return this;
    }

    // Adds the given positions to the map as markers
    Map.prototype.addPins = function (infos) {
        for (var i = 0; i < infos.length; i++) {
            this.addPin(infos[i]);
        }

        // set zoom to selected

        return this;
    }

    // Zooms the map out to fit all current markers
    Map.prototype.expandBoundsToFitMarkers = function () {
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < this.pins.length; i++) {
            bounds.extend(this.pins[i].marker.position);
        }

        this.gMap.fitBounds(bounds);

        return this;
    }

    Map.prototype._addStreetView = function () {
        this._streetViewButton = getStreetViewButton();
        this.element.appendChild(this._streetViewButton);
        this.panorama = this.gMap.getStreetView();

        var self = this;
        this._streetViewButton.onclick = function () {
            self._toggleStreetView();
            return false;
        }
    }

    Map.prototype._toggleStreetView = function () {
        var panoramaVisible = this.panorama.getVisible();

        if (panoramaVisible) {
            this._changeFromPanoramaToMap();
        } else {
            this._changeFromMapToPanorama();
        }
    }

    Map.prototype._changeFromPanoramaToMap = function () {
        var newPosition = map.panorama.getPosition();

        var lat = newPosition.lat();
        var lng = newPosition.lng();

        var newPlace = new google.maps.LatLng(lat, lng);

        this.gMap.setCenter(newPlace);

        this._streetViewButton.textContent = "street view";

        this.panorama.setVisible(false);
    }

    Map.prototype._changeFromMapToPanorama = function () {
        var lat = this.gMap.getCenter().lat();
        var lng = this.gMap.getCenter().lng();

        var newPlace = new google.maps.LatLng(lat, lng);

        this.panorama.setPosition(newPlace);
        this.panorama.setPov({
            heading: 0,
            pitch: 0
        });

        this._streetViewButton.textContent = "satellite view";

        this.panorama.setVisible(true);
    }

    return {
        Map: Map
    }
});