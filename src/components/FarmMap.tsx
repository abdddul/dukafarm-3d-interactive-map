import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { FarmBuildingData, SelectedFloorFilter } from '../types/farm';
import { Building } from './Building';
import { FarmEnvironment } from './FarmEnvironment';

export interface CameraCommand {
  position: [number, number, number];
  target: [number, number, number];
  timestamp: number;
}

interface CameraRigProps {
  command: CameraCommand | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

/**
 * Smoothly interpolates camera position and OrbitControls target only when a
 * preset or zoom button is clicked, immediately yielding control back to the user
 * if they drag, pan, or scroll.
 */
const CameraRig: React.FC<CameraRigProps> = ({ command, controlsRef }) => {
  const { camera } = useThree();
  const isAnimating = useRef(false);
  const desiredPos = useRef(new THREE.Vector3(0, 54, 64));
  const desiredTarget = useRef(new THREE.Vector3(0, 0, 4));

  useEffect(() => {
    if (!command) return;
    desiredPos.current.set(...command.position);
    desiredTarget.current.set(...command.target);
    isAnimating.current = true;
  }, [command]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const stopAnimationOnUserInput = () => {
      isAnimating.current = false;
    };
    controls.addEventListener('start', stopAnimationOnUserInput);
    return () => {
      controls.removeEventListener('start', stopAnimationOnUserInput);
    };
  }, [controlsRef]);

  useFrame((_, delta) => {
    if (!isAnimating.current || !controlsRef.current) return;

    const step = Math.min(1, delta * 5.5);
    camera.position.lerp(desiredPos.current, step);
    controlsRef.current.target.lerp(desiredTarget.current, step);
    controlsRef.current.update();

    if (
      camera.position.distanceTo(desiredPos.current) < 0.15 &&
      controlsRef.current.target.distanceTo(desiredTarget.current) < 0.15
    ) {
      isAnimating.current = false;
    }
  });

  return null;
};

interface FarmMapProps {
  buildings: FarmBuildingData[];
  selectedBuilding: FarmBuildingData | null;
  onSelectBuilding: (building: FarmBuildingData | null) => void;
  selectedFloor: SelectedFloorFilter;
  onSelectFloor: (floor: SelectedFloorFilter) => void;
  cameraCommand: CameraCommand | null;
  showLabels: boolean;
  showExpansionZones: boolean;
  explodeFloors: boolean;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

export const FarmMap: React.FC<FarmMapProps> = ({
  buildings,
  selectedBuilding,
  onSelectBuilding,
  selectedFloor,
  onSelectFloor,
  cameraCommand,
  showLabels,
  showExpansionZones,
  explodeFloors,
  controlsRef,
}) => {
  const [contextLost, setContextLost] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#131f17] select-none">
      {contextLost ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#131f17] text-slate-200">
          <p className="text-base font-semibold mb-2">
            3D Viewport Restoring Context
          </p>
          <p className="text-sm text-slate-400 max-w-md mb-4">
            Select any Zeida Farm facility below to inspect live flock telemetry:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {buildings.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => onSelectBuilding(b)}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-xs font-mono hover:border-amber-400"
              >
                {b.code} · {b.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 54, 64], fov: 42, near: 0.5, far: 350 }}
          onCreated={({ gl }) => {
            const canvas = gl.domElement;
            const handleLost = (e: Event) => {
              e.preventDefault();
              setContextLost(true);
            };
            const handleRestored = () => {
              setContextLost(false);
            };
            canvas.addEventListener('webglcontextlost', handleLost, false);
            canvas.addEventListener(
              'webglcontextrestored',
              handleRestored,
              false
            );
          }}
          onPointerMissed={() => {
            onSelectBuilding(null);
          }}
        >
          <color attach="background" args={['#142118']} />
          <fog attach="fog" args={['#142118', 95, 215]} />

          {/* Balanced Three-Point Architectural & Agricultural Lighting */}
          <ambientLight intensity={0.65} color="#e6f0ec" />
          <hemisphereLight
            args={['#dceefb', '#243829', 0.55]}
            position={[0, 60, 0]}
          />

          {/* Warm Golden-Hour Key Directional Light */}
          <directionalLight
            position={[48, 68, 42]}
            intensity={1.35}
            color="#fff6e5"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={10}
            shadow-camera-far={180}
            shadow-camera-left={-55}
            shadow-camera-right={55}
            shadow-camera-top={55}
            shadow-camera-bottom={-55}
            shadow-bias={-0.0005}
          />

          {/* Subtle Cool Rim / Fill Light from Northwest */}
          <directionalLight
            position={[-45, 38, -35]}
            intensity={0.45}
            color="#93c5fd"
          />

          {/* Orbit / Pan / Zoom Camera Controls */}
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.07}
            rotateSpeed={0.75}
            zoomSpeed={0.95}
            panSpeed={0.85}
            minDistance={14}
            maxDistance={135}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minPolarAngle={0.08}
            target={[0, 0, 4]}
          />

          <CameraRig command={cameraCommand} controlsRef={controlsRef} />

          {/* Surrounding Terrain, Roads, Compass, Trees & Expansion Parcels */}
          <FarmEnvironment
            showExpansionZones={showExpansionZones}
            showLabels={showLabels}
            onBackgroundClick={() => onSelectBuilding(null)}
          />

          {/* Interactive 3D Farm Buildings & Enclosures */}
          {buildings.map((building) => (
            <Building
              key={building.id}
              data={building}
              isSelected={selectedBuilding?.id === building.id}
              onSelect={(b) => onSelectBuilding(b)}
              selectedFloor={
                selectedBuilding?.id === building.id ? selectedFloor : 'all'
              }
              onSelectFloor={onSelectFloor}
              showLabels={showLabels}
              explodeFloors={
                explodeFloors && building.type === 'two_story_chicken_house'
              }
            />
          ))}
        </Canvas>
      )}
    </div>
  );
};
