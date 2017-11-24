var TYPE_ICONS = {
    "locpin": "/Images/Icons/pins/locpin/small.png",
    "waypin": "/Images/Icons/pins/waypin/small.png"
}

function Pin(info, map) {
    this.map = map;
    this.position = info.position;
    this.type = info.type;
    this.selected = info.selected;

    this.marker = this.addToMap();

    if (info.url) {
        this.url = info.url;
        this.bindClick();
    }
}

Pin.prototype.addToMap = function () {
    var marker = new google.maps.Marker({
        position: this.position,
        icon: TYPE_ICONS[this.type],
        map: this.map.gMap
    });

    marker.setOpacity(this.selected ? 0.5 : 1);

    return marker;
}

Pin.prototype.bindClick = function () {
    var me = this;

    google.maps.event.addListener(this.marker, "click", function () {
        window.location.href = me.url;
    });
}