define(['async!https://maps.googleapis.com/maps/api/js?key=AIzaSyA4DfuCpwwnP6HGi40sCaWwzuj5XQwdGeQ&libraries=places&language=EN'],
    function () {


        function initialise(element) {

            // Create the autocomplete object, restricting the search to geographical
            // location types.
            var autoComplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */
                (element),
                { types: ['geocode'] });

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    var circle = new google.maps.Circle({
                        center: geolocation,
                        radius: position.coords.accuracy
                    });
                    autoComplete.setBounds(circle.getBounds());
                });
            }

            return autoComplete;
        }

        return {
            initialise: initialise
        }
    });





