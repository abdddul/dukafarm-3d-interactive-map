import React, { useMemo } from 'react';
import { FarmBuildingData } from '../types/farm';

interface DuckGroundProps {
  data: FarmBuildingData;
  isSelected: boolean;
  isHovered: boolean;
}

/**
 * 3D Northern Waterfowl Enclosure ("Ducks ground" on the Zeida Farm sketch)
 * Features fenced pasture boundary, bathing pond, timber duck shelter,
 * feeding stations, and stylized low-poly ducks.
 */
export const DuckGround: React.FC<DuckGroundProps> = ({
  data,
  isSelected,
  isHovered,
}) => {
  const [width, , depth] = data.dimensions;

  const groundColor = isSelected
    ? '#427852'
    : isHovered
    ? '#3b6d4a'
    : '#335f40';

  const shelterRoofColor = isSelected
    ? '#4d8a72'
    : isHovered
    ? '#447a64'
    : data.roofColor || '#386653';

  // Generate perimeter fence post positions along the rectangle
  const fencePosts = useMemo(() => {
    const posts: [number, number, number][] = [];
    const halfW = width / 2;
    const halfD = depth / 2;
    const spacing = 3.2;

    for (let x = -halfW; x <= halfW; x += spacing) {
      posts.push([x, 0.55, -halfD]);
      // Leave a 4m entrance gate opening on the south fence
      if (Math.abs(x - 2) > 2.2) {
        posts.push([x, 0.55, halfD]);
      }
    }
    for (let z = -halfD + spacing; z <= halfD - spacing; z += spacing) {
      posts.push([-halfW, 0.55, z]);
      posts.push([halfW, 0.55, z]);
    }
    return posts;
  }, [width, depth]);

  // Stylized low-poly ducks positioned around the pond and pasture
  const duckPositions: [number, number, number, number][] = [
    [-4.5, 0.16, -0.8, 0.4],
    [-2.2, 0.16, 0.6, -0.8],
    [0.5, 0.16, -0.4, 1.2],
    [2.8, 0.16, 1.1, -2.1],
    [-6.2, 0.16, 1.4, 0.2],
    [6.5, 0.14, 2.2, -0.5],
    [8.2, 0.14, -1.5, 2.4],
    [10.4, 0.14, 0.8, -1.1],
    [-11.5, 0.14, 2.5, 0.9],
    [-13.2, 0.14, -1.8, 1.7],
  ];

  return (
    <group>
      {/* Pasture Turf Pad */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[width, 0.12, depth]} />
        <meshStandardMaterial color={groundColor} roughness={0.92} />
      </mesh>

      {/* Subtle Dashed Boundary Stones (echoing the dashed line on the hand-drawn sketch) */}
      {fencePosts.map((pos, idx) => (
        <React.Fragment key={idx}>
          {/* Timber Fence Post */}
          <mesh position={pos} castShadow>
            <boxGeometry args={[0.18, 1.1, 0.18]} />
            <meshStandardMaterial color="#785c42" roughness={0.85} />
          </mesh>
          {/* White Top Cap for visibility */}
          <mesh position={[pos[0], 1.14, pos[2]]}>
            <boxGeometry args={[0.21, 0.08, 0.21]} />
            <meshStandardMaterial color="#e5e0d5" roughness={0.6} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Perimeter Fence Rails (North, West, East, and split South with gate) */}
      <mesh position={[0, 0.75, -depth / 2]} castShadow>
        <boxGeometry args={[width, 0.08, 0.06]} />
        <meshStandardMaterial color="#8c6d4e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.4, -depth / 2]} castShadow>
        <boxGeometry args={[width, 0.08, 0.06]} />
        <meshStandardMaterial color="#8c6d4e" roughness={0.8} />
      </mesh>

      <mesh position={[-width / 2, 0.75, 0]} castShadow>
        <boxGeometry args={[0.06, 0.08, depth]} />
        <meshStandardMaterial color="#8c6d4e" roughness={0.8} />
      </mesh>
      <mesh position={[width / 2, 0.75, 0]} castShadow>
        <boxGeometry args={[0.06, 0.08, depth]} />
        <meshStandardMaterial color="#8c6d4e" roughness={0.8} />
      </mesh>

      {/* South Fence Left & Right of Gate */}
      <mesh position={[-width / 4 - 1, 0.75, depth / 2]} castShadow>
        <boxGeometry args={[width / 2 - 2, 0.08, 0.06]} />
        <meshStandardMaterial color="#8c6d4e" roughness={0.8} />
      </mesh>
      <mesh position={[width / 4 + 2.5, 0.75, depth / 2]} castShadow>
        <boxGeometry args={[width / 2 - 5, 0.08, 0.06]} />
        <meshStandardMaterial color="#8c6d4e" roughness={0.8} />
      </mesh>

      {/* Bio-Filtered Duck Bathing Pond (Central-West of Enclosure) */}
      <group position={[-2.2, 0.08, 0.2]}>
        {/* Stone/Concrete Pond Coping Rim */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <cylinderGeometry args={[6.8, 7.1, 0.14, 28]} />
          <meshStandardMaterial color="#a8a296" roughness={0.85} />
        </mesh>
        {/* Water Surface */}
        <mesh position={[0, 0.09, 0]} receiveShadow>
          <cylinderGeometry args={[6.1, 6.1, 0.1, 28]} />
          <meshStandardMaterial
            color="#2b7a9b"
            roughness={0.2}
            metalness={0.25}
          />
        </mesh>
      </group>

      {/* Waterfowl Night Shelter & Nesting Pavilion (East side of Ducks Ground) */}
      <group position={[11.5, 0.12, -1.2]}>
        {/* Timber Deck / Floor */}
        <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
          <boxGeometry args={[10.5, 0.24, 5.8]} />
          <meshStandardMaterial color="#9c8a70" roughness={0.85} />
        </mesh>
        {/* Rear & Side Shelter Walls */}
        <mesh position={[0, 1.25, -2.6]} castShadow receiveShadow>
          <boxGeometry args={[10.2, 2.1, 0.25]} />
          <meshStandardMaterial color="#dfd6c3" roughness={0.8} />
        </mesh>
        <mesh position={[-5.0, 1.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 2.1, 5.4]} />
          <meshStandardMaterial color="#dfd6c3" roughness={0.8} />
        </mesh>
        <mesh position={[5.0, 1.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 2.1, 5.4]} />
          <meshStandardMaterial color="#dfd6c3" roughness={0.8} />
        </mesh>
        {/* Front Timber Support Columns */}
        {[-3.2, 0, 3.2].map((xCol, i) => (
          <mesh key={i} position={[xCol, 1.25, 2.5]} castShadow>
            <boxGeometry args={[0.2, 2.1, 0.2]} />
            <meshStandardMaterial color="#6e5239" roughness={0.85} />
          </mesh>
        ))}
        {/* Sloped Mono-Pitch Roof */}
        <mesh
          position={[0, 2.45, 0]}
          rotation={[0.12, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[11.2, 0.22, 6.6]} />
          <meshStandardMaterial
            color={shelterRoofColor}
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>
      </group>

      {/* Covered Duck Feeders (West side of Ducks Ground) */}
      {[-14.5, -11.5].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0.12, -2.5]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[1.8, 0.45, 0.9]} />
            <meshStandardMaterial color="#c49a45" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.05, 0]} castShadow>
            <boxGeometry args={[2.1, 0.12, 1.2]} />
            <meshStandardMaterial color="#386653" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Stylized Low-Poly White Ducks */}
      {duckPositions.map(([dx, dy, dz, rotY], idx) => (
        <group key={idx} position={[dx, dy, dz]} rotation={[0, rotY, 0]}>
          {/* Body */}
          <mesh position={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[0.42, 0.24, 0.28]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.6} />
          </mesh>
          {/* Neck & Head */}
          <mesh position={[0.18, 0.28, 0]} castShadow>
            <boxGeometry args={[0.16, 0.22, 0.16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.6} />
          </mesh>
          {/* Orange Bill */}
          <mesh position={[0.3, 0.28, 0]}>
            <boxGeometry args={[0.12, 0.07, 0.1]} />
            <meshStandardMaterial color="#f97316" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
