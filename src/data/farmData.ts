import {
  CameraPreset,
  FarmBuildingData,
  FutureExpansionPlot,
} from '../types/farm';

/**
 * ZEIDA FARM — Master Mock Data Layer (Version 1)
 *
 * Designed for drop-in replacement with an external REST / GraphQL / SQL API.
 * Each facility uses a stable primary key (`id` / `code`) so database records
 * can map 1:1 to 3D scene nodes.
 */
export const FARM_BUILDINGS: FarmBuildingData[] = [
  {
    id: 'l-building-01',
    code: 'CH-002',
    name: 'L-Building (Two-Story Poultry House)',
    subtitle: 'Central Double-Deck Chicken Complex',
    type: 'two_story_chicken_house',
    floors: 2,
    animalType: 'chickens',
    flockCategory: 'Multi-Level Layer & Grower Flock',
    breed: 'Hy-Line Brown / Ross 308',
    batchCode: 'ZF-2026-B04',
    totalAnimals: 1850,
    capacity: 2000,
    averageAgeWeeks: 16.5,
    averageWeightKg: 1.55,
    mortalityRate: 1.8,
    dailyFeedKg: 224,
    dailyWaterLiters: 460,
    temperatureC: 24.5,
    humidityPercent: 61,
    vaccinationStatus: 'Up to Date (NDV + IBDV Booster)',
    status: 'active',
    lastUpdated: '30 September 2026',
    description:
      'Flagship two-story L-shaped poultry facility located at the heart of Zeida Farm. Houses independent chicken flocks on both the Ground Floor and the elevated Upper Floor deck, with courtyard stair access and cross-flow ridge ventilation.',
    position: [2, 0, 3],
    dimensions: [20, 6.8, 18],
    roofColor: '#994636',
    wallColor: '#f1ede4',
    hasFeedSilo: true,
    siloCount: 2,
    levels: [
      {
        id: 'ground',
        name: 'Ground Floor',
        floorNumber: 1,
        animalType: 'chickens',
        flockCategory: 'Ground Level Flock (North & East Wings)',
        breed: 'Hy-Line Brown',
        batchCode: 'ZF-2026-B04-G',
        totalAnimals: 920,
        capacity: 1000,
        averageAgeWeeks: 16,
        averageWeightKg: 1.5,
        mortalityRate: 1.9,
        dailyFeedKg: 110,
        dailyWaterLiters: 225,
        temperatureC: 24.2,
        humidityPercent: 63,
        vaccinationStatus: 'Completed Week 14 Protocol',
        notes:
          'Masonry thermal-mass ground level with deep-litter flooring, automated bell drinkers, and direct courtyard service access.',
      },
      {
        id: 'upper',
        name: 'Upper Floor',
        floorNumber: 2,
        animalType: 'chickens',
        flockCategory: 'Upper Deck Flock (North & East Wings)',
        breed: 'Hy-Line Brown',
        batchCode: 'ZF-2026-B04-U',
        totalAnimals: 930,
        capacity: 1000,
        averageAgeWeeks: 17,
        averageWeightKg: 1.6,
        mortalityRate: 1.7,
        dailyFeedKg: 114,
        dailyWaterLiters: 235,
        temperatureC: 24.8,
        humidityPercent: 59,
        vaccinationStatus: 'Completed Week 16 Protocol',
        notes:
          'Elevated timber-and-steel upper deck featuring continuous side-louver natural ventilation, exterior walkway gallery, and ridge exhaust vents.',
      },
    ],
  },
  {
    id: 'broiler-house-01',
    code: 'CH-004',
    name: 'Brooder House 01',
    subtitle: 'East Wing Commercial Brooder Facility',
    type: 'chicken_house',
    floors: 1,
    animalType: 'chickens',
    flockCategory: 'Brooder Chicks',
    breed: 'Cobb 500 / Hy-Line Chicks',
    batchCode: 'ZF-2026-BR01',
    totalAnimals: 850,
    capacity: 1000,
    averageAgeWeeks: 4,
    averageWeightKg: 0.45,
    mortalityRate: 2.4,
    dailyFeedKg: 118,
    dailyWaterLiters: 245,
    temperatureC: 30.5,
    humidityPercent: 64,
    vaccinationStatus: 'Up to Date (Gumboro & Newcastle)',
    status: 'active',
    lastUpdated: '30 September 2026',
    description:
      'Long eastern poultry house ("Brooder house" on the farm layout sketch). Equipped with radiant brooder heating zones, side ventilation curtains, twin bulk feed silos, and north-south service doors.',
    position: [23, 0, 9.5],
    dimensions: [9.5, 3.8, 31],
    roofColor: '#8c3f30',
    wallColor: '#efeae0',
    hasFeedSilo: true,
    siloCount: 2,
  },
  {
    id: 'west-poultry-house-01',
    code: 'CH-001',
    name: 'West Poultry House 01',
    subtitle: 'West Wing Dual-Bay Layer & Grower House',
    type: 'chicken_house',
    floors: 1,
    animalType: 'chickens',
    flockCategory: 'Layers & Pullet Growers',
    breed: 'ISA Brown Commercial Layer',
    batchCode: 'ZF-2026-LY01',
    totalAnimals: 1120,
    capacity: 1250,
    averageAgeWeeks: 22,
    averageWeightKg: 1.75,
    mortalityRate: 1.9,
    dailyFeedKg: 142,
    dailyWaterLiters: 295,
    temperatureC: 24.0,
    humidityPercent: 60,
    vaccinationStatus: 'Up to Date (Fowl Pox + NDV)',
    status: 'active',
    lastUpdated: '30 September 2026',
    description:
      'Long western poultry structure featuring an internal partitioned bay (matching the dotted division line on the layout sketch) separating the northern pullet acclimatization bay from the main southern laying hall.',
    position: [-21, 0, 9.5],
    dimensions: [9.2, 3.7, 31],
    roofColor: '#8c3f30',
    wallColor: '#efeae0',
    hasFeedSilo: true,
    siloCount: 1,
    hasInternalDivision: true,
    divisionRatio: 0.34,
    sections: [
      {
        id: 'CH-001-A',
        name: 'North Bay (Pullet Grower Zone)',
        description: 'Partitioned northern third shown by the dotted line on the farm blueprint.',
        animalCount: 380,
        capacity: 420,
      },
      {
        id: 'CH-001-B',
        name: 'South Bay (Main Layer Hall)',
        description: 'Primary two-thirds southern production hall with nest boxes and perches.',
        animalCount: 740,
        capacity: 830,
      },
    ],
  },
  {
    id: 'south-poultry-house-03',
    code: 'CH-003',
    name: 'South Poultry House 03',
    subtitle: 'South-Central Breeder & Finisher House',
    type: 'chicken_house',
    floors: 1,
    animalType: 'chickens',
    flockCategory: 'Parent Stock & Finishers',
    breed: 'Sasso Dual-Purpose / Kuroiler',
    batchCode: 'ZF-2026-FN03',
    totalAnimals: 680,
    capacity: 800,
    averageAgeWeeks: 20,
    averageWeightKg: 1.95,
    mortalityRate: 1.5,
    dailyFeedKg: 96,
    dailyWaterLiters: 198,
    temperatureC: 23.8,
    humidityPercent: 58,
    vaccinationStatus: 'Up to Date (Full Breeder Schedule)',
    status: 'active',
    lastUpdated: '30 September 2026',
    description:
      'Horizontal poultry house positioned in the south-central sector directly below the Central L-Building courtyard. Houses robust dual-purpose finisher and breeder flocks.',
    position: [2, 0, 20.5],
    dimensions: [20, 3.6, 8.8],
    roofColor: '#8c3f30',
    wallColor: '#efeae0',
    hasFeedSilo: true,
    siloCount: 1,
  },
  {
    id: 'ducks-ground-01',
    code: 'DK-001',
    name: 'Ducks Ground & Waterfowl Paddock',
    subtitle: 'Northern Fenced Waterfowl Enclosure & Pond',
    type: 'duck_ground',
    floors: 1,
    animalType: 'ducks',
    flockCategory: 'Waterfowl (Pekin & Muscovy Ducks)',
    breed: 'White Pekin & Muscovy',
    batchCode: 'ZF-2026-DK01',
    totalAnimals: 420,
    capacity: 550,
    averageAgeWeeks: 14,
    averageWeightKg: 2.4,
    mortalityRate: 1.1,
    dailyFeedKg: 68,
    dailyWaterLiters: 310,
    temperatureC: 23.0,
    humidityPercent: 68,
    vaccinationStatus: 'Up to Date (Duck Plague / DVE)',
    status: 'active',
    lastUpdated: '30 September 2026',
    description:
      'Large northern fenced enclosure ("Ducks ground" on the farm sketch) featuring a shallow lined bathing pond, shaded timber night-shelter, perimeter mesh fencing, and open foraging pasture.',
    position: [-6.5, 0, -20],
    dimensions: [39, 2.6, 13],
    roofColor: '#3f6a58',
    wallColor: '#e6dec8',
    hasFeedSilo: false,
  },
];

/**
 * Planned expansion parcels in the surrounding open terrain.
 * Demonstrates scalability of the digital twin for future buildings.
 */
export const FUTURE_EXPANSION_PLOTS: FutureExpansionPlot[] = [
  {
    id: 'EXP-WEST',
    name: 'West Expansion Parcel A',
    plannedUse: 'Reserved for Goat Houses & Sheep Paddocks',
    position: [-46, 0, 6],
    dimensions: [22, 42],
  },
  {
    id: 'EXP-EAST',
    name: 'East Expansion Parcel B',
    plannedUse: 'Reserved for Broiler Houses CH-005 & CH-006',
    position: [48, 0, 9],
    dimensions: [22, 36],
  },
  {
    id: 'EXP-SOUTH',
    name: 'South Service & Feed Mill Zone',
    plannedUse: 'Reserved for Feed Storage, Vet Office & Quarantine',
    position: [2, 0, 42],
    dimensions: [54, 16],
  },
];

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'overview',
    label: 'View Farm Overview',
    position: [0, 54, 64],
    target: [0, 0, 4],
  },
  {
    id: 'l-building-focus',
    label: 'L-Building (2 Floors)',
    position: [-14, 19, 20],
    target: [2, 3.5, 3],
  },
  {
    id: 'top-down',
    label: 'Sketch Blueprint Angle',
    position: [0, 78, 6],
    target: [0, 0, 4],
  },
  {
    id: 'ducks-focus',
    label: 'Ducks Ground',
    position: [-18, 20, -4],
    target: [-6.5, 1, -20],
  },
];

export function getFarmSummaryMetrics(buildings: FarmBuildingData[]) {
  const totalChickens = buildings
    .filter((b) => b.animalType === 'chickens')
    .reduce((sum, b) => sum + b.totalAnimals, 0);

  const totalDucks = buildings
    .filter((b) => b.animalType === 'ducks')
    .reduce((sum, b) => sum + b.totalAnimals, 0);

  const totalAnimals = buildings.reduce((sum, b) => sum + b.totalAnimals, 0);
  const totalCapacity = buildings.reduce((sum, b) => sum + b.capacity, 0);
  const chickenHouseCount = buildings.filter(
    (b) => b.type === 'chicken_house' || b.type === 'two_story_chicken_house'
  ).length;

  return {
    totalChickens,
    totalDucks,
    totalAnimals,
    totalCapacity,
    chickenHouseCount,
    totalFacilities: buildings.length,
  };
}
