import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

export const client = generateClient<Schema>();

// ─── NHTSA VIN decode (free, no API key) ─────────────────────────
export interface DecodedVin {
  year: number;
  make: string;
  model: string;
  engine: string;
}

export async function decodeVin(vin: string): Promise<DecodedVin> {
  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin.trim()}?format=json`,
  );
  if (!res.ok) throw new Error('NHTSA API unavailable. Please try again.');

  const json = await res.json();
  const results: Array<{ Variable: string; Value: string | null }> = json.Results ?? [];
  const get = (key: string) => results.find(r => r.Variable === key)?.Value?.trim() ?? '';

  const year  = parseInt(get('Model Year'), 10);
  const make  = get('Make');
  const model = get('Model');
  const disp  = parseFloat(get('Displacement (L)'));
  const conf  = get('Engine Configuration');
  const engine = disp ? `${disp.toFixed(1)}L ${conf}`.trim() : conf;

  if (!year || !make || !model) {
    throw new Error('VIN not recognised. Please double-check and try again.');
  }
  return { year, make, model, engine };
}

// ─── Type helpers ────────────────────────────────────────────────
export function daysUntil(isoDate: string | null | undefined): number {
  if (!isoDate) return 30;
  return Math.max(0, Math.ceil((new Date(isoDate).getTime() - Date.now()) / 86_400_000));
}
