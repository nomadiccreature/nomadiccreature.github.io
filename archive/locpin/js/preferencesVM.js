requirejs(['./config'],
    function() {
        require(['jquery'],
            function($) {
                $(document).ready(function() {
                    $('#next').click(function() {
                        $('#form').submit();
                    });
                });
            });
    });