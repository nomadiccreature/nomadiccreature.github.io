﻿requirejs(['./config'], function() {
    requirejs([
            'jquery', 'bootstrap', '../js/locpin-map','../js/locpin-waypoint','../js/locpin-pin',
            'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyA4DfuCpwwnP6HGi40sCaWwzuj5XQwdGeQ&libraries=places&language=EN'
        ],
        function($, bootstrap, mapModule) {
            
            function init() {
                var map = new mapModule.Map(".map")
                    .bindHiddenFields()
                    .addCenterPin("waypin")
                    .loadPin(locpin)
                    .addPins(waypinInfos);

                $('#search').click(function () {
                    map.goTo($('#postCode').val());
                    return false;
                });
            }

            $(document).ready(function() {
                init();    
            });
            
        });
})