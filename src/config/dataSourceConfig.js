/**
 * Data Source Configuration
 *
 * Controls whether each dashboard module uses mock data or real API data.
 * Set to 'mock' to use client-side generated data, or 'real' to use API calls.
 *
 * When the real API is ready, update individual modules to 'real' as needed.
 */

export const dataSourceConfig = {
  // Overview metrics cards (total orgs, accounts, bills, avg DSO, etc.)
  metricsCards: 'mock',

  // DSO trend chart with prediction
  dsoTrend: 'mock',

  // Organization table
  organizationTable: 'mock',

  // Service utilization bar chart
  serviceUtilization: 'mock',

  // Satisfaction vs adoption scatter plot
  satisfactionChart: 'mock',

  // Autopay and paperless pie charts
  autopayPaperless: 'mock',

  // Bill surprise factor chart
  billSurprise: 'mock',

  // Churn risk bar chart
  churnRisk: 'mock',

  // Top 5 highest risk organizations list
  highRiskOrgs: 'mock',

  // AI-powered insights
  insights: 'mock',
};

/**
 * Helper function to check if a module is using mock data
 * @param {string} moduleName - Name of the module from dataSourceConfig
 * @returns {boolean} True if using mock data
 */
export const isUsingMockData = (moduleName) => {
  return dataSourceConfig[moduleName] === 'mock';
};

/**
 * Helper function to get all module names
 * @returns {string[]} Array of module names
 */
export const getModuleNames = () => {
  return Object.keys(dataSourceConfig);
};
