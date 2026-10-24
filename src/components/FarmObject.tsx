import React from 'react';
import { Html } from '@react-three/drei';

interface FeedSiloProps {
  position: [number, number, number];
  scale?: number;
}

/**
 * Reusable galvanized bulk feed silo with conical hopper, roof cap, and support legs.
 */
export const FeedSilo: React.FC<FeedSiloProps> = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={scale}>
      {/* Concrete pad */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.25, 0.2, 16]} />
        <meshStandardMaterial color="#9ca39e" roughness={0.9} />
      </mesh>

      {/* Support legs */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <mesh
          key={idx}
          position={[Math.cos(angle) * 0.78, 1.2, Math.sin(angle) * 0.78]}
          castShadow
        >
          <boxGeometry args={[0.12, 2.2, 0.12]} />
          <meshStandardMaterial color="#646e68" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Lower hopper cone */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.95, 0.22, 1.3, 20]} />
        <meshStandardMaterial color="#cbd2ce" metalness={0.55} roughness={0.35} />
      </mesh>

      {/* Main cylindrical body */}
      <mesh position={[0, 3.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 0.95, 2.6, 20]} />
        <meshStandardMaterial color="#d8dfdc" metalness={0.5} roughness={0.35} />
      </mesh>

      {/* Horizontal corrugated stiffening rings */}
      {[2.3, 3.1, 3.9].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]}>
          <cylinderGeometry args={[0.97, 0.97, 0.07, 20]} />
          <meshStandardMaterial color="#aeb8b4" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}

      {/* Upper conical roof */}
      <mesh position={[0, 5.05, 0]} castShadow>
        <cylinderGeometry args={[0.15, 1.0, 0.9, 20]} />
        <meshStandardMaterial color="#9fa9a5" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Top filler cap */}
      <mesh position={[0, 5.6, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.2, 12]} />
        <meshStandardMaterial color="#994636" roughness={0.5} />
      </mesh>
    </group>
  );
};

interface LowPolyTreeProps {
  position: [number, number, number];
  scale?: number;
  variant?: 'round' | 'cypress';
}

/**
 * Clean low-poly tree for farm perimeter windbreaks and shade.
 */
export const LowPolyTree: React.FC<LowPolyTreeProps> = ({
  position,
  scale = 1,
  variant = 'round',
}) => {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 1.8, 7]} />
        <meshStandardMaterial color="#5c4738" roughness={0.9} />
      </mesh>

      {variant === 'round' ? (
        <>
          <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[1.35, 1]} />
            <meshStandardMaterial color="#3d6b48" roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0.55, 3.1, 0.35]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.95, 1]} />
            <meshStandardMaterial color="#497c55" roughness={0.85} flatShading />
          </mesh>
          <mesh position={[-0.45, 2.9, -0.35]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.85, 1]} />
            <meshStandardMaterial color="#355e3f" roughness={0.85} flatShading />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
            <coneGeometry args={[1.2, 2.5, 7]} />
            <meshStandardMaterial color="#365e42" roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0, 3.6, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.9, 2.1, 7]} />
            <meshStandardMaterial color="#437250" roughness={0.85} flatShading />
          </mesh>
        </>
      )}
    </group>
  );
};

interface CompassMarker3DProps {
  position: [number, number, number];
  showLabels?: boolean;
}

/**
 * 3D Ground Compass Marker matching the hand-drawn sketch's "North" arrow
 * in the upper-left corner (where North points toward -X / Left).
 */
export const CompassMarker3D: React.FC<CompassMarker3DProps> = ({
  position,
  showLabels = true,
}) => {
  return (
    <group position={position}>
      {/* Circular stone base */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.5, 0.12, 24]} />
        <meshStandardMaterial color="#27362e" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.13, 0]} receiveShadow>
        <ringGeometry args={[2.0, 2.25, 24]} />
        <meshStandardMaterial color="#6b8074" roughness={0.7} side={2} />
      </mesh>

      {/* Cross bars matching the sketch cross */}
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[3.8, 0.08, 0.18]} />
        <meshStandardMaterial color="#d9e2dc" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.18, 0.08, 3.2]} />
        <meshStandardMaterial color="#8fa196" roughness={0.5} />
      </mesh>

      {/* Arrow head pointing Left (-X) as drawn in the sketch ("North.") */}
      <mesh position={[-2.05, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.45, 0.9, 4]} />
        <meshStandardMaterial color="#e07a5f" roughness={0.4} />
      </mesh>

      {showLabels && (
        <Html
          position={[-2.6, 0.6, 0]}
          center
          distanceFactor={55}
          zIndexRange={[10, 0]}
        >
          <div className="pointer-events-none select-none px-2 py-0.5 rounded bg-black/65 backdrop-blur-xs border border-white/15 text-[11px] font-mono tracking-wider text-amber-300 whitespace-nowrap">
            ← NORTH (Sketch Ref)
          </div>
        </Html>
      )}
    </group>
  );
};

interface FarmObjectProps {
  type: 'silo' | 'tree' | 'water_tank';
  position: [number, number, number];
  scale?: number;
}

export const FarmObject: React.FC<FarmObjectProps> = ({
  type,
  position,
  scale = 1,
}) => {
  if (type === 'silo') {
    return <FeedSilo position={position} scale={scale} />;
  }
  if (type === 'tree') {
    return <LowPolyTree position={position} scale={scale} />;
  }
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[1.4, 1.4, 3.2, 18]} />
        <meshStandardMaterial color="#3c5a6b" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
};
