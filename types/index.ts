export interface SimulatorInput {
  monthly: number;
  rate: number;
  years: number;
  age: number;
  initial: number;
}

export interface YearlyData {
  year: number;
  age: number;
  principal: number;
  profit: number;
  total: number;
  prevTotal: number;
}

export interface SimulationResult {
  totalPrincipal: number;
  futureValue: number;
  totalProfit: number;
  gainRate: number;
  taxSaving: number;
  endAge: number;
  yearlyData: YearlyData[];
}
