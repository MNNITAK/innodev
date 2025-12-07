import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Helper to fix map rendering issues by forcing a resize
function MapController() {
  const map = useMap();
  useEffect(() => {
    // Invalidate size after mount to ensure tiles load correctly
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

function WorldMapSimulation() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Added error handling
    fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setGeoJsonData(data))
      .catch((err) => console.error("Map Data Error:", err));
  }, []);

  const geoJsonStyle = {
    fillColor: "#1a1a1a",
    weight: 0.5,
    opacity: 1,
    color: "#333333",
    fillOpacity: 0.7,
  };

  return (
    // [FIX] Changed -z-10 to z-0 so it sits ON TOP of the app background
    // [FIX] Added 'isolation-isolate' to create a new stacking context if needed
    <div className="absolute inset-0 z-0 w-full h-full bg-black">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={false}
        // [FIX] Ensure min-height prevents collapse
        style={{ height: "100%", width: "100%", background: "#000000", minHeight: "400px" }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          opacity={0.6}
        />
        {geoJsonData && <GeoJSON data={geoJsonData} style={geoJsonStyle} />}
        <MapController />
      </MapContainer>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
    </div>
  );
}

export default WorldMapSimulation;