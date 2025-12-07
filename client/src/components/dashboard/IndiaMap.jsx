
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock heatmap data for Indian states
const stateData = {
  JK: { support: 45, name: "Jammu & Kashmir" },
  HP: { support: 62, name: "Himachal Pradesh" },
  PB: { support: 58, name: "Punjab" },
  UK: { support: 71, name: "Uttarakhand" },
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
  OR: { support: 69, name: "Odisha" },
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
};

// Get color based on support percentage
function getHeatmapColor(support) {
  if (support >= 75) return "#22c55e"; // green-500
  if (support >= 60) return "#84cc16"; // lime-500
  if (support >= 50) return "#eab308"; // yellow-500
  if (support >= 40) return "#f97316"; // orange-500
  return "#ef4444"; // red-500
}

function IndiaMap() {
  const [hoveredState, setHoveredState] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e, stateCode) => {
    setHoveredState(stateCode);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Policy Support Heatmap - India</span>
          <div className="flex items-center gap-2 text-xs font-normal">
            <span className="flex items-center gap-1">
              <span
                className="h-3 w-3 rounded"
                style={{ backgroundColor: "#ef4444" }}
              />
              {"<40%"}
            </span>
            <span className="flex items-center gap-1">
              <span
                className="h-3 w-3 rounded"
                style={{ backgroundColor: "#f97316" }}
              />
              40-50%
            </span>
            <span className="flex items-center gap-1">
              <span
                className="h-3 w-3 rounded"
                style={{ backgroundColor: "#eab308" }}
              />
              50-60%
            </span>
            <span className="flex items-center gap-1">
              <span
                className="h-3 w-3 rounded"
                style={{ backgroundColor: "#84cc16" }}
              />
              60-75%
            </span>
            <span className="flex items-center gap-1">
              <span
                className="h-3 w-3 rounded"
                style={{ backgroundColor: "#22c55e" }}
              />
              {">75%"}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg
            viewBox="0 0 600 700"
            className="w-full h-auto"
            style={{ maxHeight: "500px" }}
          >
            {/* Simplified India Map SVG paths */}
            {/* Jammu & Kashmir */}
            <path
              d="M200,50 L280,30 L320,60 L310,120 L260,140 L200,120 Z"
              fill={getHeatmapColor(stateData["JK"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "JK")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Himachal Pradesh */}
            <path
              d="M260,140 L310,120 L330,150 L300,180 L260,160 Z"
              fill={getHeatmapColor(stateData["HP"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "HP")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Punjab */}
            <path
              d="M200,120 L260,140 L260,180 L220,200 L180,180 Z"
              fill={getHeatmapColor(stateData["PB"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "PB")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Uttarakhand */}
            <path
              d="M300,180 L350,160 L380,190 L350,220 L310,210 Z"
              fill={getHeatmapColor(stateData["UK"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "UK")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Haryana */}
            <path
              d="M220,200 L260,180 L280,200 L270,240 L230,240 Z"
              fill={getHeatmapColor(stateData["HR"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "HR")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Delhi */}
            <path
              d="M255,225 L275,225 L275,245 L255,245 Z"
              fill={getHeatmapColor(stateData["DL"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "DL")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Rajasthan */}
            <path
              d="M120,200 L220,200 L230,240 L220,320 L140,340 L100,280 Z"
              fill={getHeatmapColor(stateData["RJ"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "RJ")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Uttar Pradesh */}
            <path
              d="M270,240 L350,220 L420,250 L420,320 L320,340 L260,300 Z"
              fill={getHeatmapColor(stateData["UP"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "UP")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Bihar */}
            <path
              d="M420,320 L480,300 L500,340 L470,370 L420,360 Z"
              fill={getHeatmapColor(stateData["BR"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "BR")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* West Bengal */}
            <path
              d="M470,370 L520,350 L540,420 L500,480 L460,440 Z"
              fill={getHeatmapColor(stateData["WB"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "WB")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Jharkhand */}
            <path
              d="M420,360 L470,370 L460,420 L410,410 Z"
              fill={getHeatmapColor(stateData["JH"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "JH")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Odisha */}
            <path
              d="M380,420 L460,420 L480,500 L400,520 L360,480 Z"
              fill={getHeatmapColor(stateData["OR"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "OR")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Chhattisgarh */}
            <path
              d="M320,380 L380,370 L400,440 L360,480 L300,450 Z"
              fill={getHeatmapColor(stateData["CT"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "CT")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Madhya Pradesh */}
            <path
              d="M220,320 L320,340 L340,380 L300,450 L200,420 L180,360 Z"
              fill={getHeatmapColor(stateData["MP"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "MP")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Gujarat */}
            <path
              d="M60,320 L140,340 L160,400 L120,460 L40,440 L30,380 Z"
              fill={getHeatmapColor(stateData["GJ"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "GJ")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Maharashtra */}
            <path
              d="M120,460 L200,420 L300,450 L320,520 L260,560 L140,540 Z"
              fill={getHeatmapColor(stateData["MH"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "MH")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Telangana */}
            <path
              d="M260,500 L340,480 L380,520 L340,560 L280,550 Z"
              fill={getHeatmapColor(stateData["TG"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "TG")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Andhra Pradesh */}
            <path
              d="M280,550 L380,520 L420,560 L380,620 L300,600 Z"
              fill={getHeatmapColor(stateData["AP"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "AP")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Karnataka */}
            <path
              d="M180,540 L260,560 L280,620 L240,680 L160,660 L140,580 Z"
              fill={getHeatmapColor(stateData["KA"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "KA")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Kerala */}
            <path
              d="M200,660 L240,680 L230,750 L190,760 L180,700 Z"
              fill={getHeatmapColor(stateData["KL"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "KL")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Tamil Nadu */}
            <path
              d="M240,680 L300,660 L340,700 L300,760 L230,750 Z"
              fill={getHeatmapColor(stateData["TN"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "TN")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Goa */}
            <path
              d="M140,580 L160,570 L165,595 L145,600 Z"
              fill={getHeatmapColor(stateData["GA"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "GA")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Northeast States (simplified) */}
            {/* Sikkim */}
            <path
              d="M480,280 L500,275 L505,295 L485,300 Z"
              fill={getHeatmapColor(stateData["SK"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "SK")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Assam */}
            <path
              d="M500,280 L580,260 L590,310 L520,330 Z"
              fill={getHeatmapColor(stateData["AS"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "AS")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Arunachal Pradesh */}
            <path
              d="M540,220 L600,200 L610,250 L560,270 Z"
              fill={getHeatmapColor(stateData["AR"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "AR")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Nagaland */}
            <path
              d="M580,270 L600,260 L610,290 L590,300 Z"
              fill={getHeatmapColor(stateData["NL"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "NL")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Manipur */}
            <path
              d="M580,300 L600,290 L605,320 L585,330 Z"
              fill={getHeatmapColor(stateData["MN"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "MN")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Mizoram */}
            <path
              d="M570,330 L590,320 L595,360 L575,370 Z"
              fill={getHeatmapColor(stateData["MZ"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "MZ")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Tripura */}
            <path
              d="M545,350 L565,340 L570,370 L550,380 Z"
              fill={getHeatmapColor(stateData["TR"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "TR")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Meghalaya */}
            <path
              d="M520,320 L560,310 L565,340 L525,350 Z"
              fill={getHeatmapColor(stateData["ML"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "ML")}
              onMouseLeave={() => setHoveredState(null)}
            />
          </svg>

          {/* Tooltip */}
          {hoveredState && stateData[hoveredState] && (
            <div
              className="pointer-events-none fixed z-50 rounded-lg bg-popover px-3 py-2 text-sm shadow-lg border border-border"
              style={{
                left: tooltipPos.x + 10,
                top: tooltipPos.y + 10,
              }}
            >
              <p className="font-semibold">{stateData[hoveredState].name}</p>
              <p className="text-muted-foreground">
                Support:{" "}
                <span className="font-medium text-foreground">
                  {stateData[hoveredState].support}%
                </span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default IndiaMap;
