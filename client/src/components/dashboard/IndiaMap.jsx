import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Maximize2, Minimize2, Plus, Minus } from "lucide-react";
import * as d3 from "d3";
import "leaflet/dist/leaflet.css";

// --- Mock Data ---
const stateData = {
  JK: { support: 45, name: "Jammu & Kashmir" },
  HP: { support: 62, name: "Himachal Pradesh" },
  PB: { support: 58, name: "Punjab" },
  UK: { support: 71, name: "Uttarakhand" }, // Display name is correct here
  HR: { support: 55, name: "Haryana" },
  DL: { support: 78, name: "Delhi" },
  RJ: { support: 52, name: "Rajasthan" },
  UP: { support: 48, name: "Uttar Pradesh" },
  BR: { support: 41, name: "Bihar" },
  SK: { support: 68, name: "Sikkim" },
  AR: { support: 73, name: "Arunachal Pradesh" },
  NL: { support: 65, name: "Nagaland" },
  MN: { support: 59, name: "Manipur" },
  MZ: { support: 72, name: "Mizoram" },
  TR: { support: 61, name: "Tripura" },
  ML: { support: 67, name: "Meghalaya" },
  AS: { support: 54, name: "Assam" },
  WB: { support: 63, name: "West Bengal" },
  JH: { support: 47, name: "Jharkhand" },
  OR: { support: 69, name: "Orissa" },
  CT: { support: 56, name: "Chhattisgarh" },
  MP: { support: 51, name: "Madhya Pradesh" },
  GJ: { support: 82, name: "Gujarat" },
  MH: { support: 74, name: "Maharashtra" },
  GA: { support: 79, name: "Goa" },
  KA: { support: 76, name: "Karnataka" },
  KL: { support: 83, name: "Kerala" },
  TN: { support: 71, name: "Tamil Nadu" },
  AP: { support: 64, name: "Andhra Pradesh" },
  TG: { support: 68, name: "Telangana" },
  AN: { support: 70, name: "Andaman & Nicobar" },
  CH: { support: 75, name: "Chandigarh" },
  DN: { support: 66, name: "Dadra & Nagar Haveli and Daman & Diu" },
  LA: { support: 53, name: "Ladakh" },
  LD: { support: 81, name: "Lakshadweep" },
  PY: { support: 77, name: "Puducherry" },
};

// --- Helpers ---
const getNormalizedValue = (stateCode) => {
  const data = stateData[stateCode];
  return data ? data.support / 100 : 0;
};

const getStateCodeByName = (geoName) => {
  const nameMap = {
    "Jammu and Kashmir": "JK", 
    "Himachal Pradesh": "HP", 
    "Punjab": "PB", 
    "Uttarakhand": "UK",
    "Uttaranchal": "UK", // Added alias for GeoJSON compatibility
    "Haryana": "HR", 
    "Delhi": "DL", 
    "Rajasthan": "RJ", 
    "Uttar Pradesh": "UP", 
    "Bihar": "BR",
    "Sikkim": "SK", 
    "Arunachal Pradesh": "AR", 
    "Nagaland": "NL", 
    "Manipur": "MN", 
    "Mizoram": "MZ",
    "Tripura": "TR", 
    "Meghalaya": "ML", 
    "Assam": "AS", 
    "West Bengal": "WB", 
    "Jharkhand": "JH",
    "Odisha": "OR",
    "Orissa": "OR",     // Added alias for GeoJSON compatibility
    "Chhattisgarh": "CT", 
    "Madhya Pradesh": "MP", 
    "Gujarat": "GJ", 
    "Maharashtra": "MH",
    "Goa": "GA", 
    "Karnataka": "KA", 
    "Kerala": "KL", 
    "Tamil Nadu": "TN", 
    "Andhra Pradesh": "AP",
    "Telangana": "TG", 
    "Andaman and Nicobar Islands": "AN", 
    "Chandigarh": "CH",
    "Dadra and Nagar Haveli and Daman and Diu": "DN", 
    "Ladakh": "LA", 
    "Lakshadweep": "LD", 
    "Puducherry": "PY"
  };
  return nameMap[geoName] || Object.keys(stateData).find(key => stateData[key].name === geoName);
};

// --- Sub-components for Map Interaction ---

function SetBounds({ geoJson }) {
  const map = useMap();
  useEffect(() => {
    if (geoJson) {
      const bounds = L.geoJSON(geoJson).getBounds();
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [geoJson, map]);
  return null;
}

// Custom Zoom and Fullscreen Control Panel
function MapController({ onToggleFullscreen, isFullscreen }) {
  const map = useMap();

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <div className="flex flex-col rounded-lg bg-white shadow-xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => map.zoomIn()}
          className="p-2.5 hover:bg-slate-100 border-b border-slate-200 transition-colors bg-white text-slate-700"
          title="Zoom In"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="p-2.5 hover:bg-slate-100 transition-colors bg-white text-slate-700"
          title="Zoom Out"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={onToggleFullscreen}
        className="p-2.5 rounded-lg bg-white shadow-xl border border-slate-200 hover:bg-slate-100 transition-colors text-slate-700"
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>
    </div>
  );
}

// --- Main Component ---

function IndiaMap() {
  const [geoData, setGeoData] = useState(null);
  const [hoveredData, setHoveredData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Ref for the container we want to make fullscreen
  const mapContainerRef = useRef(null);

  const colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([0.4, 0.9]);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading map data:", err));
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events (e.g. user pressing Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const style = (feature) => {
    const stateName = feature.properties.NAME_1 || feature.properties.name;
    const stateCode = getStateCodeByName(stateName);
    const value = stateCode ? getNormalizedValue(stateCode) : 0;

    return {
      fillColor: value ? colorScale(value) : "#EEE",
      weight: 1,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties.NAME_1 || feature.properties.name;
    const stateCode = getStateCodeByName(stateName);
    const data = stateData[stateCode];

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: "#666",
          dashArray: "",
          fillOpacity: 0.9,
        });
        setHoveredData({ name: stateName, ...data });
      },
      mouseout: (e) => {
        e.target.setStyle(style(feature));
        setHoveredData(null);
      },
    });
  };

  return (
    <Card className={`w-full h-full shadow-lg flex flex-col transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen w-screen" : ""}`}>
      <CardHeader className={isFullscreen ? "absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur rounded-lg shadow-md p-4 max-w-sm" : ""}>
        <CardTitle className="flex items-center justify-between">
          <span>Policy Support Heatmap</span>
          {!isFullscreen && (
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="block h-3 w-12 rounded bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></span>
                <span>0% - 100% Support</span>
              </div>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      {/* Container holding the map - ref is attached here for Fullscreen API */}
      <CardContent 
        ref={mapContainerRef} 
        className={`p-0 relative w-full overflow-hidden bg-slate-50 ${isFullscreen ? "h-screen" : "h-[600px] rounded-b-xl"}`}
      >
        {!geoData ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading Map Data...
          </div>
        ) : (
          <MapContainer
            center={[22.9734, 78.6569]}
            zoom={4}
            scrollWheelZoom={true} 
            dragging={true}
            doubleClickZoom={true}
            className="h-full w-full outline-none"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <GeoJSON 
              data={geoData} 
              style={style} 
              onEachFeature={onEachFeature} 
            />
            
            {/* Custom Controls inside MapContainer context */}
            <MapController 
                onToggleFullscreen={toggleFullscreen} 
                isFullscreen={isFullscreen} 
            />
            
            <SetBounds geoJson={geoData} />
          </MapContainer>
        )}

        {/* Floating Tooltip/Legend for Hover */}
        {hoveredData && (
          <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur shadow-xl border border-slate-200 p-4 rounded-lg min-w-[200px] animate-in fade-in slide-in-from-bottom-2 pointer-events-none">
            <h4 className="font-bold text-lg text-slate-800">{hoveredData.name}</h4>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Support</span>
                <span className={`font-bold ${hoveredData.support > 60 ? 'text-green-600' : 'text-orange-600'}`}>
                  {hoveredData.support}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-500"
                  style={{ width: `${hoveredData.support}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default IndiaMap;