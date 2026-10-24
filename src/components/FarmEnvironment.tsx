import React from 'react';
import { Html } from '@react-three/drei';
import { FUTURE_EXPANSION_PLOTS } from '../data/farmData';
import { CompassMarker3D, LowPolyTree, FarmObject } from './FarmObject';

interface FarmEnvironmentProps {
  showExpansionZones: boolean;
  showLabels: boolean;
  onBackgroundClick: () => void;
}

/**
 * 3D Farm Terrain, Road Network, Perimeter Trees, Compass Marker,
 * and Future Expansion Parcels for Zeida Farm.
 */
export const FarmEnvironment: React.FC<FarmEnvironmentProps> = ({
  showExpansionZones,
  showLabels,
  onBackgroundClick,
}) => {
  // Sparse perimeter windbreak trees placed well outside the building core
  const treePlacements: [number, number, number, number, 'round' | 'cypress'][] = [
    [-34, 0, -26, 1.1, 'round'],
    [-36, 0, -16, 0.9, 'cypress'],
    [-35, 0, 2, 1.0, 'round'],
    [-35, 0, 18, 1.15, 'round'],
    [-33, 0, 28, 0.9, 'cypress'],
    [34, 0, -24, 1.05, 'round'],
    [36, 0, -10, 0.95, 'cypress'],
    [36, 0, 8, 1.1, 'round'],
    [35, 0, 24, 0.95, 'cypress'],
    [18, 0, -25, 1.0, 'round'],
    [26, 0, -23, 0.85, 'cypress'],
    [-14, 0, 31, 0.95, 'round'],
    [15, 0, 31, 1.05, 'round'],
  ];

  return (
    <group>
      {/* Vast Outer Agricultural Plain (leaves generous room for future expansion) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.06, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onBackgroundClick();
        }}
      >
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial color="#1f3124" roughness={0.96} />
      </mesh>

      {/* Active Estate Turf Field */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 2]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onBackgroundClick();
        }}
      >
        <planeGeometry args={[125, 105]} />
        <meshStandardMaterial color="#294130" roughness={0.93} />
      </mesh>

      {/* Subtle Survey Grid for Spatial Scale Reference */}
      <gridHelper
        args={[180, 36, '#36533e', '#263b2c']}
        position={[0, 0.01, 2]}
      />

      {/* ===================================================================
          INTERNAL FARM ROAD & PATH NETWORK
         =================================================================== */}
      <group position={[0, 0.02, 0]}>
        {/* North-South West Service Road (between West House CH-001 and Central L-Building) */}
        <mesh position={[-12.8, 0, 6]} receiveShadow>
          <boxGeometry args={[3.4, 0.05, 42]} />
          <meshStandardMaterial color="#787163" roughness={0.9} />
        </mesh>

        {/* North-South East Service Road (between Central Buildings and East Broiler House CH-004) */}
        <mesh position={[15.2, 0, 9]} receiveShadow>
          <boxGeometry args={[3.4, 0.05, 48]} />
          <meshStandardMaterial color="#787163" roughness={0.9} />
        </mesh>

        {/* East-West Northern Avenue (between Ducks Ground and Chicken Houses) */}
        <mesh position={[1, 0, -11.2]} receiveShadow>
          <boxGeometry args={[52, 0.05, 3.2]} />
          <meshStandardMaterial color="#787163" roughness={0.9} />
        </mesh>

        {/* East-West Central Courtyard Lane (between L-Building CH-002 and South House CH-003) */}
        <mesh position={[1.2, 0, 14.1]} receiveShadow>
          <boxGeometry args={[28, 0.05, 2.8]} />
          <meshStandardMaterial color="#787163" roughness={0.9} />
        </mesh>

        {/* East-West Southern Perimeter Access Road */}
        <mesh position={[1, 0, 28.2]} receiveShadow>
          <boxGeometry args={[56, 0.05, 3.6]} />
          <meshStandardMaterial color="#6e685b" roughness={0.9} />
        </mesh>

        {/* Main Farm Entrance Approach Road (extending South) */}
        <mesh position={[1.2, 0, 46]} receiveShadow>
          <boxGeometry args={[4.5, 0.05, 34]} />
          <meshStandardMaterial color="#6e685b" roughness={0.9} />
        </mesh>
      </group>

      {/* Farm Water Storage Tower (Northeast Service Utility) */}
      <FarmObject type="water_tank" position={[15.2, 0, -21]} scale={0.95} />

      {/* 3D Sketch Orientation Compass Rose (Top-Left of Ducks Ground as drawn in sketch) */}
      <CompassMarker3D position={[-22.5, 0, -20]} showLabels={showLabels} />

      {/* Perimeter Windbreak Trees */}
      {treePlacements.map(([tx, ty, tz, scale, variant], idx) => (
        <LowPolyTree
          key={idx}
          position={[tx, ty, tz]}
          scale={scale}
          variant={variant}
        />
      ))}

      {/* ===================================================================
          FUTURE EXPANSION ZONES (Demonstrating Scalability)
         =================================================================== */}
      {showExpansionZones &&
        FUTURE_EXPANSION_PLOTS.map((plot) => (
          <group key={plot.id} position={plot.position}>
            <mesh position={[0, 0.03, 0]} receiveShadow>
              <boxGeometry
                args={[plot.dimensions[0], 0.04, plot.dimensions[1]]}
              />
              <meshStandardMaterial
                color="#3b82f6"
                transparent
                opacity={0.14}
                roughness={0.8}
              />
            </mesh>
            {/* Corner Marker Stakes */}
            {[
              [-plot.dimensions[0] / 2, -plot.dimensions[1] / 2],
              [plot.dimensions[0] / 2, -plot.dimensions[1] / 2],
              [-plot.dimensions[0] / 2, plot.dimensions[1] / 2],
              [plot.dimensions[0] / 2, plot.dimensions[1] / 2],
            ].map(([cx, cz], idx) => (
              <mesh key={idx} position={[cx, 0.6, cz]}>
                <boxGeometry args={[0.25, 1.2, 0.25]} />
                <meshStandardMaterial color="#60a5fa" />
              </mesh>
            ))}
            <Html
              position={[0, 1.8, 0]}
              center
              distanceFactor={75}
              zIndexRange={[10, 0]}
            >
              <div className="pointer-events-none select-none px-2.5 py-1 rounded bg-slate-950/85 border border-sky-400/40 text-center whitespace-nowrap">
                <div className="text-[10px] font-mono text-sky-300 font-semibold">
                  {plot.id} · FUTURE EXPANSION
                </div>
                <div className="text-[11px] text-slate-200 font-medium">
                  {plot.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {plot.plannedUse}
                </div>
              </div>
            </Html>
          </group>
        ))}
    </group>
  );
};
