import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { FarmBuildingData, SelectedFloorFilter } from '../types/farm';
import { FeedSilo } from './FarmObject';

interface TwoStoryBuildingProps {
  data: FarmBuildingData;
  isSelected: boolean;
  isHovered: boolean;
  selectedFloor: SelectedFloorFilter;
  onSelectFloor: (floor: SelectedFloorFilter) => void;
  explodeFloors?: boolean;
}

/**
 * Flagship Two-Story L-Shaped Chicken Building (CH-002)
 *
 * Recreates the central L-shaped structure from the Zeida Farm sketch (`┐` orientation):
 * - North Horizontal Wing: 20m wide (x: -10 to +10), 8m deep (z: -9 to -1), center [-0, y, -5]
 * - East Vertical Wing: 8m wide (x: +2 to +10), 10m deep (z: -1 to +9), center [6, y, 4]
 *
 * Visually distinguishes:
 * - Level 1 (Ground Floor): Masonry white/stone walls + ground louvers + courtyard doors
 * - Inter-floor Slab & Balcony Walkway: Projecting 2nd-story gallery + exterior courtyard stairs
 * - Level 2 (Upper Floor): Warm timber-clad ventilated upper deck + pitched L-roof + ridge vents
 */
export const TwoStoryBuilding: React.FC<TwoStoryBuildingProps> = ({
  data,
  isSelected,
  isHovered,
  selectedFloor,
  onSelectFloor,
  explodeFloors = false,
}) => {
  const plinthH = 0.35;
  const groundFloorH = 3.0;
  const slabH = 0.35;
  const upperFloorH = 2.9;
  const roofPeakH = 1.65;

  // Vertical offset when user activates "Separate Floors" inspection mode
  const explodeOffset = explodeFloors ? 2.4 : 0;

  const isGroundHighlighted =
    isSelected && (selectedFloor === 'all' || selectedFloor === 'ground');
  const isUpperHighlighted =
    isSelected && (selectedFloor === 'all' || selectedFloor === 'upper');

  const groundWallColor = isGroundHighlighted
    ? '#fffbeb'
    : isHovered
    ? '#f7f4eb'
    : '#efeae0';

  // Upper floor has a distinct architectural warm timber/cladding treatment
  const upperWallColor = isUpperHighlighted
    ? '#fde68a'
    : isHovered
    ? '#eadbc0'
    : '#dcc9a9';

  const roofColor = isUpperHighlighted
    ? '#c85a32'
    : isHovered
    ? '#ad4d38'
    : data.roofColor || '#994636';

  const groundEmissive = isGroundHighlighted
    ? '#d97706'
    : isHovered
    ? '#78350f'
    : '#000000';
  const groundEmissiveIntensity =
    isSelected && selectedFloor === 'ground'
      ? 0.28
      : isGroundHighlighted
      ? 0.14
      : isHovered
      ? 0.08
      : 0;

  const upperEmissive = isUpperHighlighted
    ? '#d97706'
    : isHovered
    ? '#78350f'
    : '#000000';
  const upperEmissiveIntensity =
    isSelected && selectedFloor === 'upper'
      ? 0.28
      : isUpperHighlighted
      ? 0.16
      : isHovered
      ? 0.08
      : 0;

  // Dim unselected floor slightly when a specific single floor is inspected
  const groundOpacity =
    isSelected && selectedFloor === 'upper' ? 0.55 : 1.0;
  const upperOpacity =
    isSelected && selectedFloor === 'ground' ? 0.55 : 1.0;

  // Pitched roof geometry for North Horizontal Wing (20m wide along X, 8m deep along Z)
  const northRoofGeom = useMemo(() => {
    const overhang = 0.55;
    const w = 20 + overhang * 2;
    const d = 8 + overhang * 2;
    const shape = new THREE.Shape();
    shape.moveTo(-d / 2, 0);
    shape.lineTo(0, roofPeakH);
    shape.lineTo(d / 2, 0);
    shape.closePath();

    const geom = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: w,
      bevelEnabled: false,
    });
    geom.translate(0, 0, -w / 2);
    geom.rotateY(Math.PI / 2);
    return geom;
  }, [roofPeakH]);

  // Pitched roof geometry for East Vertical Wing (8m wide along X, 11m deep along Z to join North roof)
  const eastRoofGeom = useMemo(() => {
    const overhang = 0.55;
    const w = 8 + overhang * 2;
    const d = 14 + overhang * 2;
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2, 0);
    shape.lineTo(0, roofPeakH);
    shape.lineTo(w / 2, 0);
    shape.closePath();

    const geom = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: d,
      bevelEnabled: false,
    });
    geom.translate(0, 0, -d / 2);
    return geom;
  }, [roofPeakH]);

  const groundLevelY = plinthH;
  const slabLevelY = plinthH + groundFloorH;
  const upperLevelY = slabLevelY + slabH + explodeOffset;
  const roofBaseY = upperLevelY + upperFloorH;

  return (
    <group>
      {/* ===================================================================
          1. FOUNDATION PLINTH & INNER COURTYARD APRON
         =================================================================== */}
      {/* North Wing Plinth */}
      <mesh position={[0, plinthH / 2, -5]} receiveShadow castShadow>
        <boxGeometry args={[20.6, plinthH, 8.6]} />
        <meshStandardMaterial color="#87908a" roughness={0.9} />
      </mesh>
      {/* East Wing Plinth */}
      <mesh position={[6, plinthH / 2, 4]} receiveShadow castShadow>
        <boxGeometry args={[8.6, plinthH, 10.6]} />
        <meshStandardMaterial color="#87908a" roughness={0.9} />
      </mesh>
      {/* Concrete Service Courtyard Paving inside the L-corner */}
      <mesh position={[-3.2, 0.05, 3.2]} receiveShadow>
        <boxGeometry args={[10.5, 0.1, 8.5]} />
        <meshStandardMaterial color="#9ea7a1" roughness={0.92} />
      </mesh>

      {/* ===================================================================
          2. GROUND FLOOR (LEVEL 1 — 920 CHICKENS)
         =================================================================== */}
      <group
        onClick={(e) => {
          if (isSelected) {
            e.stopPropagation();
            onSelectFloor(selectedFloor === 'ground' ? 'all' : 'ground');
          }
        }}
      >
        {/* North Wing — Ground Floor Walls */}
        <mesh
          position={[0, groundLevelY + groundFloorH / 2, -5]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[20, groundFloorH, 8]} />
          <meshStandardMaterial
            color={groundWallColor}
            roughness={0.78}
            emissive={groundEmissive}
            emissiveIntensity={groundEmissiveIntensity}
            transparent={groundOpacity < 1}
            opacity={groundOpacity}
          />
        </mesh>

        {/* East Wing — Ground Floor Walls */}
        <mesh
          position={[6, groundLevelY + groundFloorH / 2, 4]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[8, groundFloorH, 10]} />
          <meshStandardMaterial
            color={groundWallColor}
            roughness={0.78}
            emissive={groundEmissive}
            emissiveIntensity={groundEmissiveIntensity}
            transparent={groundOpacity < 1}
            opacity={groundOpacity}
          />
        </mesh>

        {/* Ground Floor Masonry Stone Skirt */}
        <mesh position={[0, groundLevelY + 0.45, -5]} receiveShadow>
          <boxGeometry args={[20.1, 0.9, 8.1]} />
          <meshStandardMaterial color="#cfc8bc" roughness={0.88} />
        </mesh>
        <mesh position={[6, groundLevelY + 0.45, 4]} receiveShadow>
          <boxGeometry args={[8.1, 0.9, 10.1]} />
          <meshStandardMaterial color="#cfc8bc" roughness={0.88} />
        </mesh>

        {/* Ground Floor Poultry Ventilation Windows (North, South-Courtyard, East, West) */}
        {/* North Outer Wall Vents */}
        <mesh position={[0, groundLevelY + 1.85, -9.05]}>
          <boxGeometry args={[17.5, 1.05, 0.06]} />
          <meshStandardMaterial color="#273630" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Courtyard-Facing Ground Vents (North Wing South face) */}
        <mesh position={[-4.5, groundLevelY + 1.85, -0.95]}>
          <boxGeometry args={[9.2, 1.05, 0.06]} />
          <meshStandardMaterial color="#273630" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* East Outer Wall Vents */}
        <mesh position={[10.05, groundLevelY + 1.85, 0]}>
          <boxGeometry args={[0.06, 1.05, 15.5]} />
          <meshStandardMaterial color="#273630" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Courtyard-Facing Ground Vents (East Wing West face) */}
        <mesh position={[1.95, groundLevelY + 1.85, 4.5]}>
          <boxGeometry args={[0.06, 1.05, 7.2]} />
          <meshStandardMaterial color="#273630" metalness={0.3} roughness={0.5} />
        </mesh>

        {/* Ground Floor Courtyard Double Doors */}
        <mesh position={[-1.5, groundLevelY + 1.1, -0.94]}>
          <boxGeometry args={[2.1, 2.15, 0.1]} />
          <meshStandardMaterial color="#4a3628" roughness={0.75} />
        </mesh>
        <mesh position={[1.94, groundLevelY + 1.1, 1.2]}>
          <boxGeometry args={[0.1, 2.15, 2.1]} />
          <meshStandardMaterial color="#4a3628" roughness={0.75} />
        </mesh>
      </group>

      {/* ===================================================================
          3. INTER-FLOOR STRUCTURAL SLAB, COURTYARD BALCONY & STAIRCASE
         =================================================================== */}
      <group position={[0, slabLevelY, 0]}>
        {/* Structural Belt Course / Floor Slab separating Floor 1 & Floor 2 */}
        <mesh position={[0, slabH / 2, -5]} castShadow receiveShadow>
          <boxGeometry args={[20.5, slabH, 8.5]} />
          <meshStandardMaterial color="#46524c" roughness={0.7} />
        </mesh>
        <mesh position={[6, slabH / 2, 4]} castShadow receiveShadow>
          <boxGeometry args={[8.5, slabH, 10.5]} />
          <meshStandardMaterial color="#46524c" roughness={0.7} />
        </mesh>

        {/* Cantilevered Upper-Floor Walkway Balcony along the Inner L-Courtyard */}
        {/* North Wing Courtyard Balcony Deck (z: -1 to +0.5, x: -10 to +2) */}
        <mesh position={[-4, slabH / 2, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[12.2, slabH * 0.85, 1.55]} />
          <meshStandardMaterial color="#58655e" roughness={0.75} />
        </mesh>
        {/* East Wing Courtyard Balcony Deck (x: +0.5 to +2, z: -1 to +9) */}
        <mesh position={[1.2, slabH / 2, 4]} castShadow receiveShadow>
          <boxGeometry args={[1.55, slabH * 0.85, 10.2]} />
          <meshStandardMaterial color="#58655e" roughness={0.75} />
        </mesh>

        {/* Balcony Handrail along Courtyard Gallery */}
        <mesh position={[-3.2, slabH + 0.95, 0.52]} castShadow>
          <boxGeometry args={[10.4, 0.08, 0.08]} />
          <meshStandardMaterial color="#d0d7d3" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.48, slabH + 0.95, 4.0]} castShadow>
          <boxGeometry args={[0.08, 0.08, 9.8]} />
          <meshStandardMaterial color="#d0d7d3" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Balcony Vertical Posts */}
        {[-8, -5.5, -3, -0.5, 1.8].map((xPos, idx) => (
          <mesh key={`post-n-${idx}`} position={[xPos, slabH + 0.48, 0.52]}>
            <boxGeometry args={[0.08, 0.95, 0.08]} />
            <meshStandardMaterial color="#7d8a83" metalness={0.4} roughness={0.5} />
          </mesh>
        ))}
        {[1.2, 3.5, 6.0, 8.5].map((zPos, idx) => (
          <mesh key={`post-e-${idx}`} position={[0.48, slabH + 0.48, zPos]}>
            <boxGeometry args={[0.08, 0.95, 0.08]} />
            <meshStandardMaterial color="#7d8a83" metalness={0.4} roughness={0.5} />
          </mesh>
        ))}

        {/* Exterior Steel & Concrete Staircase leading from Courtyard up to 2nd Floor Balcony */}
        <group position={[-8.8, -groundFloorH, 0.5]}>
          {/* Angled Stair Stringer Ramp */}
          <mesh
            position={[0, groundFloorH / 2, 1.8]}
            rotation={[-Math.atan2(groundFloorH, 3.6), 0, 0]}
            castShadow
          >
            <boxGeometry args={[1.25, 0.22, 4.7]} />
            <meshStandardMaterial color="#5c6861" roughness={0.7} />
          </mesh>
          {/* Individual Stair Treads */}
          {[0.2, 0.55, 0.9, 1.25, 1.6, 1.95, 2.3, 2.65].map((stepY, idx) => (
            <mesh
              key={idx}
              position={[0, stepY, 3.5 - idx * 0.44]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[1.2, 0.1, 0.36]} />
              <meshStandardMaterial color="#9aa49e" roughness={0.8} />
            </mesh>
          ))}
          {/* Stair Handrail */}
          <mesh
            position={[-0.58, groundFloorH / 2 + 0.85, 1.8]}
            rotation={[-Math.atan2(groundFloorH, 3.6), 0, 0]}
          >
            <boxGeometry args={[0.07, 0.07, 4.7]} />
            <meshStandardMaterial color="#d0d7d3" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* ===================================================================
          4. UPPER FLOOR (LEVEL 2 — 930 CHICKENS)
         =================================================================== */}
      <group
        position={[0, upperLevelY, 0]}
        onClick={(e) => {
          if (isSelected) {
            e.stopPropagation();
            onSelectFloor(selectedFloor === 'upper' ? 'all' : 'upper');
          }
        }}
      >
        {/* North Wing — Upper Floor Walls (distinct warm architectural cladding) */}
        <mesh
          position={[0, upperFloorH / 2, -5]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[20, upperFloorH, 8]} />
          <meshStandardMaterial
            color={upperWallColor}
            roughness={0.72}
            emissive={upperEmissive}
            emissiveIntensity={upperEmissiveIntensity}
            transparent={upperOpacity < 1}
            opacity={upperOpacity}
          />
        </mesh>

        {/* East Wing — Upper Floor Walls */}
        <mesh
          position={[6, upperFloorH / 2, 4]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[8, upperFloorH, 10]} />
          <meshStandardMaterial
            color={upperWallColor}
            roughness={0.72}
            emissive={upperEmissive}
            emissiveIntensity={upperEmissiveIntensity}
            transparent={upperOpacity < 1}
            opacity={upperOpacity}
          />
        </mesh>

        {/* Upper Floor Horizontal Cladding Accent Band */}
        <mesh position={[0, 0.35, -5]}>
          <boxGeometry args={[20.12, 0.35, 8.12]} />
          <meshStandardMaterial color="#8c6d46" roughness={0.8} />
        </mesh>
        <mesh position={[6, 0.35, 4]}>
          <boxGeometry args={[8.12, 0.35, 10.12]} />
          <meshStandardMaterial color="#8c6d46" roughness={0.8} />
        </mesh>

        {/* Upper Floor Continuous Ventilation Louver Shutters */}
        {/* North Outer Face */}
        <mesh position={[0, upperFloorH * 0.58, -9.05]}>
          <boxGeometry args={[17.5, 1.15, 0.06]} />
          <meshStandardMaterial color="#1f2e28" metalness={0.35} roughness={0.45} />
        </mesh>
        {/* Courtyard Face (North Wing) */}
        <mesh position={[-4.5, upperFloorH * 0.58, -0.95]}>
          <boxGeometry args={[8.5, 1.15, 0.06]} />
          <meshStandardMaterial color="#1f2e28" metalness={0.35} roughness={0.45} />
        </mesh>
        {/* East Outer Face */}
        <mesh position={[10.05, upperFloorH * 0.58, 0]}>
          <boxGeometry args={[0.06, 1.15, 15.5]} />
          <meshStandardMaterial color="#1f2e28" metalness={0.35} roughness={0.45} />
        </mesh>
        {/* Courtyard Face (East Wing) */}
        <mesh position={[1.95, upperFloorH * 0.58, 4.5]}>
          <boxGeometry args={[0.06, 1.15, 7.2]} />
          <meshStandardMaterial color="#1f2e28" metalness={0.35} roughness={0.45} />
        </mesh>

        {/* Upper Floor Doors opening onto the 2nd-Story Courtyard Balcony */}
        <mesh position={[-1.5, 1.05, -0.94]}>
          <boxGeometry args={[1.9, 2.05, 0.1]} />
          <meshStandardMaterial color="#3e2c1e" roughness={0.7} />
        </mesh>
        <mesh position={[1.94, 1.05, 1.2]}>
          <boxGeometry args={[0.1, 2.05, 1.9]} />
          <meshStandardMaterial color="#3e2c1e" roughness={0.7} />
        </mesh>
      </group>

      {/* ===================================================================
          5. L-SHAPED PITCHED CORRUGATED ROOF & RIDGE VENTILATORS
         =================================================================== */}
      <group position={[0, roofBaseY, 0]}>
        {/* North Wing Pitched Roof */}
        <mesh
          geometry={northRoofGeom}
          position={[0, 0, -5]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={roofColor}
            roughness={0.62}
            metalness={0.18}
            emissive={upperEmissive}
            emissiveIntensity={upperEmissiveIntensity * 0.6}
          />
        </mesh>

        {/* East Wing Pitched Roof (intersects cleanly with North Wing roof) */}
        <mesh
          geometry={eastRoofGeom}
          position={[6, 0, 2]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={roofColor}
            roughness={0.62}
            metalness={0.18}
            emissive={upperEmissive}
            emissiveIntensity={upperEmissiveIntensity * 0.6}
          />
        </mesh>

        {/* Ridge Ventilation Chimneys along both L-wings */}
        {[
          [-6.5, roofPeakH * 0.88, -5],
          [-0.5, roofPeakH * 0.88, -5],
          [6.0, roofPeakH * 0.88, -5],
          [6.0, roofPeakH * 0.88, 1.5],
          [6.0, roofPeakH * 0.88, 6.5],
        ].map((pos, idx) => (
          <group key={idx} position={pos as [number, number, number]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.9, 10]} />
              <meshStandardMaterial color="#525e59" metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.52, 0]} castShadow>
              <coneGeometry args={[0.45, 0.28, 10]} />
              <meshStandardMaterial color="#37423d" metalness={0.5} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Twin Bulk Feed Silos serving Ground & Upper Floors */}
      <FeedSilo position={[-11.6, 0, -6.8]} scale={0.82} />
      <FeedSilo position={[-11.6, 0, -3.8]} scale={0.82} />

      {/* Interactive 3D Floor Callout Pills when L-Building is Selected or Hovered */}
      {(isSelected || isHovered) && (
        <>
          <Html
            position={[-9.8, upperLevelY + upperFloorH * 0.55, -0.5]}
            center
            distanceFactor={48}
            zIndexRange={[20, 0]}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectFloor(selectedFloor === 'upper' ? 'all' : 'upper');
              }}
              className={`pointer-events-auto cursor-pointer px-2.5 py-1 rounded-md border text-[11px] font-mono transition-all whitespace-nowrap shadow-md ${
                selectedFloor === 'upper'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 font-semibold scale-105'
                  : 'bg-slate-950/85 text-amber-200 border-amber-400/40 hover:bg-slate-900'
              }`}
            >
              L2 · Upper Floor · 930 Chickens
            </button>
          </Html>

          <Html
            position={[-9.8, groundLevelY + groundFloorH * 0.45, -0.5]}
            center
            distanceFactor={48}
            zIndexRange={[20, 0]}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectFloor(selectedFloor === 'ground' ? 'all' : 'ground');
              }}
              className={`pointer-events-auto cursor-pointer px-2.5 py-1 rounded-md border text-[11px] font-mono transition-all whitespace-nowrap shadow-md ${
                selectedFloor === 'ground'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 font-semibold scale-105'
                  : 'bg-slate-950/85 text-emerald-200 border-emerald-400/40 hover:bg-slate-900'
              }`}
            >
              L1 · Ground Floor · 920 Chickens
            </button>
          </Html>
        </>
      )}
    </group>
  );
};
