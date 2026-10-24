/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  CAMERA_PRESETS,
  FARM_BUILDINGS,
  getFarmSummaryMetrics,
} from './data/farmData';
import {
  CameraPreset,
  FarmBuildingData,
  SelectedFloorFilter,
} from './types/farm';
import { CameraCommand, FarmMap } from './components/FarmMap';
import { InfoPanel } from './components/InfoPanel';
import { MapControls } from './components/MapControls';

export default function App() {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [selectedFloor, setSelectedFloor] =
    useState<SelectedFloorFilter>('all');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showExpansionZones, setShowExpansionZones] = useState<boolean>(false);
  const [explodeFloors, setExplodeFloors] = useState<boolean>(false);
  const [showBlueprintModal, setShowBlueprintModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  const [cameraCommand, setCameraCommand] = useState<CameraCommand | null>(
    null
  );
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const selectedBuilding = useMemo(
    () => FARM_BUILDINGS.find((b) => b.id === selectedBuildingId) || null,
    [selectedBuildingId]
  );

  const summary = useMemo(() => getFarmSummaryMetrics(FARM_BUILDINGS), []);

  const focusBuildingCamera = useCallback((building: FarmBuildingData) => {
    const [bx, , bz] = building.position;
    if (building.type === 'two_story_chicken_house') {
      setCameraCommand({
        position: [bx - 18, 21, bz + 22],
        target: [bx, 3.2, bz],
        timestamp: Date.now(),
      });
    } else if (building.type === 'duck_ground') {
      setCameraCommand({
        position: [bx - 12, 22, bz + 22],
        target: [bx, 1.0, bz],
        timestamp: Date.now(),
      });
    } else {
      setCameraCommand({
        position: [bx + (bx < 0 ? 18 : -18), 22, bz + 22],
        target: [bx, 2.0, bz],
        timestamp: Date.now(),
      });
    }
  }, []);

  const handleSelectBuilding = useCallback(
    (building: FarmBuildingData | null) => {
      if (!building) {
        setSelectedBuildingId(null);
        return;
      }
      setSelectedBuildingId(building.id);
      if (building.id !== selectedBuildingId) {
        setSelectedFloor('all');
      }
    },
    [selectedBuildingId]
  );

  const handleSelectPreset = useCallback((preset: CameraPreset) => {
    setCameraCommand({
      position: preset.position,
      target: preset.target,
      timestamp: Date.now(),
    });
  }, []);

  const handleResetCamera = useCallback(() => {
    const overview = CAMERA_PRESETS[0];
    setCameraCommand({
      position: overview.position,
      target: overview.target,
      timestamp: Date.now(),
    });
  }, []);

  const handleZoomIn = useCallback(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const cam = controls.object;
    const dir = cam.position.clone().sub(controls.target);
    const nextLen = Math.max(16, dir.length() * 0.78);
    dir.setLength(nextLen);
    const nextPos = controls.target.clone().add(dir);
    setCameraCommand({
      position: [nextPos.x, nextPos.y, nextPos.z],
      target: [controls.target.x, controls.target.y, controls.target.z],
      timestamp: Date.now(),
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const cam = controls.object;
    const dir = cam.position.clone().sub(controls.target);
    const nextLen = Math.min(130, dir.length() * 1.25);
    dir.setLength(nextLen);
    const nextPos = controls.target.clone().add(dir);
    setCameraCommand({
      position: [nextPos.x, nextPos.y, nextPos.z],
      target: [controls.target.x, controls.target.y, controls.target.z],
      timestamp: Date.now(),
    });
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#131f17] text-slate-100">
      {/* ===================================================================
          TOP BAR (3-Zone Contract: Brand Wordmark — Facility Nav — Actions)
         =================================================================== */}
      <header className="pointer-events-auto fixed top-0 left-0 right-0 z-30 h-14 px-5 flex items-center justify-between bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        {/* Zone 2: 5 Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <button
            type="button"
            onClick={() => {
              const lBuilding = FARM_BUILDINGS.find(
                (b) => b.id === 'l-building-01'
              );
              if (lBuilding) {
                handleSelectBuilding(lBuilding);
                focusBuildingCamera(lBuilding);
              }
            }}
            className="hover:text-white hover:underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
          >
            L-Building (2 Floors)
          </button>
          <button
            type="button"
            onClick={() => {
              const b = FARM_BUILDINGS.find((x) => x.id === 'broiler-house-01');
              if (b) {
                handleSelectBuilding(b);
                focusBuildingCamera(b);
              }
            }}
            className="hover:text-white hover:underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
          >
            Brooder House
          </button>
          <button
            type="button"
            onClick={() => {
              const b = FARM_BUILDINGS.find(
                (x) => x.id === 'west-poultry-house-01'
              );
              if (b) {
                handleSelectBuilding(b);
                focusBuildingCamera(b);
              }
            }}
            className="hover:text-white hover:underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
          >
            West House
          </button>
          <button
            type="button"
            onClick={() => {
              const b = FARM_BUILDINGS.find(
                (x) => x.id === 'south-poultry-house-03'
              );
              if (b) {
                handleSelectBuilding(b);
                focusBuildingCamera(b);
              }
            }}
            className="hover:text-white hover:underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
          >
            South House
          </button>
          <button
            type="button"
            onClick={() => {
              const b = FARM_BUILDINGS.find((x) => x.id === 'ducks-ground-01');
              if (b) {
                handleSelectBuilding(b);
                focusBuildingCamera(b);
              }
            }}
            className="hover:text-white hover:underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
          >
            Ducks Ground
          </button>
        </nav>

        {/* Zone 3: 2 Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowHelpModal((prev) => !prev)}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-white/8 hover:bg-white/15 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Controls & Help
          </button>
          <button
            type="button"
            onClick={handleResetCamera}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            View Farm
          </button>
        </div>
      </header>

      {/* Subtle Estate Totals Bar (Top-Right below Header when InfoPanel is closed) */}
      {!selectedBuilding && (
        <div className="pointer-events-none fixed top-20 right-5 z-20 hidden sm:block">
          <div className="bg-slate-950/75 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-right shadow-lg">
            <div className="text-[11px] text-slate-400">
              Interactive Digital Farm Map · Version 1
            </div>
            <div className="text-xs font-mono text-slate-200 tabular-nums mt-1">
              <span>{summary.totalChickens.toLocaleString()} Chickens</span>
              <span aria-hidden="true" className="mx-1.5 text-slate-600">
                ·
              </span>
              <span>{summary.totalDucks.toLocaleString()} Ducks</span>
              <span aria-hidden="true" className="mx-1.5 text-slate-600">
                ·
              </span>
              <span className="text-amber-300">
                {summary.totalAnimals.toLocaleString()} Total Animals
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Controls & Help Popover */}
      {showHelpModal && (
        <div className="pointer-events-auto fixed top-16 right-5 z-40 w-80 bg-slate-950/95 backdrop-blur-xl border border-white/15 rounded-xl p-4 shadow-2xl text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-semibold text-white">
              3D Farm Navigation & Guide
            </h3>
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/5 cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Inspect Facility:</span>
              <span className="font-mono text-slate-100">
                Click Any Building
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 leading-relaxed">
            The central <strong className="text-amber-300">L-Building (CH-002)</strong>{' '}
            is a two-story chicken complex. Click it to inspect Ground Floor
            (920 chickens), Upper Floor (930 chickens), or separate the floors
            in 3D.
          </div>
        </div>
      )}

      {/* ===================================================================
          MAIN 3D INTERACTIVE FARM VIEWPORT
         =================================================================== */}
      <main className="w-full h-full">
        <FarmMap
          buildings={FARM_BUILDINGS}
          selectedBuilding={selectedBuilding}
          onSelectBuilding={handleSelectBuilding}
          selectedFloor={selectedFloor}
          onSelectFloor={setSelectedFloor}
          cameraCommand={cameraCommand}
          showLabels={showLabels}
          showExpansionZones={showExpansionZones}
          explodeFloors={explodeFloors}
          controlsRef={controlsRef}
        />
      </main>

      {/* ===================================================================
          FLOATING CAMERA & LAYER CONTROLS
         =================================================================== */}
      <MapControls
        buildings={FARM_BUILDINGS}
        selectedBuilding={selectedBuilding}
        onSelectBuilding={(b) => {
          handleSelectBuilding(b);
          focusBuildingCamera(b);
        }}
        onSelectPreset={handleSelectPreset}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetCamera={handleResetCamera}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels((prev) => !prev)}
        showExpansionZones={showExpansionZones}
        onToggleExpansionZones={() => setShowExpansionZones((prev) => !prev)}
        explodeFloors={explodeFloors}
        onToggleExplodeFloors={() => {
          setExplodeFloors((prev) => !prev);
          const lBuilding = FARM_BUILDINGS.find(
            (b) => b.id === 'l-building-01'
          );
          if (lBuilding && !selectedBuilding) {
            handleSelectBuilding(lBuilding);
          }
        }}
        showBlueprintModal={showBlueprintModal}
        onToggleBlueprintModal={() => setShowBlueprintModal((prev) => !prev)}
      />

      {/* ===================================================================
          SLIDE-IN BUILDING INFORMATION PANEL
         =================================================================== */}
      <InfoPanel
        building={selectedBuilding}
        selectedFloor={selectedFloor}
        onSelectFloor={setSelectedFloor}
        explodeFloors={explodeFloors}
        onToggleExplodeFloors={() => setExplodeFloors((prev) => !prev)}
        onClose={() => setSelectedBuildingId(null)}
        onFocusBuilding={focusBuildingCamera}
      />
    </div>
  );
}
