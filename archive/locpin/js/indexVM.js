requirejs(['./config'], function() {
    requirejs([
        'jquery', '../js/autocomplete', 'bootstrap' , 
            'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyA4DfuCpwwnP6HGi40sCaWwzuj5XQwdGeQ&libraries=places&language=EN'
        ],
        function ($, autoCompleteModule, bootstrap ) {
            $(document).ready(function () {
                
                $('#submit').click(function() {
                    $('#searchForm').submit();
                });
                    
                autoCompleteModule.initialise(document.getElementById('place'));

            });
        });
})