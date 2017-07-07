requirejs(['./config'], function() {
    requirejs(['jquery'],
        function($) {            
            $(document).ready(function() {
                $(".MoveUp").click(function(e) { move(e, "Up") });
                $(".MoveDown").click(function(e) {move(e, "Down")});
            });

            function move(e, direction) {
                var id = $(e.target).parent().data('id');
                var url = '/api/Waypin/' + id + '/WaypinOrder';

                var object = { direction: direction }
                $.post(url, object).done(moved);
            }

            function moved() {
                location.reload(true);
            }
        });
});

    