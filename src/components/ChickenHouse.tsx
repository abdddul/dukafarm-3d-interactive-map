import React, { useMemo } from 'react';
import * as THREE from 'three';
import { FarmBuildingData } from '../types/farm';
import { FeedSilo } from './FarmObject';

interface ChickenHouseProps {
  data: FarmBuildingData;
  isSelected: boolean;
  isHovered: boolean;
}

/**
 * 3D Single-Story Poultry House Component
 * Automatically adapts roof ridge orientation to the longer axis of the building,
 * renders side ventilation louvers, ridge exhaust stacks, entrance doors,
 * feed silos, and internal bay partitions (matching the sketch's dotted line on West House).
 */
export const ChickenHouse: React.FC<ChickenHouseProps> = ({
  data,
  isSelected,
  isHovered,
}) => {
  const [width, height, depth] = data.dimensions;
  const isHorizontal = width >= depth; // True for South House (CH-003), False for West (CH-001) & East (CH-004)

  const wallHeight = height * 0.68;
  const roofPeakHeight = height * 0.36;
  const plinthHeight = 0.32;

  const wallColor = isSelected
    ? '#fffbeb'
    : isHovered
    ? '#f8f5ec'
    : data.wallColor || '#efeae0';

  const roofColor = isSelected
    ? '#c85a32'
    : isHovered
    ? '#ab4c39'
    : data.roofColor || '#8c3f30';

  const emissiveColor = isSelected
    ? '#d97706'
    : isHovered
    ? '#78350f'
    : '#000000';
  const emissiveIntensity = isSelected ? 0.18 : isHovered ? 0.1 : 0;

  // Build triangular prism roof geometry so it has a crisp pitched gable roof
  const roofGeometry = useMemo(() => {
    const overhang = 0.55;
    const w = width + overhang * 2;
    const d = depth + overhang * 2;
    const h = roofPeakHeight;

    const shape = new THREE.Shape();
    if (!isHorizontal) {
      // Ridge runs along Z axis; cross-section in X-Y plane
      shape.moveTo(-w / 2, 0);
      shape.lineTo(0, h);
      shape.lineTo(w / 2, 0);
      shape.closePath();

      const extrudeSettings = {
        steps: 1,
        depth: d,
        bevelEnabled: false,
      };
      const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geom.translate(0, 0, -d / 2);
      return geom;
    } else {
      // Ridge runs along X axis; cross-section in Z-Y plane, then rotated
      shape.moveTo(-d / 2, 0);
      shape.lineTo(0, h);
      shape.lineTo(d / 2, 0);
      shape.closePath();

      const extrudeSettings = {
        steps: 1,
        depth: w,
        bevelEnabled: false,
      };
      const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geom.translate(0, 0, -w / 2);
      geom.rotateY(Math.PI / 2);
      return geom;
    }
  }, [width, depth, roofPeakHeight, isHorizontal]);

  // Calculate positions for roof ventilation chimneys along the ridge
  const chimneyPositions = useMemo(() => {
    const longSpan = isHorizontal ? width : depth;
    const count = Math.max(2, Math.floor(longSpan / 7.5));
    const step = longSpan / (count + 1);
    const coords: [number, number, number][] = [];
    for (let i = 1; i <= count; i++) {
      const offset = -longSpan / 2 + i * step;
      coords.push(
        isHorizontal
          ? [offset, plinthHeight + wallHeight + roofPeakHeight * 0.85, 0]
          : [0, plinthHeight + wallHeight + roofPeakHeight * 0.85, offset]
      );
    }
    return coords;
  }, [width, depth, isHorizontal, plinthHeight, wallHeight, roofPeakHeight]);

  // Calculate structural wall pilasters along the long walls
  const pilasterOffsets = useMemo(() => {
    const longSpan = isHorizontal ? width : depth;
    const count = Math.max(3, Math.floor(longSpan / 5));
    const step = longSpan / count;
    const offsets: number[] = [];
    for (let i = 0; i <= count; i++) {
      offsets.push(-longSpan / 2 + i * step);
    }
    return offsets;
  }, [width, depth, isHorizontal]);

  // Internal division z-offset for West Poultry House (matching the sketch's dotted line)
  const divisionZ =
    data.hasInternalDivision && data.divisionRatio
      ? -depth / 2 + depth * data.divisionRatio
      : null;

  return (
    <group>
      {/* Concrete Foundation Plinth */}
      <mesh position={[0, plinthHeight / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[width + 0.6, plinthHeight, depth + 0.6]} />
        <meshStandardMaterial color="#8c948e" roughness={0.9} />
      </mesh>

      {/* Main Structural Body / Walls */}
      <mesh
        position={[0, plinthHeight + wallHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, wallHeight, depth]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={0.78}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Lower Masonry Skirt Band */}
      <mesh position={[0, plinthHeight + 0.45, 0]} receiveShadow>
        <boxGeometry args={[width + 0.08, 0.9, depth + 0.08]} />
        <meshStandardMaterial color="#d2cdc2" roughness={0.85} />
      </mesh>

      {/* Continuous Poultry Ventilation Mesh / Louver Windows along long sides */}
      {!isHorizontal ? (
        <>
          {/* Left & Right Long Side Vents */}
          <mesh
            position={[width / 2 + 0.05, plinthHeight + wallHeight * 0.58, 0]}
          >
            <boxGeometry args={[0.06, wallHeight * 0.42, depth - 1.6]} />
            <meshStandardMaterial
              color="#2b3a34"
              metalness={0.3}
              roughness={0.5}
            />
          </mesh>
          <mesh
            position={[-width / 2 - 0.05, plinthHeight + wallHeight * 0.58, 0]}
          >
            <boxGeometry args={[0.06, wallHeight * 0.42, depth - 1.6]} />
            <meshStandardMaterial
              color="#2b3a34"
              metalness={0.3}
              roughness={0.5}
            />
          </mesh>
        </>
      ) : (
        <>
          {/* Front & Back Long Side Vents */}
          <mesh
            position={[0, plinthHeight + wallHeight * 0.58, depth / 2 + 0.05]}
          >
            <boxGeometry args={[width - 1.6, wallHeight * 0.42, 0.06]} />
            <meshStandardMaterial
              color="#2b3a34"
              metalness={0.3}
              roughness={0.5}
            />
          </mesh>
          <mesh
            position={[0, plinthHeight + wallHeight * 0.58, -depth / 2 - 0.05]}
          >
            <boxGeometry args={[width - 1.6, wallHeight * 0.42, 0.06]} />
            <meshStandardMaterial
              color="#2b3a34"
              metalness={0.3}
              roughness={0.5}
            />
          </mesh>
        </>
      )}

      {/* Structural Wall Pilasters */}
      {pilasterOffsets.map((offset, idx) =>
        !isHorizontal ? (
          <React.Fragment key={idx}>
            <mesh
              position={[width / 2 + 0.08, plinthHeight + wallHeight / 2, offset]}
              castShadow
            >
              <boxGeometry args={[0.14, wallHeight, 0.24]} />
              <meshStandardMaterial color="#dcd6ca" roughness={0.8} />
            </mesh>
            <mesh
              position={[-width / 2 - 0.08, plinthHeight + wallHeight / 2, offset]}
              castShadow
            >
              <boxGeometry args={[0.14, wallHeight, 0.24]} />
              <meshStandardMaterial color="#dcd6ca" roughness={0.8} />
            </mesh>
          </React.Fragment>
        ) : (
          <React.Fragment key={idx}>
            <mesh
              position={[offset, plinthHeight + wallHeight / 2, depth / 2 + 0.08]}
              castShadow
            >
              <boxGeometry args={[0.24, wallHeight, 0.14]} />
              <meshStandardMaterial color="#dcd6ca" roughness={0.8} />
            </mesh>
            <mesh
              position={[offset, plinthHeight + wallHeight / 2, -depth / 2 - 0.08]}
              castShadow
            >
              <boxGeometry args={[0.24, wallHeight, 0.14]} />
              <meshStandardMaterial color="#dcd6ca" roughness={0.8} />
            </mesh>
          </React.Fragment>
        )
      )}

      {/* Pitched Gable Roof */}
      <mesh
        geometry={roofGeometry}
        position={[0, plinthHeight + wallHeight, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={roofColor}
          roughness={0.65}
          metalness={0.15}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 0.8}
        />
      </mesh>

      {/* Ridge Ventilation Chimneys */}
      {chimneyPositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.85, 10]} />
            <meshStandardMaterial color="#57635e" metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.5, 0]} castShadow>
            <coneGeometry args={[0.42, 0.25, 10]} />
            <meshStandardMaterial color="#3c4742" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Internal Partition Firewall / Baffle Band (for West House CH-001 dotted line in sketch) */}
      {divisionZ !== null && (
        <group position={[0, 0, divisionZ]}>
          {/* Exterior partition rib wrapping walls and roof to make the sketch division clearly visible */}
          <mesh position={[0, plinthHeight + wallHeight / 2, 0]} castShadow>
            <boxGeometry args={[width + 0.45, wallHeight + 0.1, 0.35]} />
            <meshStandardMaterial color="#6d7a73" roughness={0.6} />
          </mesh>
          {/* Roof division band */}
          <mesh
            position={[0, plinthHeight + wallHeight + roofPeakHeight * 0.55, 0]}
            castShadow
          >
            <boxGeometry args={[width * 0.65, roofPeakHeight * 0.95, 0.38]} />
            <meshStandardMaterial color="#58645e" roughness={0.5} />
          </mesh>
          {/* Side service door at the division bay */}
          <mesh position={[width / 2 + 0.06, plinthHeight + 1.05, -1.4]}>
            <boxGeometry args={[0.1, 2.0, 1.2]} />
            <meshStandardMaterial color="#4a3728" roughness={0.7} />
          </mesh>
        </group>
      )}

      {/* Main Double Entrance Doors & Concrete Apron */}
      {!isHorizontal ? (
        <group position={[0, 0, depth / 2]}>
          {/* South Gable Double Door */}
          <mesh position={[0, plinthHeight + 1.1, 0.05]}>
            <boxGeometry args={[2.4, 2.15, 0.12]} />
            <meshStandardMaterial color="#4f3b2c" roughness={0.75} />
          </mesh>
          {/* Door frame trim */}
          <mesh position={[0, plinthHeight + 2.22, 0.08]}>
            <boxGeometry args={[2.7, 0.14, 0.18]} />
            <meshStandardMaterial color="#7b857f" roughness={0.6} />
          </mesh>
          {/* Concrete entrance apron */}
          <mesh position={[0, 0.06, 1.2]} receiveShadow>
            <boxGeometry args={[3.4, 0.12, 2.2]} />
            <meshStandardMaterial color="#9ba39d" roughness={0.9} />
          </mesh>

          {/* North Gable Double Door */}
          <mesh position={[0, plinthHeight + 1.1, -depth - 0.05]}>
            <boxGeometry args={[2.4, 2.15, 0.12]} />
            <meshStandardMaterial color="#4f3b2c" roughness={0.75} />
          </mesh>
        </group>
      ) : (
        <group position={[0, 0, 0]}>
          {/* Courtyard-facing (North) Double Door */}
          <mesh position={[0, plinthHeight + 1.1, -depth / 2 - 0.05]}>
            <boxGeometry args={[2.4, 2.15, 0.12]} />
            <meshStandardMaterial color="#4f3b2c" roughness={0.75} />
          </mesh>
          {/* Concrete entrance apron */}
          <mesh position={[0, 0.06, -depth / 2 - 1.2]} receiveShadow>
            <boxGeometry args={[3.4, 0.12, 2.2]} />
            <meshStandardMaterial color="#9ba39d" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* Bulk Feed Silos next to the Poultry House */}
      {data.hasFeedSilo && (
        <>
          <FeedSilo
            position={
              !isHorizontal
                ? [width / 2 + 1.65, 0, -depth / 2 + 3.2]
                : [-width / 2 - 1.75, 0, -depth / 2 + 2.0]
            }
            scale={0.72}
          />
          {(data.siloCount ?? 1) > 1 && (
            <FeedSilo
              position={
                !isHorizontal
                  ? [width / 2 + 1.65, 0, -depth / 2 + 5.6]
                  : [-width / 2 - 1.75, 0, -depth / 2 + 4.4]
              }
              scale={0.72}
            />
          )}
        </>
      )}
    </group>
  );
};
