import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Layers,
  Tag,
  Maximize2,
  Map,
} from 'lucide-react';
import { CameraPreset, FarmBuildingData } from '../types/farm';
import { CAMERA_PRESETS } from '../data/farmData';

interface MapControlsProps {
  buildings: FarmBuildingData[];
  selectedBuilding: FarmBuildingData | null;
  onSelectBuilding: (building: FarmBuildingData) => void;
  onSelectPreset: (preset: CameraPreset) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetCamera: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  showExpansionZones: boolean;
  onToggleExpansionZones: () => void;
  explodeFloors: boolean;
  onToggleExplodeFloors: () => void;
  showBlueprintModal: boolean;
  onToggleBlueprintModal: () => void;
}

/**
 * Floating 3D Viewport Navigation & Facility Quick-Select HUD
 */
export const MapControls: React.FC<MapControlsProps> = ({
  buildings,
  selectedBuilding,
  onSelectBuilding,
  onSelectPreset,
  onZoomIn,
  onZoomOut,
  onResetCamera,
  showLabels,
  onToggleLabels,
  showExpansionZones,
  onToggleExpansionZones,
  explodeFloors,
  onToggleExplodeFloors,
  showBlueprintModal,
  onToggleBlueprintModal,
}) => {
  return (
    <>
      {/* Left Floating Facility Directory & Farm Summary */}
      <div className="pointer-events-auto fixed top-20 left-5 z-20 hidden lg:flex flex-col gap-2 w-68 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl p-3.5 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div>
            <h2 className="text-xs font-semibold text-white tracking-tight">
              Mapped Farm Structures
            </h2>
            <p className="text-[11px] text-slate-400">
              4 Chicken Houses · 1 Duck Ground
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleBlueprintModal}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              showBlueprintModal
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'bg-white/8 text-slate-300 hover:text-white hover:bg-white/15'
            }`}
          >
            2D Sketch Ref
          </button>
        </div>

        {/* Building List */}
        <div className="space-y-1">
          {buildings.map((b) => {
            const isSelected = selectedBuilding?.id === b.id;
            const isChicken = b.animalType === 'chickens';
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onSelectBuilding(b)}
                className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-amber-500/20 border border-amber-400/60 text-white'
                    : 'hover:bg-white/6 border border-transparent text-slate-300'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span
                      className={
                        isChicken ? 'text-amber-400' : 'text-teal-300'
                      }
                    >
                      {b.code}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">
                      ·
                    </span>
                    <span className="text-slate-400 truncate">
                      {b.floors === 2
                        ? '2 Stories'
                        : isChicken
                        ? 'Poultry'
                        : 'Waterfowl'}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-100 truncate">
                    {b.name}
                  </div>
                </div>

                <div className="text-right font-mono tabular-nums shrink-0">
                  <div className="text-xs font-semibold text-white">
                    {b.totalAnimals.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">
                    {b.animalType}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Visual Legend */}
        <div className="pt-2.5 border-t border-white/10 space-y-1 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span>Terracotta Roofs</span>
            <span className="text-slate-200">Chicken Houses (CH-001–004)</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Central L-Structure</span>
            <span className="text-amber-300 font-medium">
              2-Story Chicken Building
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>North Fenced Paddock</span>
            <span className="text-teal-300">Ducks Ground (DK-001)</span>
          </div>
        </div>
      </div>

      {/* Bottom-Left Camera & Layer Toolbar */}
      <div className="pointer-events-auto fixed bottom-14 md:bottom-5 left-5 z-20 flex flex-wrap items-center gap-2">
        {/* Zoom & Reset Controls */}
        <div className="flex items-center bg-slate-950/85 backdrop-blur-md border border-white/12 rounded-lg p-1 shadow-xl">
          <button
            type="button"
            onClick={onZoomIn}
            title="Zoom In"
            className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onZoomOut}
            title="Zoom Out"
            className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-white/12 mx-0.5" />
          <button
            type="button"
            onClick={onResetCamera}
            title="Reset Camera to Full Farm Overview"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>View Farm</span>
          </button>
        </div>

        {/* Camera Angle Presets */}
        <div className="hidden sm:flex items-center bg-slate-950/85 backdrop-blur-md border border-white/12 rounded-lg p-1 shadow-xl gap-1">
          {CAMERA_PRESETS.slice(1).map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Scene Layer Toggles */}
        <div className="flex items-center bg-slate-950/85 backdrop-blur-md border border-white/12 rounded-lg p-1 shadow-xl gap-1">
          <button
            type="button"
            onClick={onToggleExplodeFloors}
            title="Separate L-Building Ground & Upper Floors in 3D"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              explodeFloors
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">2-Floor Split</span>
          </button>

          <button
            type="button"
            onClick={onToggleLabels}
            title="Toggle 3D Map Labels"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              showLabels
                ? 'bg-white/15 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Labels</span>
          </button>

          <button
            type="button"
            onClick={onToggleExpansionZones}
            title="Show Future Farm Expansion Parcels"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              showExpansionZones
                ? 'bg-sky-500/25 text-sky-200 border border-sky-400/40'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Expansion Zones</span>
          </button>

          <button
            type="button"
            onClick={onToggleBlueprintModal}
            title="Compare with 2D Hand-Drawn Sketch Layout"
            className={`inline-flex lg:hidden items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              showBlueprintModal
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Sketch</span>
          </button>
        </div>
      </div>

      {/* 2D Sketch Reference Overlay Modal (Interactive comparison with the original layout sketch) */}
      {showBlueprintModal && (
        <div className="pointer-events-auto fixed bottom-20 left-5 lg:left-76 z-30 w-84 bg-slate-950/95 backdrop-blur-xl border border-white/15 rounded-xl p-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
            <div>
              <h3 className="text-xs font-semibold text-white">
                Sketch Layout Reference Map
              </h3>
              <p className="text-[11px] text-slate-400">
                Click any structure in the diagram to inspect in 3D
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleBlueprintModal}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/5 cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Interactive SVG recreation of the uploaded hand-drawn sketch */}
          <svg
            viewBox="0 0 300 320"
            className="w-full h-auto rounded-lg bg-[#0d1711] border border-white/10 p-2"
          >
            {/* 1. Ducks Ground (Top Dashed Rectangle) */}
            <g
              onClick={() => {
                const b = buildings.find((x) => x.id === 'ducks-ground-01');
                if (b) onSelectBuilding(b);
              }}
              className="cursor-pointer group"
            >
              <rect
                x="18"
                y="14"
                width="198"
                height="58"
                fill={
                  selectedBuilding?.id === 'ducks-ground-01'
                    ? 'rgba(45, 212, 191, 0.25)'
                    : 'rgba(20, 83, 45, 0.25)'
                }
                stroke="#38bdf8"
                strokeWidth="1.8"
                strokeDasharray="6 5"
              />
              {/* Sketch North Compass Arrow pointing Left */}
              <line
                x1="34"
                y1="46"
                x2="66"
                y2="46"
                stroke="#fbbf24"
                strokeWidth="1.5"
              />
              <line
                x1="50"
                y1="30"
                x2="50"
                y2="60"
                stroke="#fbbf24"
                strokeWidth="1.2"
              />
              <polyline
                points="40,42 33,46 40,50"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.5"
              />
              <text
                x="34"
                y="27"
                fill="#fbbf24"
                fontSize="8"
                fontFamily="monospace"
              >
                ← North.
              </text>
              <text
                x="92"
                y="46"
                fill="#e2e8f0"
                fontSize="11"
                fontWeight="600"
              >
                Ducks ground (DK-001)
              </text>
            </g>

            {/* 2. Left Long Building (CH-001) with Dotted Division Line */}
            <g
              onClick={() => {
                const b = buildings.find(
                  (x) => x.id === 'west-poultry-house-01'
                );
                if (b) onSelectBuilding(b);
              }}
              className="cursor-pointer"
            >
              <rect
                x="20"
                y="90"
                width="48"
                height="196"
                fill={
                  selectedBuilding?.id === 'west-poultry-house-01'
                    ? 'rgba(245, 158, 11, 0.35)'
                    : 'rgba(255, 255, 255, 0.06)'
                }
                stroke="#f59e0b"
                strokeWidth="1.8"
              />
              {/* Dotted internal division line from sketch */}
              <line
                x1="22"
                y1="154"
                x2="66"
                y2="154"
                stroke="#fbbf24"
                strokeWidth="1.8"
                strokeDasharray="2 5"
              />
              <text
                x="44"
                y="195"
                fill="#f8fafc"
                fontSize="9.5"
                textAnchor="middle"
                fontWeight="600"
              >
                CH-001
              </text>
              <text
                x="44"
                y="208"
                fill="#94a3b8"
                fontSize="8"
                textAnchor="middle"
              >
                1,120 Birds
              </text>
            </g>

            {/* 3. Central Two-Story L-Shaped Building (CH-002) */}
            <g
              onClick={() => {
                const b = buildings.find((x) => x.id === 'l-building-01');
                if (b) onSelectBuilding(b);
              }}
              className="cursor-pointer"
            >
              <polygon
                points="100,90 214,90 214,196 166,196 166,138 100,138"
                fill={
                  selectedBuilding?.id === 'l-building-01'
                    ? 'rgba(245, 158, 11, 0.42)'
                    : 'rgba(245, 158, 11, 0.16)'
                }
                stroke="#fbbf24"
                strokeWidth="2.2"
              />
              <text
                x="158"
                y="112"
                fill="#fef3c7"
                fontSize="10"
                textAnchor="middle"
                fontWeight="700"
              >
                L-Building (CH-002)
              </text>
              <text
                x="158"
                y="125"
                fill="#fde68a"
                fontSize="8.5"
                textAnchor="middle"
              >
                2 Floors · 1,850 Chickens
              </text>
            </g>

            {/* 4. Bottom-Center Rectangular Building (CH-003) */}
            <g
              onClick={() => {
                const b = buildings.find(
                  (x) => x.id === 'south-poultry-house-03'
                );
                if (b) onSelectBuilding(b);
              }}
              className="cursor-pointer"
            >
              <rect
                x="100"
                y="236"
                width="114"
                height="50"
                fill={
                  selectedBuilding?.id === 'south-poultry-house-03'
                    ? 'rgba(245, 158, 11, 0.35)'
                    : 'rgba(255, 255, 255, 0.06)'
                }
                stroke="#f59e0b"
                strokeWidth="1.8"
              />
              <text
                x="157"
                y="259"
                fill="#f8fafc"
                fontSize="9.5"
                textAnchor="middle"
                fontWeight="600"
              >
                South House (CH-003)
              </text>
              <text
                x="157"
                y="272"
                fill="#94a3b8"
                fontSize="8"
                textAnchor="middle"
              >
                680 Chickens
              </text>
            </g>

            {/* 5. Right Long Building — Brooder / Broiler House (CH-004) */}
            <g
              onClick={() => {
                const b = buildings.find((x) => x.id === 'broiler-house-01');
                if (b) onSelectBuilding(b);
              }}
              className="cursor-pointer"
            >
              <rect
                x="236"
                y="90"
                width="46"
                height="196"
                fill={
                  selectedBuilding?.id === 'broiler-house-01'
                    ? 'rgba(245, 158, 11, 0.35)'
                    : 'rgba(255, 255, 255, 0.06)'
                }
                stroke="#f59e0b"
                strokeWidth="1.8"
              />
              <text
                x="259"
                y="188"
                fill="#f8fafc"
                fontSize="9.5"
                textAnchor="middle"
                fontWeight="600"
                transform="rotate(90 259 188)"
              >
                Brooder House (CH-004)
              </text>
            </g>
          </svg>
        </div>
      )}
    </>
  );
};
