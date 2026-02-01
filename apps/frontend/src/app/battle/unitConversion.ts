import { UnitSystem } from "@five-parsecs/parsec-api";

const FEET_TO_CM = 30.48;

/**
 * Convert feet to display value in the chosen unit system.
 * Imperial: value in ft. Metric: value in cm (rounded).
 */
export function formatLength(
  feet: number,
  unitSystem: UnitSystem
): { value: number; unit: string } {
  if (unitSystem === 'metric') {
    return { value: Math.round(feet * FEET_TO_CM), unit: 'cm' };
  }
  return { value: feet, unit: 'ft' };
}
