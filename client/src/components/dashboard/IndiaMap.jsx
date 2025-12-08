import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock heatmap data for Indian states and union territories
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
  // Union Territories
  AN: { support: 70, name: "Andaman & Nicobar" },
  CH: { support: 75, name: "Chandigarh" },
  DN: { support: 66, name: "Dadra & Nagar Haveli and Daman & Diu" },
  LA: { support: 53, name: "Ladakh" },
  LD: { support: 81, name: "Lakshadweep" },
  PY: { support: 77, name: "Puducherry" },
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
            viewBox="0 0 680 850"
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
            style={{ maxHeight: "650px" }}
          >
            {/* Simplified India Map SVG paths */}
            {/* Ladakh */}
            <path
              d="M240,20 L290,15 L320,45 L305,90 L260,100 L235,70 Z"
              fill={getHeatmapColor(stateData["LA"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "LA")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Jammu & Kashmir */}
            <path
              d="M205,55 L265,100 L280,130 L320,135 L315,160 L270,175 L230,160 L195,125 Z"
              fill={getHeatmapColor(stateData["JK"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "JK")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Himachal Pradesh */}
            <path
              d="M270,175 L315,160 L340,180 L330,215 L280,225 L260,200 Z"
              fill={getHeatmapColor(stateData["HP"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "HP")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Punjab */}
            <path
              d="M195,155 L230,160 L260,200 L250,235 L210,240 L180,210 Z"
              fill={getHeatmapColor(stateData["PB"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "PB")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Chandigarh (small region near Haryana-Punjab border) */}
            <path
              d="M243,230 L253,228 L255,238 L245,240 Z"
              fill={getHeatmapColor(stateData["CH"].support)}
              stroke="#1f2937"
              strokeWidth="1.5"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "CH")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Uttarakhand */}
            <path
              d="M330,215 L365,200 L395,225 L380,260 L340,255 L325,240 Z"
              fill={getHeatmapColor(stateData["UK"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "UK")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Haryana */}
            <path
              d="M210,240 L250,235 L280,260 L275,295 L240,295 L220,270 Z"
              fill={getHeatmapColor(stateData["HR"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "HR")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Delhi */}
            <path
              d="M265,275 L280,272 L282,288 L267,291 Z"
              fill={getHeatmapColor(stateData["DL"].support)}
              stroke="#1f2937"
              strokeWidth="1.5"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "DL")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Rajasthan */}
            <path
              d="M115,245 L210,250 L240,295 L240,375 L175,400 L100,370 L85,310 Z"
              fill={getHeatmapColor(stateData["RJ"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "RJ")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Uttar Pradesh */}
            <path
              d="M275,295 L340,255 L395,265 L445,290 L450,355 L395,375 L340,390 L280,365 L270,320 Z"
              fill={getHeatmapColor(stateData["UP"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "UP")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Bihar */}
            <path
              d="M450,355 L505,335 L535,370 L520,410 L470,415 L450,385 Z"
              fill={getHeatmapColor(stateData["BR"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "BR")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Sikkim */}
            <path
              d="M510,305 L530,300 L538,318 L520,325 Z"
              fill={getHeatmapColor(stateData["SK"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "SK")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* West Bengal */}
            <path
              d="M470,415 L520,410 L555,435 L565,480 L540,525 L505,510 L480,465 Z"
              fill={getHeatmapColor(stateData["WB"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "WB")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Jharkhand */}
            <path
              d="M395,395 L450,385 L470,425 L460,470 L415,465 L390,435 Z"
              fill={getHeatmapColor(stateData["JH"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "JH")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Odisha */}
            <path
              d="M415,465 L460,470 L505,510 L510,560 L455,585 L400,565 L375,520 Z"
              fill={getHeatmapColor(stateData["OR"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "OR")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Chhattisgarh */}
            <path
              d="M340,430 L390,415 L415,465 L400,530 L360,540 L320,505 Z"
              fill={getHeatmapColor(stateData["CT"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "CT")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Madhya Pradesh */}
            <path
              d="M240,375 L340,390 L360,430 L340,500 L260,505 L200,480 L175,420 Z"
              fill={getHeatmapColor(stateData["MP"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "MP")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Gujarat */}
            <path
              d="M50,365 L115,380 L175,400 L180,455 L150,515 L90,530 L40,500 L30,420 Z"
              fill={getHeatmapColor(stateData["GJ"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "GJ")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Dadra & Nagar Haveli and Daman & Diu (between Gujarat and Maharashtra) */}
            <path
              d="M155,480 L168,476 L172,492 L159,496 Z"
              fill={getHeatmapColor(stateData["DN"].support)}
              stroke="#1f2937"
              strokeWidth="1.5"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "DN")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Maharashtra */}
            <path
              d="M150,515 L200,480 L260,505 L320,505 L345,555 L330,615 L280,640 L220,630 L170,610 L140,565 Z"
              fill={getHeatmapColor(stateData["MH"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "MH")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Goa */}
            <path
              d="M170,610 L185,605 L192,625 L177,630 Z"
              fill={getHeatmapColor(stateData["GA"].support)}
              stroke="#1f2937"
              strokeWidth="1.5"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "GA")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Telangana */}
            <path
              d="M330,555 L360,540 L400,565 L405,605 L375,635 L335,625 Z"
              fill={getHeatmapColor(stateData["TG"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "TG")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Andhra Pradesh */}
            <path
              d="M375,635 L405,605 L455,585 L485,615 L480,675 L445,705 L395,700 L360,670 Z"
              fill={getHeatmapColor(stateData["AP"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "AP")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Karnataka */}
            <path
              d="M220,630 L280,640 L330,625 L360,670 L355,730 L340,775 L300,780 L255,770 L220,740 L200,690 Z"
              fill={getHeatmapColor(stateData["KA"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "KA")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Kerala */}
            <path
              d="M220,740 L255,770 L265,800 L260,820 L245,825 L220,815 L205,795 L200,760 Z"
              fill={getHeatmapColor(stateData["KL"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "KL")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Tamil Nadu */}
            <path
              d="M340,775 L395,700 L445,705 L470,745 L465,790 L445,820 L410,830 L375,825 L340,815 L310,805 L285,800 L265,800 Z"
              fill={getHeatmapColor(stateData["TN"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "TN")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Puducherry (near Tamil Nadu coast) */}
            <path
              d="M420,760 L430,757 L433,770 L423,773 Z"
              fill={getHeatmapColor(stateData["PY"].support)}
              stroke="#1f2937"
              strokeWidth="1.5"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "PY")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Lakshadweep (small islands off Kerala coast) */}
            <path
              d="M140,790 L152,787 L155,800 L143,803 Z"
              fill={getHeatmapColor(stateData["LD"].support)}
              stroke="#1f2937"
              strokeWidth="1.5"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "LD")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Northeast States */}
            {/* Assam */}
            <path
              d="M535,330 L605,315 L620,355 L610,395 L560,410 L540,375 Z"
              fill={getHeatmapColor(stateData["AS"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "AS")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Arunachal Pradesh */}
            <path
              d="M575,260 L625,245 L638,285 L630,320 L605,315 L585,290 Z"
              fill={getHeatmapColor(stateData["AR"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "AR")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Nagaland */}
            <path
              d="M610,320 L628,312 L635,335 L617,343 Z"
              fill={getHeatmapColor(stateData["NL"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "NL")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Manipur */}
            <path
              d="M610,350 L628,342 L635,370 L617,378 Z"
              fill={getHeatmapColor(stateData["MN"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "MN")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Mizoram */}
            <path
              d="M600,385 L618,378 L625,410 L607,417 Z"
              fill={getHeatmapColor(stateData["MZ"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "MZ")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Tripura */}
            <path
              d="M575,400 L595,393 L602,420 L582,427 Z"
              fill={getHeatmapColor(stateData["TR"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "TR")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Meghalaya */}
            <path
              d="M555,360 L590,350 L598,380 L563,390 Z"
              fill={getHeatmapColor(stateData["ML"].support)}
              stroke="#1f2937"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "ML")}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Andaman & Nicobar (islands in Bay of Bengal) */}
            <path
              d="M595,540 L608,535 L615,560 L602,565 Z"
              fill={getHeatmapColor(stateData["AN"].support)}
              stroke="#1f2937"
              strokeWidth="1.5"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, "AN")}
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
