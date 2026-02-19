import { SimulatorInput, SimulationResult, YearlyData } from "@/types";

export function calculate(input: SimulatorInput): SimulationResult {
  const { monthly, rate, years, age, initial } = input;

  const monthlyRate = rate / 12 / 100;
  const totalMonths = years * 12;

  // Future value calculation using compound interest formula
  let futureValue: number;
  if (monthlyRate === 0) {
    futureValue = initial + monthly * totalMonths;
  } else {
    futureValue =
      initial * Math.pow(1 + monthlyRate, totalMonths) +
      monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  }

  const totalPrincipal = monthly * totalMonths + initial;
  const totalProfit = futureValue - totalPrincipal;
  const gainRate = totalPrincipal > 0 ? (totalProfit / totalPrincipal) * 100 : 0;
  const taxSaving = totalProfit * 0.20315;
  const endAge = age + years;

  // Calculate yearly data
  const yearlyData: YearlyData[] = [];
  let prevTotal = initial;

  for (let y = 1; y <= years; y++) {
    const months = y * 12;
    let yearTotal: number;

    if (monthlyRate === 0) {
      yearTotal = initial + monthly * months;
    } else {
      yearTotal =
        initial * Math.pow(1 + monthlyRate, months) +
        monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }

    const yearPrincipal = monthly * months + initial;
    const yearProfit = yearTotal - yearPrincipal;

    yearlyData.push({
      year: y,
      age: age + y,
      principal: Math.round(yearPrincipal),
      profit: Math.round(yearProfit),
      total: Math.round(yearTotal),
      prevTotal: Math.round(prevTotal),
    });

    prevTotal = yearTotal;
  }

  return {
    totalPrincipal: Math.round(totalPrincipal),
    futureValue: Math.round(futureValue),
    totalProfit: Math.round(totalProfit),
    gainRate: Math.round(gainRate * 10) / 10,
    taxSaving: Math.round(taxSaving),
    endAge,
    yearlyData,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP").format(value);
}

export function formatCurrencyCompact(value: number): string {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(2)}億円`;
  }
  if (value >= 10000) {
    return `${Math.round(value / 10000).toLocaleString("ja-JP")}万円`;
  }
  return `${formatCurrency(value)}円`;
}
