requirejs(['./config'], function () {
    requirejs(['jquery', 'bootstrap', '../js/locpin-map', '../js/autocomplete', '../js/locpin-pin', '../js/locpin-waypoint', 'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyA4DfuCpwwnP6HGi40sCaWwzuj5XQwdGeQ&libraries=places&language=EN'],
        function ($, bootstrap, mapModule, autoComplete) {

            function init() {
                var map = new mapModule.Map("#detailMap")
                    .bindHiddenFields()
                    .addCenterPin()
                    .loadPin(locpin)
                    .addPins(waypinInfos);

                $('#searchButton').click(function () {
                    map.goTo($('#searchBox').val());
                    return false;
                });
            }

            $(document).ready(function () {
                init();

                var autoCompleteObject = autoComplete.initialise('place');

                autoCompleteObject.addListener('place_changed',
                    function () {
                        var place = autoCompleteObject.getPlace();
                        var latLng = place.geometry.location;
                        me.goTo(latLng);
                        
                    });
            });
        });
});






