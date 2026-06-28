/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PnLStatement {
  id?: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  currency: string;
  notes?: string;
}

export interface TaxRecord {
  id?: string;
  name: string;
  jurisdiction: string;
  taxType: string;
  taxRate: number;
  relatedRevenue?: string;
  relatedPayable?: string;
  notes?: string;
}

export interface ForecastRecord {
  id?: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  budgetCategory: string;
  forecastedAmount: number;
  currency: string;
  linkedBudget?: string;
  notes?: string;
}

export interface FeedProfile {
  id?: string;
  name: string;
  ingredients: string; // comma separated list
  proteinPct: number;
  fatPct: number;
  fiberPct: number;
  energyKcal: number;
  otherNutrients?: string;
  profileInsights?: string;
  batchManagement?: string;
}

export interface IngredientRecord {
  id?: string;
  name: string;
  supplier: string;
  costPerKg: number;
  proteinPct: number;
  fatPct: number;
  otherNutritionalInfo?: string;
  lastUpdated: string;
  sourcingInsights?: string;
}

export interface FeedingSchedule {
  id?: string;
  name: string;
  feedType: string;
  startDate: string;
  endDate: string;
  frequency: string;
  assignedTanks: string;
  fishSpecies: string;
  quantityPerCycle: number;
  instructions?: string;
  recommendations?: string;

  // Extended fields for feed consumption per tank/pond
  fishTankId?: string;
  fishCount?: number;
  fishStage?: string;
  fishStockingDate?: string;
  waterTemperature?: number;
  feedPerFish?: string; // in g/fish or g/kg
  feedingFrequencyPerDay?: number;
  totalFeedUsedPerDay?: number;
  feedQuantityPerCycle?: number;
  biomassGainKg?: number;
  fcr?: string;
  growthRatePct?: number;
  expectedHarvestDate?: string;
  notes?: string;
  feedWastage?: string;
  feedWastageNotes?: string;

  // Automated recommendations (AI)
  aiRecommendations?: string;
  aiFeedAdjustment?: string;
  aiFeedingSchedule?: string;
  aiSupplierInsights?: string;
  aiConsumptionSummary?: string;
  aiIngredientCostBreakdown?: string;
  aiNutritionalProfileSummary?: string;
  traceabilityInterface?: string;
}

export interface BatchRecord {
  id?: string;
  name: string;
  species: string;
  stockType: string;
  pondLink: string;
  broodstockLink?: string;
  initialQuantity: number;
  stockingDate: string;
  currentQuantity: number;
  source: string;
  fishStage: string;
  feedProfileLink?: string;
  relatedInventory?: string;
  associatedHarvest?: string;
  associatedHealthRecord?: string;
  notes?: string;
  status: string;
  photo?: string;
}

export interface SupplierRecord {
  id?: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  active: boolean;
  insights?: string;
  ingredientCosting?: string;

  // Custom supplier fields
  companyName?: string;
  aiInsights?: string;
  feedIngredients?: string;
}

export interface PondRecord {
  id?: string;
  name: string;
  pondType: string;
  sizeM2: number;
  volumeM3: number;
  location: string;
  constructionDate: string;
  lastMaintenanceDate: string;
  status: string;
  associatedSpecies: string;
  notes?: string;
  relatedWaterTests?: string;
  photo?: string;
  batchManagement?: string;
  latitude?: string;
  longitude?: string;
  farmId?: string;
}

export interface FarmRecord {
  id?: string;
  name: string;
  location: string;
  acreage?: number;
  managerName?: string;
  description?: string;
  layoutMapping?: string;
}

export interface CurrencyRecord {
  id?: string;
  name: string;
  code: string;
  symbol: string;
  exchangeRate: number;
  isBase: boolean;
  notes?: string;
  forecasts?: string;
  pnlStatements?: string;
}

export interface TraceRecord {
  id?: string;
  name: string;
  lotNumber: string;
  trackingType: string;
  harvestBatchLink?: string;
  sourcePond?: string;
  packagedProductId?: string;
  dateInitiated: string;
  custodyDetails?: string;
  complianceReport?: string;
  linkedQr?: string;
  stockMovementLog?: string;
  recallStatus: string;
  diseaseTracing?: string;
  feedBatchLink?: string;
  ingredientSourceLogs?: string;
  regulatoryExportTag?: string;
  processingMapping?: string;
  linkedInventory?: string;
  complianceDocs?: string;
  summaryRiskAlerts?: string;
}

export interface ProcessingRecord {
  id?: string;
  name: string;
  date: string;
  batchId: string;
  linkedHarvest: string;
  species: string;
  gradingLine?: string;
  gradingCategory?: string;
  packingType?: string;
  labelGenerated: boolean;
  labelDetails?: string;
  cutYieldKg: number;
  wasteKg: number;
  wasteDisposalMethod?: string;
  stage: string;
  startTime?: string;
  endTime?: string;
  cleaningStatus: string;
  cleaningNotes?: string;
  qcStatus: string;
  qcIssues?: string;
  catchweightPerPack: number;
  totalPacks: number;
  crew?: string;
  documents?: string;
  lastUpdated: string;
  additionalNotes?: string;
  coldStorageStatus?: string;
  coldStorageLocation?: string;
  coldStorageEntryTime?: string;
  coldStorageExitTime?: string;
}

export interface LPORecord {
  id?: string;
  lpoNumber: string;
  date: string;
  supplierName: string;
  supplierContact?: string;
  status: string;
  category: string;
  relatedStockItems?: string;
  relatedConsultancyServices?: string;
  totalAmount: number;
  supportingDocs?: string;
  expectedDelivery?: string;
  dateReceived?: string;
  notes?: string;
  createdBy: string;
  budgetRef?: string;
  payableRef?: string;
  summaryAI?: string;
  trackingStatus: string;
  deliveryNotes?: string;
  trackingNumber?: string;
  deliveryReceipt?: string;
}

export interface CameraRecord {
  id?: string;
  name: string;
  location: string;
  installationDate: string;
  status: string;
  model?: string;
  serialNumber?: string;
  viewZone?: string;
  lastMaintenanceDate?: string;
  supplier?: string;
  payableRef?: string;
  budgetRef?: string;
  notes?: string;
  photos?: string;
  relatedCashFlows?: string;
  activityType?: string;
  activityTimestamp?: string;
  activityNotes?: string;
  activityAttachments?: string;
}

export interface InvoiceRecord {
  id?: string;
  invoiceNumber: string;
  supplierName: string;
  invoiceDate: string;
  dueDate: string;
  contactNumber?: string;
  physicalAddress?: string;
  location?: string;
  goodsDescription?: string;
  amountOwed: number;
  status: string;
  supportingDoc?: string;
  notes?: string;
  relatedCashFlows?: string;
  daysOverdue: number;
  isOverdue: boolean;
  budgetCategory?: string;
  budgets?: string;
  totalPaymentsMade: number;
  outstandingBalance: number;
  paymentCompletionPct: number;
  riskAssessmentAI?: string;
  summaryAI?: string;
  revenueRecords?: string;
  cameras?: string;
  procurementLpos?: string;
  taxes?: string;
}

export interface CashFlowRecord {
  id?: string;
  recordedBy: string;
  type: string; // Inflow / Outflow
  amount: number;
  description: string;
  relatedRevenue?: string;
  relatedReceivable?: string;
  relatedPayable?: string;
  photo?: string;
  transactionDate: string;
  revenueAmount?: number;
  grossMargin?: number;
  receivableAmoutDue?: number;
  payableAmountOwed?: number;
  isInflow: boolean;
  isOutflow: boolean;
  month: string;
  netCashFlow: number;
  summaryAI?: string;
  categorySuggestionAI?: string;
  cameras?: string;
  consultancyServices?: string;
}

export interface FishFeedRecord {
  id?: string;
  name: string;
  weightPerBag?: number;
  tankId: string;
  fishSpecies: string;
  fishStage: string;
  stockingDensity: number;
  feedId?: string;
  feedTypeByIngredients?: string;
  feedTypeByForm?: string;
  supplier?: string;
  batchNumber?: string;
  unitCostPerKg: number;
  unitKg: number;
  receivedDate: string;
  stockKg: number;
  reservedStockKg: number;
  reorderLevelKg: number;
  reorderQtyKg: number;
  lastUpdated: string;
  dailyLogDate?: string;
  currentFeedQtyKg: number;
  fishCount?: number;
  waterTemp?: string;
  feedPerFishG?: number;
  feedingFrequency?: number;
  feedQtyDispensedKg?: number;
  totalFeedUsedPerDay?: number;
  biomassGainKg?: number;
  fcr?: number;
  growthRatePct?: number;
  notes?: string;
  enteredBy?: string;
  inventoryLink?: string;
  feedWastageKg?: number;
  wastageNotes?: string;
  aiSchedule?: string;
  aiSupplierInsights?: string;
  aiConsumptionSummary?: string;
  aiAdjustments?: string;
  aiCosting?: string;
  aiNutritionalSummary?: string;
  traceabilityInterface?: string;
}

export interface RevenueRecord {
  id?: string;
  name: string;
  saleDate: string;
  customer: string;
  contactNumber?: string;
  physicalAddress?: string;
  location?: string;
  salesTransaction?: string;
  fingerlingsSales?: boolean;
  fishSales?: boolean;
  consultancyServices?: boolean;
  revenueAmount: number;
  costOfGoodsSold: number;
  grossMargin: number;
  photos?: string;
  notes?: string;
  fryQuantity: number;
  fryUnitPrice: number;
  fryTotalAmount: number;
  grossMarginPct: number;
  budgetCategory?: string;
  budgetVariances?: string;
  cashInflowsTotal: number;
  cashFlows?: string;
  cashOutflowsTotal: number;
  netCashFlow: number;
  receivablesLinked?: string;
  accountsReceivable?: string;
  payablesLinked?: string;
  accountsPayable?: string;
  summaryAI?: string;
  healthAssessmentAI?: string;
  budgets?: string;
  financialRatios?: string;
  taxes?: string;
}

export interface CustomerSaleRecord {
  id?: string;
  customerName: string;
  contactNumber?: string;
  physicalAddress?: string;
  fishType: string;
  fishStage: string;
  saleDate: string;
  quantitySold: number;
  unit: string;
  unitPrice: number;
  amount: number;
  customerNeeds?: string;
  stockRecordLink?: string;
  revenueRecordLink?: string;
  documents?: string;
  notes?: string;
  channel?: string;
  location?: string;
  recordedBy?: string;
  healthAssessment?: string;
  feedbackSummary?: string;
}

export interface HarvestRecord {
  id?: string;
  name: string;
  harvestDate: string;
  tankLocation: string;
  species: string;
  stage: string;
  batchNumber?: string;
  scheduledHarvestDate?: string;
  scheduledCrew?: string;
  crewNotes?: string;
  estimatedBiomassKg: number;
  actualYieldKg: number;
  postHarvestCleaning?: string;
  gradingCategory?: string;
  wasteDisposalMethod?: string;
  wasteQtyKg?: number;
  qualityStatus: string;
  qualityNotes?: string;
  coldChainMaintained: boolean;
  packagingDetails?: string;
  batchLabels?: string;
  transportStatus?: string;
  transportCompany?: string;
  transportDriverDetails?: string;
  linkedFishFarm?: string;
  linkedHealth?: string;
  photos?: string;
  documents?: string;
  createdBy?: string;
  lastUpdated: string;
  aiSummarySteps?: string;
  processingLink?: string;
  traceabilityLink?: string;
  batchManagementLink?: string;
  equipmentUsedLog?: string;
}

export interface SpawningRecord {
  id?: string;
  tankId: string;
  broodstockOrigin: string;
  species: string;
  sex: string;
  weightG: number;
  mortality: number;
  replacementQty: number;
  hormoneTime?: string;
  hormoneInjected?: string;
  hormoneDosageMlPerKg?: number;
  hormoneTotalDoseMl?: number;
  tranquilizerTank?: string;
  spawningSchedule?: string;
  spawningDate: string;
  spawningTank?: string;
  spawningStartTime?: string;
  spawningEndTime?: string;
  strippingTime?: string;
  eggAppearance?: string;
  eggChemicals?: string;
  eggWeightG: number;
  eggsQuantity: number;
  incubationTank: string;
  tankStatus: string;
  incubationStartDate?: string;
  incubationEndDate?: string;
  hatchedFry: number;
  stockType: string;
  activityDescription?: string;
  fryMortality?: number;
  survivalRatePct: number;
  qualityAssessment?: string;
  notes?: string;
  lastUpdated: string;
  apparatusUsed?: string;
  staffName?: string;
  staffRole?: string;
  activityDate?: string;
  endTime?: string;
  durationMinutes?: number;
  aiMonitoringStatus?: string;
  aiTestAdjustments?: string;
  aiBroodstockScheduleAdjustments?: string;
  batchManagement?: string;
}

export interface HealthRecord {
  id?: string;
  name: string;
  tankLocation: string;
  species: string;
  stage: string;
  observationDate: string;
  diseaseDetected: string;
  mortalityCount: number;
  mortalityCause?: string;
  waterQualityTestLink?: string;
  healthStatus: string;
  symptoms?: string;
  biosecurityStatus: string;
  complianceChecklist?: string;
  treatmentPrescribed?: string;
  treatmentStartDate?: string;
  treatmentEndDate?: string;
  treatmentStatus: string;
  environmentalImpact?: string;
  environmentalImpactLevel?: string;
  createdBy?: string;
  notes?: string;
  stockInventoryLink?: string;
  linkedAppointment?: string;
  relatedFinancialLink?: string;
  diseaseDocument?: string;
  attachments?: string;
  harvestManagementLink?: string;
  mortalityRate?: string;
  lastUpdated?: string;
  equipmentServiceLog?: string;
  dailyMaintenanceChecklist?: string;
  pumpMaintenance?: string;
  workOrderRef?: string;
  aeratorUsageLog?: string;
  crewAssigned?: string;
  netCageRepair?: string;
  fuelConsumptionL?: number;
  routineTaskSchedule?: string;
  fenceGateLog?: string;
  generatorLog?: string;
  farmMaintenance?: string;
}

export interface WaterQualityRecord {
  id?: string;
  name: string;
  tankId: string;
  tankName: string;
  tankType: string;
  species: string;
  stage: string;
  testDate: string;
  ph: number;
  dissolvedOxygen: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  temperature: number;
  hardness?: number;
  alkalinity?: number;
  chlorine?: number;
  turbidity?: string;
  remarks?: string;
  testedBy: string;
  isMonitored: boolean;
  immediateActions?: string;
  aiRecommendedAction?: string;
  aiRiskLevel?: string;
  aiRiskReport?: string;
  feedbackInput?: string;
  aiCriticalFeedback?: string;
  aiAnalysis?: string;
  healthLink?: string;
  pondLink?: string;
  location?: string;
}

export interface BudgetRecord {
  id?: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  category: string;
  plannedAmount: number;
  notes?: string;
  relatedRevenue?: string;
  relatedPayable?: string;
  amountOwedPayable?: string;
  invoiceNumber?: string;
  relatedReceivable?: string;
  supportingDocs?: string;
  actualRevenueRollup: number;
  actualExpensesRollup: number;
  actualReceivablesRollup: number;
  budgetVariance: number;
  variancePercentage: number;
  docsLookup?: string;
  aiSummary?: string;
  aiRisk?: string;
  budgetVariancesLink?: string;
  camerasLink?: string;
  lposLink?: string;
  forecastsLink?: string;
}

export interface AppointmentBooking {
  id?: string;
  customersName?: string;
  customerName: string;
  transportMode: string;
  contactInfo: string;
  appointmentType: string;
  relatedFishSales?: string;
  relatedConsultancy?: string;
  dateTime: string;
  status: string;
  staffAssigned?: string;
  notes?: string;
  followUpRequired: boolean;
  followUpDetails?: string;
  createdBy?: string;
  vehiclePlate?: string;
  gateFeePayment: string;
  biosecurityStatus: string;
  aiAnalysis?: string;
  healthLink?: string;
}

export interface StockInventory {
  id?: string;
  name: string; // Compatible fallback, mapped to description/fishFeedName
  description: string;
  inventoryType: "Equipment" | "Feed" | "Medication" | "Fish" | "Consumables";
  photo?: string;
  unitOfMeasure: string;
  unitCost: number;
  quantity: number;
  receivedDate: string;
  expiryDate: string;
  lastUpdated: string;
  reorderLevel: number;
  supplier: string;
  fishFeedName: string;
  brand: string;
  batchNumber: string;
  quantityReceived: number;
  dateTimeReceived: string;
  unitCostPerKg: number;
  reorderLevelQuantityKg: number;
  dailyLogDate: string;
  currentFeedQuantityKg: number;
  ingredientsUsed: string;
  costPerIngredientKg: number;
  proteinPct: number;
  fatPct: number;
  fiberPct: number;
  energyKcal: number;
}

export interface ConsultancyRecord {
  id?: string;
  requestTitle: string;
  descriptionOfNeeds: string;
  questions?: string;
  dateSubmitted: string;
  status: "Pending" | "In Review" | "Responded" | "Closed";
  photosOfIssue?: string;
  fishFarmManager: string;
  assignedConsultant: string;
  consultancyResponses?: string;
  numberOfResponses: number;
  averageResponseRating?: number;
  firstResponseDate?: string;
  fishFarmManagerName?: string;
  assignedConsultantName?: string;
  summaryOfNeedsAi?: string;
  suggestedExpertiseAreaAi?: string;
  requestedServices?: string;
}

export interface MaintenanceRecord {
  id?: string;
  name: string;
  dateTime: string;
  checklist: string;
  maintenanceType: string;
  pumpLog: string;
  solarLog: string;
  generatorLog: string;
  cameraLog: string;
  cameraMaintenance: string;
  workOrderRef: string;
  aeratorLog: string;
  crewAssigned: string;
  netRepair: string;
  pondRepair: string;
  fuelConsumption?: number;
  routineSchedule: string;
  fenceLog: string;
  activities: string;
  images?: string;
  issues: string;
  actionsTaken: string;
  person: string;
  notes?: string;
  linkedHealthId?: string;
}

export interface StaffActivityRecord {
  id?: string;
  taskType: string;
  staffName: string;
  role: string;
  activityDetails: string;
  durationMinutes?: number;
  date: string;
  additionalNotes?: string;
}


