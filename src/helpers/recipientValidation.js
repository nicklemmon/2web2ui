import { RECIPIENT_VALIDATION_TIERS } from 'src/constants';
import { formatCurrency } from 'src/helpers/units';

export const calculateCost = (volume = 0) => {
  const totalCost = RECIPIENT_VALIDATION_TIERS.reduce(
    (acc, { volumeMax, volumeMin, cost }) =>
      acc + Math.max(Math.min(volumeMax, volume) - volumeMin, 0) * cost,
    0,
  );
  return totalCost;
};

export const calculateNewCost = (existingVolume = 0, newVolume = 0) => {
  const diff = calculateCost(newVolume + existingVolume) - calculateCost(existingVolume);
  return formatCurrency(diff);
};

const totalRVCost = (volume = 0) => formatCurrency(calculateCost(volume));

export default totalRVCost;
