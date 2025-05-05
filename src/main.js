import maplibregl from "maplibre-gl";
import circleToPolygon from "circle-to-polygon";
import "maplibre-gl/dist/maplibre-gl.css";

function initializeMap(mapCenter, zoom) {
    const map = new maplibregl.Map({
        container: 'map',
        style: 'https://tiles.openfreemap.org/styles/liberty', // A default tile source
        center: mapCenter,
        zoom: zoom
    });

    map.on('load', () => {
        // Add controls
        map.addControl(new maplibregl.NavigationControl({
            showZoom: true,  // Enables zoom buttons
            showCompass: true // Enables the compass
        }));
        map.addControl(new maplibregl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true // Keeps tracking the user’s movement
        }));
        map.addControl(new maplibregl.FullscreenControl());
        map.addControl(new maplibregl.ScaleControl());

        // Add a GeoJSON source for the circle
        const cirCenter = [-83.2393, 42.7845];
        const radius = 1609; // 1 mile in meters
        const polygon = circleToPolygon(cirCenter, radius);
        
        map.addSource('circle-source', {
            type: 'geojson',
            data: { type: "Feature", geometry: polygon }
        });

        // Add a layer to render the circle
        map.addLayer({
            id: 'circle-layer',
            type: 'fill',
            source: 'circle-source',
            paint: {
                'fill-color': '#ff0000', // Red color
                'fill-opacity': 0.5
            }
        });
    });
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {            
            if(!isNaN(position?.coords?.latitude) || !isNaN(position?.coords?.longitude)) {
                initializeMap([position.coords.longitude, position.coords.latitude], 10);
            }
            else
            {
                // TODO - is there a way to combine this with the other failure case?
                initializeMap([0,0], 2);
            }
    })
}
else
{
    initializeMap([0,0], 2);
}