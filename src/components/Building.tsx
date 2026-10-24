import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { FarmBuildingData, SelectedFloorFilter } from '../types/farm';
import { ChickenHouse } from './ChickenHouse';
import { TwoStoryBuilding } from './TwoStoryBuilding';
import { DuckGround } from './DuckGround';

interface BuildingProps {
  data: FarmBuildingData;
  isSelected: boolean;
  onSelect: (building: FarmBuildingData) => void;
  selectedFloor: SelectedFloorFilter;
  onSelectFloor: (floor: SelectedFloorFilter) => void;
  showLabels: boolean;
  explodeFloors: boolean;
}

/**
 * Unified Interactive 3D Building Wrapper
 * Manages pointer hover states, cursor feedback, selection footprint ring,
 * floating 3D labels, and dispatches to the appropriate 3D architectural model.
 */
export const Building: React.FC<BuildingProps> = ({
  data,
  isSelected,
  onSelect,
  selectedFloor,
  onSelectFloor,
  showLabels,
  explodeFloors,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const [width, height, depth] = data.dimensions;
  const isChickenHouse =
    data.type === 'chicken_house' || data.type === 'two_story_chicken_house';

  const labelHeight =
    data.type === 'two_story_chicken_house'
      ? height + (explodeFloors ? 4.8 : 2.5)
      : data.type === 'duck_ground'
      ? 3.8
      : height + 1.9;

  return (
    <group
      position={data.position}
      rotation={[0, data.rotationY || 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(data);
      }}
    >
      {/* Ground Selection / Hover Highlight Footprint Ring */}
      {(isSelected || isHovered) && (
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <boxGeometry
            args={[
              width + (isSelected ? 2.2 : 1.4),
              0.05,
              depth + (isSelected ? 2.2 : 1.4),
            ]}
          />
          <meshBasicMaterial
            color={isSelected ? '#f59e0b' : '#fbbf24'}
            transparent
            opacity={isSelected ? 0.38 : 0.2}
          />
        </mesh>
      )}

      {/* Render Specialized 3D Structure */}
      {data.type === 'two_story_chicken_house' ? (
        <TwoStoryBuilding
          data={data}
          isSelected={isSelected}
          isHovered={isHovered}
          selectedFloor={selectedFloor}
          onSelectFloor={onSelectFloor}
          explodeFloors={explodeFloors}
        />
      ) : data.type === 'duck_ground' ? (
        <DuckGround
          data={data}
          isSelected={isSelected}
          isHovered={isHovered}
        />
      ) : (
        <ChickenHouse
          data={data}
          isSelected={isSelected}
          isHovered={isHovered}
        />
      )}

      {/* Floating 3D Map Marker Label */}
      {(showLabels || isHovered || isSelected) && (
        <Html
          position={[
            data.type === 'two_story_chicken_house' ? 1.5 : 0,
            labelHeight,
            data.type === 'two_story_chicken_house' ? -2.5 : 0,
          ]}
          center
          distanceFactor={62}
          zIndexRange={[30, 0]}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(data);
            }}
            className={`group cursor-pointer select-none text-left transition-all duration-150 rounded-lg px-3 py-1.5 border backdrop-blur-md shadow-lg whitespace-nowrap ${
              isSelected
                ? 'bg-amber-500/95 text-slate-950 border-amber-200 scale-105'
                : isHovered
                ? 'bg-slate-900/95 text-white border-amber-400/70 scale-105'
                : 'bg-slate-950/80 text-slate-100 border-white/15 hover:border-amber-400/50'
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider">
              <span
                className={
                  isSelected
                    ? 'text-slate-900 font-semibold'
                    : isChickenHouse
                    ? 'text-amber-400 font-semibold'
                    : 'text-teal-300 font-semibold'
                }
              >
                {data.code}
              </span>
              <span aria-hidden="true" className="opacity-50">
                ·
              </span>
              <span className="opacity-85">
                {data.floors === 2
                  ? '2 FLOORS · POULTRY'
                  : isChickenHouse
                  ? 'CHICKEN HOUSE'
                  : 'WATERFOWL AREA'}
              </span>
            </div>

            <div className="text-xs font-semibold tracking-tight mt-0.5">
              {data.name}
            </div>

            <div
              className={`text-[11px] font-mono tabular-nums mt-0.5 ${
                isSelected ? 'text-slate-900 font-medium' : 'text-slate-300'
              }`}
            >
              {data.totalAnimals.toLocaleString()} {data.animalType}
              {data.floors === 2 && ' (920 G · 930 U)'}
            </div>
          </button>
        </Html>
      )}
    </group>
  );
};
