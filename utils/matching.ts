import { Load, Truck } from '../types';

const MAX_DAYS_DIFF = 7;

/**
 * Da li tura odgovara kamion?
 * Kriterijumi:
 * - Ista zemlja utovara
 * - Ista zemlja istovara (ili kamion ide "bilo gde")
 * - Datumi se razlikuju najviše 7 dana
 */
export const isLoadMatchForTruck = (load: Load, truck: Truck): boolean => {
  if (load.originCountry !== truck.originCountry) return false;

  if (
    truck.destinationCountry &&
    load.destinationCountry &&
    truck.destinationCountry !== load.destinationCountry
  ) return false;

  const daysDiff =
    Math.abs(new Date(load.dateFrom).getTime() - new Date(truck.dateFrom).getTime()) /
    (1000 * 60 * 60 * 24);
  if (daysDiff > MAX_DAYS_DIFF) return false;

  return true;
};

export const isTruckMatchForLoad = (truck: Truck, load: Load): boolean =>
  isLoadMatchForTruck(load, truck);

/**
 * Skor podudaranja (veći = bolji)
 */
export const matchScore = (load: Load, truck: Truck): number => {
  let score = 0;
  if (load.originCountry === truck.originCountry) score += 3;
  if (
    load.destinationCountry &&
    truck.destinationCountry &&
    load.destinationCountry === truck.destinationCountry
  ) score += 3;
  if (load.truckType && truck.truckType && load.truckType === truck.truckType) score += 2;

  const daysDiff =
    Math.abs(new Date(load.dateFrom).getTime() - new Date(truck.dateFrom).getTime()) /
    (1000 * 60 * 60 * 24);
  if (daysDiff <= 1) score += 3;
  else if (daysDiff <= 3) score += 2;
  else if (daysDiff <= 7) score += 1;

  return score;
};

/**
 * Pronađi ture koje odgovaraju korisnikovim kamionima
 */
export const findLoadsMatchingTrucks = (
  allLoads: Load[],
  myTrucks: Truck[],
  myUserId: string
): Load[] => {
  if (myTrucks.length === 0) return [];
  return allLoads
    .filter(load => load.userId !== myUserId)
    .filter(load => myTrucks.some(truck => isLoadMatchForTruck(load, truck)))
    .sort((a, b) => {
      const scoreA = Math.max(...myTrucks.map(t => matchScore(a, t)));
      const scoreB = Math.max(...myTrucks.map(t => matchScore(b, t)));
      return scoreB - scoreA;
    });
};

/**
 * Pronađi kamione koji odgovaraju korisnikovim turama
 */
export const findTrucksMatchingLoads = (
  allTrucks: Truck[],
  myLoads: Load[],
  myUserId: string
): Truck[] => {
  if (myLoads.length === 0) return [];
  return allTrucks
    .filter(truck => truck.userId !== myUserId)
    .filter(truck => myLoads.some(load => isTruckMatchForLoad(truck, load)))
    .sort((a, b) => {
      const scoreA = Math.max(...myLoads.map(l => matchScore(l, a)));
      const scoreB = Math.max(...myLoads.map(l => matchScore(l, b)));
      return scoreB - scoreA;
    });
};

/**
 * Da li oglas ima bar jedno podudaranje sa listom kamiona/tura
 */
export const loadHasMatchInTrucks = (load: Load, myTrucks: Truck[]): boolean =>
  myTrucks.some(truck => isLoadMatchForTruck(load, truck));

export const truckHasMatchInLoads = (truck: Truck, myLoads: Load[]): boolean =>
  myLoads.some(load => isTruckMatchForLoad(truck, load));
