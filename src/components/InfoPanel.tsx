import React from 'react';
import { X, Layers, Focus } from 'lucide-react';
import {
  BuildingLevelData,
  FarmBuildingData,
  SelectedFloorFilter,
} from '../types/farm';

interface InfoPanelProps {
  building: FarmBuildingData | null;
  selectedFloor: SelectedFloorFilter;
  onSelectFloor: (floor: SelectedFloorFilter) => void;
  explodeFloors: boolean;
  onToggleExplodeFloors: () => void;
  onClose: () => void;
  onFocusBuilding: (building: FarmBuildingData) => void;
}

/**
 * Slide-in Building Information Inspector Panel
 * Displays livestock telemetry, capacity utilization, environmental metrics,
 * and multi-story floor controls for the Central L-Building (Ground Floor, Upper Floor, Entire Building).
 */
export const InfoPanel: React.FC<InfoPanelProps> = ({
  building,
  selectedFloor,
  onSelectFloor,
  explodeFloors,
  onToggleExplodeFloors,
  onClose,
  onFocusBuilding,
}) => {
  if (!building) {
    return (
      <div className="pointer-events-none fixed bottom-5 left-1/2 -translate-x-1/2 z-20">
        <div className="px-4 py-2 rounded-lg bg-slate-950/75 backdrop-blur-md border border-white/10 text-xs text-slate-300 tracking-wide whitespace-nowrap shadow-lg">
          Click a building to view animal information · Drag to rotate · Scroll to zoom · Right-drag to pan
        </div>
      </div>
    );
  }

  const isTwoStory =
    building.floors === 2 && building.levels && building.levels.length > 0;

  // Determine active telemetry source based on floor selection
  const activeLevel: BuildingLevelData | null =
    isTwoStory && selectedFloor !== 'all'
      ? building.levels!.find((lvl) => lvl.id === selectedFloor) || null
      : null;

  const displayAnimals = activeLevel
    ? activeLevel.totalAnimals
    : building.totalAnimals;
  const displayCapacity = activeLevel
    ? activeLevel.capacity
    : building.capacity;
  const displayAge = activeLevel
    ? activeLevel.averageAgeWeeks
    : building.averageAgeWeeks;
  const displayWeight = activeLevel
    ? activeLevel.averageWeightKg
    : building.averageWeightKg;
  const displayMortality = activeLevel
    ? activeLevel.mortalityRate
    : building.mortalityRate;
  const displayFeed = activeLevel
    ? activeLevel.dailyFeedKg
    : building.dailyFeedKg;
  const displayWater = activeLevel
    ? activeLevel.dailyWaterLiters
    : building.dailyWaterLiters;
  const displayTemp = activeLevel
    ? activeLevel.temperatureC
    : building.temperatureC;
  const displayHumidity = activeLevel
    ? activeLevel.humidityPercent
    : building.humidityPercent;
  const displayBatch = activeLevel
    ? activeLevel.batchCode
    : building.batchCode;
  const displayBreed = activeLevel ? activeLevel.breed : building.breed;
  const displayVaccination = activeLevel
    ? activeLevel.vaccinationStatus
    : building.vaccinationStatus;

  const occupancyPercent = Math.min(
    100,
    Math.round((displayAnimals / displayCapacity) * 100)
  );

  const groundLevel = building.levels?.find((l) => l.id === 'ground');
  const upperLevel = building.levels?.find((l) => l.id === 'upper');

  return (
    <aside
      aria-label="Facility Information Panel"
      className="pointer-events-auto fixed bottom-0 right-0 left-0 md:left-auto md:top-20 md:bottom-5 md:right-5 z-30 w-full md:w-[400px] max-h-[76vh] md:max-h-[calc(100vh-6.5rem)] flex flex-col bg-slate-950/90 backdrop-blur-xl border-t md:border border-white/12 md:rounded-xl shadow-2xl overflow-hidden transition-all duration-200"
    >
      {/* Header Section */}
      <div className="px-5 pt-5 pb-4 border-b border-white/10 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            {/* Clean unboxed metadata line */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
              <span>{building.code}</span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-slate-300 capitalize">
                {building.animalType}
              </span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-emerald-400 capitalize">
                Status: {building.status}
              </span>
            </div>

            <h2 className="font-display text-xl font-bold text-white tracking-tight mt-1">
              {building.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{building.subtitle}</p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onFocusBuilding(building)}
              title="Center camera on this facility"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Focus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close building details"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Two-Story L-Building Interactive Floor Selector */}
        {isTwoStory && (
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Two-Story Facility Level View</span>
              <button
                type="button"
                onClick={onToggleExplodeFloors}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  explodeFloors
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                {explodeFloors ? 'Merge Floors' : 'Separate Floors in 3D'}
              </button>
            </div>

            {/* Interactive Segmented Control for Entire Building / Ground Floor / Upper Floor */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/90 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => onSelectFloor('all')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  selectedFloor === 'all'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Entire Building
              </button>
              <button
                type="button"
                onClick={() => onSelectFloor('ground')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  selectedFloor === 'ground'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Ground Floor
              </button>
              <button
                type="button"
                onClick={() => onSelectFloor('upper')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  selectedFloor === 'upper'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Upper Floor
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Body */}
      <div className="px-5 py-4 overflow-y-auto space-y-5 text-sm">
        {/* Primary Headcount & Capacity Block */}
        <div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs text-slate-400">
                {activeLevel
                  ? `${activeLevel.name} — Total ${building.animalType}`
                  : `Total ${building.animalType}`}
              </div>
              <div className="text-3xl font-mono font-semibold text-white tabular-nums mt-0.5">
                {displayAnimals.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Capacity</div>
              <div className="text-base font-mono text-slate-200 tabular-nums mt-0.5">
                {displayCapacity.toLocaleString()}{' '}
                <span className="text-xs text-amber-400">
                  ({occupancyPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Clean Utilization Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2.5">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        {/* Two-Story Floor Summary Breakdown (Always visible on L-Building so Ground & Upper counts are clear) */}
        {isTwoStory && groundLevel && upperLevel && (
          <div className="pt-3 border-t border-white/10">
            <div className="text-xs font-medium text-slate-300 mb-2">
              Two-Level Flock Distribution
            </div>
            <div className="space-y-1.5 font-mono text-xs tabular-nums">
              <button
                type="button"
                onClick={() =>
                  onSelectFloor(selectedFloor === 'ground' ? 'all' : 'ground')
                }
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-colors cursor-pointer ${
                  selectedFloor === 'ground'
                    ? 'bg-amber-500/15 border-amber-400/60 text-white'
                    : 'bg-slate-900/60 border-white/8 text-slate-300 hover:border-white/20'
                }`}
              >
                <span>Level 1 · Ground Floor</span>
                <span className="font-semibold text-emerald-300">
                  {groundLevel.totalAnimals.toLocaleString()} chickens ·{' '}
                  {groundLevel.averageAgeWeeks}w · {groundLevel.averageWeightKg}{' '}
                  kg
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onSelectFloor(selectedFloor === 'upper' ? 'all' : 'upper')
                }
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-colors cursor-pointer ${
                  selectedFloor === 'upper'
                    ? 'bg-amber-500/15 border-amber-400/60 text-white'
                    : 'bg-slate-900/60 border-white/8 text-slate-300 hover:border-white/20'
                }`}
              >
                <span>Level 2 · Upper Floor</span>
                <span className="font-semibold text-amber-300">
                  {upperLevel.totalAnimals.toLocaleString()} chickens ·{' '}
                  {upperLevel.averageAgeWeeks}w · {upperLevel.averageWeightKg}{' '}
                  kg
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Internal Bay Breakdown (For West Poultry House CH-001 dotted line division) */}
        {building.sections && building.sections.length > 0 && (
          <div className="pt-3 border-t border-white/10">
            <div className="text-xs font-medium text-slate-300 mb-2">
              Internal Partitioned Bays (Sketch Division)
            </div>
            <div className="space-y-2">
              {building.sections.map((sec) => (
                <div
                  key={sec.id}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-white/6 last:border-0"
                >
                  <div>
                    <div className="font-medium text-slate-200">{sec.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {sec.description}
                    </div>
                  </div>
                  <div className="font-mono tabular-nums text-right shrink-0 ml-3">
                    <div className="text-slate-100 font-semibold">
                      {sec.animalCount.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      / {sec.capacity.toLocaleString()} cap
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Biological & Production Metrics */}
        <div className="pt-3 border-t border-white/10">
          <div className="text-xs font-medium text-slate-300 mb-2.5">
            Flock Metrics & Telemetry
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
            <div className="flex flex-col border-b border-white/8 pb-2">
              <dt className="text-slate-400">Animal Type</dt>
              <dd className="text-slate-100 font-medium capitalize mt-0.5">
                {building.animalType} ({building.flockCategory})
              </dd>
            </div>

            <div className="flex flex-col border-b border-white/8 pb-2">
              <dt className="text-slate-400">Average Age</dt>
              <dd className="font-mono text-slate-100 font-semibold tabular-nums mt-0.5">
                {displayAge} weeks
              </dd>
            </div>

            <div className="flex flex-col border-b border-white/8 pb-2">
              <dt className="text-slate-400">Average Weight</dt>
              <dd className="font-mono text-slate-100 font-semibold tabular-nums mt-0.5">
                {displayWeight.toFixed(2)} kg
              </dd>
            </div>

            <div className="flex flex-col border-b border-white/8 pb-2">
              <dt className="text-slate-400">Mortality</dt>
              <dd className="font-mono text-slate-100 font-semibold tabular-nums mt-0.5">
                {displayMortality.toFixed(1)}%
              </dd>
            </div>

            <div className="flex flex-col border-b border-white/8 pb-2">
              <dt className="text-slate-400">Daily Feed Intake</dt>
              <dd className="font-mono text-slate-100 tabular-nums mt-0.5">
                {displayFeed} kg / day
              </dd>
            </div>

            <div className="flex flex-col border-b border-white/8 pb-2">
              <dt className="text-slate-400">Daily Water Intake</dt>
              <dd className="font-mono text-slate-100 tabular-nums mt-0.5">
                {displayWater} L / day
              </dd>
            </div>

            <div className="flex flex-col border-b border-white/8 pb-2">
              <dt className="text-slate-400">House Climate</dt>
              <dd className="font-mono text-slate-100 tabular-nums mt-0.5">
                {displayTemp.toFixed(1)}°C · {displayHumidity}% RH
              </dd>
            </div>

            <div className="flex flex-col border-b border-white/8 pb-2">
              <dt className="text-slate-400">Batch Reference</dt>
              <dd className="font-mono text-slate-200 tabular-nums mt-0.5">
                {displayBatch}
              </dd>
            </div>
          </dl>
        </div>

        {/* Breed, Vaccination & Architectural Description */}
        <div className="pt-2 space-y-2 text-xs text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Breed Stock:</span>
            <span className="text-slate-200 font-medium">{displayBreed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Vaccination:</span>
            <span className="text-emerald-300 font-medium">
              {displayVaccination}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Database Record ID:</span>
            <span className="font-mono text-slate-200">
              {building.code} ({building.id})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Last Updated:</span>
            <span className="font-mono text-slate-200">
              {building.lastUpdated}
            </span>
          </div>

          <p className="text-slate-400 leading-relaxed pt-2 border-t border-white/8">
            {activeLevel?.notes ? activeLevel.notes : building.description}
          </p>
        </div>
      </div>
    </aside>
  );
};
