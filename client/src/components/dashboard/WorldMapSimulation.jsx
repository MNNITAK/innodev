import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 1. Fix Leaflet's default icon path issues in Vite/Webpack
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// 2. Custom pulsing marker using Tailwind classes
const createPulseIcon = () => {
  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.75_0.18_165)]/50 opacity-75"></span>
        <span class="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.75_0.18_165)] shadow-[0_0_10px_oklch(0.75_0.18_165)]"></span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12], // Center the icon
  });
};

// 3. Indian Cities Data
const CITIES = [
  { name: "New Delhi", lat: 28.6139, lon: 77.209 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
  { name: "Chennai", lat: 13.0827, lon: 80.2707 },
];

// 4. Auto-Pan Component
function AutoPanMap() {
  const map = useMap();
  const animationRef = useRef();

  useEffect(() => {
    let longitude = 78.9629; // Start at India center
    
    const animate = () => {
      // Very slow drift to simulate "scanning"
      // Pan by 0.05 degrees per frame
      map.panBy([0.5, 0], { animate: false }); 
      animationRef.current = requestAnimationFrame(animate);
    };

    // Disable interaction for "Simulation Mode" feel (optional)
    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [map]);

  return null;
}

export default function WorldMapSimulation() {
  return (
    <div className="absolute inset-0 z-0 w-full h-full bg-black">
      <MapContainer
        center={[22.5937, 78.9629]} // Center on India
        zoom={5}
        zoomControl={false}
        attributionControl={false} // Clean look
        className="w-full h-full"
        style={{ background: "#050505" }} // Dark background to hide loading tiles
      >
        {/* Dark Matter Tiles - High contrast, perfect for dashboards */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />

        {/* City Markers */}
        {CITIES.map((city) => (
          <Marker 
            key={city.name} 
            position={[city.lat, city.lon]} 
            icon={createPulseIcon()} 
          />
        ))}

        {/* Auto Animation Control */}
        <AutoPanMap />
      </MapContainer>

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.6)_80%,#000000_100%)] z-[1000]" />
      
      {/* Scanline Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05] z-[1000]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} 
      />
    </div>
  );
}