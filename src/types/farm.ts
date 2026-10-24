export type AnimalType =
  | 'chickens'
  | 'ducks'
  | 'geese'
  | 'turkeys'
  | 'guinea_fowl'
  | 'quails'
  | 'goats'
  | 'sheep'
  | 'none';

export type BuildingType =
  | 'chicken_house'
  | 'two_story_chicken_house'
  | 'duck_ground'
  | 'goat_house'
  | 'sheep_area'
  | 'feed_storage'
  | 'office'
  | 'water_point';

export type FacilityStatus = 'active' | 'maintenance' | 'cleaning' | 'standby';

export type SelectedFloorFilter = 'all' | 'ground' | 'upper';

export interface BuildingLevelData {
  id: 'ground' | 'upper' | string;
  name: string;
  floorNumber: number;
  animalType: AnimalType;
  flockCategory: string;
  breed: string;
  batchCode: string;
  totalAnimals: number;
  capacity: number;
  averageAgeWeeks: number;
  averageWeightKg: number;
  mortalityRate: number;
  dailyFeedKg: number;
  dailyWaterLiters: number;
  temperatureC: number;
  humidityPercent: number;
  vaccinationStatus: string;
  notes?: string;
}

export interface BuildingSectionData {
  id: string;
  name: string;
  description: string;
  animalCount: number;
  capacity: number;
}

export interface FarmBuildingData {
  /** Primary database record identifier (e.g. CH-001, CH-002, DK-001) */
  id: string;
  /** Human-readable facility code for map badges */
  code: string;
  /** Display name of the structure */
  name: string;
  /** Subtitle / role on the farm */
  subtitle: string;
  /** Architectural / functional type */
  type: BuildingType;
  /** Number of stories (1 for standard houses, 2 for the central L-Building) */
  floors: 1 | 2;
  /** Primary livestock kept in this structure */
  animalType: AnimalType;
  /** Specific poultry/animal category (e.g., Broilers, Layers, Breeders, Pekin Ducks) */
  flockCategory: string;
  /** Breed name */
  breed: string;
  /** Active batch reference ID for future DB join */
  batchCode: string;
  /** Total animals across entire building */
  totalAnimals: number;
  /** Maximum design capacity */
  capacity: number;
  /** Average flock age in weeks */
  averageAgeWeeks: number;
  /** Average weight per bird/animal in kg */
  averageWeightKg: number;
  /** Cumulative mortality percentage */
  mortalityRate: number;
  /** Daily feed consumption in kg */
  dailyFeedKg: number;
  /** Daily water consumption in liters */
  dailyWaterLiters: number;
  /** Internal ambient temperature in Celsius */
  temperatureC: number;
  /** Relative humidity percentage */
  humidityPercent: number;
  /** Vaccination schedule status */
  vaccinationStatus: string;
  /** Operational status */
  status: FacilityStatus;
  /** Last record sync date */
  lastUpdated: string;
  /** Architectural description and notes */
  description: string;
  /** 3D World Position [x, y, z] in meters relative to farm center */
  position: [number, number, number];
  /** 3D Dimensions [width (X), height (Y), depth (Z)] in meters */
  dimensions: [number, number, number];
  /** Optional Y-axis rotation in radians */
  rotationY?: number;
  /** Optional floor-by-floor breakdown (used by the 2-story L-shaped building) */
  levels?: BuildingLevelData[];
  /** Optional internal bay divisions (e.g. West House dotted division in sketch) */
  sections?: BuildingSectionData[];
  /** Visual styling hints */
  roofColor?: string;
  wallColor?: string;
  hasFeedSilo?: boolean;
  siloCount?: number;
  hasInternalDivision?: boolean;
  divisionRatio?: number;
}

export interface FutureExpansionPlot {
  id: string;
  name: string;
  plannedUse: string;
  position: [number, number, number];
  dimensions: [number, number];
}

export interface CameraPreset {
  id: string;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}
