/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates the Feed Conversion Ratio (FCR).
 * Formula: Total Feed Consumed (kg) / Biomass Gained (kg)
 */
export function calculateFCR(totalFeedUsedKg: number, biomassGainKg: number): number {
  if (biomassGainKg <= 0 || totalFeedUsedKg <= 0) {
    return 1.35; // Standard industry default fallback
  }
  const fcr = totalFeedUsedKg / biomassGainKg;
  return Math.round(fcr * 100) / 100;
}

/**
 * Calculates Gross Profit Margin Percentage.
 * Formula: ((Revenue - COGS) / Revenue) * 100
 */
export function calculateGrossProfitMargin(revenue: number, cogs: number): number {
  if (revenue <= 0) {
    return 0;
  }
  const margin = ((revenue - cogs) / revenue) * 100;
  return Math.round(margin * 100) / 100;
}

/**
 * Calculates Spawning Survival Rate Percentage.
 * Formula: (Hatched Fry / Eggs Quantity) * 100
 */
export function calculateSurvivalRate(hatchedFry: number, eggsQuantity: number): number {
  if (eggsQuantity <= 0) {
    return 0;
  }
  const survival = (hatchedFry / eggsQuantity) * 100;
  return Math.round(survival * 100) / 100;
}

/**
 * Rules-based Water Quality Risk Classifier.
 * Checks key variables (pH, DO, Ammonia, Nitrite) to determine system risk levels.
 */
export interface WaterQualityMetrics {
  ph: number;
  dissolvedOxygen: number; // DO (mg/L)
  ammonia: number;         // (ppm)
  nitrite: number;         // (ppm)
}

export function assessWaterQualityRisk(metrics: WaterQualityMetrics): "Critical" | "High" | "Normal" {
  const { ph, dissolvedOxygen, ammonia, nitrite } = metrics;

  // Critical thresholds (immediate danger of mass mortality)
  if (dissolvedOxygen < 1.5) return "Critical";
  if (ammonia > 5.0) return "Critical";
  if (nitrite > 5.0) return "Critical";
  if (ph < 4.0 || ph > 10.0) return "Critical";

  // High thresholds (elevated risk, requires active intervention)
  if (dissolvedOxygen < 3.5) return "High";
  if (ammonia > 1.0) return "High";
  if (nitrite > 2.0) return "High";
  if (ph < 5.5 || ph > 8.5) return "High";

  return "Normal";
}

/**
 * Calculates invoice overdue status, days overdue, and risk assessment rating.
 */
export function checkInvoiceOverdueStatus(
  dueDateStr: string,
  currentDateStr: string,
  isPaid: boolean,
  amountOwed: number
): { isOverdue: boolean; daysOverdue: number; riskRating: "Low" | "Medium" | "High" } {
  if (isPaid || amountOwed <= 0) {
    return { isOverdue: false, daysOverdue: 0, riskRating: "Low" };
  }

  const dueDate = new Date(dueDateStr);
  const currentDate = new Date(currentDateStr);
  
  if (isNaN(dueDate.getTime()) || isNaN(currentDate.getTime())) {
    return { isOverdue: false, daysOverdue: 0, riskRating: "Low" };
  }

  const timeDiff = currentDate.getTime() - dueDate.getTime();
  const daysOverdue = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (daysOverdue <= 0) {
    return { isOverdue: false, daysOverdue: 0, riskRating: "Low" };
  }

  let riskRating: "Low" | "Medium" | "High" = "Low";
  if (daysOverdue > 30) {
    riskRating = "High";
  } else if (daysOverdue > 10) {
    riskRating = "Medium";
  }

  return { isOverdue: true, daysOverdue, riskRating };
}
