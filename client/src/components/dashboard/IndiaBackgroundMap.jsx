import { useEffect, useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function IndiaBackgroundMap() {
  const [indiaGeoJson, setIndiaGeoJson] = useState(null);

  useEffect(() => {
    // Proper India GeoJSON (country outline) from GitHub
    fetch(
      "https://raw.githubusercontent.com/adarshbiradar/maps-geojson/master/india.json"
    )
      .then((res) => res.json())
      .then((data) => setIndiaGeoJson(data))
      .catch((err) => console.error("India map error:", err));
  }, []);

  const indiaStyle = {
    fillColor: "#000000", // black fill
    color: "#000000",     // black border
    weight: 0.7,
    fillOpacity: 1,
  };

  return (
    <div className="pointer-events-none absolute inset-0">
      <MapContainer
        center={[22.5, 79]}   // roughly center of India
        zoom={4}
        minZoom={4}
        maxZoom={4}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full"
        style={{ background: "#ffffff" }}   // pure white background
      >
        {indiaGeoJson && <GeoJSON data={indiaGeoJson} style={indiaStyle} />}
      </MapContainer>
    </div>
  );
}

export default IndiaBackgroundMap;
