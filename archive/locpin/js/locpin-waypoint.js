//waypoint initialisation calls
Map.prototype.wayPointInit = function (wayPoints) {

    this.directionsService = new google.maps.DirectionsService();

    var rendererOptions = { map: this.map }

    this.directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    this.stepDisplay = new google.maps.InfoWindow();

    this.markerArray = [];

    if (wayPoints === null || wayPoints === undefined) {
        this.wayPoints = [];
    }
    else {
        this.setWaypoints(wayPoints);
    }
}

//set where driving instructions will go.
Map.prototype.setDirectionsPanelFromID = function (selector) {
    this.directionsDisplay.setPanel(document.getElementById(selector));
}

//if wayPoints not specified in init, can be set with this
Map.prototype.setWaypoints = function (wayPoints, isLatLng) {
    for (i in wayPoints) {
        this.addWaypoint(wayPoints[i], isLatLng);
    }
};

//add single waypoint.
Map.prototype.addWaypoint = function (wayPoint, isLatLng) {
    var tempWaypoint = wayPoint;
    if (isLatLng) {
        tempWaypoint = new google.maps.LatLng(wayPoint.Latitude, wayPoint.Longitude);
    }
    this.wayPoints.push({ location: tempWaypoint, stopover: true });
};

Map.prototype.setStart = function (start, isLatLng) {
    this.start = start;

    if (isLatLng) {
        this.start = new google.maps.LatLng(start.Latitude, start.Longitude);
    }
};

Map.prototype.setEnd = function (end, isLatLng) {
    this.end = end;

    if (isLatLng) {
        this.end = new google.maps.LatLng(end.Latitude, end.Longitude);
    }
}

Map.prototype.calculateRoute = function () {
    // First, remove any existing markers from the map.
    for (var i = 0; i < this.markerArray.length; i++) {
        this.markerArray[i].setMap(null);
    }

    // Now, clear the array itself.
    this.markerArray = [];

    // Retrieve the start and end locations and create
    // a DirectionsRequest using WALKING directions.
    var request = {
        origin: this.start,
        destination: this.end,
        waypoints: this.wayPoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
    };

    var currentMap = this;

    // Route the directions and pass the response to a
    // function to create markers for each step.
    this.directionsService.route(request, function (response, status) {
        console.log(response);
        console.log(status);
        console.log(this);
        if (status === google.maps.DirectionsStatus.OK) {
            var warnings = document.getElementById('warnings_panel');
            warnings.innerHTML = '<b>' + response.routes[0].warnings + '</b>';
            currentMap.directionsDisplay.setDirections(response);
            currentMap.showSteps(response);
        }
    });
};

Map.prototype.showSteps = function (directionResult) {
    // For each step, place a marker, and add the text to the marker's
    // info window. Also attach the marker to an array so we
    // can keep track of it and remove it when calculating new
    // routes.
    var myRoute = directionResult.routes[0].legs[0];

    for (var i = 0; i < myRoute.steps.length; i++) {
        var marker = new google.maps.Marker({
            position: myRoute.steps[i].start_location,
            map: map
        });
        this.attachInstructionText(marker, myRoute.steps[i].instructions);
        this.markerArray[i] = marker;
    }
};

Map.prototype.attachInstructionText = function (marker, text) {
    google.maps.event.addListener(marker, 'click', function () {
        // Open an info window when the marker is clicked on,
        // containing the text of the step.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
    });
};