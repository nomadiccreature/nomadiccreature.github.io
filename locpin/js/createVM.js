requirejs(['./config'], function () {    
    requirejs([
        'jquery', 'bootstrap', '../js/locpin-map', '../js/autocomplete',
            'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyA4DfuCpwwnP6HGi40sCaWwzuj5XQwdGeQ&libraries=places&language=EN'
        ],
        function ($, bootstrap, mapModule, autoComplete) {
            var map;
            function init() {
                map = new mapModule.Map(".map").bindHiddenFields().addCenterPin();
                
                $('#useMyLocation').click(function () {
                    map.goToMyLocation();
                });

                $('#next').click(function () {
                    $('#form').submit();
                });
            }

            $(document).ready(function () {                
                init();

                var element = $('#place');
                
                if (element.length > 0) {
                    var autoCompleteObject = autoComplete.initialise(element[0]);

                    autoCompleteObject.addListener('place_changed',
                        function () {
                            var place = autoCompleteObject.getPlace();
                            map.goTo(place.formatted_address);
                        });

                    if (element.val() !== '') {
                        map.goTo($('#place').val());
                    };

                } else if (locpin != null) {                 
                    map.centerAndZoomTo(locpin);
                }
            });
        });
})




