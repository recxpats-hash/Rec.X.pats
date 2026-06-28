/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from "vitest";
import {
  calculateFCR,
  calculateGrossProfitMargin,
  calculateSurvivalRate,
  assessWaterQualityRisk,
  checkInvoiceOverdueStatus,
} from "../utils/calculations";

describe("recxpats Core Calculations", () => {
  describe("calculateFCR (Feed Conversion Ratio)", () => {
    it("should compute standard FCR correctly", () => {
      // 150kg of feed used for 100kg of biomass gain should yield FCR of 1.50
      expect(calculateFCR(150, 100)).toBe(1.5);
    });

    it("should round to two decimal places", () => {
      // 140kg feed for 103kg biomass gain = 1.3592... -> 1.36
      expect(calculateFCR(140, 103)).toBe(1.36);
    });

    it("should gracefully return default standard FCR (1.35) for zero or negative biomass gain", () => {
      expect(calculateFCR(100, 0)).toBe(1.35);
      expect(calculateFCR(100, -10)).toBe(1.35);
    });

    it("should gracefully return default standard FCR (1.35) for zero or negative feed used", () => {
      expect(calculateFCR(0, 100)).toBe(1.35);
      expect(calculateFCR(-50, 100)).toBe(1.35);
    });
  });

  describe("calculateGrossProfitMargin", () => {
    it("should compute positive gross profit margin percentage", () => {
      // Revenue 10,000, COGS 6,000 -> Profit 4,000 -> 40% margin
      expect(calculateGrossProfitMargin(10000, 6000)).toBe(40);
    });

    it("should return correct decimal precision", () => {
      // Revenue 30,000, COGS 19,500 -> Profit 10,500 -> 35% margin
      expect(calculateGrossProfitMargin(30000, 19500)).toBe(35);
    });

    it("should handle zero revenue without dividing by zero", () => {
      expect(calculateGrossProfitMargin(0, 500)).toBe(0);
      expect(calculateGrossProfitMargin(-100, 500)).toBe(0);
    });
  });

  describe("calculateSurvivalRate", () => {
    it("should calculate correct spawning survival rates", () => {
      // 45,000 hatched from 50,000 eggs = 90%
      expect(calculateSurvivalRate(45000, 50000)).toBe(90);
    });

    it("should handle zero eggs gracefully", () => {
      expect(calculateSurvivalRate(100, 0)).toBe(0);
    });
  });

  describe("assessWaterQualityRisk", () => {
    it("should classify ideal water quality as Normal", () => {
      expect(
        assessWaterQualityRisk({
          ph: 7.2,
          dissolvedOxygen: 6.5,
          ammonia: 0.1,
          nitrite: 0.2,
        })
      ).toBe("Normal");
    });

    it("should detect Critical risk on critically low Dissolved Oxygen (DO)", () => {
      expect(
        assessWaterQualityRisk({
          ph: 7.2,
          dissolvedOxygen: 1.0, // critically low
          ammonia: 0.1,
          nitrite: 0.2,
        })
      ).toBe("Critical");
    });

    it("should detect Critical risk on high Nitrite", () => {
      expect(
        assessWaterQualityRisk({
          ph: 7.0,
          dissolvedOxygen: 5.5,
          ammonia: 0.1,
          nitrite: 6.0, // critically high
        })
      ).toBe("Critical");
    });

    it("should detect High risk on slightly low Dissolved Oxygen", () => {
      expect(
        assessWaterQualityRisk({
          ph: 7.0,
          dissolvedOxygen: 3.0, // moderately low
          ammonia: 0.1,
          nitrite: 0.2,
        })
      ).toBe("High");
    });

    it("should detect High risk on elevated Ammonia levels", () => {
      expect(
        assessWaterQualityRisk({
          ph: 7.0,
          dissolvedOxygen: 5.0,
          ammonia: 1.5, // elevated
          nitrite: 0.2,
        })
      ).toBe("High");
    });
  });

  describe("checkInvoiceOverdueStatus", () => {
    it("should assess paid invoices as not overdue and Low risk", () => {
      const result = checkInvoiceOverdueStatus("2026-06-01", "2026-06-15", true, 1000);
      expect(result.isOverdue).toBe(false);
      expect(result.daysOverdue).toBe(0);
      expect(result.riskRating).toBe("Low");
    });

    it("should assess outstanding invoices before due date as not overdue and Low risk", () => {
      const result = checkInvoiceOverdueStatus("2026-06-20", "2026-06-15", false, 1000);
      expect(result.isOverdue).toBe(false);
      expect(result.daysOverdue).toBe(0);
      expect(result.riskRating).toBe("Low");
    });

    it("should assess slightly overdue outstanding invoices (e.g. 5 days) as Medium or Low risk", () => {
      const result = checkInvoiceOverdueStatus("2026-06-10", "2026-06-15", false, 1000);
      expect(result.isOverdue).toBe(true);
      expect(result.daysOverdue).toBe(5);
      expect(result.riskRating).toBe("Low"); // <= 10 days
    });

    it("should assess moderately overdue outstanding invoices (e.g. 15 days) as Medium risk", () => {
      const result = checkInvoiceOverdueStatus("2026-06-01", "2026-06-16", false, 1000);
      expect(result.isOverdue).toBe(true);
      expect(result.daysOverdue).toBe(15);
      expect(result.riskRating).toBe("Medium"); // > 10 and <= 30 days
    });

    it("should assess highly overdue outstanding invoices (e.g. 40 days) as High risk", () => {
      const result = checkInvoiceOverdueStatus("2026-06-01", "2026-07-11", false, 1000);
      expect(result.isOverdue).toBe(true);
      expect(result.daysOverdue).toBe(40);
      expect(result.riskRating).toBe("High"); // > 30 days
    });
  });
});
