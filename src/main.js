import maplibregl from "maplibre-gl";
import circleToPolygon from "circle-to-polygon";
import "maplibre-gl/dist/maplibre-gl.css";

/*
function saveGeoJSON(data, filename = "debug.geojson") {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000); // Cleanup
}
 */

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

        // Add city boundary (starting with NYC)

        fetch("/newyorkcity.geojson")
            .then(response => response.json())
            .then(data => {
                const worldBoundingBox = [
                    [-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90] // Covers the whole world
                ];
                
                // TODO - figure out why extra braces were there which required 2x flattens
                const invertedData = {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: "Polygon",
                                coordinates: [
                                    worldBoundingBox,
                                    ...data.features.flatMap(feature => feature.geometry.coordinates).flat() // ✅ Subtract boundar
                                ]
                            },
                            properties: { name: "Negative Shading Area" }
                        }
                    ]
                };
                
                map.addSource("negative-shading", { type: "geojson", data : invertedData });
                map.addLayer({
                    id: "negative-fill",
                    type: "fill",
                    source: "negative-shading",
                    paint: { "fill-color": "#000000", "fill-opacity": 0.5 }
                });

                // saveGeoJSON(invertedData, "negative_shading.geojson");
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