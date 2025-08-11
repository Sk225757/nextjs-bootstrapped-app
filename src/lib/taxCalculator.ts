export interface TaxInputs {
  grossSalary: number;
  otherIncome: number;
  basicSalary: number; // For NPS calculation
  // Old regime deductions
  section80C: number;
  section80D: number;
  section80CCD1B: number;
  section80E: number;
  section80G: number;
  hraExemption: number;
  lta: number;
  homeLoanInterest: number;
  // New regime deductions
  employerNPS: number; // Section 80CCD(2)
  transportAllowance: number; // Only for disabled
  conveyanceAllowance: number;
  gratuity: number;
  vrs: number;
  leaveEncashment: number;
  isDisabled: boolean;
}

export interface TaxResult {
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebateAmount: number;
  taxAfterRebate: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  regime: 'old' | 'new';
}

export interface TaxComparison {
  oldRegime: TaxResult;
  newRegime: TaxResult;
  savings: number;
  recommendedRegime: 'old' | 'new';
}

// Tax slabs for Old Regime (FY 2024-25)
const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.20 },
  { min: 1000000, max: Infinity, rate: 0.30 }
];

// Tax slabs for New Regime (FY 2024-25)
const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 600000, rate: 0.05 },
  { min: 600000, max: 900000, rate: 0.10 },
  { min: 900000, max: 1200000, rate: 0.15 },
  { min: 1200000, max: 1500000, rate: 0.20 },
  { min: 1500000, max: Infinity, rate: 0.30 }
];

// Surcharge slabs
const SURCHARGE_SLABS = [
  { min: 0, max: 5000000, rate: 0 },
  { min: 5000000, max: 10000000, rate: 0.10 },
  { min: 10000000, max: 20000000, rate: 0.15 },
  { min: 20000000, max: 50000000, rate: 0.25 },
  { min: 50000000, max: Infinity, rate: 0.37 }
];

const NEW_REGIME_SURCHARGE_SLABS = [
  { min: 0, max: 5000000, rate: 0 },
  { min: 5000000, max: Infinity, rate: 0.15 } // Capped at 15% for new regime
];

function calculateTaxFromSlabs(income: number, slabs: typeof OLD_REGIME_SLABS): number {
  let tax = 0;
  
  for (const slab of slabs) {
    if (income > slab.min) {
      const taxableInThisSlab = Math.min(income, slab.max) - slab.min;
      tax += taxableInThisSlab * slab.rate;
    }
  }
  
  return Math.round(tax);
}

function calculateSurcharge(income: number, tax: number, isNewRegime: boolean): number {
  if (income <= 5000000) return 0;
  
  const slabs = isNewRegime ? NEW_REGIME_SURCHARGE_SLABS : SURCHARGE_SLABS;
  
  for (const slab of slabs) {
    if (income > slab.min && income <= slab.max) {
      return Math.round(tax * slab.rate);
    }
  }
  
  return 0;
}

function calculateRebate(income: number, tax: number, isNewRegime: boolean): number {
  const rebateLimit = isNewRegime ? 700000 : 500000;
  
  if (income <= rebateLimit) {
    return Math.min(tax, isNewRegime ? 25000 : 12500);
  }
  
  return 0;
}

export function calculateOldRegimeTax(inputs: TaxInputs): TaxResult {
  const totalIncome = inputs.grossSalary + inputs.otherIncome;
  
  // Apply deduction limits
  const standardDeduction = 50000;
  const section80C = Math.min(inputs.section80C, 150000);
  const section80D = Math.min(inputs.section80D, 50000);
  const section80CCD1B = Math.min(inputs.section80CCD1B, 50000);
  const homeLoanInterest = Math.min(inputs.homeLoanInterest, 200000);
  
  const totalDeductions = standardDeduction + section80C + section80D + 
                         section80CCD1B + inputs.section80E + inputs.section80G + 
                         inputs.hraExemption + inputs.lta + homeLoanInterest;
  
  const taxableIncome = Math.max(0, totalIncome - totalDeductions);
  
  const taxBeforeRebate = calculateTaxFromSlabs(taxableIncome, OLD_REGIME_SLABS);
  const rebateAmount = calculateRebate(taxableIncome, taxBeforeRebate, false);
  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebateAmount);
  
  const surcharge = calculateSurcharge(taxableIncome, taxAfterRebate, false);
  const cess = Math.round((taxAfterRebate + surcharge) * 0.04);
  const totalTax = taxAfterRebate + surcharge + cess;
  
  return {
    totalIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeRebate,
    rebateAmount,
    taxAfterRebate,
    surcharge,
    cess,
    totalTax,
    regime: 'old'
  };
}

export function calculateNewRegimeTax(inputs: TaxInputs): TaxResult {
  const totalIncome = inputs.grossSalary + inputs.otherIncome;
  
  // New regime deductions
  const standardDeduction = 75000;
  
  // Employer's NPS Contribution (80CCD(2)) - Max 10% of Basic + DA
  const maxEmployerNPS = Math.min(inputs.employerNPS, inputs.basicSalary * 0.10);
  
  // Transport Allowance (only for disabled)
  const transportAllowance = inputs.isDisabled ? inputs.transportAllowance : 0;
  
  // Other allowed deductions
  const conveyanceAllowance = inputs.conveyanceAllowance;
  const gratuity = inputs.gratuity;
  const vrs = Math.min(inputs.vrs, 500000); // VRS exempt up to ₹5 lakh
  const leaveEncashment = inputs.leaveEncashment;
  
  const totalDeductions = standardDeduction + maxEmployerNPS + transportAllowance + 
                         conveyanceAllowance + gratuity + vrs + leaveEncashment;
  
  const taxableIncome = Math.max(0, totalIncome - totalDeductions);
  
  const taxBeforeRebate = calculateTaxFromSlabs(taxableIncome, NEW_REGIME_SLABS);
  const rebateAmount = calculateRebate(taxableIncome, taxBeforeRebate, true);
  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebateAmount);
  
  const surcharge = calculateSurcharge(taxableIncome, taxAfterRebate, true);
  const cess = Math.round((taxAfterRebate + surcharge) * 0.04);
  const totalTax = taxAfterRebate + surcharge + cess;
  
  return {
    totalIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeRebate,
    rebateAmount,
    taxAfterRebate,
    surcharge,
    cess,
    totalTax,
    regime: 'new'
  };
}

export function compareTaxRegimes(inputs: TaxInputs): TaxComparison {
  const oldRegime = calculateOldRegimeTax(inputs);
  const newRegime = calculateNewRegimeTax(inputs);
  
  const savings = Math.abs(oldRegime.totalTax - newRegime.totalTax);
  const recommendedRegime = oldRegime.totalTax <= newRegime.totalTax ? 'old' : 'new';
  
  return {
    oldRegime,
    newRegime,
    savings,
    recommendedRegime
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
