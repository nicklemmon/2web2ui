import totalRVCost, { calculateCost, calculateNewCost } from '../recipientValidation';

describe('Total RV Cost', () => {
  it('should calculate price correctly', () => {
    expect(totalRVCost(123321)).toEqual('$599.96');
  });

  it('should calculate price correctly for undefined', () => {
    expect(totalRVCost(undefined)).toEqual('$0.00');
  });
});

describe('calculateCost', () => {
  it('should calculate raw cost value', () => {
    expect(calculateCost(123321)).toEqual(599.963);
  });

  it('should calculate price correctly for undefined', () => {
    expect(calculateCost(undefined)).toEqual(0);
  });
});

describe('calculateNewCost', () => {
  it('should new cost difference', () => {
    expect(calculateNewCost(12333, 123)).toEqual('$0.74');
    expect(calculateNewCost(0, 123)).toEqual('$1.23');
  });
});
